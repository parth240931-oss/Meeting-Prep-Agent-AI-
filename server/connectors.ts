import { scrapeCompanyWebsite } from './liveScraper';

/**
 * Connector layer.
 *
 * Rule for this file: a connector either returns data it actually fetched,
 * or it says plainly that it is not connected. Nothing here invents data.
 */

export interface ApolloEnrichmentResult {
  source: 'Apollo.io';
  status: 'ok' | 'not_connected' | 'error';
  note?: string;
  organization?: {
    name: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    estimatedNumEmployees?: number;
    industries?: string[];
    foundedYear?: number;
    totalFunding?: string;
    latestFundingStage?: string;
    annualRevenue?: string;
    techStackDetected?: string[];
  };
}

const APOLLO_BASE = 'https://api.apollo.io/v1';

function apolloHeaders(apiKey: string) {
  return {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey.trim(),
  };
}

/**
 * Looks up an organisation in Apollo.io. Requires the user's own Apollo API key.
 * Without a key the connector is skipped; it never falls back to made-up data.
 */
export async function enrichWithApollo(
  companyName: string,
  domain: string,
  apiKey?: string
): Promise<ApolloEnrichmentResult> {
  if (!apiKey || !apiKey.trim()) {
    return {
      source: 'Apollo.io',
      status: 'not_connected',
      note: 'No Apollo API key configured, so Apollo enrichment was skipped.',
    };
  }

  try {
    const response = await fetch(
      `${APOLLO_BASE}/organizations/enrich?domain=${encodeURIComponent(domain)}`,
      { method: 'GET', headers: apolloHeaders(apiKey), signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) {
      return {
        source: 'Apollo.io',
        status: 'error',
        note: `Apollo returned HTTP ${response.status} for ${domain}.`,
      };
    }

    const json: any = await response.json();
    const org = json?.organization;
    if (!org) {
      return {
        source: 'Apollo.io',
        status: 'error',
        note: `Apollo has no organisation record for ${domain}.`,
      };
    }

    return {
      source: 'Apollo.io',
      status: 'ok',
      organization: {
        name: org.name || companyName.trim(),
        websiteUrl: org.website_url,
        linkedinUrl: org.linkedin_url,
        estimatedNumEmployees: org.estimated_num_employees,
        industries: org.industries || (org.industry ? [org.industry] : undefined),
        foundedYear: org.founded_year,
        totalFunding: org.total_funding_printed,
        latestFundingStage: org.latest_funding_stage,
        annualRevenue: org.annual_revenue_printed,
        techStackDetected: org.technology_names?.slice(0, 10),
      },
    };
  } catch (err: any) {
    return {
      source: 'Apollo.io',
      status: 'error',
      note: `Apollo request failed: ${err?.message || 'network error'}.`,
    };
  }
}

export type ConnectorId = 'apollo' | 'linkedin' | 'webScraper' | 'googleSearch';

/**
 * Connection tests. Each one performs a real check and reports the real outcome.
 */
export async function testConnector(
  connectorId: ConnectorId,
  payload: { apiKey?: string; testUrl?: string; hasGeminiKey: boolean }
): Promise<{ success: boolean; message: string; data?: any }> {
  if (connectorId === 'webScraper') {
    const testTarget = payload.testUrl || 'https://linear.app';
    const scrapeRes = await scrapeCompanyWebsite(testTarget);
    if (scrapeRes.scrapedSuccessfully) {
      return {
        success: true,
        message: `Fetched ${scrapeRes.finalUrl} (HTTP ${scrapeRes.statusCode}): "${scrapeRes.title || 'no page title'}", ${scrapeRes.headings.length} headings found.`,
        data: {
          title: scrapeRes.title,
          headingsFound: scrapeRes.headings.length,
          techDetected: scrapeRes.detectedTech,
        },
      };
    }
    return {
      success: false,
      message: `Could not fetch ${testTarget}: ${scrapeRes.errorMessage}`,
    };
  }

  if (connectorId === 'apollo') {
    if (!payload.apiKey || !payload.apiKey.trim()) {
      return {
        success: false,
        message: 'No Apollo API key entered. Apollo enrichment stays off until you add one.',
      };
    }
    try {
      const res = await fetch(`${APOLLO_BASE}/auth/health`, {
        method: 'GET',
        headers: apolloHeaders(payload.apiKey),
        signal: AbortSignal.timeout(8000),
      });
      const json: any = await res.json().catch(() => null);
      if (res.ok && json?.is_logged_in !== false) {
        return { success: true, message: 'Apollo accepted this API key.' };
      }
      return { success: false, message: `Apollo rejected this API key (HTTP ${res.status}).` };
    } catch (err: any) {
      return { success: false, message: `Could not reach Apollo: ${err?.message || 'network error'}.` };
    }
  }

  // LinkedIn signals and Google Search both run through Gemini's Google Search grounding.
  if (payload.hasGeminiKey) {
    return {
      success: true,
      message:
        connectorId === 'linkedin'
          ? 'Gemini API key found. Public LinkedIn signals are looked up through Google Search grounding.'
          : 'Gemini API key found. Google Search grounding is available to the agent.',
    };
  }
  return {
    success: false,
    message: 'No GEMINI_API_KEY on the server, so search-grounded lookups cannot run.',
  };
}
