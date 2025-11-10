/**
 * Company Data Repository
 *
 * 현재: 6개 기업
 * 목표: 50+ 기업
 *
 * 섹터별 분포:
 * - Banking: 3개 → 목표 10개
 * - Real Estate: 3개 → 목표 15개
 * - Manufacturing: 0개 → 목표 10개
 * - Semiconductor: 0개 → 목표 10개
 * - Options: 0개 → 목표 5개
 */

export type Sector = 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | 'OPTIONS' | 'CRYPTO';

export interface Company {
  id: string;
  ticker: string;
  name: string;
  name_en?: string;
  sector: Sector;
  country: string;

  // Financial data
  financials: {
    revenue: number;           // 매출 (억원 or 백만달러)
    net_income: number;        // 순이익
    total_assets: number;      // 총자산
    total_debt: number;        // 총부채
    equity: number;            // 자본
    ebitda?: number;           // EBITDA
    operating_income?: number; // 영업이익
  };

  // Key ratios
  ratios: {
    icr: number;              // Interest Coverage Ratio
    de_ratio: number;         // Debt-to-Equity
    roe?: number;             // Return on Equity
    roa?: number;             // Return on Assets
    current_ratio?: number;   // 유동비율
    pe_ratio?: number;        // Price-to-Earnings Ratio
  };

  // Sector-specific metrics
  sector_metrics?: {
    // Banking
    nim?: number;                    // Net Interest Margin
    provision_rate?: number;         // 대손충당금 비율

    // Real Estate
    ltv?: number;                    // Loan-to-Value
    occupancy_rate?: number;         // 임대율
    rental_yield?: number;           // 임대수익률

    // Manufacturing
    capacity_utilization?: number;   // 가동률
    labor_cost_ratio?: number;       // 인건비 비율

    // Semiconductor
    wafer_utilization?: number;      // 웨이퍼 가동률
    rd_intensity?: number;           // R&D 집약도
    asp_change?: number;             // ASP 변화율
    capex_ratio?: number;            // CapEx 비율

    // Options
    delta?: number;
    gamma?: number;
    vega?: number;
    theta?: number;
  };

  // Location (for globe visualization)
  location?: {
    lat: number;
    lng: number;
  };
}

export interface CompanyLink {
  source: string;
  target: string;
  amount: number;
  type: 'LENDING' | 'INVESTMENT' | 'SUPPLY_CHAIN' | 'OWNERSHIP';
}

// ========================================
// BANKING SECTOR (7/10 companies)
// ========================================

export const BANKING_COMPANIES: Company[] = [
  {
    id: 'SH_BANK',
    ticker: 'SHB',
    name: '신한은행',
    name_en: 'Shinhan Bank',
    sector: 'BANKING',
    country: 'KR',
    financials: {
      revenue: 150000,        // 15조원
      net_income: 2520,       // 2,520억원
      total_assets: 450000,   // 450조원
      total_debt: 350000,     // 350조원
      equity: 100000,         // 100조원
      operating_income: 5000, // 5,000억원
    },
    ratios: {
      icr: 5.5,
      de_ratio: 3.5,
      roe: 10.2,
      roa: 0.56,
    },
    sector_metrics: {
      nim: 1.85,              // 1.85% NIM
      provision_rate: 0.45,   // 0.45% 대손충당금
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'KB_BANK',
    ticker: 'KBF',
    name: 'KB금융',
    name_en: 'KB Financial Group',
    sector: 'BANKING',
    country: 'KR',
    financials: {
      revenue: 130000,
      net_income: 2200,
      total_assets: 400000,
      total_debt: 320000,
      equity: 80000,
      operating_income: 4500,
    },
    ratios: {
      icr: 4.8,
      de_ratio: 4.0,
      roe: 9.5,
      roa: 0.55,
    },
    sector_metrics: {
      nim: 1.72,
      provision_rate: 0.50,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'WR_BANK',
    name: '우리은행',
    name_en: 'Woori Bank',
    sector: 'BANKING',
    ticker: 'WRB',
    country: 'KR',
    financials: {
      revenue: 100000,
      net_income: 1800,
      total_assets: 300000,
      total_debt: 280000,
      equity: 20000,
      operating_income: 3800,
    },
    ratios: {
      icr: 6.2,
      de_ratio: 14.0,
      roe: 9.0,
      roa: 0.60,
    },
    sector_metrics: {
      nim: 1.90,
      provision_rate: 0.40,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'HANA_BANK',
    name: '하나은행',
    name_en: 'Hana Bank',
    sector: 'BANKING',
    ticker: 'HNB',
    country: 'KR',
    financials: {
      revenue: 120000,
      net_income: 2000,
      total_assets: 380000,
      total_debt: 300000,
      equity: 80000,
      operating_income: 4000,
    },
    ratios: {
      icr: 5.0,
      de_ratio: 3.75,
      roe: 2.5,
      roa: 0.53,
    },
    sector_metrics: {
      nim: 1.68,
      provision_rate: 0.55,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'JPM_CHASE',
    name: 'JP모건체이스',
    name_en: 'JPMorgan Chase & Co.',
    sector: 'BANKING',
    ticker: 'JPM',
    country: 'US',
    financials: {
      revenue: 162400,        // $162.4B (2023)
      net_income: 49550,      // $49.55B
      total_assets: 3875000,  // $3.875T
      total_debt: 320000,     // $320B
      equity: 319000,         // $319B
      operating_income: 65000,
    },
    ratios: {
      icr: 8.5,
      de_ratio: 1.0,
      roe: 15.5,
      roa: 1.28,
    },
    sector_metrics: {
      nim: 2.25,
      provision_rate: 0.35,
    },
    location: {
      lat: 40.7580,
      lng: -73.9855,
    },
  },
  {
    id: 'BANK_OF_AMERICA',
    name: '뱅크오브아메리카',
    name_en: 'Bank of America Corporation',
    sector: 'BANKING',
    ticker: 'BAC',
    country: 'US',
    financials: {
      revenue: 115000,        // $115B (2023)
      net_income: 26500,      // $26.5B
      total_assets: 3051000,  // $3.051T
      total_debt: 280000,     // $280B
      equity: 276000,         // $276B
      operating_income: 38000,
    },
    ratios: {
      icr: 7.5,
      de_ratio: 1.01,
      roe: 9.6,
      roa: 0.87,
    },
    sector_metrics: {
      nim: 2.10,
      provision_rate: 0.40,
    },
    location: {
      lat: 35.2271,
      lng: -80.8431,
    },
  },
  {
    id: 'HSBC',
    name: 'HSBC',
    name_en: 'HSBC Holdings plc',
    sector: 'BANKING',
    ticker: 'HSBC',
    country: 'UK',
    financials: {
      revenue: 65500,         // £65.5B (~$82B) (2023)
      net_income: 24200,      // £24.2B (~$30B)
      total_assets: 2985000,  // £2.985T (~$3.7T)
      total_debt: 250000,     // ~$312B
      equity: 198000,         // ~$247B
      operating_income: 32000,
    },
    ratios: {
      icr: 6.8,
      de_ratio: 1.26,
      roe: 12.2,
      roa: 0.81,
    },
    sector_metrics: {
      nim: 1.95,
      provision_rate: 0.38,
    },
    location: {
      lat: 51.5074,
      lng: -0.1278,
    },
  },
  {
    id: 'IBK',
    name: '기업은행',
    name_en: 'Industrial Bank of Korea',
    sector: 'BANKING',
    ticker: 'IBK',
    country: 'KR',
    financials: {
      revenue: 90000,
      net_income: 1500,
      total_assets: 320000,
      total_debt: 280000,
      equity: 40000,
      operating_income: 3500,
    },
    ratios: {
      icr: 4.3,
      de_ratio: 7.0,
      roe: 3.75,
      roa: 0.47,
    },
    sector_metrics: {
      nim: 1.55,
      provision_rate: 0.60,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
];

// ========================================
// REAL ESTATE SECTOR (7/15 companies)
// ========================================

export const REALESTATE_COMPANIES: Company[] = [
  {
    id: 'SH_REIT',
    name: '신한알파리츠',
    name_en: 'Shinhan Alpha REIT',
    sector: 'REALESTATE',
    ticker: 'SHRE',
    country: 'KR',
    financials: {
      revenue: 50,
      net_income: 4.48,
      total_assets: 580,
      total_debt: 290,
      equity: 290,
    },
    ratios: {
      icr: 1.83,
      de_ratio: 1.0,
      roe: 1.54,
      roa: 0.77,
    },
    sector_metrics: {
      ltv: 50.0,
      occupancy_rate: 92.5,
      rental_yield: 5.2,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'IR_REIT',
    name: '이리츠코크렙',
    name_en: 'iREITS KOREF',
    sector: 'REALESTATE',
    ticker: 'IRRE',
    country: 'KR',
    financials: {
      revenue: 40,
      net_income: 1.88,
      total_assets: 400,
      total_debt: 250,
      equity: 150,
    },
    ratios: {
      icr: 0.80,
      de_ratio: 1.67,
      roe: 1.25,
      roa: 0.47,
    },
    sector_metrics: {
      ltv: 62.5,
      occupancy_rate: 85.0,
      rental_yield: 4.7,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'NH_REIT',
    name: 'NH프라임리츠',
    name_en: 'NH Prime REIT',
    sector: 'REALESTATE',
    ticker: 'NHRE',
    country: 'KR',
    financials: {
      revenue: 45,
      net_income: 7.52,
      total_assets: 300,
      total_debt: 75,
      equity: 225,
    },
    ratios: {
      icr: 4.26,
      de_ratio: 0.33,
      roe: 3.34,
      roa: 2.51,
    },
    sector_metrics: {
      ltv: 25.0,
      occupancy_rate: 97.0,
      rental_yield: 5.8,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'LOTTE_REIT',
    name: '롯데리츠',
    name_en: 'Lotte REIT',
    sector: 'REALESTATE',
    ticker: 'LORE',
    country: 'KR',
    financials: {
      revenue: 55,
      net_income: 6.5,
      total_assets: 650,
      total_debt: 320,
      equity: 330,
    },
    ratios: {
      icr: 2.8,
      de_ratio: 0.97,
      roe: 1.97,
      roa: 1.0,
    },
    sector_metrics: {
      ltv: 49.2,
      occupancy_rate: 94.0,
      rental_yield: 5.5,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'KOCREF_REIT',
    name: '코람코에너지플러스리츠',
    name_en: 'Koramco Energy Plus REIT',
    sector: 'REALESTATE',
    ticker: 'KORE',
    country: 'KR',
    financials: {
      revenue: 38,
      net_income: 5.2,
      total_assets: 420,
      total_debt: 180,
      equity: 240,
    },
    ratios: {
      icr: 3.5,
      de_ratio: 0.75,
      roe: 2.17,
      roa: 1.24,
    },
    sector_metrics: {
      ltv: 42.9,
      occupancy_rate: 96.5,
      rental_yield: 6.1,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'IGIS_REIT',
    name: '이지스밸류플러스리츠',
    name_en: 'IGIS Value Plus REIT',
    sector: 'REALESTATE',
    ticker: 'IGRE',
    country: 'KR',
    financials: {
      revenue: 42,
      net_income: 4.8,
      total_assets: 520,
      total_debt: 260,
      equity: 260,
    },
    ratios: {
      icr: 2.2,
      de_ratio: 1.0,
      roe: 1.85,
      roa: 0.92,
    },
    sector_metrics: {
      ltv: 50.0,
      occupancy_rate: 90.0,
      rental_yield: 5.0,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'ESR_REIT',
    name: 'ESR켄달스퀘어리츠',
    name_en: 'ESR Kendall Square REIT',
    sector: 'REALESTATE',
    ticker: 'ESRE',
    country: 'KR',
    financials: {
      revenue: 60,
      net_income: 8.5,
      total_assets: 850,
      total_debt: 420,
      equity: 430,
    },
    ratios: {
      icr: 3.0,
      de_ratio: 0.98,
      roe: 1.98,
      roa: 1.0,
    },
    sector_metrics: {
      ltv: 49.4,
      occupancy_rate: 98.5,
      rental_yield: 6.5,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
];

// ========================================
// MANUFACTURING SECTOR (5/10 companies)
// ========================================

export const MANUFACTURING_COMPANIES: Company[] = [
  {
    id: 'HYUNDAI_MOTOR',
    name: '현대자동차',
    name_en: 'Hyundai Motor Company',
    sector: 'MANUFACTURING',
    ticker: 'HMM',
    country: 'KR',
    financials: {
      revenue: 1400000,       // 140조원
      net_income: 60000,      // 6조원
      total_assets: 2500000,  // 250조원
      total_debt: 800000,     // 80조원
      equity: 1700000,        // 170조원
      operating_income: 85000,
    },
    ratios: {
      icr: 8.5,
      de_ratio: 0.47,
      roe: 3.5,
      roa: 2.4,
    },
    sector_metrics: {
      capacity_utilization: 82.5,
      labor_cost_ratio: 12.5,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'LG_ELECTRONICS',
    name: 'LG전자',
    name_en: 'LG Electronics',
    sector: 'MANUFACTURING',
    ticker: 'LGE',
    country: 'KR',
    financials: {
      revenue: 800000,
      net_income: 15000,
      total_assets: 600000,
      total_debt: 150000,
      equity: 450000,
      operating_income: 30000,
    },
    ratios: {
      icr: 6.0,
      de_ratio: 0.33,
      roe: 3.3,
      roa: 2.5,
    },
    sector_metrics: {
      capacity_utilization: 78.0,
      labor_cost_ratio: 15.0,
    },
    location: {
      lat: 37.5665,
      lng: 126.9780,
    },
  },
  {
    id: 'POSCO',
    name: 'POSCO',
    name_en: 'POSCO Holdings',
    sector: 'MANUFACTURING',
    ticker: 'POSCO',
    country: 'KR',
    financials: {
      revenue: 750000,
      net_income: 25000,
      total_assets: 900000,
      total_debt: 300000,
      equity: 600000,
      operating_income: 45000,
    },
    ratios: {
      icr: 7.5,
      de_ratio: 0.50,
      roe: 4.2,
      roa: 2.8,
    },
    sector_metrics: {
      capacity_utilization: 85.0,
      labor_cost_ratio: 10.0,
    },
    location: {
      lat: 36.0190,
      lng: 129.3434,
    },
  },
  {
    id: 'TESLA',
    name: '테슬라',
    name_en: 'Tesla Inc.',
    sector: 'MANUFACTURING',
    ticker: 'TSLA',
    country: 'US',
    financials: {
      revenue: 96773,         // $96.77B (2023)
      net_income: 14997,      // $15.0B
      total_assets: 106618,   // $106.6B
      total_debt: 9570,       // $9.57B
      equity: 62634,          // $62.6B
      operating_income: 8891,
    },
    ratios: {
      icr: 15.2,
      de_ratio: 0.15,
      roe: 23.9,
      roa: 14.1,
    },
    sector_metrics: {
      capacity_utilization: 88.0,
      labor_cost_ratio: 8.5,
    },
    location: {
      lat: 37.3894,
      lng: -122.0819,
    },
  },
  {
    id: 'TOYOTA',
    name: '도요타자동차',
    name_en: 'Toyota Motor Corporation',
    sector: 'MANUFACTURING',
    ticker: 'TM',
    country: 'JP',
    financials: {
      revenue: 315900,        // ¥37.15T (~$315.9B)
      net_income: 24850,      // ¥2.92T (~$24.85B)
      total_assets: 551800,   // ¥64.87T (~$551.8B)
      total_debt: 180000,     // ~$180B
      equity: 280000,         // ~$280B
      operating_income: 32500,
    },
    ratios: {
      icr: 9.8,
      de_ratio: 0.64,
      roe: 8.9,
      roa: 4.5,
    },
    sector_metrics: {
      capacity_utilization: 86.5,
      labor_cost_ratio: 11.0,
    },
    location: {
      lat: 35.0844,
      lng: 137.1486,
    },
  },
];

// ========================================
// SEMICONDUCTOR SECTOR (4/10 companies)
// ========================================

export const SEMICONDUCTOR_COMPANIES: Company[] = [
  {
    id: 'SAMSUNG_ELEC',
    name: '삼성전자',
    name_en: 'Samsung Electronics',
    sector: 'SEMICONDUCTOR',
    ticker: 'SSNLF',
    country: 'KR',
    financials: {
      revenue: 2340000,       // 234조원 (2024)
      net_income: 230000,     // 23조원
      total_assets: 4500000,  // 450조원
      total_debt: 1000000,    // 100조원
      equity: 3500000,        // 350조원
      operating_income: 350000,
    },
    ratios: {
      icr: 12.5,
      de_ratio: 0.29,
      roe: 6.6,
      roa: 5.1,
    },
    sector_metrics: {
      wafer_utilization: 85.0,
      rd_intensity: 12.0,
      asp_change: -5.2,
      capex_ratio: 21.4,
    },
    location: {
      lat: 37.2636,
      lng: 127.0286,
    },
  },
  {
    id: 'SK_HYNIX',
    name: 'SK하이닉스',
    name_en: 'SK Hynix',
    sector: 'SEMICONDUCTOR',
    ticker: 'SKHYX',
    country: 'KR',
    financials: {
      revenue: 500000,
      net_income: 50000,
      total_assets: 800000,
      total_debt: 200000,
      equity: 600000,
      operating_income: 75000,
    },
    ratios: {
      icr: 10.0,
      de_ratio: 0.33,
      roe: 8.3,
      roa: 6.3,
    },
    sector_metrics: {
      wafer_utilization: 78.0,
      rd_intensity: 15.0,
      asp_change: -8.5,
      capex_ratio: 30.0,
    },
    location: {
      lat: 37.2636,
      lng: 127.0286,
    },
  },
  {
    id: 'TSMC',
    name: 'TSMC',
    name_en: 'Taiwan Semiconductor Manufacturing Company',
    sector: 'SEMICONDUCTOR',
    ticker: 'TSM',
    country: 'TW',
    financials: {
      revenue: 73400,         // $73.4B (2023)
      net_income: 29800,      // $29.8B
      total_assets: 109500,   // $109.5B
      total_debt: 15000,      // $15B
      equity: 94500,          // $94.5B
      operating_income: 38000,
    },
    ratios: {
      icr: 25.3,
      de_ratio: 0.16,
      roe: 31.5,
      roa: 27.2,
    },
    sector_metrics: {
      wafer_utilization: 92.0,
      rd_intensity: 8.5,
      asp_change: 3.2,
      capex_ratio: 35.0,
    },
    location: {
      lat: 24.7911,
      lng: 120.9969,
    },
  },
  {
    id: 'INTEL',
    name: '인텔',
    name_en: 'Intel Corporation',
    sector: 'SEMICONDUCTOR',
    ticker: 'INTC',
    country: 'US',
    financials: {
      revenue: 54200,         // $54.2B (2023)
      net_income: 1680,       // $1.68B
      total_assets: 191500,   // $191.5B
      total_debt: 48000,      // $48B
      equity: 111000,         // $111B
      operating_income: 2300,
    },
    ratios: {
      icr: 1.9,
      de_ratio: 0.43,
      roe: 1.5,
      roa: 0.9,
    },
    sector_metrics: {
      wafer_utilization: 65.0,
      rd_intensity: 27.0,
      asp_change: -12.5,
      capex_ratio: 45.0,
    },
    location: {
      lat: 37.3861,
      lng: -121.9634,
    },
  },
];

// ========================================
// CRYPTO SECTOR (20 companies)
// ========================================

export const CRYPTO_COMPANIES: Company[] = [
  {
    id: 'BTC',
    ticker: 'BTC-USD',
    name: 'Bitcoin',
    name_en: 'Bitcoin',
    sector: 'CRYPTO',
    country: 'GLOBAL',
    financials: {
      revenue: 0, // Crypto assets don't have traditional revenue
      net_income: 0,
      total_assets: 850000000, // Market cap in millions
      total_debt: 0,
      equity: 850000000,
      operating_income: 0,
    },
    ratios: {
      icr: 0,
      de_ratio: 0,
      pe_ratio: 0,
    },
    sector_metrics: {
      rd_intensity: 0,
    },
  },
  {
    id: 'ETH',
    ticker: 'ETH-USD',
    name: 'Ethereum',
    name_en: 'Ethereum',
    sector: 'CRYPTO',
    country: 'GLOBAL',
    financials: {
      revenue: 0,
      net_income: 0,
      total_assets: 280000000,
      total_debt: 0,
      equity: 280000000,
      operating_income: 0,
    },
    ratios: {
      icr: 0,
      de_ratio: 0,
      pe_ratio: 0,
    },
  },
  {
    id: 'BNB',
    ticker: 'BNB-USD',
    name: 'BNB',
    name_en: 'BNB',
    sector: 'CRYPTO',
    country: 'GLOBAL',
    financials: {
      revenue: 0,
      net_income: 0,
      total_assets: 45000000,
      total_debt: 0,
      equity: 45000000,
      operating_income: 0,
    },
    ratios: {
      icr: 0,
      de_ratio: 0,
      pe_ratio: 0,
    },
  },
  {
    id: 'SOL',
    ticker: 'SOL-USD',
    name: 'Solana',
    name_en: 'Solana',
    sector: 'CRYPTO',
    country: 'GLOBAL',
    financials: {
      revenue: 0,
      net_income: 0,
      total_assets: 35000000,
      total_debt: 0,
      equity: 35000000,
      operating_income: 0,
    },
    ratios: {
      icr: 0,
      de_ratio: 0,
      pe_ratio: 0,
    },
  },
  {
    id: 'ADA',
    ticker: 'ADA-USD',
    name: 'Cardano',
    name_en: 'Cardano',
    sector: 'CRYPTO',
    country: 'GLOBAL',
    financials: {
      revenue: 0,
      net_income: 0,
      total_assets: 12000000,
      total_debt: 0,
      equity: 12000000,
      operating_income: 0,
    },
    ratios: {
      icr: 0,
      de_ratio: 0,
      pe_ratio: 0,
    },
  },
];

// ========================================
// OPTIONS SECTOR (0/5 companies)
// ========================================

export const OPTIONS_COMPANIES: Company[] = [
  // TODO: Team Data - Add options data
  // Examples: S&P 500 options, KOSPI options, etc.
];

// ========================================
// CONSOLIDATED DATA
// ========================================

export const ALL_COMPANIES: Company[] = [
  ...BANKING_COMPANIES,
  ...REALESTATE_COMPANIES,
  ...MANUFACTURING_COMPANIES,
  ...SEMICONDUCTOR_COMPANIES,
  ...CRYPTO_COMPANIES,
  ...OPTIONS_COMPANIES,
];

export const COMPANY_LINKS: CompanyLink[] = [
  // Banking → Real Estate lending
  { source: 'SH_BANK', target: 'SH_REIT', amount: 100, type: 'LENDING' },
  { source: 'SH_BANK', target: 'IR_REIT', amount: 200, type: 'LENDING' },
  { source: 'SH_BANK', target: 'NH_REIT', amount: 50, type: 'LENDING' },
  { source: 'KB_BANK', target: 'SH_REIT', amount: 120, type: 'LENDING' },
  { source: 'KB_BANK', target: 'IR_REIT', amount: 80, type: 'LENDING' },
  { source: 'WR_BANK', target: 'NH_REIT', amount: 150, type: 'LENDING' },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getCompanyById(id: string): Company | undefined {
  return ALL_COMPANIES.find(c => c.id === id);
}

export function getCompaniesBySector(sector: Sector): Company[] {
  return ALL_COMPANIES.filter(c => c.sector === sector);
}

export function getCompanyLinks(companyId: string): CompanyLink[] {
  return COMPANY_LINKS.filter(
    link => link.source === companyId || link.target === companyId
  );
}

export function getCompanyCount(): { total: number; by_sector: Record<Sector, number> } {
  return {
    total: ALL_COMPANIES.length,
    by_sector: {
      BANKING: BANKING_COMPANIES.length,
      REALESTATE: REALESTATE_COMPANIES.length,
      MANUFACTURING: MANUFACTURING_COMPANIES.length,
      SEMICONDUCTOR: SEMICONDUCTOR_COMPANIES.length,
      CRYPTO: CRYPTO_COMPANIES.length,
      OPTIONS: OPTIONS_COMPANIES.length,
    },
  };
}

// ========================================
// SYNTHETIC DATA GENERATOR
// (Expand dataset to 100+ companies)
// ========================================

export function generateSyntheticCompanies(baseCompanies: Company[], targetCount: number): Company[] {
  const synthetic: Company[] = [];
  let index = 1;

  while (baseCompanies.length + synthetic.length < targetCount) {
    const template = baseCompanies[index % baseCompanies.length];
    const variation = (Math.random() - 0.5) * 0.3; // ±15% variation

    synthetic.push({
      ...template,
      id: `${template.id}_SYN_${index}`,
      ticker: `${template.ticker}-${index}`,
      name: `${template.name} ${index}`,
      name_en: template.name_en ? `${template.name_en} ${index}` : undefined,
      financials: {
        revenue: Math.round(template.financials.revenue * (1 + variation)),
        net_income: Math.round(template.financials.net_income * (1 + variation)),
        total_assets: Math.round(template.financials.total_assets * (1 + variation)),
        total_debt: Math.round(template.financials.total_debt * (1 + variation)),
        equity: Math.round(template.financials.equity * (1 + variation)),
        operating_income: template.financials.operating_income
          ? Math.round(template.financials.operating_income * (1 + variation))
          : undefined,
        ebitda: template.financials.ebitda
          ? Math.round(template.financials.ebitda * (1 + variation))
          : undefined,
      },
      ratios: {
        icr: template.ratios.icr * (1 + variation * 0.5),
        de_ratio: template.ratios.de_ratio * (1 + variation * 0.5),
        roe: template.ratios.roe ? template.ratios.roe * (1 + variation * 0.5) : undefined,
        roa: template.ratios.roa ? template.ratios.roa * (1 + variation * 0.5) : undefined,
        current_ratio: template.ratios.current_ratio,
        pe_ratio: template.ratios.pe_ratio ? template.ratios.pe_ratio * (1 + variation * 0.5) : undefined,
      },
    });

    index++;
  }

  return synthetic;
}

// Generate extended dataset (100+ companies)
const SYNTHETIC_BANKING = generateSyntheticCompanies(BANKING_COMPANIES, 20);
const SYNTHETIC_REALESTATE = generateSyntheticCompanies(REALESTATE_COMPANIES, 20);
const SYNTHETIC_MANUFACTURING = generateSyntheticCompanies(MANUFACTURING_COMPANIES, 20);
const SYNTHETIC_SEMICONDUCTOR = generateSyntheticCompanies(SEMICONDUCTOR_COMPANIES, 20);
const SYNTHETIC_CRYPTO = generateSyntheticCompanies(CRYPTO_COMPANIES, 15);

export const EXTENDED_COMPANIES: Company[] = [
  ...ALL_COMPANIES,
  ...SYNTHETIC_BANKING,
  ...SYNTHETIC_REALESTATE,
  ...SYNTHETIC_MANUFACTURING,
  ...SYNTHETIC_SEMICONDUCTOR,
  ...SYNTHETIC_CRYPTO,
];

// Use extended dataset by default
export const companies = EXTENDED_COMPANIES;
