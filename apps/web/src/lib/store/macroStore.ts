import { create } from 'zustand';
import { getDefaultMacroState, MacroState, MACRO_VARIABLES } from '@/data/macroVariables';
import { Company } from '@/data/companies';

export interface AdjustedFinancials {
  revenue: number;
  operating_income: number;
  net_income: number;
  total_assets: number;
  total_debt: number;
  equity: number;
  market_cap?: number;
  ebitda: number;
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
  };

  // Calculate adjusted financials based on macro impact
  calculateAdjustedFinancials: (company: Company) => AdjustedFinancials;

  // Trigger recalculation
  recalculateImpacts: () => void;
}

// Calculation logic for how macro variables affect sectors
const calculateSectorImpacts = (macroState: MacroState) => {
  // Find key variables
  const fedRate = macroState['fed_rate'] || 0.025;
  const gdpGrowth = macroState['gdp_growth_us'] || 0.021;
  const oilPrice = macroState['oil_price_wti'] || 85;
  const vix = macroState['vix'] || 18.5;

  // Calculate impacts (simplified model)
  // Banking: Benefits from higher rates
  const bankingImpact = (fedRate - 0.025) * 100 * 16; // +0.1% rate → +1.6% banking

  // Real Estate: Hurt by higher rates
  const realEstateImpact = -(fedRate - 0.025) * 100 * 20; // +0.1% rate → -2.0% RE

  // Manufacturing: Affected by GDP growth and trade
  const manufacturingImpact = (gdpGrowth - 0.021) * 100 * 30 + (oilPrice - 85) / 85 * -10;

  // Semiconductor: Affected by tech cycle and demand
  const semiconductorImpact = (gdpGrowth - 0.021) * 100 * 40 + (vix - 18.5) / 18.5 * -15;

  return {
    banking: bankingImpact,
    realEstate: realEstateImpact,
    manufacturing: manufacturingImpact,
    semiconductor: semiconductorImpact,
  };
};

export const useMacroStore = create<MacroStore>((set, get) => ({
  macroState: getDefaultMacroState(),

  calculatedImpacts: {
    banking: 0,
    realEstate: 0,
    manufacturing: 0,
    semiconductor: 0,
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
    }

    // Apply impact as percentage change
    const impactMultiplier = 1 + (sectorImpact / 100);

    // Calculate adjusted financials
    const baseFinancials = company.financials;

    return {
      revenue: baseFinancials.revenue * impactMultiplier,
      operating_income: (baseFinancials.operating_income || 0) * impactMultiplier,
      net_income: baseFinancials.net_income * impactMultiplier,
      total_assets: baseFinancials.total_assets * (1 + (sectorImpact / 200)), // Assets grow slower
      total_debt: baseFinancials.total_debt * (1 + (sectorImpact / 300)), // Debt changes even slower
      equity: baseFinancials.equity * impactMultiplier,
      market_cap: baseFinancials.market_cap ? baseFinancials.market_cap * impactMultiplier : undefined,
      ebitda: (baseFinancials.operating_income || 0) * 1.2 * impactMultiplier, // EBITDA estimation
    };
  },

  recalculateImpacts: () => {
    const state = get();
    const newImpacts = calculateSectorImpacts(state.macroState);
    set({ calculatedImpacts: newImpacts });
  },
}));
