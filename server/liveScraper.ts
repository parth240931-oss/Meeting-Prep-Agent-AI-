import * as cheerio from 'cheerio';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export interface ScrapedWebsiteData {
  url: string;
  finalUrl: string;
  statusCode: number;
  title: string;
  metaDescription: string;
  ogSiteName?: string;
  headings: string[];
  keyParagraphs: string[];
  cleanedText: string;
  detectedTech?: string[];
  subpagesChecked: string[];
  scrapedSuccessfully: boolean;
  errorMessage?: string;
  timestamp: number;
}

export function normalizeUrl(input: string): string {
  let cleaned = input.trim();
  if (!cleaned) return '';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  try {
    const parsed = new URL(cleaned);
    return parsed.origin + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch {
    return cleaned;
  }
}

export function extractDomain(input: string): string {
  try {
    const normalized = normalizeUrl(input);
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return input.toLowerCase().replace(/[^a-z0-9.-]/g, '');
  }
}

/**
 * True for loopback, private, link-local and other non-public addresses.
 */
function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    if (v6.startsWith('::ffff:')) return isPrivateAddress(v6.slice(7));
    return v6 === '::' || v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80');
  }
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

/**
 * The scraper takes a URL from the user, so it must only reach public websites.
 * Rejects non-http(s) URLs and hosts that resolve to internal addresses.
 */
export async function assertPublicUrl(rawUrl: string): Promise<void> {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs can be scraped');
  }
  const host = parsed.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local')) {
    throw new Error('Internal hosts cannot be scraped');
  }
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (addresses.length === 0 || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new Error('Internal hosts cannot be scraped');
  }
}

const MAX_REDIRECTS = 4;

/**
 * Directly accesses any public company website on the internet via HTTP GET,
 * follows redirects, and parses HTML content to extract core value propositions,
 * products, and messaging.
 */
export async function scrapeCompanyWebsite(urlOrDomain: string): Promise<ScrapedWebsiteData> {
  const targetUrl = normalizeUrl(urlOrDomain);
  const result: ScrapedWebsiteData = {
    url: targetUrl,
    finalUrl: targetUrl,
    statusCode: 0,
    title: '',
    metaDescription: '',
    headings: [],
    keyParagraphs: [],
    cleanedText: '',
    subpagesChecked: [],
    scrapedSuccessfully: false,
    timestamp: Date.now(),
  };

  if (!targetUrl) {
    result.errorMessage = 'Invalid URL provided';
    return result;
  }

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    // Follow redirects by hand so every hop is checked against the public-host rule.
    let currentUrl = targetUrl;
    let response: Response;
    for (let hop = 0; ; hop++) {
      await assertPublicUrl(currentUrl);
      response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgents[0],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
        redirect: 'manual',
      });
      const location = response.headers.get('location');
      if (response.status >= 300 && response.status < 400 && location) {
        if (hop >= MAX_REDIRECTS) throw new Error('Too many redirects');
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }
      break;
    }

    clearTimeout(timeoutId);

    result.statusCode = response.status;
    result.finalUrl = currentUrl;

    if (!response.ok) {
      result.errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      return result;
    }

    const html = await response.text();
    if (!html || html.length < 50) {
      result.errorMessage = 'Empty response received from server';
      return result;
    }

    const $ = cheerio.load(html);

    // Extract Meta Information
    result.title = $('title').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
    result.metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content') || '';
    result.ogSiteName = $('meta[property="og:site_name"]').attr('content') || '';

    // Extract Headings
    const headingsSet = new Set<string>();
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text && text.length >= 3 && text.length <= 140 && !headingsSet.has(text)) {
        headingsSet.add(text);
      }
    });
    result.headings = Array.from(headingsSet).slice(0, 12);

    // Strip unneeded elements for text extraction
    $('script, style, noscript, svg, iframe, nav, footer, header, form, select').remove();

    // Extract meaningful paragraphs
    const paragraphs: string[] = [];
    $('p, li, [class*="description"], [class*="subtitle"], [class*="hero"], [class*="feature"]').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text && text.length > 30 && text.length < 500 && !paragraphs.includes(text)) {
        paragraphs.push(text);
      }
    });
    result.keyParagraphs = paragraphs.slice(0, 15);

    // Build synthesized cleaned text
    const textPieces = [
      result.title ? `Page Title: ${result.title}` : '',
      result.metaDescription ? `Meta Description: ${result.metaDescription}` : '',
      result.headings.length > 0 ? `Key Headings:\n- ${result.headings.join('\n- ')}` : '',
      result.keyParagraphs.length > 0 ? `Core Page Content:\n${result.keyParagraphs.join('\n\n')}` : '',
    ].filter(Boolean);

    result.cleanedText = textPieces.join('\n\n').slice(0, 4500);
    result.scrapedSuccessfully = true;

    // Detect common tech stack clues in HTML
    const techClues: string[] = [];
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes('next/dist') || lowerHtml.includes('__next')) techClues.push('Next.js');
    if (lowerHtml.includes('react') || lowerHtml.includes('react-dom')) techClues.push('React');
    if (lowerHtml.includes('tailwind')) techClues.push('Tailwind CSS');
    if (lowerHtml.includes('segment.com') || lowerHtml.includes('analytics.js')) techClues.push('Segment');
    if (lowerHtml.includes('google-analytics') || lowerHtml.includes('gtag')) techClues.push('Google Analytics');
    if (lowerHtml.includes('intercom') || lowerHtml.includes('intercomSettings')) techClues.push('Intercom');
    if (lowerHtml.includes('hubspot') || lowerHtml.includes('hs-scripts')) techClues.push('HubSpot');
    if (lowerHtml.includes('stripe.com')) techClues.push('Stripe Payments');
    if (lowerHtml.includes('cloudflare')) techClues.push('Cloudflare');
    if (lowerHtml.includes('datadog')) techClues.push('Datadog');
    result.detectedTech = techClues;

    return result;
  } catch (err: any) {
    result.errorMessage = err?.name === 'AbortError' ? 'Connection timed out after 7.5s' : (err?.message || 'Failed to fetch website');
    return result;
  }
}
