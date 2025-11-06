/**
 * Company Data Service
 * Purpose: Abstraction layer for company data operations
 * Benefits: Decouples data access from UI, easy to switch data sources (API vs local)
 */

import { API_CONFIG, buildUrl } from '../config/api.config';

/**
 * Company interface definition
 */
export interface Company {
  id: string;
  ticker: string;
  name: string;
  sector: 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | 'OPTIONS' | 'CRYPTO';
  country: string;
  logo?: string;
  description?: string;
  website?: string;
  financialData?: FinancialData;
  ratios?: FinancialRatios;
  sectorMetrics?: SectorMetrics;
}

/**
 * Financial data interface
 */
export interface FinancialData {
  marketCap?: number;
  revenue?: number;
  netIncome?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  cash?: number;
  debt?: number;
  operatingIncome?: number;
  ebitda?: number;
}

/**
 * Financial ratios interface
 */
export interface FinancialRatios {
  pe?: number;
  pb?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  quickRatio?: number;
  profitMargin?: number;
  operatingMargin?: number;
}

/**
 * Sector-specific metrics interface
 */
export interface SectorMetrics {
  [key: string]: number | string;
}

/**
 * Company Service Class
 */
export class CompanyService {
  /**
   * Fetch all companies
   */
  static async getAllCompanies(): Promise<Company[]> {
    try {
      const url = buildUrl(API_CONFIG.endpoints.companies.list);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data as Company[];
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      throw error;
    }
  }

  /**
   * Fetch company by ID
   */
  static async getCompanyById(id: string): Promise<Company | null> {
    try {
      const url = buildUrl(API_CONFIG.endpoints.companies.detail, { id });
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data as Company;
    } catch (error) {
      console.error('Failed to fetch company:', error);
      throw error;
    }
  }

  /**
   * Fetch companies by sector
   */
  static async getCompaniesBySector(sector: string): Promise<Company[]> {
    try {
      const allCompanies = await this.getAllCompanies();
      return allCompanies.filter((company) => company.sector === sector);
    } catch (error) {
      console.error('Failed to fetch companies by sector:', error);
      throw error;
    }
  }

  /**
   * Fetch company relationships
   */
  static async getCompanyRelationships(id: string): Promise<string[]> {
    try {
      const url = buildUrl(API_CONFIG.endpoints.companies.relationships, { id });
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data as string[];
    } catch (error) {
      console.error('Failed to fetch company relationships:', error);
      throw error;
    }
  }

  /**
   * Search companies by name or ticker
   */
  static async searchCompanies(query: string): Promise<Company[]> {
    try {
      const allCompanies = await this.getAllCompanies();
      const lowerQuery = query.toLowerCase();

      return allCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(lowerQuery) ||
          company.ticker.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search companies:', error);
      throw error;
    }
  }

  /**
   * Get company financial data
   */
  static async getCompanyFinancialData(id: string): Promise<FinancialData | null> {
    try {
      const company = await this.getCompanyById(id);
      return company?.financialData || null;
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
      throw error;
    }
  }

  /**
   * Get company ratios
   */
  static async getCompanyRatios(id: string): Promise<FinancialRatios | null> {
    try {
      const company = await this.getCompanyById(id);
      return company?.ratios || null;
    } catch (error) {
      console.error('Failed to fetch ratios:', error);
      throw error;
    }
  }

  /**
   * Get sector metrics for company
   */
  static async getCompanySectorMetrics(id: string): Promise<SectorMetrics | null> {
    try {
      const company = await this.getCompanyById(id);
      return company?.sectorMetrics || null;
    } catch (error) {
      console.error('Failed to fetch sector metrics:', error);
      throw error;
    }
  }

  /**
   * Validate company data
   */
  static validateCompany(company: Partial<Company>): boolean {
    return !!(company.id && company.ticker && company.name && company.sector);
  }

  /**
   * Format company for display
   */
  static formatCompanyDisplay(company: Company): {
    displayName: string;
    ticker: string;
    sector: string;
  } {
    return {
      displayName: `${company.name} (${company.ticker})`,
      ticker: company.ticker,
      sector: company.sector,
    };
  }

  /**
   * Get company comparison data
   */
  static async getCompanyComparison(companyIds: string[]): Promise<Company[]> {
    try {
      const companies = await Promise.all(companyIds.map((id) => this.getCompanyById(id)));
      return companies.filter((company) => company !== null) as Company[];
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
      throw error;
    }
  }

  /**
   * Sort companies by metric
   */
  static sortCompaniesByMetric(
    companies: Company[],
    metric: keyof FinancialRatios | keyof FinancialData,
    ascending: boolean = true
  ): Company[] {
    return [...companies].sort((a, b) => {
      const aValue = (a.ratios?.[metric as keyof FinancialRatios] ||
        a.financialData?.[metric as keyof FinancialData] ||
        0) as number;
      const bValue = (b.ratios?.[metric as keyof FinancialRatios] ||
        b.financialData?.[metric as keyof FinancialData] ||
        0) as number;

      return ascending ? aValue - bValue : bValue - aValue;
    });
  }

  /**
   * Filter companies by criteria
   */
  static filterCompanies(
    companies: Company[],
    criteria: {
      sector?: string;
      minMarketCap?: number;
      maxMarketCap?: number;
      minPE?: number;
      maxPE?: number;
    }
  ): Company[] {
    return companies.filter((company) => {
      if (criteria.sector && company.sector !== criteria.sector) return false;

      if (
        criteria.minMarketCap &&
        (company.financialData?.marketCap || 0) < criteria.minMarketCap
      ) {
        return false;
      }

      if (
        criteria.maxMarketCap &&
        (company.financialData?.marketCap || 0) > criteria.maxMarketCap
      ) {
        return false;
      }

      if (criteria.minPE && (company.ratios?.pe || 0) < criteria.minPE) {
        return false;
      }

      if (criteria.maxPE && (company.ratios?.pe || 0) > criteria.maxPE) {
        return false;
      }

      return true;
    });
  }
}

/**
 * Hook wrapper for easier React component usage
 */
export function useCompanyService() {
  return CompanyService;
}
