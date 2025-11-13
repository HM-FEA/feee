/**
 * Simulation History Store
 *
 * Tracks simulation runs with timestamp, prices, and sector data
 * Enables historical analysis and comparison
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MacroState {
  fed_funds_rate: number;
  us_gdp_growth: number;
  us_cpi: number;
  wti_oil: number;
  vix: number;
  usd_index: number;
  us_unemployment: number;
  us_m2_money_supply: number;
}

export interface SectorPrice {
  sector: string;
  index: number;
  changePercent: number;
  priceLevel: number;
}

export interface CompanyPrice {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  marketCap: number;
  changePercent: number;
}

export interface SimulationSnapshot {
  id: string;
  timestamp: Date;
  name: string;
  description?: string;

  // Macro state at simulation time
  macroState: MacroState;

  // Sector prices
  sectorPrices: SectorPrice[];

  // Company prices
  companyPrices: CompanyPrice[];

  // Simulation results
  totalImpact: number;
  affectedCompanies: number;
  affectedSectors: number;

  // User metadata
  createdBy?: string;
  tags?: string[];
}

interface SimulationHistoryStore {
  snapshots: Record<string, SimulationSnapshot>;
  currentSnapshot: string | null;

  // Actions
  saveSnapshot: (snapshot: Omit<SimulationSnapshot, 'id' | 'timestamp'>) => string;
  loadSnapshot: (id: string) => SimulationSnapshot | null;
  deleteSnapshot: (id: string) => void;
  listSnapshots: () => SimulationSnapshot[];
  compareSnapshots: (id1: string, id2: string) => SimulationComparison | null;
  setCurrentSnapshot: (id: string | null) => void;

  // Queries
  getSnapshotsByDateRange: (start: Date, end: Date) => SimulationSnapshot[];
  getSnapshotsBySector: (sector: string) => SimulationSnapshot[];
  getLatestSnapshot: () => SimulationSnapshot | null;
}

export interface SimulationComparison {
  snapshot1: SimulationSnapshot;
  snapshot2: SimulationSnapshot;
  timeDelta: number; // milliseconds

  // Macro changes
  macroChanges: {
    variable: string;
    oldValue: number;
    newValue: number;
    change: number;
    changePercent: number;
  }[];

  // Sector price changes
  sectorChanges: {
    sector: string;
    oldPrice: number;
    newPrice: number;
    change: number;
    changePercent: number;
  }[];

  // Company price changes
  companyChanges: {
    ticker: string;
    name: string;
    oldPrice: number;
    newPrice: number;
    change: number;
    changePercent: number;
  }[];
}

export const useSimulationHistoryStore = create<SimulationHistoryStore>()(
  persist(
    (set, get) => ({
      snapshots: {},
      currentSnapshot: null,

      saveSnapshot: (snapshot) => {
        const id = `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fullSnapshot: SimulationSnapshot = {
          ...snapshot,
          id,
          timestamp: new Date(),
        };

        set(state => ({
          snapshots: {
            ...state.snapshots,
            [id]: fullSnapshot,
          },
          currentSnapshot: id,
        }));

        return id;
      },

      loadSnapshot: (id) => {
        const snapshot = get().snapshots[id];
        if (snapshot) {
          set({ currentSnapshot: id });
          return snapshot;
        }
        return null;
      },

      deleteSnapshot: (id) => {
        set(state => {
          const { [id]: deleted, ...remaining } = state.snapshots;
          return {
            snapshots: remaining,
            currentSnapshot: state.currentSnapshot === id ? null : state.currentSnapshot,
          };
        });
      },

      listSnapshots: () => {
        const snapshots = Object.values(get().snapshots);
        return snapshots.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },

      compareSnapshots: (id1, id2) => {
        const snap1 = get().snapshots[id1];
        const snap2 = get().snapshots[id2];

        if (!snap1 || !snap2) return null;

        const timeDelta = new Date(snap2.timestamp).getTime() - new Date(snap1.timestamp).getTime();

        // Compare macro variables
        const macroChanges = Object.keys(snap1.macroState).map(key => {
          const k = key as keyof MacroState;
          const oldValue = snap1.macroState[k];
          const newValue = snap2.macroState[k];
          const change = newValue - oldValue;
          const changePercent = (change / oldValue) * 100;

          return {
            variable: key,
            oldValue,
            newValue,
            change,
            changePercent,
          };
        });

        // Compare sector prices
        const sectorMap1 = new Map(snap1.sectorPrices.map(s => [s.sector, s.priceLevel]));
        const sectorMap2 = new Map(snap2.sectorPrices.map(s => [s.sector, s.priceLevel]));

        const sectorChanges = snap1.sectorPrices.map(s1 => {
          const oldPrice = s1.priceLevel;
          const newPrice = sectorMap2.get(s1.sector) || oldPrice;
          const change = newPrice - oldPrice;
          const changePercent = (change / oldPrice) * 100;

          return {
            sector: s1.sector,
            oldPrice,
            newPrice,
            change,
            changePercent,
          };
        });

        // Compare company prices
        const companyMap1 = new Map(snap1.companyPrices.map(c => [c.ticker, c.price]));
        const companyMap2 = new Map(snap2.companyPrices.map(c => [c.ticker, c.price]));

        const companyChanges = snap1.companyPrices.map(c1 => {
          const oldPrice = c1.price;
          const newPrice = companyMap2.get(c1.ticker) || oldPrice;
          const change = newPrice - oldPrice;
          const changePercent = (change / oldPrice) * 100;

          return {
            ticker: c1.ticker,
            name: c1.name,
            oldPrice,
            newPrice,
            change,
            changePercent,
          };
        });

        return {
          snapshot1: snap1,
          snapshot2: snap2,
          timeDelta,
          macroChanges,
          sectorChanges,
          companyChanges,
        };
      },

      setCurrentSnapshot: (id) => {
        set({ currentSnapshot: id });
      },

      getSnapshotsByDateRange: (start, end) => {
        return Object.values(get().snapshots).filter(s => {
          const time = new Date(s.timestamp).getTime();
          return time >= start.getTime() && time <= end.getTime();
        });
      },

      getSnapshotsBySector: (sector) => {
        return Object.values(get().snapshots).filter(s =>
          s.sectorPrices.some(sp => sp.sector === sector)
        );
      },

      getLatestSnapshot: () => {
        const snapshots = get().listSnapshots();
        return snapshots[0] || null;
      },
    }),
    {
      name: 'simulation-history-store',
    }
  )
);

// Helper functions

export function formatMacroVariable(key: string): string {
  const labels: Record<string, string> = {
    fed_funds_rate: 'Fed Funds Rate',
    us_gdp_growth: 'GDP Growth',
    us_cpi: 'CPI Inflation',
    wti_oil: 'WTI Oil Price',
    vix: 'VIX',
    usd_index: 'USD Index',
    us_unemployment: 'Unemployment',
    us_m2_money_supply: 'M2 Money Supply',
  };
  return labels[key] || key;
}

export function formatMacroValue(key: string, value: number): string {
  if (key.includes('rate') || key.includes('growth') || key.includes('cpi') || key.includes('unemployment')) {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (key === 'wti_oil') {
    return `$${value.toFixed(2)}`;
  }
  if (key === 'us_m2_money_supply') {
    return `$${(value / 1000).toFixed(1)}T`;
  }
  return value.toFixed(2);
}

export function getSectorColor(sector: string): string {
  const colors: Record<string, string> = {
    SEMICONDUCTOR: 'text-accent-cyan',
    BANKING: 'text-status-safe',
    REALESTATE: 'text-accent-magenta',
    TECHNOLOGY: 'text-accent-cyan',
    ENERGY: 'text-status-warning',
    HEALTHCARE: 'text-status-safe',
    CRYPTO: 'text-accent-yellow',
  };
  return colors[sector] || 'text-text-primary';
}
