import { create } from 'zustand';
import { getDefaultMacroState, MACRO_VARIABLES } from '@/data/macroVariables';
import { Company } from '@/data/companies';
import { calculateAllImpacts, getSectorImpactBreakdown, ImpactBreakdown } from '@/lib/utils/impactCalculation';
import { useLinkageStore } from './linkageStore';
import { calculateAdjustedFinancials as calculateFinancialTheory, calculateImpliedValuation } from '@/lib/finance/macroImpact';

export type MacroState = Record<string, number>;

export interface AdjustedFinancials {
  revenue: number;
  operating_income: number;
  net_income: number;
  total_assets: number;
  total_debt: number;
  equity: number;
  market_cap?: number;
  ebitda: number;
  fcf?: number;                // Free Cash Flow
  costOfEquity?: number;       // CAPM-based
  fairValue?: number;          // DCF valuation
  evToEbitda?: number;         // EV/EBITDA multiple
  peRatio?: number;            // P/E ratio
}

interface MacroStore {
  // Current macro variable values
  macroState: MacroState;

  // Update a single macro variable
  updateMacroVariable: (id: string, value: number) => void;

  // Reset to defaults
  resetMacroState: () => void;

  // Calculation results (updated when macros change)
  calculatedImpacts: {
    banking: number;      // % impact on banking sector
    realEstate: number;   // % impact on real estate sector
    manufacturing: number; // % impact on manufacturing sector
    semiconductor: number; // % impact on semiconductor sector
    crypto: number;       // % impact on crypto sector
  };

  // Get detailed impact breakdown for a sector
  getSectorBreakdown: (sector: 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | 'CRYPTO') => ImpactBreakdown[];

  // Calculate adjusted financials based on macro impact
  calculateAdjustedFinancials: (company: Company) => AdjustedFinancials;

  // Trigger recalculation
  recalculateImpacts: () => void;
}

// Calculation logic using linkage-based engine
const calculateSectorImpacts = (macroState: MacroState) => {
  // Get adjusted linkages from linkageStore
  const linkages = useLinkageStore.getState().getAdjustedLinkages();

  // Use the sophisticated calculation engine
  return calculateAllImpacts(macroState, linkages);
};

export const useMacroStore = create<MacroStore>((set, get) => ({
  macroState: getDefaultMacroState(),

  calculatedImpacts: {
    banking: 0,
    realEstate: 0,
    manufacturing: 0,
    semiconductor: 0,
    crypto: 0,
  },

  updateMacroVariable: (id: string, value: number) => {
    set((state) => {
      const newMacroState = {
        ...state.macroState,
        [id]: value,
      };

      // Recalculate impacts immediately
      const newImpacts = calculateSectorImpacts(newMacroState);

      return {
        macroState: newMacroState,
        calculatedImpacts: newImpacts,
      };
    });
  },

  resetMacroState: () => {
    set({
      macroState: getDefaultMacroState(),
      calculatedImpacts: {
        banking: 0,
        realEstate: 0,
        manufacturing: 0,
        semiconductor: 0,
        crypto: 0,
      },
    });
  },

  calculateAdjustedFinancials: (company: Company) => {
    const state = get();
    const impacts = state.calculatedImpacts;

    // Get sector-specific impact
    let sectorImpact = 0;
    if (company.sector === 'BANKING') {
      sectorImpact = impacts.banking;
    } else if (company.sector === 'REALESTATE') {
      sectorImpact = impacts.realEstate;
    } else if (company.sector === 'MANUFACTURING') {
      sectorImpact = impacts.manufacturing;
    } else if (company.sector === 'SEMICONDUCTOR') {
      sectorImpact = impacts.semiconductor;
    } else if (company.sector === 'CRYPTO') {
      sectorImpact = impacts.crypto;
    }

    // Use financial theory-based calculation
    const advancedMetrics = calculateFinancialTheory(company, state.macroState, sectorImpact);
    const valuation = calculateImpliedValuation(company, advancedMetrics, state.macroState);

    // Apply impact as percentage change for assets/debt (less sensitive)
    const impactMultiplier = 1 + (sectorImpact / 100);
    const baseFinancials = company.financials;

    return {
      revenue: advancedMetrics.revenue,
      operating_income: advancedMetrics.operatingIncome,
      net_income: advancedMetrics.netIncome,
      ebitda: advancedMetrics.ebitda,
      fcf: advancedMetrics.fcf,
      costOfEquity: advancedMetrics.costOfEquity,
      fairValue: advancedMetrics.fairValue,
      evToEbitda: valuation.evToEbitda,
      peRatio: valuation.peRatio,
      total_assets: baseFinancials.total_assets * (1 + (sectorImpact / 200)),
      total_debt: baseFinancials.total_debt * (1 + (sectorImpact / 300)),
      equity: baseFinancials.equity * impactMultiplier,
      market_cap: valuation.impliedMarketCap,
    };
  },

  recalculateImpacts: () => {
    const state = get();
    const newImpacts = calculateSectorImpacts(state.macroState);
    set({ calculatedImpacts: newImpacts });
  },

  getSectorBreakdown: (sector) => {
    const state = get();
    const linkages = useLinkageStore.getState().getAdjustedLinkages();
    return getSectorImpactBreakdown(sector, state.macroState, linkages);
  },
}));
