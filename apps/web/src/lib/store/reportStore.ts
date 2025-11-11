/**
 * Report Store - Markdown-based Analyst Reports (Obsidian-style)
 * 각 entity/relationship에 대한 MD 보고서 작성 및 공유
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EntityType =
  | 'company'
  | 'product'
  | 'component'
  | 'shareholder'
  | 'customer'
  | 'macro'
  | 'sector'
  | 'technology'
  | 'relationship';

export interface Report {
  id: string;
  entityId: string; // company-nvidia, product-h100, etc
  entityType: EntityType;
  entityName: string;

  // Markdown content
  title: string;
  content: string; // Full markdown with [[links]]
  summary: string; // Short summary (1-2 sentences)

  // Metadata
  author: string;
  createdAt: string;
  updatedAt: string;
  version: number;

  // Tags & categorization
  tags: string[];
  category: 'technical' | 'financial' | 'strategic' | 'market' | 'supply-chain';

  // Collaboration
  isPublic: boolean;
  upvotes: number;
  downvotes: number;
  views: number;

  // Linked entities (extracted from [[links]])
  linkedEntities: string[]; // ['company-sk-hynix', 'component-hbm3e']

  // Attachments & sources
  sources: string[]; // URLs
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface ReportStore {
  reports: Record<string, Report>;
  bookmarkedReports: string[]; // Array of report IDs

  // Actions
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'upvotes' | 'downvotes' | 'views'>) => string;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  deleteReport: (reportId: string) => void;
  voteReport: (reportId: string, vote: 'up' | 'down') => void;
  incrementViews: (reportId: string) => void;
  bookmarkReport: (reportId: string) => void;
  unbookmarkReport: (reportId: string) => void;

  // Getters
  getReportsByEntity: (entityId: string) => Report[];
  getReportsByType: (entityType: EntityType) => Report[];
  getReportsByAuthor: (author: string) => Report[];
  getReportsByTag: (tag: string) => Report[];
  getPublicReports: () => Report[];
  getLinkedReports: (entityId: string) => Report[]; // Reports that link to this entity
  searchReports: (query: string) => Report[];
  getBookmarkedReports: () => Report[];
  isBookmarked: (reportId: string) => boolean;
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: {},
      bookmarkedReports: [],

      createReport: (report) => {
        const id = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        // Extract [[links]] from markdown
        const linkedEntities = extractLinks(report.content);

        const newReport: Report = {
          ...report,
          id,
          createdAt: now,
          updatedAt: now,
          version: 1,
          upvotes: 0,
          downvotes: 0,
          views: 0,
          linkedEntities,
        };

        set(state => ({
          reports: {
            ...state.reports,
            [id]: newReport,
          },
        }));

        return id;
      },

      updateReport: (reportId, updates) => {
        const report = get().reports[reportId];
        if (!report) return;

        // Re-extract links if content changed
        const linkedEntities = updates.content
          ? extractLinks(updates.content)
          : report.linkedEntities;

        set(state => ({
          reports: {
            ...state.reports,
            [reportId]: {
              ...report,
              ...updates,
              linkedEntities,
              updatedAt: new Date().toISOString(),
              version: report.version + 1,
            },
          },
        }));
      },

      deleteReport: (reportId) => {
        set(state => {
          const { [reportId]: deleted, ...remaining } = state.reports;
          return { reports: remaining };
        });
      },

      voteReport: (reportId, vote) => {
        const report = get().reports[reportId];
        if (!report) return;

        set(state => ({
          reports: {
            ...state.reports,
            [reportId]: {
              ...report,
              upvotes: vote === 'up' ? report.upvotes + 1 : report.upvotes,
              downvotes: vote === 'down' ? report.downvotes + 1 : report.downvotes,
            },
          },
        }));
      },

      incrementViews: (reportId) => {
        const report = get().reports[reportId];
        if (!report) return;

        set(state => ({
          reports: {
            ...state.reports,
            [reportId]: {
              ...report,
              views: report.views + 1,
            },
          },
        }));
      },

      bookmarkReport: (reportId) => {
        set(state => {
          if (state.bookmarkedReports.includes(reportId)) {
            return state; // Already bookmarked
          }
          return {
            bookmarkedReports: [...state.bookmarkedReports, reportId],
          };
        });
      },

      unbookmarkReport: (reportId) => {
        set(state => ({
          bookmarkedReports: state.bookmarkedReports.filter(id => id !== reportId),
        }));
      },

      // Getters
      getReportsByEntity: (entityId) => {
        return Object.values(get().reports)
          .filter(r => r.entityId === entityId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getReportsByType: (entityType) => {
        return Object.values(get().reports)
          .filter(r => r.entityType === entityType)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getReportsByAuthor: (author) => {
        return Object.values(get().reports)
          .filter(r => r.author === author)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getReportsByTag: (tag) => {
        return Object.values(get().reports)
          .filter(r => r.tags.includes(tag))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getPublicReports: () => {
        return Object.values(get().reports)
          .filter(r => r.isPublic)
          .sort((a, b) => b.upvotes - a.upvotes);
      },

      getLinkedReports: (entityId) => {
        return Object.values(get().reports)
          .filter(r => r.linkedEntities.includes(entityId))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      searchReports: (query) => {
        const lowerQuery = query.toLowerCase();
        return Object.values(get().reports)
          .filter(r =>
            r.title.toLowerCase().includes(lowerQuery) ||
            r.content.toLowerCase().includes(lowerQuery) ||
            r.summary.toLowerCase().includes(lowerQuery) ||
            r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getBookmarkedReports: () => {
        const { reports, bookmarkedReports } = get();
        return bookmarkedReports
          .map(id => reports[id])
          .filter(Boolean) // Remove any undefined reports
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      isBookmarked: (reportId) => {
        return get().bookmarkedReports.includes(reportId);
      },
    }),
    {
      name: 'report-store',
    }
  )
);

// Helper: Extract [[Entity Name]] links from markdown
export function extractLinks(markdown: string): string[] {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    // Convert [[Entity Name]] to entity-id format
    const entityName = match[1];
    const entityId = entityName.toLowerCase().replace(/\s+/g, '-');
    links.push(entityId);
  }

  return [...new Set(links)]; // Remove duplicates
}

// Helper: Parse markdown and replace [[links]] with clickable elements
export function parseMarkdownLinks(markdown: string, onLinkClick?: (entityId: string) => void): string {
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (match, entityName) => {
    const entityId = entityName.toLowerCase().replace(/\s+/g, '-');
    return `<span class="wiki-link" data-entity-id="${entityId}" onclick="handleEntityClick('${entityId}')">${entityName}</span>`;
  });
}

// Helper: Get entity type from ID
export function getEntityTypeFromId(entityId: string): EntityType {
  if (entityId.startsWith('company-')) return 'company';
  if (entityId.startsWith('product-')) return 'product';
  if (entityId.startsWith('component-')) return 'component';
  if (entityId.startsWith('shareholder-')) return 'shareholder';
  if (entityId.startsWith('customer-')) return 'customer';
  if (entityId.startsWith('macro-')) return 'macro';
  if (entityId.startsWith('sector-')) return 'sector';
  if (entityId.startsWith('technology-')) return 'technology';
  return 'company'; // default
}

// Sample reports
export const SAMPLE_REPORTS: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'upvotes' | 'downvotes' | 'views' | 'linkedEntities'>[] = [
  {
    entityId: 'company-nvidia',
    entityType: 'company',
    entityName: 'NVIDIA Corporation',
    title: 'NVIDIA H100 AI Accelerator - Complete Supply Chain Analysis',
    summary: 'Deep dive into NVIDIA H100 production chain from HBM3E memory to TSMC manufacturing.',
    content: `# NVIDIA H100 Supply Chain Analysis

## Executive Summary
[[NVIDIA]] H100 is the flagship AI accelerator, commanding 80%+ market share in AI training. This report analyzes the complete supply chain.

## Key Components

### 1. HBM3E Memory
- **Supplier**: [[SK Hynix]] (exclusive, 95% market share)
- **Specifications**: 819 GB/s bandwidth, 80GB capacity
- **Cost**: ~$1,500 per unit
- **Lead Time**: 4-6 months

The [[HBM3E]] is manufactured using [[ASML]] EUV equipment, making it a critical bottleneck.

### 2. GPU Die Manufacturing
- **Foundry**: [[TSMC]] 4nm process
- **Capacity**: 10,000 wafers/month allocated to NVIDIA
- **Yield**: ~70% (improving from 60% in Q1)

### 3. CoWoS Packaging
Advanced packaging by [[TSMC]] using Chip-on-Wafer-on-Substrate technology.

## Financial Impact

**H100 Economics:**
- Retail Price: $30,000-$40,000
- Manufacturing Cost: ~$3,500
- Gross Margin: 88%+

**Market Dynamics:**
- [[Microsoft]] - $8B annual spend (largest customer)
- [[Meta]] - $6B annual spend
- [[Google]] - $5B annual spend

## Supply Chain Risks

1. **HBM3E Bottleneck**: Single supplier ([[SK Hynix]])
2. **ASML Dependency**: EUV equipment for both HBM and GPU
3. **Geopolitical**: Taiwan manufacturing concentration

## Conclusion
The H100 supply chain represents a highly concentrated, capital-intensive ecosystem with significant barriers to entry.

---
*Tags: #supply-chain #AI #semiconductors #HBM*
*Sources: NVIDIA Investor Relations, TechInsights teardown*
`,
    author: 'analyst-research-team',
    tags: ['supply-chain', 'AI', 'semiconductors', 'HBM', 'nvidia'],
    category: 'supply-chain',
    isPublic: true,
    sources: [
      'https://www.nvidia.com/en-us/data-center/h100/',
      'https://www.techinsights.com/blog/nvidia-h100-teardown'
    ],
  },
  {
    entityId: 'component-hbm3e',
    entityType: 'component',
    entityName: 'HBM3E Memory',
    title: 'HBM3E: The AI Memory Revolution',
    summary: 'Technical deep-dive into High Bandwidth Memory 3E technology and its role in AI acceleration.',
    content: `# HBM3E Memory Technology

## Overview
HBM3E (High Bandwidth Memory 3 Enhanced) is the latest generation of 3D-stacked DRAM, critical for AI workloads.

## Technical Specifications
- **Bandwidth**: 819 GB/s (vs 600 GB/s for HBM3)
- **Capacity**: Up to 96GB per stack
- **Power Efficiency**: 30% better than HBM3
- **Stack Height**: 12-high (vs 8-high for HBM2e)

## Manufacturing Process
Manufactured by [[SK Hynix]] using:
1. [[ASML]] EUV lithography for logic die
2. Through-Silicon Via (TSV) technology
3. Micro-bump interconnects

## Applications
Primary use in:
- [[NVIDIA]] H100, H200, B100 GPUs
- [[AMD]] MI300 series
- Custom AI accelerators by [[Microsoft]], [[Google]]

## Market Dynamics
- **Supply**: [[SK Hynix]] 95%, [[Samsung]] 5%
- **Demand**: Growing 150% YoY
- **Lead Times**: Extended to 6+ months

## Investment Thesis
HBM3E represents a critical chokepoint in AI infrastructure. [[SK Hynix]]'s dominant position provides significant pricing power.

---
*Tags: #HBM #memory #AI #semiconductors*
`,
    author: 'tech-analyst-mike',
    tags: ['HBM', 'memory', 'AI', 'semiconductors', 'sk-hynix'],
    category: 'technical',
    isPublic: true,
    sources: ['https://www.skhynix.com/products/hbm'],
  },
  {
    entityId: 'company-tsmc',
    entityType: 'company',
    entityName: 'TSMC',
    title: 'TSMC 4nm Process: The Foundation of AI Revolution',
    summary: 'Analysis of TSMC\'s advanced 4nm node technology powering NVIDIA H100 and other leading AI chips.',
    content: `# TSMC 4nm Process Technology

## Overview
Taiwan Semiconductor Manufacturing Company ([[TSMC]]) dominates the advanced logic foundry market with its cutting-edge 4nm process, producing chips for [[NVIDIA]], [[AMD]], and [[Apple]].

## Process Technology
- **Node**: N4P (4nm Performance Enhanced)
- **Transistor Density**: 171 million transistors/mm²
- **Power Reduction**: 22% vs N5 (5nm)
- **Performance Gain**: 11% vs N5
- **EUV Layers**: 13-15 layers

## Production Capacity
- **Total Wafer Capacity**: 40,000 WSPM (Wafers Started Per Month)
- **[[NVIDIA]] Allocation**: ~10,000 WSPM
- **[[AMD]] Allocation**: ~3,000 WSPM
- **[[Apple]] Allocation**: ~15,000 WSPM

## CoWoS Advanced Packaging
[[TSMC]]\'s Chip-on-Wafer-on-Substrate (CoWoS) packaging is critical for [[HBM3E]] integration:
- **Capacity**: 15,000-20,000 units/month (bottleneck)
- **Expansion Plans**: +50% by Q2 2025
- **Cost**: $500-800 per unit

## Competitive Position
- **Market Share**: 60%+ in advanced logic (<7nm)
- **Key Competitors**: [[Samsung]] (20%), [[Intel]] (10%)
- **Moat**: 2-3 year technology lead

## Risks
1. **Geopolitical**: 90% production in Taiwan
2. **Customer Concentration**: Top 3 customers = 60% revenue
3. **Capital Intensity**: $40B+ annual CapEx

## Investment Outlook
[[TSMC]] remains the critical enabler of AI infrastructure. Capacity constraints in CoWoS packaging present near-term bottleneck but expansion underway.

---
*Tags: #tsmc #semiconductors #manufacturing #AI #foundry*`,
    author: 'semiconductor-analyst-jen',
    tags: ['tsmc', 'semiconductors', 'manufacturing', 'AI', 'foundry'],
    category: 'technical',
    isPublic: true,
    sources: [
      'https://www.tsmc.com/english/dedicatedFoundry/technology/logic',
      'https://www.tsmc.com/english/dedicatedFoundry/manufacturing/cowos'
    ],
  },
  {
    entityId: 'company-amd',
    entityType: 'company',
    entityName: 'AMD',
    title: 'AMD MI300X: Challenging NVIDIA\'s AI Dominance',
    summary: 'Deep dive into AMD\'s MI300X AI accelerator and its competitive positioning against NVIDIA H100.',
    content: `# AMD MI300X AI Accelerator

## Product Overview
The [[AMD]] MI300X is a unified compute die combining CPU and GPU elements, targeting data center AI workloads currently dominated by [[NVIDIA]].

## Technical Specifications
- **Architecture**: CDNA 3
- **Memory**: 192GB HBM3 (vs 80GB for [[H100]])
- **Memory Bandwidth**: 5.2 TB/s
- **Compute**: 1.3 PFLOPS FP16
- **Process**: [[TSMC]] N5 (5nm)
- **Power**: 750W TDP

## Supply Chain
1. **GPU Dies**: [[TSMC]] N5
2. **HBM3**: [[SK Hynix]] (80%), [[Samsung]] (20%)
3. **Packaging**: [[TSMC]] 3D stacking
4. **Substrate**: Multiple suppliers

## Competitive Analysis vs NVIDIA H100
**Advantages:**
- 2.4x memory capacity (192GB vs 80GB)
- Lower price (~$15,000 vs $30,000)
- Better memory bandwidth per dollar

**Disadvantages:**
- Software ecosystem (ROCm vs CUDA)
- Market share (5% vs 80%)
- Supply allocation challenges

## Market Adoption
- **[[Microsoft]]**: Testing for Azure AI
- **[[Meta]]**: Ordered 150,000 units for 2024
- **[[Google]]**: Evaluation ongoing
- **Oracle Cloud**: Deployment announced

## Investment Thesis
[[AMD]] is gaining traction in AI accelerators, particularly for inference workloads. Memory advantage appeals to large language model training. However, [[NVIDIA]]'s software moat remains formidable.

---
*Tags: #amd #AI #datacenter #mi300x #gpu*`,
    author: 'tech-analyst-chris',
    tags: ['amd', 'AI', 'datacenter', 'mi300x', 'gpu'],
    category: 'technical',
    isPublic: true,
    sources: ['https://www.amd.com/en/products/accelerators/instinct/mi300'],
  },
  {
    entityId: 'company-asml',
    entityType: 'company',
    entityName: 'ASML',
    title: 'ASML: The Monopoly Behind Every Advanced Chip',
    summary: 'How ASML\'s EUV lithography monopoly makes it the most critical company in semiconductors.',
    content: `# ASML EUV Lithography Monopoly

## The Ultimate Chokepoint
[[ASML]] Holding is the **only** company in the world that manufactures extreme ultraviolet (EUV) lithography systems, essential for all advanced semiconductor manufacturing below 7nm.

## EUV Technology
- **Wavelength**: 13.5 nanometers
- **Light Source**: Laser-produced plasma
- **Complexity**: 100,000+ parts, 20 shipping containers
- **Price**: $150-200 million per machine
- **Annual Production**: ~60 systems (capacity constrained)

## Customer Dependency
**Every advanced chip requires ASML EUV:**
- [[TSMC]]: Largest customer, 50+ systems
- [[Samsung]]: 30+ systems
- [[Intel]]: 20+ systems
- [[SK Hynix]]: For [[HBM3E]] production

## Supply Chain Impact
The entire AI revolution depends on ASML:
- [[NVIDIA]] [[H100]] → [[TSMC]] 4nm → ASML EUV
- [[AMD]] MI300X → [[TSMC]] 5nm → ASML EUV
- [[SK Hynix]] [[HBM3E]] → ASML EUV for logic die

## Financial Metrics
- **Revenue**: €27.6B (2023)
- **Backlog**: €38B (2+ year visibility)
- **Gross Margin**: 51%+
- **R&D Spend**: 15% of revenue

## Geopolitical Significance
- **Export Controls**: US restricts sales to China
- **Strategic Asset**: Netherlands government has golden share
- **National Security**: Each system tracked by multiple governments

## Risks
1. **Single Point of Failure**: No backup supplier exists
2. **Complexity**: Only company with necessary IP/expertise
3. **Lead Time**: 18-24 months from order to delivery

## Investment Outlook
[[ASML]] is arguably the most strategically important technology company globally. Monopoly position virtually guaranteed for next decade due to immense technical barriers to entry.

---
*Tags: #asml #euv #semiconductors #lithography #monopoly*`,
    author: 'strategic-analyst-david',
    tags: ['asml', 'euv', 'semiconductors', 'lithography', 'monopoly'],
    category: 'strategic',
    isPublic: true,
    sources: [
      'https://www.asml.com/en/products/euv-lithography-systems',
      'https://www.asml.com/en/investors/annual-report'
    ],
  },
  {
    entityId: 'sector-banking',
    entityType: 'sector',
    entityName: 'Banking',
    title: 'Banking Sector Interest Rate Sensitivity Analysis',
    summary: 'How Federal Reserve rate changes impact bank profitability through NIM expansion and loan demand.',
    content: `# Banking Sector Interest Rate Analysis

## Fed Rate Impact Mechanism
The [[Banking]] sector exhibits the strongest correlation to [[Federal Reserve]] interest rate policy of any sector in the economy.

## Net Interest Margin (NIM) Dynamics
**Rate Hike Scenario (+100 bps):**
- Asset repricing: +80 bps (loans reprice faster)
- Liability repricing: +40 bps (deposits reprice slower)
- **NIM Expansion**: +40 bps on average

**Rate Cut Scenario (-100 bps):**
- Asset repricing: -80 bps
- Liability repricing: -20 bps (deposit floor)
- **NIM Compression**: -60 bps

## Key Metrics by Bank Type
### Large Money Center Banks
- **NIM**: 2.8-3.2%
- **Loan Growth**: Moderate (5-7%)
- **Deposit Beta**: 40-50%
- **Examples**: [[JPMorgan Chase]], [[Bank of America]]

### Regional Banks
- **NIM**: 3.2-3.8%
- **Loan Growth**: Higher (8-12%)
- **Deposit Beta**: 50-60%
- **Examples**: [[US Bancorp]], [[PNC Financial]]

### Korean Banks
- **NIM**: 1.8-2.2% (low due to competition)
- **Loan Growth**: Moderate (4-6%)
- **Examples**: [[KB Financial]], [[Shinhan Financial]]

## Interest Coverage Ratio (ICR) Analysis
**Optimal Fed Rate for Banking Sector: 4.5-5.5%**
- Below 4%: NIM compression hurts profitability
- 4.5-5.5%: Sweet spot for NIM expansion
- Above 6%: Credit risk increases (loan defaults)

## Current Environment (Nov 2025)
- **Fed Funds Rate**: 5.25%
- **10Y Treasury**: 4.8%
- **Yield Curve**: Slightly inverted
- **Sector Performance**: Outperforming S&P 500 by 12% YTD

## Risks
1. **Recession**: Credit losses spike, NIM irrelevant
2. **Deposit Flight**: Rising deposit beta erodes NIM
3. **Regulation**: Capital requirements increase

## Investment Strategy
Banking sector is **Buy** in current rate environment. NIM expansion phase with controlled credit risk. Prefer large money center banks with diverse revenue streams.

---
*Tags: #banking #interest-rates #nim #federal-reserve*`,
    author: 'financial-analyst-sarah',
    tags: ['banking', 'interest-rates', 'nim', 'federal-reserve'],
    category: 'financial',
    isPublic: true,
    sources: [
      'https://www.federalreserve.gov/monetarypolicy.htm'
    ],
  },
  {
    entityId: 'sector-realestate',
    entityType: 'sector',
    entityName: 'Real Estate',
    title: 'REIT Market Analysis: LTV, Cap Rates, and Fed Policy',
    summary: 'Comprehensive analysis of Real Estate Investment Trusts and their sensitivity to interest rates.',
    content: `# Real Estate Sector: REIT Analysis

## REIT Overview
Real Estate Investment Trusts ([[Real Estate]] sector) are highly sensitive to interest rate changes due to their leveraged business models and income-generating properties.

## Key Metrics

### Loan-to-Value (LTV) Ratio
**Average LTV by Property Type:**
- Office: 55-60% (highest risk post-COVID)
- Retail: 45-50%
- Industrial/Logistics: 40-45% (lowest risk)
- Multifamily: 50-55%
- Data Centers: 35-40%

### Capitalization Rates
**Current Cap Rates (Nov 2025):**
- **Industrial**: 5.5-6.0% (Amazon/logistics demand)
- **Multifamily**: 5.0-5.5%
- **Office**: 7.0-9.0% (distressed)
- **Retail**: 6.5-7.5%
- **Data Centers**: 4.5-5.0% (AI demand)

## Interest Rate Sensitivity
**Impact of +100 bps Fed Rate Increase:**
- REIT NAV: -12% to -15%
- Dividend Coverage: -8% to -10%
- Occupancy: Minimal (lagged effect)
- Development Activity: -30% (financing cost spike)

## Sector Winners & Losers
### Winners (Low Rate Sensitivity)
1. **Industrial/Logistics REITs**
   - E-commerce tailwind
   - Long-term leases
   - Low LTV
   - Examples: [[Prologis]], [[GLP]]

2. **Data Center REITs**
   - AI infrastructure demand
   - Mission-critical tenants
   - Examples: [[Equinix]], [[Digital Realty]]

### Losers (High Rate Sensitivity)
1. **Office REITs**
   - Work-from-home impact
   - High vacancy rates
   - Refinancing risk

2. **Retail REITs**
   - E-commerce competition
   - Consumer spending pressure

## Korean Real Estate Market
- **Average LTV**: 45% (conservative)
- **Jeonse System**: Unique deposit-based rental
- **Regulation**: Strict loan limits
- **Key Players**: [[Lotte REIT]], [[Mirae Asset]]

## Investment Outlook
**Current Fed Rate: 5.25%**
- **Office**: Avoid (structural decline)
- **Industrial**: Buy (AI/logistics growth)
- **Multifamily**: Hold (stable)
- **Data Center**: Strong Buy (AI infrastructure)

Expected Fed pivot to rate cuts in H2 2025 would provide +15-20% upside to REIT sector.

---
*Tags: #realestate #reit #interest-rates #ltv #cap-rates*`,
    author: 'real-estate-analyst-tom',
    tags: ['realestate', 'reit', 'interest-rates', 'ltv', 'cap-rates'],
    category: 'financial',
    isPublic: true,
    sources: [
      'https://www.nareit.com/research-and-publications'
    ],
  },
];
