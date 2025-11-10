'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMacroStore } from '@/lib/store/macroStore';

// Dynamic import to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Country {
  lat: number;
  lng: number;
  name: string;
  code: string;
  m2Supply: number; // in trillions USD
  gdp: number;
  color: string;
  size: number;
}

interface CapitalFlow {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  amount: number; // in billions USD
  color: string;
  label: string;
}

// Major economies with M2 money supply data
const COUNTRIES: Country[] = [
  { lat: 37.5665, lng: 126.9780, name: 'South Korea', code: 'KR', m2Supply: 3.2, gdp: 1.7, color: '#00E5FF', size: 0.8 },
  { lat: 37.7749, lng: -122.4194, name: 'United States', code: 'US', m2Supply: 21.4, gdp: 25.5, color: '#FFD700', size: 1.5 },
  { lat: 35.6762, lng: 139.6503, name: 'Japan', code: 'JP', m2Supply: 11.2, gdp: 4.2, color: '#FF6B6B', size: 1.2 },
  { lat: 39.9042, lng: 116.4074, name: 'China', code: 'CN', m2Supply: 38.6, gdp: 17.9, color: '#EF4444', size: 2.0 },
  { lat: 51.5074, lng: -0.1278, name: 'United Kingdom', code: 'GB', m2Supply: 3.5, gdp: 3.1, color: '#8B5CF6', size: 0.9 },
  { lat: 52.5200, lng: 13.4050, name: 'Germany', code: 'DE', m2Supply: 4.2, gdp: 4.3, color: '#06B6D4', size: 1.0 },
  { lat: 48.8566, lng: 2.3522, name: 'France', code: 'FR', m2Supply: 3.8, gdp: 2.9, color: '#00FF9F', size: 0.9 },
  { lat: -23.5505, lng: -46.6333, name: 'Brazil', code: 'BR', m2Supply: 1.9, gdp: 2.1, color: '#F59E0B', size: 0.7 },
  { lat: 28.6139, lng: 77.2090, name: 'India', code: 'IN', m2Supply: 2.8, gdp: 3.7, color: '#E6007A', size: 1.1 },
  { lat: 25.2048, lng: 55.2708, name: 'UAE', code: 'AE', m2Supply: 0.5, gdp: 0.5, color: '#39FF14', size: 0.5 },
];

// Capital flows (arcs) between countries
const CAPITAL_FLOWS: CapitalFlow[] = [
  // US → Global outflows
  { startLat: 37.7749, startLng: -122.4194, endLat: 39.9042, endLng: 116.4074, amount: 150, color: 'rgba(255, 215, 0, 0.6)', label: 'US → China' },
  { startLat: 37.7749, startLng: -122.4194, endLat: 35.6762, endLng: 139.6503, amount: 120, color: 'rgba(255, 215, 0, 0.6)', label: 'US → Japan' },
  { startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278, amount: 100, color: 'rgba(255, 215, 0, 0.6)', label: 'US → UK' },
  { startLat: 37.7749, startLng: -122.4194, endLat: 37.5665, endLng: 126.9780, amount: 80, color: 'rgba(255, 215, 0, 0.6)', label: 'US → Korea' },

  // China → Asia
  { startLat: 39.9042, startLng: 116.4074, endLat: 37.5665, endLng: 126.9780, amount: 90, color: 'rgba(239, 68, 68, 0.6)', label: 'China → Korea' },
  { startLat: 39.9042, startLng: 116.4074, endLat: 28.6139, endLng: 77.2090, amount: 70, color: 'rgba(239, 68, 68, 0.6)', label: 'China → India' },
  { startLat: 39.9042, startLng: 116.4074, endLat: 25.2048, endLng: 55.2708, amount: 50, color: 'rgba(239, 68, 68, 0.6)', label: 'China → UAE' },

  // EU internal flows
  { startLat: 52.5200, startLng: 13.4050, endLat: 48.8566, endLng: 2.3522, amount: 60, color: 'rgba(0, 229, 255, 0.6)', label: 'Germany → France' },
  { startLat: 51.5074, startLng: -0.1278, endLat: 52.5200, endLng: 13.4050, amount: 55, color: 'rgba(139, 92, 246, 0.6)', label: 'UK → Germany' },

  // Asia → Global
  { startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, amount: 100, color: 'rgba(255, 107, 107, 0.6)', label: 'Japan → US' },
  { startLat: 37.5665, startLng: 126.9780, endLat: 39.9042, endLng: 116.4074, amount: 65, color: 'rgba(0, 229, 255, 0.6)', label: 'Korea → China' },
];

export default function Globe3D() {
  const globeRef = useRef<any>();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [viewMode, setViewMode] = useState<'m2' | 'flows'>('m2');
  const [autoRotate, setAutoRotate] = useState(true);
  const macroState = useMacroStore(state => state.macroState);

  // Auto-rotate globe
  useEffect(() => {
    if (autoRotate && globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
      }
    }
  }, [autoRotate]);

  // Adjust M2 based on global liquidity macro variable
  const adjustedCountries = useMemo(() => {
    const globalLiquidityMultiplier = 1 + ((macroState.global_m2_growth || 0) - 5) / 100;
    return COUNTRIES.map(country => ({
      ...country,
      m2Supply: country.m2Supply * globalLiquidityMultiplier,
      size: Math.log(country.m2Supply * globalLiquidityMultiplier) * 0.3
    }));
  }, [macroState.global_m2_growth]);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setAutoRotate(false);

    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: country.lat, lng: country.lng, altitude: 1.5 },
        1000
      );
    }
  };

  const handleGlobeClick = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">View Mode</div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('m2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'm2'
                  ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/50'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              M2 Supply
            </button>
            <button
              onClick={() => setViewMode('flows')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'flows'
                  ? 'bg-accent-magenta text-black shadow-lg shadow-accent-magenta/50'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              Capital Flows
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">Legend</div>
          {viewMode === 'm2' ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-cyan shadow-lg" style={{ boxShadow: '0 0 10px #00E5FF' }} />
                <span className="text-xs text-text-primary">Point Size = M2 Supply</span>
              </div>
              <div className="text-xs text-text-tertiary mt-2">
                Larger = More Money Supply
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-transparent" />
                <span className="text-xs text-text-primary">Capital Flow</span>
              </div>
              <div className="text-xs text-text-tertiary mt-2">
                Arc Width = Flow Volume
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">Controls</div>
          <div className="space-y-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                autoRotate
                  ? 'bg-accent-emerald text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              {autoRotate ? '⏸ Pause Rotation' : '▶ Auto Rotate'}
            </button>
            <button
              onClick={() => {
                setSelectedCountry(null);
                setAutoRotate(true);
                if (globeRef.current) {
                  globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
                }
              }}
              className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-background-secondary text-text-secondary hover:text-text-primary transition-all"
            >
              🔄 Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Country Details */}
      {selectedCountry && (
        <div className="absolute top-4 right-4 z-10 w-72 bg-black/90 backdrop-blur border border-accent-cyan rounded-lg p-4 shadow-2xl shadow-accent-cyan/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-accent-cyan">{selectedCountry.name}</h3>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-text-tertiary hover:text-accent-cyan transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border-primary">
              <span className="text-text-tertiary">Code:</span>
              <span className="text-text-primary font-mono font-semibold">{selectedCountry.code}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-text-tertiary">M2 Supply:</span>
              <span className="text-accent-cyan font-mono font-bold">${selectedCountry.m2Supply.toFixed(1)}T</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-text-tertiary">GDP:</span>
              <span className="text-accent-emerald font-mono font-bold">${selectedCountry.gdp.toFixed(1)}T</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-text-tertiary">M2/GDP Ratio:</span>
              <span className={`font-mono font-bold ${
                (selectedCountry.m2Supply / selectedCountry.gdp) > 2
                  ? 'text-status-danger'
                  : 'text-status-safe'
              }`}>
                {(selectedCountry.m2Supply / selectedCountry.gdp).toFixed(2)}x
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-border-primary">
              <div className="text-text-tertiary mb-2">Capital Flows:</div>
              {CAPITAL_FLOWS.filter(
                flow => flow.label.includes(selectedCountry.name)
              ).length > 0 ? (
                <div className="space-y-1">
                  {CAPITAL_FLOWS.filter(
                    flow => flow.label.includes(selectedCountry.name)
                  ).map((flow, i) => (
                    <div key={i} className="text-xs">
                      <span className="text-text-primary">{flow.label}</span>
                      <span className="text-accent-cyan ml-2 font-mono">${flow.amount}B</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-text-tertiary text-xs">No major flows</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary">Countries</div>
            <div className="text-accent-cyan font-bold text-lg">{COUNTRIES.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Total M2</div>
            <div className="text-accent-emerald font-bold text-lg">
              ${adjustedCountries.reduce((sum, c) => sum + c.m2Supply, 0).toFixed(1)}T
            </div>
          </div>
          <div>
            <div className="text-text-tertiary">Flows</div>
            <div className="text-accent-magenta font-bold text-lg">{CAPITAL_FLOWS.length}</div>
          </div>
        </div>
      </div>

      {/* Globe */}
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0, 0, 0, 0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        // Points (M2 Supply)
        pointsData={viewMode === 'm2' ? adjustedCountries : []}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d: any) => d.size * 0.01}
        pointRadius={(d: any) => d.size * 0.5}
        pointColor={(d: any) => d.color}
        pointLabel={(d: any) => `
          <div style="background: rgba(0, 0, 0, 0.9); padding: 8px; border-radius: 6px; border: 1px solid #00E5FF;">
            <div style="color: #00E5FF; font-weight: bold; margin-bottom: 4px;">${d.name}</div>
            <div style="color: white; font-size: 12px;">M2: $${d.m2Supply.toFixed(1)}T</div>
            <div style="color: #00FF9F; font-size: 12px;">GDP: $${d.gdp.toFixed(1)}T</div>
          </div>
        `}
        onPointClick={(point: any) => handleCountryClick(point as Country)}

        // Arcs (Capital Flows)
        arcsData={viewMode === 'flows' ? CAPITAL_FLOWS : []}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke={(d: any) => Math.sqrt(d.amount) * 0.02}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcLabel={(d: any) => `
          <div style="background: rgba(0, 0, 0, 0.9); padding: 8px; border-radius: 6px; border: 1px solid #E6007A;">
            <div style="color: #E6007A; font-weight: bold; margin-bottom: 4px;">${d.label}</div>
            <div style="color: white; font-size: 12px;">Amount: $${d.amount}B</div>
          </div>
        `}

        // Atmosphere
        atmosphereColor="#00E5FF"
        atmosphereAltitude={0.15}

        // Camera
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={typeof window !== 'undefined' ? window.innerHeight : 1080}

        // Interaction
        onGlobeClick={handleGlobeClick}
        enablePointerInteraction={true}
      />
    </div>
  );
}
