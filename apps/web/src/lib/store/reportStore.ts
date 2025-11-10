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

  // Actions
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'upvotes' | 'downvotes' | 'views'>) => string;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  deleteReport: (reportId: string) => void;
  voteReport: (reportId: string, vote: 'up' | 'down') => void;
  incrementViews: (reportId: string) => void;

  // Getters
  getReportsByEntity: (entityId: string) => Report[];
  getReportsByType: (entityType: EntityType) => Report[];
  getReportsByAuthor: (author: string) => Report[];
  getReportsByTag: (tag: string) => Report[];
  getPublicReports: () => Report[];
  getLinkedReports: (entityId: string) => Report[]; // Reports that link to this entity
  searchReports: (query: string) => Report[];
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: {},

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
];
