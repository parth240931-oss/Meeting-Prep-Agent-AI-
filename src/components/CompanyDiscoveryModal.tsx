import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Globe,
  Building2,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Filter,
  Users,
  DollarSign,
  MapPin,
  Check,
  Flame,
  Zap,
} from 'lucide-react';
import { DiscoveredCompany } from '../types';

interface CompanyDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (company: DiscoveredCompany) => void;
}

const REGIONS = [
  { id: 'india', label: '🇮🇳 India (curated list + live search)', badge: 'India' },
  { id: 'all', label: '🌐 All Tech & Global', badge: 'Global & India' },
  { id: 'global', label: '🇺🇸 US & International', badge: 'Global Tech' },
];

const INDIA_HUBS = [
  { id: 'all', label: 'All Cities' },
  { id: 'Bengaluru', label: 'Bengaluru (Bangalore)' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Gurugram', label: 'Gurugram (Gurgaon)' },
  { id: 'Noida', label: 'Noida / NCR' },
  { id: 'Hyderabad', label: 'Hyderabad' },
  { id: 'Pune', label: 'Pune' },
  { id: 'Chennai', label: 'Chennai' },
  { id: 'Delhi', label: 'Delhi NCR' },
  { id: 'Ahmedabad', label: 'Ahmedabad' },
  { id: 'Kochi', label: 'Kochi' },
  { id: 'Jaipur', label: 'Jaipur' },
];

const SECTOR_CATEGORIES = [
  { id: 'all', label: 'All Sectors' },
  { id: 'Unicorns', label: '🦄 Unicorns & Decacorns' },
  { id: 'SaaS', label: 'Cloud SaaS & B2B' },
  { id: 'Fintech', label: 'FinTech & Payments' },
  { id: 'AI', label: 'AI & DeepTech' },
  { id: 'E-commerce', label: 'Quick-Comm & D2C' },
  { id: 'IT Services', label: 'IT Services Giants' },
  { id: 'Logistics', label: 'Logistics & Mobility' },
  { id: 'HealthTech', label: 'HealthTech & Bio' },
  { id: 'EdTech', label: 'EdTech & Upskilling' },
];

const POPULAR_INDIAN_SEARCHES = [
  'Swiggy',
  'Zepto',
  'Razorpay',
  'Zoho',
  'PhysicsWallah',
  'Zerodha',
  'Groww',
  'Sarvam AI',
  'Ather Energy',
  'Pixxel Space',
  'Infosys',
  'TCS',
  'CRED',
  'Delhivery',
  'Darwinbox',
];

export const CompanyDiscoveryModal: React.FC<CompanyDiscoveryModalProps> = ({
  isOpen,
  onClose,
  onSelectCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('india');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [companies, setCompanies] = useState<DiscoveredCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<string>('');

  const fetchCompanies = async (
    query: string,
    category: string,
    region: string,
    city: string
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        category: category,
        region: region,
        city: city,
      });

      const res = await fetch(`/api/companies/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const rawCompanies: DiscoveredCompany[] = data.companies || [];
        
        // Ensure strictly unique companies by domain/name in client state
        const seen = new Set<string>();
        const uniqueCompanies: DiscoveredCompany[] = [];
        for (const item of rawCompanies) {
          const key = (item.domain || item.name).toLowerCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueCompanies.push(item);
          }
        }

        setCompanies(uniqueCompanies);
        if (data.totalIndexedIndianEntities) {
          setTotalCount(data.totalIndexedIndianEntities);
        }
      }
    } catch (e) {
      console.warn('Failed to search companies', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search on filter changes
  useEffect(() => {
    if (isOpen) {
      fetchCompanies(searchQuery, selectedCategory, selectedRegion, selectedCity);
    }
  }, [isOpen, selectedCategory, selectedRegion, selectedCity]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchCompanies(searchQuery, selectedCategory, selectedRegion, selectedCity);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="bg-[#FDFCF9] border border-[#E5E2D9] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E2D9] bg-[#F8F6F1] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest font-mono">
                Indian & Global Corporate Index
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold font-mono">
                🇮🇳 {totalCount ? `${totalCount} curated Indian companies` : 'Curated Indian companies'} + live web search
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light font-serif text-[#1A1A1A]">
              Company Finder: Indian & Global Companies
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C8980] hover:text-[#1A1A1A] hover:bg-[#EFEDE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Region & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E2D9] bg-white space-y-3">
          {/* Top Row: Region Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-[#EFEDE7] p-1 border border-[#E5E2D9]">
              {REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg.id);
                    if (reg.id !== 'india') setSelectedCity('all');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedRegion === reg.id
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'text-[#4A4842] hover:text-[#1A1A1A] hover:bg-[#E5E2D9]/60'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* Quick city filter when Indian region is selected */}
            {selectedRegion === 'india' && (
              <div className="flex items-center gap-1.5 text-xs text-[#4A4842]">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8980] hidden sm:inline">
                  Hub:
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-[#FDFCF9] border border-[#E5E2D9] px-2.5 py-1 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {INDIA_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8980]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name (e.g. Swiggy, Zepto, Razorpay, Zoho, TCS), domain (e.g. pw.live), city or keywords..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-[#E5E2D9] bg-[#FDFCF9] text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C8980] hover:text-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Popular Searches */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-[#8C8980]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 text-orange-600" /> Hot:
            </span>
            {POPULAR_INDIAN_SEARCHES.slice(0, 8).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className="px-2 py-0.5 bg-[#F8F6F1] border border-[#E5E2D9] hover:border-[#1A1A1A] text-[#4A4842] hover:text-[#1A1A1A] whitespace-nowrap text-[11px] font-mono transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Sector Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sector:
            </span>
            {SECTOR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 border transition-all font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                    : 'bg-[#FDFCF9] text-[#4A4842] border-[#E5E2D9] hover:bg-[#EFEDE7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#F8F6F1]/30">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-600 mx-auto" />
              <p className="text-xs font-serif italic text-[#8C8980]">
                Searching the curated company list and the live web...
              </p>
            </div>
          )}

          {!isLoading && companies.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <Building2 className="w-8 h-8 text-[#8C8980] mx-auto" />
              <h4 className="text-base font-serif text-[#1A1A1A]">No companies found matching your filters</h4>
              <p className="text-xs text-[#8C8980] max-w-sm mx-auto font-serif italic">
                Try searching for specific company names (e.g. "Zoho", "Razorpay", "Swiggy"), domains, or reset sector filters.
              </p>
            </div>
          )}

          {!isLoading && companies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((company, idx) => (
                <div
                  key={`${company.domain || 'company'}-${company.name || 'entity'}-${idx}`}
                  className="bg-white border border-[#E5E2D9] p-5 hover:border-[#1A1A1A] transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 font-bold text-sm flex items-center justify-center font-serif shrink-0 ${
                            company.isUnicorn
                              ? 'bg-amber-500 text-black shadow-xs font-mono'
                              : 'bg-[#1A1A1A] text-white'
                          }`}
                        >
                          {company.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-serif font-bold text-base text-[#1A1A1A] group-hover:text-orange-600 transition-colors">
                              {company.name}
                            </h3>
                            {company.isUnicorn && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
                                🦄 Unicorn
                              </span>
                            )}
                            {company.source && (
                              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 bg-emerald-100 text-emerald-800">
                                {company.source}
                              </span>
                            )}
                          </div>
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-[#8C8980] hover:text-[#1A1A1A] flex items-center gap-1 mt-0.5"
                          >
                            <span>{company.domain}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] bg-[#F8F6F1] px-2 py-1 border border-[#E5E2D9] shrink-0 text-right">
                        {company.industry.split('&')[0]}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#4A4842] leading-relaxed line-clamp-2 font-sans">
                      {company.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8C8980] font-sans pt-1">
                      {company.location && (
                        <span className="flex items-center gap-1 bg-[#F8F6F1] px-2 py-0.5 border border-[#E5E2D9] font-medium text-[#1A1A1A]">
                          <MapPin className="w-3 h-3 text-orange-600" />
                          <span>{company.location}</span>
                        </span>
                      )}
                      {company.estimatedHeadcount && (
                        <span className="flex items-center gap-1 bg-[#F8F6F1] px-2 py-0.5 border border-[#E5E2D9]">
                          <Users className="w-3 h-3 text-[#4A4842]" />
                          <span>{company.estimatedHeadcount}</span>
                        </span>
                      )}
                      {company.fundingStage && (
                        <span className="flex items-center gap-1 bg-[#F8F6F1] px-2 py-0.5 border border-[#E5E2D9]">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span>{company.fundingStage}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {company.tags && company.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {company.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 bg-[#F4F2EB] text-[#4A4842] font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Launch Action */}
                  <div className="pt-4 mt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                    <span className="text-[11px] font-serif italic text-[#8C8980]">
                      🌐 Live Web Scraper & Apollo Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCompany(company);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs group-hover:scale-[1.02]"
                    >
                      <span>Research Target</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E2D9] bg-[#F8F6F1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C8980]">
          <span className="font-serif italic">
            Results come from a small curated list plus live Google Search results. Pick any company to research it.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E2D9] bg-white text-[#1A1A1A] font-bold uppercase tracking-wider text-xs hover:bg-[#EFEDE7]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

