'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { companies, Company } from '@/data/companies';
import { Search, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NewsFeed from './NewsFeed';
import CommunityPanel from './CommunityPanel';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, icon, className = '' }: { children: React.ReactNode, icon?: React.ReactNode, className?: string }) => (
  <h3 className={`text-base font-semibold text-text-primary mb-4 flex items-center gap-2 ${className}`}>
    {icon}
    {children}
  </h3>
);

const generateDeterministicMock = (seed: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
  const random = (hash & 0x7fffffff) / 0x7fffffff;
  return min + random * (max - min);
};

// Analysis Components
const FundamentalAnalysis = ({ company }: { company: Company }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
    <div>
      <h4 className="font-bold text-text-primary mb-3">Income Statement</h4>
      <div className="space-y-2 p-4 bg-black rounded-lg">
        <div className="flex justify-between"><span className="text-text-secondary">Revenue:</span><span className="font-mono text-text-primary">${company.financials.revenue.toLocaleString()} M</span></div>
        <div className="flex justify-between"><span className="text-text-secondary">Operating Income:</span><span className="font-mono text-text-primary">${company.financials.operating_income?.toLocaleString() || 'N/A'} M</span></div>
        <div className="flex justify-between"><span className="text-text-secondary">Net Income:</span><span className="font-mono text-text-primary">${company.financials.net_income.toLocaleString()} M</span></div>
      </div>
    </div>
    <div>
      <h4 className="font-bold text-text-primary mb-3">Balance Sheet</h4>
      <div className="space-y-2 p-4 bg-black rounded-lg">
        <div className="flex justify-between"><span className="text-text-secondary">Total Assets:</span><span className="font-mono text-text-primary">${company.financials.total_assets.toLocaleString()} M</span></div>
        <div className="flex justify-between"><span className="text-text-secondary">Total Debt:</span><span className="font-mono text-text-primary">${company.financials.total_debt.toLocaleString()} M</span></div>
        <div className="flex justify-between"><span className="text-text-secondary">Equity:</span><span className="font-mono text-text-primary">${company.financials.equity.toLocaleString()} M</span></div>
      </div>
    </div>
  </div>
);

const TechnicalAnalysis = ({ ticker }: { ticker: string }) => {
  const data = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i}`, rsi: generateDeterministicMock(`${ticker}-rsi-${i}`, 30, 70), macd: generateDeterministicMock(`${ticker}-macd-${i}`, -0.5, 0.5) })), [ticker]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-40">
        <h4 className="text-sm text-text-secondary mb-2">RSI (14)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <Tooltip contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1A1A1F' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Area type="monotone" dataKey="rsi" stroke="#E6007A" fill="#E6007A" fillOpacity={0.2} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-40">
        <h4 className="text-sm text-text-secondary mb-2">MACD</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <Tooltip contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1A1A1F' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <Area type="monotone" dataKey="macd" stroke="#39FF14" fill="#39FF14" fillOpacity={0.2} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MacroImpactAnalysis = ({ company, macroVariables }: { company: Company, macroVariables: any }) => {
  const baseRate = 2.5;
  const rateChange = macroVariables.interestRate - baseRate;
  const { impact, explanation } = useMemo(() => {
    let impact = 0, explanation = "";
    if (company.sector === 'BANKING') {
      impact = rateChange * generateDeterministicMock(company.ticker, 2.5, 3.5);
      explanation = `A ${rateChange.toFixed(2)}% change in interest rates directly impacts Net Interest Margin (NIM).`;
    }
    else if (company.sector === 'REALESTATE') {
      impact = rateChange * generateDeterministicMock(company.ticker, -4.5, -5.5);
      explanation = `Real Estate companies are sensitive to borrowing costs. A ${rateChange.toFixed(2)}% rate change significantly impacts ICR and profitability.`;
    }
    else if (company.sector === 'MANUFACTURING') {
      impact = macroVariables.tariffRate * generateDeterministicMock(company.ticker, -0.4, -0.6);
      explanation = `Manufacturing sector is sensitive to trade tariffs. A tariff rate of ${macroVariables.tariffRate}% can increase costs.`;
    }
    else {
      explanation = "This sector has low direct sensitivity to the selected macro variables.";
    }
    return { impact: impact.toFixed(2), explanation };
  }, [company, macroVariables]);

  return (
    <div>
      <h4 className="font-bold text-text-primary mb-3">Scenario: Interest Rate at {macroVariables.interestRate.toFixed(1)}%, Tariff Rate at {macroVariables.tariffRate}%</h4>
      <div className={`p-4 rounded-lg ${parseFloat(impact) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
        <p className="text-sm text-text-secondary mb-2">Estimated Net Income Impact</p>
        <p className={`text-4xl font-bold ${parseFloat(impact) >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>{impact}%</p>
        <p className="text-xs text-text-secondary mt-4">{explanation}</p>
      </div>
    </div>
  );
};

export default function PlatformDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);
  const [analysisTab, setAnalysisTab] = useState('Fundamental');
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState<any[]>([]);
  const [macroVariables, setMacroVariables] = useState({ interestRate: 2.5, tariffRate: 0, fxRate: 1200 });

  const analysisTabs = ['Fundamental', 'Technical', 'Macro Impact'];
  const filteredCompanies = useMemo(() => companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.ticker.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  useEffect(() => {
    setStockData(Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, price: generateDeterministicMock(`${selectedCompany.ticker}-price-${i}`, selectedCompany.financials.equity / 200, selectedCompany.financials.equity / 100) })));
  }, [selectedCompany]);

  const renderAnalysisContent = () => {
    switch(analysisTab) {
      case 'Fundamental': return <FundamentalAnalysis company={selectedCompany} />;
      case 'Technical': return <TechnicalAnalysis ticker={selectedCompany.ticker} />;
      case 'Macro Impact': return <MacroImpactAnalysis company={selectedCompany} macroVariables={macroVariables} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-black text-text-primary flex flex-col">
      {/* Header */}
      <div className="border-b border-border-primary px-6 py-3 bg-black/50 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-accent-cyan">Nexus-Alpha</h1>
            <p className="text-xs text-text-secondary">Financial Simulation Platform</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-primary font-mono">{selectedCompany.name}</p>
            <p className="text-xs text-accent-cyan font-mono">{selectedCompany.ticker}</p>
          </div>
        </div>
      </div>

      {/* Main Content: 20% | 60% | 20% */}
      <div className="flex-1 flex gap-4 px-4 py-4 overflow-hidden">

        {/* LEFT SIDEBAR (20%) - Company Selector + News + Community */}
        <div className="w-[20%] min-w-0 flex flex-col gap-4 overflow-hidden">
          {/* Trending */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full flex flex-col">
              <CardTitle icon={<TrendingUp size={16}/>} className="text-xs">Trending</CardTitle>
              <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                {['TSLA', 'NVDA', 'AAPL', 'MSFT', 'META'].map(ticker => {
                  const company = companies.find(c => c.ticker === ticker);
                  return company ? (
                    <button
                      key={ticker}
                      onClick={() => setSelectedCompany(company)}
                      className={`w-full p-2 rounded text-left transition-all text-xs ${
                        selectedCompany.ticker === ticker ? 'bg-accent-cyan/10 border border-accent-cyan' : 'hover:bg-background-tertiary'
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{ticker}</div>
                      <div className="text-text-secondary text-xs truncate">{company.name}</div>
                    </button>
                  ) : null;
                })}
              </div>
            </Card>
          </div>

          {/* Company List */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardTitle className="text-xs mb-2 flex-shrink-0">Company List</CardTitle>
              <div className="relative mb-2 flex-shrink-0">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary"/>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-border-primary rounded-lg pl-6 pr-2 py-1 text-xs focus:outline-none focus:border-accent-cyan"
                />
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto pr-1 min-h-0">
                {filteredCompanies.map(company => (
                  <button
                    key={company.ticker}
                    onClick={() => setSelectedCompany(company)}
                    className={`w-full p-1.5 rounded text-left transition-all text-xs ${
                      selectedCompany.ticker === company.ticker ? 'bg-accent-cyan/10' : 'hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="font-semibold text-text-primary">{company.ticker}</div>
                    <div className="text-text-secondary text-xs">{company.sector}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* News Feed */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <NewsFeed selectedSector={selectedCompany.sector} />
          </div>

          {/* Community Panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <CommunityPanel />
          </div>
        </div>

        {/* CENTER (60%) - Main Analysis: Ontology-Focused */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden">
          {/* Macro Impact Analysis (PRIMARY) */}
          <div className="flex-shrink-0 min-h-0">
            <Card className="h-full flex flex-col p-6">
              <h3 className="text-base font-semibold text-text-primary mb-4">
                Macro Impact Analysis
              </h3>
              <div className="space-y-4">
                {/* Scenario Display */}
                <div className="text-xs text-text-secondary">
                  <span>Scenario: Interest Rate at </span>
                  <span className="text-accent-cyan font-semibold">
                    {macroVariables.interestRate.toFixed(1)}%
                  </span>
                  <span>, Tariff Rate at </span>
                  <span className="text-accent-cyan font-semibold">
                    {macroVariables.tariffRate.toFixed(0)}%
                  </span>
                </div>

                {/* Impact Result */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-2">
                      Estimated Net Income Impact
                    </p>
                    {(() => {
                      const baseRate = 2.5;
                      const rateChange = macroVariables.interestRate - baseRate;
                      let impact = 0;
                      if (selectedCompany.sector === 'BANKING') {
                        impact = rateChange * generateDeterministicMock(selectedCompany.ticker, 2.5, 3.5);
                      } else if (selectedCompany.sector === 'REALESTATE') {
                        impact = rateChange * generateDeterministicMock(selectedCompany.ticker, -4.5, -5.5);
                      } else if (selectedCompany.sector === 'MANUFACTURING') {
                        impact = macroVariables.tariffRate * generateDeterministicMock(selectedCompany.ticker, -0.4, -0.6);
                      }
                      return (
                        <p className={`text-4xl font-bold ${
                          impact >= 0 ? 'text-status-safe' : 'text-status-danger'
                        }`}>
                          {impact.toFixed(2)}%
                        </p>
                      );
                    })()}
                  </div>
                  <div className="flex items-center justify-center p-4 bg-background-tertiary rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-text-secondary mb-2">Company</p>
                      <p className="text-sm font-semibold text-text-primary">
                        {selectedCompany.ticker}
                      </p>
                      <p className="text-xs text-accent-cyan mt-1">
                        {selectedCompany.sector}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stock Chart (Secondary) */}
          <div className="h-[25%] min-h-0">
            <Card className="h-full flex flex-col">
              <CardTitle className="text-sm">{selectedCompany.name} ({selectedCompany.ticker})</CardTitle>
              <div className="flex-1 min-h-0 -ml-4 -mr-4 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockData} margin={{ top: 5, right: 15, left: 40, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1A1A1F' }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                    <Area type="monotone" dataKey="price" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Fundamental & Technical Tabs (Supplementary) */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full flex flex-col overflow-hidden">
              <div className="flex gap-1 border-b border-border-primary pb-3 overflow-x-auto flex-shrink-0">
                {['Fundamental', 'Technical'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAnalysisTab(tab)}
                    className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                      analysisTab === tab
                        ? 'text-accent-cyan border-b-2 border-accent-cyan'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pt-3 text-xs pr-2">
                {analysisTab === 'Fundamental' && <FundamentalAnalysis company={selectedCompany} />}
                {analysisTab === 'Technical' && <TechnicalAnalysis ticker={selectedCompany.ticker} />}
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDEBAR (20%) - Controls & Ratios */}
        <div className="w-[20%] min-w-0 flex flex-col gap-4 overflow-hidden">
          {/* Key Ratios */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full flex flex-col overflow-y-auto text-xs">
              <CardTitle className="text-xs mb-2">Key Ratios</CardTitle>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-black rounded-lg">
                  <div className="text-text-secondary text-xs mb-1">P/E</div>
                  <div className="font-bold text-text-primary">{selectedCompany.ratios?.pe_ratio?.toFixed(1) || 'N/A'}</div>
                </div>
                <div className="text-center p-2 bg-black rounded-lg">
                  <div className="text-text-secondary text-xs mb-1">ROE</div>
                  <div className="font-bold text-text-primary">{selectedCompany.ratios?.roe?.toFixed(1) || 'N/A'}%</div>
                </div>
                <div className="text-center p-2 bg-black rounded-lg">
                  <div className="text-text-secondary text-xs mb-1">D/E</div>
                  <div className="font-bold text-text-primary">{selectedCompany.ratios?.de_ratio?.toFixed(1) || 'N/A'}</div>
                </div>
                <div className="text-center p-2 bg-black rounded-lg">
                  <div className="text-text-secondary text-xs mb-1">ICR</div>
                  <div className={`font-bold ${
                    selectedCompany.ratios?.icr && selectedCompany.ratios.icr > 2
                      ? 'text-status-safe'
                      : selectedCompany.ratios?.icr && selectedCompany.ratios.icr > 0
                      ? 'text-status-caution'
                      : 'text-status-danger'
                  }`}>
                    {selectedCompany.ratios?.icr?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Macro Controls */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full flex flex-col overflow-y-auto text-xs">
              <CardTitle className="text-xs mb-2">Macro Variables</CardTitle>
              <div className="space-y-3">
                <div>
                  <label className="text-text-secondary text-xs block mb-1">Interest Rate</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={macroVariables.interestRate}
                      onChange={(e) => setMacroVariables({...macroVariables, interestRate: parseFloat(e.target.value)})}
                      className="flex-1 h-0.5"
                    />
                    <span className="text-accent-cyan font-mono text-xs w-8 text-right">{macroVariables.interestRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-text-secondary text-xs block mb-1">Tariff</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={macroVariables.tariffRate}
                      onChange={(e) => setMacroVariables({...macroVariables, tariffRate: parseFloat(e.target.value)})}
                      className="flex-1 h-0.5"
                    />
                    <span className="text-accent-cyan font-mono text-xs w-8 text-right">{macroVariables.tariffRate.toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-text-secondary text-xs block mb-1">FX (KRW/USD)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="range"
                      min="900"
                      max="1500"
                      step="10"
                      value={macroVariables.fxRate}
                      onChange={(e) => setMacroVariables({...macroVariables, fxRate: parseFloat(e.target.value)})}
                      className="flex-1 h-0.5"
                    />
                    <span className="text-accent-cyan font-mono text-xs w-10 text-right">{macroVariables.fxRate.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
