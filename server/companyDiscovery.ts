import { GoogleGenAI } from '@google/genai';
import {
  TOP_INDIAN_COMPANIES,
  searchIndianCompaniesIndex,
  IndianCompanyRecord,
  INDIAN_TECH_HUBS,
  INDIAN_SECTORS,
} from './indianCompaniesData';

export interface DiscoveredCompanyItem {
  name: string;
  domain: string;
  websiteUrl: string;
  logoUrl?: string;
  description: string;
  industry: string;
  estimatedHeadcount?: string;
  location?: string;
  fundingStage?: string;
  tags?: string[];
  source?: string;
  isUnicorn?: boolean;
  region?: string;
  city?: string;
  state?: string;
}

// Small curated list of well-known global tech companies (approximate snapshot figures)
const SEED_COMPANIES: DiscoveredCompanyItem[] = [
  {
    name: 'Linear',
    domain: 'linear.app',
    websiteUrl: 'https://linear.app',
    description: 'Purpose-built issue tracking and project management tool designed for high-performance software engineering teams.',
    industry: 'Developer Tools & Project Management',
    estimatedHeadcount: '80 - 150 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Series B ($48M raised)',
    tags: ['Issue Tracking', 'Productivity', 'Git Workflows', 'Engineering'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Ramp',
    domain: 'ramp.com',
    websiteUrl: 'https://ramp.com',
    description: 'Finance automation platform combining corporate cards, automated expense management, bill pay, and accounting integrations.',
    industry: 'Financial Technology & Corporate Spend',
    estimatedHeadcount: '1,000 - 1,500 employees',
    location: 'New York, NY',
    fundingStage: 'Series D-2 ($1.2B raised, $7.6B Valuation)',
    tags: ['Corporate Cards', 'Expense Management', 'Fintech', 'Accounts Payable'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Supabase',
    domain: 'supabase.com',
    websiteUrl: 'https://supabase.com',
    description: 'Open source Firebase alternative providing PostgreSQL database, instant REST/GraphQL APIs, Auth, Realtime subscriptions, and Vector embeddings.',
    industry: 'Database & Developer Infrastructure',
    estimatedHeadcount: '150 - 300 employees',
    location: 'San Francisco, CA (Remote)',
    fundingStage: 'Series B ($116M raised)',
    tags: ['PostgreSQL', 'Open Source', 'BaaS', 'AI Vectors'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Vercel',
    domain: 'vercel.com',
    websiteUrl: 'https://vercel.com',
    description: 'Frontend cloud platform and creator of Next.js, providing serverless deployment, edge middleware, and AI SDK for modern web developers.',
    industry: 'Cloud Infrastructure & Frontend Platforms',
    estimatedHeadcount: '500 - 900 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Series E ($250M raised, $3.25B Valuation)',
    tags: ['Next.js', 'Frontend Cloud', 'Serverless', 'AI SDK'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Datadog',
    domain: 'datadoghq.com',
    websiteUrl: 'https://www.datadoghq.com',
    description: 'Cloud-scale monitoring and security platform providing full-stack observability across infrastructure, applications, logs, and network telemetry.',
    industry: 'Cloud Observability & Security (SaaS)',
    estimatedHeadcount: '5,000 - 7,000 employees',
    location: 'New York, NY',
    fundingStage: 'Public (NASDAQ: DDOG)',
    tags: ['Observability', 'APM', 'Cloud Security', 'DevOps'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Stripe',
    domain: 'stripe.com',
    websiteUrl: 'https://stripe.com',
    description: 'Financial infrastructure platform powering internet payments, billing, treasury, tax calculation, and global commerce for businesses of all sizes.',
    industry: 'Financial Technology & Global Payments',
    estimatedHeadcount: '7,000 - 9,000 employees',
    location: 'San Francisco, CA / Dublin',
    fundingStage: 'Private / Pre-IPO (~$70B Valuation)',
    tags: ['Payments', 'Billing', 'Financial API', 'Global Commerce'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Retool',
    domain: 'retool.com',
    websiteUrl: 'https://retool.com',
    description: 'Low-code platform that allows developers to build internal tools, dashboards, and workflows by connecting directly to databases and APIs.',
    industry: 'Internal Tools & Enterprise Low-Code',
    estimatedHeadcount: '350 - 600 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Series C ($3.2B Valuation)',
    tags: ['Internal Tools', 'Low-Code', 'Enterprise Portals', 'SQL UI'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Figma',
    domain: 'figma.com',
    websiteUrl: 'https://figma.com',
    description: 'Collaborative cloud interface design and prototyping tool that connects designers, engineers, and product managers in real time.',
    industry: 'Design & Collaboration Software',
    estimatedHeadcount: '1,200 - 1,800 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Private ($12.5B Valuation)',
    tags: ['Design', 'Prototyping', 'Design Systems', 'Collaboration'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Resend',
    domain: 'resend.com',
    websiteUrl: 'https://resend.com',
    description: 'Modern developer email delivery platform and API with React email templates and analytics built for high-scale applications.',
    industry: 'Developer Tools & Communications',
    estimatedHeadcount: '20 - 50 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Seed / Series A',
    tags: ['Email API', 'React Email', 'Developer Experience'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Snowflake',
    domain: 'snowflake.com',
    websiteUrl: 'https://www.snowflake.com',
    description: 'Data Cloud platform providing instant, secure access to data warehousing, data lakes, AI model fine-tuning, and data sharing.',
    industry: 'Cloud Data Warehouse & Analytics',
    estimatedHeadcount: '7,000+ employees',
    location: 'Bozeman, MT / San Mateo, CA',
    fundingStage: 'Public (NYSE: SNOW)',
    tags: ['Data Cloud', 'Data Warehouse', 'SQL Analytics', 'AI Data'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Weights & Biases',
    domain: 'wandb.ai',
    websiteUrl: 'https://wandb.ai',
    description: 'Enterprise AI developer platform for tracking machine learning experiments, hyperparameter tuning, model evaluation, and LLMOps.',
    industry: 'Machine Learning & LLMOps Platform',
    estimatedHeadcount: '200 - 400 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Series C ($1.25B Valuation)',
    tags: ['MLOps', 'LLMOps', 'Experiment Tracking', 'AI Models'],
    source: 'Curated list',
    region: 'Global',
  },
  {
    name: 'Cursor',
    domain: 'cursor.com',
    websiteUrl: 'https://cursor.com',
    description: 'AI-first code editor and IDE built for pair-programming, full-codebase indexing, and automated code transformations powered by frontier LLMs.',
    industry: 'Developer Tools & AI IDE',
    estimatedHeadcount: '25 - 60 employees',
    location: 'San Francisco, CA',
    fundingStage: 'Series A ($60M raised, $2.5B Valuation)',
    tags: ['AI Editor', 'IDE', 'Code Generation', 'Developer Velocity'],
    source: 'Curated list',
    region: 'Global',
  },
];

// Convert Indian company records to DiscoveredCompanyItem
function mapIndianToDiscovered(rec: IndianCompanyRecord): DiscoveredCompanyItem {
  return {
    name: rec.name,
    domain: rec.domain,
    websiteUrl: rec.websiteUrl,
    description: rec.description,
    industry: rec.industry,
    estimatedHeadcount: rec.estimatedHeadcount,
    location: `${rec.city}, ${rec.state} (India)`,
    fundingStage: rec.fundingStage,
    tags: rec.tags,
    source: rec.isUnicorn ? '🇮🇳 Curated list · Unicorn' : '🇮🇳 Curated list',
    isUnicorn: rec.isUnicorn,
    region: 'India',
    city: rec.city,
    state: rec.state,
  };
}

/**
 * Searches the curated company lists, then adds live results from Gemini with
 * Google Search grounding when a Gemini key is available.
 */
export async function searchAndDiscoverCompanies(
  query: string,
  category: string = 'all',
  ai: GoogleGenAI | null,
  region: string = 'all',
  city: string = 'all'
): Promise<DiscoveredCompanyItem[]> {
  const cleanQuery = query.trim().toLowerCase();
  const isIndiaFocused =
    region === 'india' ||
    cleanQuery.includes('india') ||
    cleanQuery.includes('bengaluru') ||
    cleanQuery.includes('bangalore') ||
    cleanQuery.includes('mumbai') ||
    cleanQuery.includes('delhi') ||
    cleanQuery.includes('gurgaon') ||
    cleanQuery.includes('gurugram') ||
    cleanQuery.includes('hyderabad') ||
    cleanQuery.includes('pune') ||
    cleanQuery.includes('chennai') ||
    cleanQuery.includes('noida') ||
    cleanQuery.includes('unicorn');

  // 1. Search the curated Indian list
  const indianMatches = searchIndianCompaniesIndex(query, category, city).map(mapIndianToDiscovered);

  // 2. Search in global seed index (if not strictly India-only)
  let globalMatches: DiscoveredCompanyItem[] = [];
  if (region !== 'india') {
    globalMatches = SEED_COMPANIES.filter((c) => {
      if (!cleanQuery) return true;
      const matchName = c.name.toLowerCase().includes(cleanQuery);
      const matchDomain = c.domain.toLowerCase().includes(cleanQuery);
      const matchIndustry = c.industry.toLowerCase().includes(cleanQuery);
      const matchDesc = c.description.toLowerCase().includes(cleanQuery);
      const matchTag = c.tags?.some((t) => t.toLowerCase().includes(cleanQuery));
      return matchName || matchDomain || matchIndustry || matchDesc || matchTag;
    });

    if (category && category !== 'all' && category !== 'All Sectors') {
      const cleanCat = category.toLowerCase().split('&')[0].trim();
      globalMatches = globalMatches.filter(
        (c) =>
          c.industry.toLowerCase().includes(cleanCat) ||
          c.tags?.some((t) => t.toLowerCase().includes(cleanCat))
      );
    }
  }

  // Combine seed matches prioritizing user's intent/region
  let rawSeeds: DiscoveredCompanyItem[] = [];
  if (isIndiaFocused || region === 'india') {
    rawSeeds = [...indianMatches, ...globalMatches];
  } else {
    rawSeeds = [...globalMatches, ...indianMatches];
  }

  // Deduplicate seeds by domain & normalized name
  const seenSeedDomains = new Set<string>();
  const combinedSeeds: DiscoveredCompanyItem[] = [];
  for (const item of rawSeeds) {
    const key = (item.domain || item.name).toLowerCase().replace(/^www\./, '').trim();
    if (!seenSeedDomains.has(key)) {
      seenSeedDomains.add(key);
      combinedSeeds.push(item);
    }
  }

  // If query is broad or already has great verified seed matches, return promptly
  if (combinedSeeds.length >= 4 && cleanQuery.length <= 3) {
    return combinedSeeds.slice(0, 16);
  }

  // 3. Live Google Search Grounding for targeted or long-tail entities
  if (ai && cleanQuery.length >= 2) {
    try {
      const regionPrompt = isIndiaFocused ? 'based in India (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, etc.)' : 'globally or in India';
      const searchPrompt = `You are a real-time corporate intelligence discovery engine with deep knowledge of Indian startups, unicorns, IT giants, and global enterprises.
Search the public web for real companies matching: "${query}".
Focus: ${regionPrompt}.
Category/Sector: "${category || 'All Tech & Business'}"

TASK:
Find 4 to 6 real companies matching this search query or theme.
For each company, provide their official name, domain/website, description of product/service (1-2 sentences), industry, estimated headcount, headquarters city & country, and funding or public status.

Respond ONLY with a JSON array conforming to this schema:
[
  {
    "name": "Company Name",
    "domain": "company.com",
    "websiteUrl": "https://company.com",
    "description": "Accurate description of what the company builds or sells.",
    "industry": "Specific Industry Category",
    "estimatedHeadcount": "e.g. 500 - 1,000 employees",
    "location": "City, State / Country",
    "fundingStage": "e.g. Series B ($50M raised) or Public (NSE: TICKER)",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "isUnicorn": false
  }
]`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim();
      if (text) {
        const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const liveDiscovered: DiscoveredCompanyItem[] = parsed.map((item: any) => ({
            name: String(item.name || 'Unknown Entity'),
            domain: String(item.domain || `${String(item.name).toLowerCase().replace(/[^a-z0-9]/g, '')}.com`),
            websiteUrl: String(item.websiteUrl || `https://${item.domain || item.name}`),
            description: String(item.description || ''),
            industry: String(item.industry || 'Technology & Enterprise Solutions'),
            estimatedHeadcount: item.estimatedHeadcount ? String(item.estimatedHeadcount) : undefined,
            location: item.location ? String(item.location) : undefined,
            fundingStage: item.fundingStage ? String(item.fundingStage) : undefined,
            tags: Array.isArray(item.tags) ? item.tags.map(String) : ['Enterprise', 'Tech'],
            source: item.location?.toLowerCase().includes('india') ? '🇮🇳 Live India Web Search' : 'Live Web Search',
            isUnicorn: Boolean(item.isUnicorn || item.fundingStage?.toLowerCase().includes('unicorn') || item.fundingStage?.toLowerCase().includes('$1b')),
            region: item.location?.toLowerCase().includes('india') ? 'India' : 'Global',
          }));

          // Merge live results with seed results, deduplicating by domain
          const seenDomains = new Set<string>();
          const combined: DiscoveredCompanyItem[] = [];

          for (const item of [...liveDiscovered, ...combinedSeeds]) {
            const dom = item.domain.toLowerCase().replace(/^www\./, '');
            if (!seenDomains.has(dom)) {
              seenDomains.add(dom);
              combined.push(item);
            }
          }

          return combined.slice(0, 20);
        }
      }
    } catch {
      // Fall through to seeds
    }
  }

  return combinedSeeds.slice(0, 20);
}

