export interface ResearchToolCall {
  id: string;
  toolName: 'web_search' | 'scrape_company_site' | 'analyze_hiring_and_signals' | 'lookup_financials_funding' | 'linkedin_company_profile' | 'recent_news_search' | 'competitor_analysis';
  queryOrTarget: string;
  rationale: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  resultSummary?: string;
  fullData?: Record<string, any> | string;
  timestamp: number;
}

export interface AgentStep {
  stepNumber: number;
  thought: string;
  actionType: 'tool_call' | 'synthesizing' | 'evaluating_sufficiency' | 'finalizing';
  toolCall?: ResearchToolCall;
  sufficiencyScore?: number; // 0 - 100
  sufficiencyReasoning?: string;
  timestamp: number;
}

export interface TalkingPoint {
  topic: string;
  headline: string;
  context: string;
  suggestedScript: string;
  sourceSignal: string; // e.g. "Recent Series C announcement" or "Hiring 12 AI Engineers"
  confidence: 'High' | 'Medium';
}

export interface InferredObjection {
  objection: string;
  likelyReason: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  recommendedPivot: string;
  killerFollowUpQuestion: string;
}

export interface DiscoveryQuestion {
  phase: 'Situation' | 'Problem' | 'Implication' | 'Need-Payoff';
  question: string;
  whyAskThis: string;
  idealResponseClues: string;
}

export interface StakeholderSignal {
  roleCategory: string;
  likelyPriorities: string[];
  keyRisks: string[];
  recentSignals: string;
}

export interface CompanyExecutive {
  name: string;
  title: string;
  linkedinSignal?: string;
  focusArea?: string;
}

export interface DepartmentHeadcount {
  department: string;
  percentageOrCount: string;
}

export interface CoreProductOffering {
  name: string;
  description: string;
  targetAudience?: string;
}

export interface CompanyOverview {
  tagline: string;
  whatCompanyDoes: string; // Detailed breakdown of what the company actually does
  industry: string;
  sector?: string;
  subIndustry?: string;
  hq: string;
  locations?: string[];
  websiteUrl?: string;
  linkedinUrl?: string;
  
  // Employee Strength & Headcount
  employeeStrength: {
    headcountRange: string; // e.g. "1,000 - 5,000 employees"
    exactOrEstimatedCount?: string; // e.g. "~1,450 employees on LinkedIn"
    headcountGrowth?: string; // e.g. "+22% 1-year headcount growth"
    departmentBreakdown?: DepartmentHeadcount[];
    hiringStatus?: string; // e.g. "Actively hiring for Engineering & GTM"
  };

  estimatedSize: string;
  businessModel?: string; // e.g. "B2B SaaS, Usage-Based, Enterprise Subscriptions"
  targetCustomers?: string; // e.g. "Software Engineers, Product Managers, Fast-growing startups"
  fundingStage: string;
  valuationOrRevenue?: string;
  keyCompetitors: string[];
  coreProducts: (string | CoreProductOffering)[];
  keyExecutives?: CompanyExecutive[];
}

export interface MeetingBrief {
  id: string;
  companyName: string;
  meetingTime: string;
  meetingContext?: string;
  pitchFocus?: string;
  createdAt: number;
  dataSource?: 'live_research' | 'heuristic_estimate';
  
  companyOverview: CompanyOverview;

  strategicAngle: {
    hook: string;
    whyNowReason: string;
    executiveSummary: string;
    urgencyDriver: string;
  };

  talkingPoints: TalkingPoint[];
  objectionsToExpect: InferredObjection[];
  discoveryQuestions: DiscoveryQuestion[];
  stakeholderSignals: StakeholderSignal[];
  
  recentSignals: {
    category: 'News' | 'Funding' | 'Hiring' | 'Product' | 'Leadership';
    headline: string;
    dateOrSource: string;
    relevanceToPitch: string;
  }[];

  executiveCheatSheet: {
    doSay: string[];
    doNotSay: string[];
    oneSentenceValueProp: string;
  };

  researchTrace: {
    totalToolsExecuted: number;
    agentDecisions: AgentStep[];
    autonomousStopReason: string;
    searchQueriesUsed: string[];
  };
}

export interface ResearchRequest {
  companyName: string;
  meetingTime: string;
  meetingContext?: string;
  pitchFocus?: string;
}

