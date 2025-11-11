/**
 * Global Supply Chain Data
 * Trade flows, shipping routes, and supply chain paths for visualization
 */

export interface TradeFlow {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  volume: number; // in billions USD
  product: string;
  color: string;
  type: 'export' | 'import';
}

export interface ShippingRoute {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  mode: 'sea' | 'air';
  frequency: number; // trips per month
  cargo: string;
  color: string;
}

export interface SupplyChainPath {
  nodes: {
    lat: number;
    lng: number;
    name: string;
    type: 'raw-material' | 'component' | 'assembly' | 'distribution' | 'consumer';
    company?: string;
  }[];
  product: string;
  color: string;
  description: string;
}

// Major trade flows
export const TRADE_FLOWS: TradeFlow[] = [
  // Semiconductors
  { startLat: 37.5665, startLng: 126.9780, endLat: 37.7749, endLng: -122.4194, volume: 72, product: 'Memory Chips', color: '#06B6D4', type: 'export' },
  { startLat: 25.0330, startLng: 121.5654, endLat: 37.7749, endLng: -122.4194, volume: 95, product: 'GPU Dies', color: '#10B981', type: 'export' },

  // Raw Materials
  { startLat: 51.1657, startLng: 10.4515, endLat: 37.5665, endLng: 126.9780, volume: 18, product: 'EUV Equipment', color: '#8B5CF6', type: 'export' },
  { startLat: 51.1657, startLng: 10.4515, endLat: 25.0330, endLng: 121.5654, volume: 22, product: 'Lithography', color: '#8B5CF6', type: 'export' },

  // Consumer Electronics
  { startLat: 39.9042, startLng: 116.4074, endLat: 37.7749, endLng: -122.4194, volume: 180, product: 'Electronics', color: '#F59E0B', type: 'export' },
  { startLat: 39.9042, startLng: 116.4074, endLat: 51.5074, endLng: -0.1278, volume: 120, product: 'Consumer Goods', color: '#F59E0B', type: 'export' },

  // Energy
  { startLat: 25.2048, startLng: 55.2708, endLat: 35.6762, endLng: 139.6503, volume: 85, product: 'Crude Oil', color: '#EF4444', type: 'export' },
  { startLat: 25.2048, startLng: 55.2708, endLat: 39.9042, endLng: 116.4074, volume: 110, product: 'Crude Oil', color: '#EF4444', type: 'export' },

  // Agriculture
  { startLat: 41.8781, startLng: -87.6298, endLat: 39.9042, endLng: 116.4074, volume: 45, product: 'Agricultural Products', color: '#22C55E', type: 'export' },
  { startLat: -23.5505, startLng: -46.6333, endLat: 39.9042, endLng: 116.4074, volume: 38, product: 'Soybeans', color: '#22C55E', type: 'export' },

  // Automotive
  { startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, volume: 62, product: 'Automobiles', color: '#3B82F6', type: 'export' },
  { startLat: 52.5200, startLng: 13.4050, endLat: 37.7749, endLng: -122.4194, volume: 48, product: 'Luxury Vehicles', color: '#3B82F6', type: 'export' },
];

// Major shipping routes
export const SHIPPING_ROUTES: ShippingRoute[] = [
  // Pacific Routes (Sea)
  { startLat: 39.9042, startLng: 116.4074, endLat: 33.9416, endLng: -118.4085, frequency: 450, cargo: 'Container Ships', color: '#06B6D4', mode: 'sea' },
  { startLat: 35.6762, startLng: 139.6503, endLat: 47.6062, endLng: -122.3321, frequency: 280, cargo: 'Bulk Cargo', color: '#06B6D4', mode: 'sea' },
  { startLat: 37.5665, startLng: 126.9780, endLat: 33.9416, endLng: -118.4085, frequency: 320, cargo: 'Electronics', color: '#10B981', mode: 'sea' },

  // Atlantic Routes (Sea)
  { startLat: 51.5074, startLng: -0.1278, endLat: 40.7128, endLng: -74.0060, frequency: 380, cargo: 'Trans-Atlantic', color: '#8B5CF6', mode: 'sea' },
  { startLat: 52.5200, startLng: 13.4050, endLat: 40.7128, endLng: -74.0060, frequency: 290, cargo: 'Machinery', color: '#8B5CF6', mode: 'sea' },

  // Middle East Routes (Sea)
  { startLat: 25.2048, startLng: 55.2708, endLat: 39.9042, endLng: 116.4074, frequency: 420, cargo: 'Oil Tankers', color: '#EF4444', mode: 'sea' },
  { startLat: 25.2048, startLng: 55.2708, endLat: 35.6762, endLng: 139.6503, frequency: 350, cargo: 'LNG Carriers', color: '#F59E0B', mode: 'sea' },

  // Air Cargo Routes
  { startLat: 37.7749, startLng: -122.4194, endLat: 39.9042, endLng: 116.4074, frequency: 180, cargo: 'High-Value Goods', color: '#FFD700', mode: 'air' },
  { startLat: 37.7749, startLng: -122.4194, endLat: 35.6762, endLng: 139.6503, frequency: 150, cargo: 'Express Cargo', color: '#FFD700', mode: 'air' },
  { startLat: 51.5074, startLng: -0.1278, endLat: 25.2048, endLng: 55.2708, frequency: 120, cargo: 'Air Freight', color: '#FFD700', mode: 'air' },
  { startLat: 37.5665, startLng: 126.9780, endLat: 37.7749, endLng: -122.4194, frequency: 140, cargo: 'Semiconductors', color: '#00E5FF', mode: 'air' },
];

// Supply chain paths (examples)
export const SUPPLY_CHAIN_PATHS: SupplyChainPath[] = [
  // NVIDIA H100 Supply Chain
  {
    product: 'NVIDIA H100 AI Accelerator',
    color: '#10B981',
    description: 'From raw materials to AI datacenter deployment',
    nodes: [
      { lat: 51.1657, lng: 10.4515, name: 'ASML (Netherlands)', type: 'raw-material', company: 'ASML' },
      { lat: 37.5665, lng: 126.9780, name: 'SK Hynix (Korea)', type: 'component', company: 'SK Hynix' },
      { lat: 25.0330, lng: 121.5654, name: 'TSMC (Taiwan)', type: 'component', company: 'TSMC' },
      { lat: 37.3861, lng: -121.9640, name: 'NVIDIA (Silicon Valley)', type: 'assembly', company: 'NVIDIA' },
      { lat: 47.6062, lng: -122.3321, name: 'Microsoft Azure', type: 'distribution', company: 'Microsoft' },
      { lat: 37.7749, lng: -122.4194, name: 'OpenAI (San Francisco)', type: 'consumer', company: 'OpenAI' },
    ],
  },
  // iPhone Supply Chain
  {
    product: 'iPhone Manufacturing',
    color: '#06B6D4',
    description: 'Global smartphone supply chain',
    nodes: [
      { lat: 35.6762, lng: 139.6503, name: 'Camera Sensors (Japan)', type: 'component', company: 'Sony' },
      { lat: 37.5665, lng: 126.9780, name: 'OLED Displays (Korea)', type: 'component', company: 'Samsung' },
      { lat: 25.0330, lng: 121.5654, name: 'A-Series Chips (Taiwan)', type: 'component', company: 'TSMC' },
      { lat: 31.2304, lng: 121.4737, name: 'Assembly (Shanghai)', type: 'assembly', company: 'Foxconn' },
      { lat: 37.3861, lng: -121.9640, name: 'Apple HQ', type: 'distribution', company: 'Apple' },
      { lat: 40.7128, lng: -74.0060, name: 'Retail (NYC)', type: 'consumer' },
    ],
  },
  // Electric Vehicle Battery Chain
  {
    product: 'EV Battery Supply Chain',
    color: '#F59E0B',
    description: 'Lithium-ion battery production for electric vehicles',
    nodes: [
      { lat: -33.8688, lng: 151.2093, name: 'Lithium Mining (Australia)', type: 'raw-material' },
      { lat: 39.9042, lng: 116.4074, name: 'Battery Cell Production (China)', type: 'component', company: 'CATL' },
      { lat: 52.5200, lng: 13.4050, name: 'Battery Pack Assembly (Germany)', type: 'assembly', company: 'Tesla' },
      { lat: 37.3861, lng: -121.9640, name: 'EV Manufacturing (Fremont)', type: 'distribution', company: 'Tesla' },
      { lat: 33.7490, lng: -84.3880, name: 'Delivery Center', type: 'consumer' },
    ],
  },
];

// Currency exchange flows (forex trading volumes)
export const CURRENCY_FLOWS = [
  { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, volume: 850, pair: 'USD/GBP', color: 'rgba(255, 215, 0, 0.5)' },
  { startLat: 40.7128, startLng: -74.0060, endLat: 35.6762, endLng: 139.6503, volume: 720, pair: 'USD/JPY', color: 'rgba(255, 215, 0, 0.5)' },
  { startLat: 40.7128, startLng: -74.0060, endLat: 39.9042, endLng: 116.4074, volume: 680, pair: 'USD/CNY', color: 'rgba(255, 215, 0, 0.5)' },
  { startLat: 51.5074, startLng: -0.1278, endLat: 52.5200, endLng: 13.4050, volume: 540, pair: 'GBP/EUR', color: 'rgba(139, 92, 246, 0.5)' },
  { startLat: 35.6762, startLng: 139.6503, endLat: 39.9042, endLng: 116.4074, volume: 420, pair: 'JPY/CNY', color: 'rgba(239, 68, 68, 0.5)' },
];
