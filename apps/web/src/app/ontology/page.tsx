'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Globe, BarChart3, Building, Wrench, Landmark, TrendingUp, DollarSign, Users, Package } from 'lucide-react';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 hover:border-[#2A2A3F] transition-all ${className}`}>
    {children}
  </div>
);

interface OntologyElement {
  name: string;
  definition: string;
  examples: string[];
  equations?: string[];
}

interface OntologyLevel {
  level: number;
  name: string;
  description: string;
  icon: string;
  elements: OntologyElement[];
}

const ONTOLOGY_LEVELS: OntologyLevel[] = [
  {
    level: 1,
    name: 'Macro Variables',
    description: 'Global economic factors affecting entire markets',
    icon: 'globe',
    elements: [
      {
        name: 'Interest Rates',
        definition: 'Central bank policy rates that influence borrowing costs across the economy',
        examples: [
          'Fed Funds Rate (US)',
          'ECB Main Refinancing Rate (EU)',
          'Bank of Japan Policy Rate'
        ],
        equations: [
          'Bond Price ∝ 1 / Interest Rate',
          'Stock Valuation: P = D / (r - g)'
        ]
      },
      {
        name: 'Inflation',
        definition: 'Rate of increase in price levels, eroding purchasing power',
        examples: [
          'Consumer Price Index (CPI)',
          'Producer Price Index (PPI)',
          'Core Inflation (ex-food & energy)'
        ],
        equations: [
          'Real Return = Nominal Return - Inflation',
          'Real Interest Rate = Nominal Rate - Expected Inflation'
        ]
      },
      {
        name: 'GDP Growth',
        definition: 'Measure of economic expansion or contraction',
        examples: [
          'Real GDP Growth Rate',
          'GDP per Capita',
          'Quarterly GDP Changes'
        ],
        equations: [
          'GDP = C + I + G + (X - M)',
          'Growth Rate = (GDP₂ - GDP₁) / GDP₁ × 100%'
        ]
      },
      {
        name: 'Exchange Rates',
        definition: 'Currency valuations affecting international trade and competitiveness',
        examples: [
          'USD/EUR Exchange Rate',
          'Trade-Weighted Dollar Index',
          'Currency Volatility (VIX equivalent)'
        ],
        equations: [
          'Purchasing Power Parity: S = P₁ / P₂',
          'Forward Rate = Spot Rate × (1 + r₁) / (1 + r₂)'
        ]
      },
      {
        name: 'Commodity Prices',
        definition: 'Raw material costs impacting production and inflation',
        examples: [
          'Crude Oil (WTI, Brent)',
          'Gold Price',
          'Agricultural Commodities (Wheat, Corn)'
        ],
        equations: [
          'Break-even Price = Total Cost / Units Produced',
          'Contango: Future Price > Spot Price'
        ]
      }
    ]
  },
  {
    level: 2,
    name: 'Sector-Specific Metrics',
    description: 'Industry-level indicators and performance measures',
    icon: 'barchart',
    elements: [
      {
        name: 'Banking Sector',
        definition: 'Financial health indicators for lending institutions',
        examples: [
          'Net Interest Margin (NIM)',
          'Loan-to-Deposit Ratio',
          'Non-Performing Loan Ratio'
        ],
        equations: [
          'NIM = (Interest Income - Interest Expense) / Avg Earning Assets',
          'Tier 1 Capital Ratio = Tier 1 Capital / Risk-Weighted Assets'
        ]
      },
      {
        name: 'Real Estate',
        definition: 'Property market health and valuation metrics',
        examples: [
          'Occupancy Rate',
          'Cap Rate (Capitalization Rate)',
          'Rental Yield'
        ],
        equations: [
          'Cap Rate = Net Operating Income / Property Value',
          'Rental Yield = (Annual Rent / Property Price) × 100%'
        ]
      },
      {
        name: 'Technology',
        definition: 'Growth and innovation metrics for tech companies',
        examples: [
          'Monthly Active Users (MAU)',
          'Customer Acquisition Cost (CAC)',
          'Lifetime Value (LTV)'
        ],
        equations: [
          'LTV/CAC Ratio = Customer Lifetime Value / Acquisition Cost',
          'Churn Rate = Lost Customers / Total Customers × 100%'
        ]
      },
      {
        name: 'Energy',
        definition: 'Production efficiency and profitability metrics',
        examples: [
          'Production Costs per Barrel',
          'Reserve Replacement Ratio',
          'Refining Margins'
        ],
        equations: [
          'Cash Operating Margin = (Revenue - Op Costs) / Revenue',
          'Finding Cost = Exploration Cost / New Reserves'
        ]
      },
      {
        name: 'Healthcare',
        definition: 'Drug development and healthcare delivery metrics',
        examples: [
          'R&D Pipeline Value',
          'Clinical Trial Success Rate',
          'Patient Volume Growth'
        ],
        equations: [
          'R&D Efficiency = Revenue from New Drugs / R&D Spend',
          'Margin per Patient = (Revenue - Cost) / Patient Count'
        ]
      }
    ]
  },
  {
    level: 3,
    name: 'Company-Level Details',
    description: 'Individual company financial health and performance',
    icon: 'building',
    elements: [
      {
        name: 'Profitability Ratios',
        definition: 'Measures of company earnings and efficiency',
        examples: [
          'Return on Equity (ROE)',
          'Return on Assets (ROA)',
          'Net Profit Margin'
        ],
        equations: [
          'ROE = Net Income / Shareholders Equity',
          'ROA = Net Income / Total Assets',
          'Net Margin = Net Income / Revenue × 100%'
        ]
      },
      {
        name: 'Valuation Metrics',
        definition: 'Market value indicators relative to fundamentals',
        examples: [
          'Price-to-Earnings Ratio (P/E)',
          'Enterprise Value / EBITDA',
          'Price-to-Book Ratio (P/B)'
        ],
        equations: [
          'P/E = Stock Price / Earnings Per Share',
          'EV/EBITDA = (Market Cap + Debt - Cash) / EBITDA',
          'P/B = Stock Price / Book Value Per Share'
        ]
      },
      {
        name: 'Leverage Ratios',
        definition: 'Company debt levels and repayment capacity',
        examples: [
          'Debt-to-Equity Ratio (D/E)',
          'Interest Coverage Ratio (ICR)',
          'Debt Service Coverage Ratio'
        ],
        equations: [
          'D/E = Total Debt / Total Equity',
          'ICR = EBIT / Interest Expense',
          'DSCR = Operating Income / Total Debt Service'
        ]
      },
      {
        name: 'Growth Metrics',
        definition: 'Revenue and earnings expansion indicators',
        examples: [
          'Revenue Growth Rate',
          'Earnings Growth (YoY)',
          'Operating Leverage'
        ],
        equations: [
          'Revenue Growth = (Revenue₂ - Revenue₁) / Revenue₁ × 100%',
          'EPS Growth = (EPS₂ - EPS₁) / EPS₁ × 100%',
          'Operating Leverage = % Change EBIT / % Change Sales'
        ]
      },
      {
        name: 'Cash Flow Analysis',
        definition: 'Actual cash generation and allocation',
        examples: [
          'Free Cash Flow (FCF)',
          'Operating Cash Flow',
          'Cash Conversion Cycle'
        ],
        equations: [
          'FCF = Operating Cash Flow - Capital Expenditures',
          'Cash Conversion = (Receivables Days + Inventory Days - Payables Days)',
          'FCF Yield = Free Cash Flow / Market Cap × 100%'
        ]
      }
    ]
  },
  {
    level: 4,
    name: 'Asset/Product-Level',
    description: 'Granular asset and product line analysis',
    icon: 'wrench',
    elements: [
      {
        name: 'Individual Loans (Banking)',
        definition: 'Loan-level risk assessment and performance',
        examples: [
          'Loan-to-Value Ratio (LTV)',
          'Credit Score of Borrower',
          'Debt Service Coverage'
        ],
        equations: [
          'LTV = Loan Amount / Asset Value × 100%',
          'Default Probability = f(Credit Score, Income, LTV)',
          'Expected Loss = PD × LGD × EAD'
        ]
      },
      {
        name: 'Real Estate Properties',
        definition: 'Individual property performance metrics',
        examples: [
          'Property-Level NOI',
          'Tenant Quality Score',
          'Maintenance Cost Ratio'
        ],
        equations: [
          'NOI = Rental Income - Operating Expenses',
          'Cash-on-Cash Return = Annual Cash Flow / Total Investment',
          'Operating Expense Ratio = Op Expenses / Gross Revenue'
        ]
      },
      {
        name: 'Product Lines (Tech)',
        definition: 'Individual product revenue and engagement',
        examples: [
          'Product-Specific Revenue',
          'User Engagement per Feature',
          'Conversion Rate by Product'
        ],
        equations: [
          'Product Revenue = Users × ARPU',
          'Conversion Rate = Paying Users / Total Users × 100%',
          'Product Margin = (Revenue - Direct Costs) / Revenue'
        ]
      },
      {
        name: 'Oil & Gas Fields',
        definition: 'Individual field production and economics',
        examples: [
          'Field Production Rate',
          'Decline Curve Analysis',
          'Field Operating Cost'
        ],
        equations: [
          'NPV = Σ(Cash Flow_t / (1 + r)^t)',
          'Break-even Price = (CAPEX + OPEX) / Lifetime Production',
          'Recovery Factor = Cumulative Production / Original In Place'
        ]
      },
      {
        name: 'Drug Patents (Pharma)',
        definition: 'Individual drug revenue and patent life',
        examples: [
          'Sales by Drug',
          'Patent Expiration Date',
          'Generic Competition Impact'
        ],
        equations: [
          'Patent Value = Σ(Future Cash Flows / (1 + r)^t)',
          'Revenue Loss = Pre-Generic Sales × Generic Erosion %',
          'R&D ROI = Drug Revenue / Development Cost'
        ]
      }
    ]
  }
];

export default function OntologyPage() {
  const [expandedLevel, setExpandedLevel] = useState<number>(1);
  const [expandedElement, setExpandedElement] = useState<string>('');

  const renderIcon = (icon: string, size: number = 20) => {
    const iconProps = { size, className: "text-accent-cyan" };
    if (icon === 'globe') return <Globe {...iconProps} />;
    if (icon === 'barchart') return <BarChart3 {...iconProps} />;
    if (icon === 'building') return <Building {...iconProps} />;
    if (icon === 'wrench') return <Wrench {...iconProps} />;
    return <Landmark {...iconProps} />;
  };

  const currentLevel = ONTOLOGY_LEVELS.find(l => l.level === expandedLevel);

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div>
            <h1 className="text-2xl font-bold text-accent-cyan mb-1 flex items-center gap-2">
              <Landmark size={28} />
              4-Level Economic Ontology
            </h1>
            <p className="text-sm text-text-secondary">
              The foundational framework of Nexus-Alpha: Systematic analysis of how macro variables cascade through sectors to companies and individual assets
            </p>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - 20% */}
          <div className="w-[20%] min-w-[240px] border-r border-border-primary bg-[#0A0A0C] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Quick Stats */}
              <Card className="text-xs">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 size={14} className="text-accent-cyan" />
                  Ontology Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Levels:</span>
                    <span className="font-semibold text-accent-cyan">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Categories:</span>
                    <span className="font-semibold text-text-primary">
                      {ONTOLOGY_LEVELS.reduce((sum, level) => sum + level.elements.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Current Level:</span>
                    <span className="font-semibold text-accent-magenta">{expandedLevel}</span>
                  </div>
                </div>
              </Card>

              {/* Level Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-text-tertiary mb-2 px-2">LEVELS</h3>
                <div className="space-y-1">
                  {ONTOLOGY_LEVELS.map((level) => (
                    <button
                      key={level.level}
                      onClick={() => setExpandedLevel(level.level)}
                      className={`w-full px-3 py-2.5 rounded-lg text-left transition-all text-xs ${
                        expandedLevel === level.level
                          ? 'bg-accent-cyan/10 border border-accent-cyan text-accent-cyan'
                          : 'bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {renderIcon(level.icon, 16)}
                        <span className="font-semibold">Level {level.level}</span>
                      </div>
                      <div className="text-xs opacity-80 pl-5">{level.name}</div>
                      <div className="text-xs opacity-60 pl-5 mt-1">
                        {level.elements.length} categories
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Level Elements */}
              <Card className="text-xs">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Package size={14} className="text-accent-emerald" />
                  Elements
                </h3>
                <div className="space-y-1">
                  {currentLevel?.elements.map((element, idx) => (
                    <button
                      key={idx}
                      onClick={() => setExpandedElement(expandedElement === element.name ? '' : element.name)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                        expandedElement === element.name
                          ? 'bg-accent-cyan/10 text-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      {element.name}
                    </button>
                  ))}
                </div>
              </Card>

              {/* How It Works */}
              <Card className="text-xs bg-accent-cyan/5 border-accent-cyan/20">
                <h3 className="font-semibold text-accent-cyan mb-2 flex items-center gap-2">
                  <Landmark size={14} />
                  Flow
                </h3>
                <div className="space-y-1 text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    <span>Macro Variables</span>
                  </div>
                  <div className="pl-4 text-text-tertiary">↓</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-emerald" />
                    <span>Sector Metrics</span>
                  </div>
                  <div className="pl-4 text-text-tertiary">↓</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-magenta" />
                    <span>Company Financials</span>
                  </div>
                  <div className="pl-4 text-text-tertiary">↓</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Individual Assets</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content - 80% */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Level Overview */}
            <Card className="mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-cyan/10 rounded-lg">
                  {renderIcon(currentLevel?.icon || 'globe', 32)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text-primary mb-2">
                    Level {currentLevel?.level}: {currentLevel?.name}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {currentLevel?.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Elements Grid */}
            <div className="grid grid-cols-1 gap-4">
              {currentLevel?.elements.map((element, idx) => {
                const isExpanded = expandedElement === element.name;

                return (
                  <Card key={idx}>
                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedElement(isExpanded ? '' : element.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-text-primary">
                              {element.name}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full">
                              {element.examples.length} examples
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {element.definition}
                          </p>
                        </div>
                        <button className="ml-4 p-2 hover:bg-background-secondary rounded-lg transition-colors">
                          {isExpanded ? (
                            <ChevronDown size={20} className="text-accent-cyan" />
                          ) : (
                            <ChevronRight size={20} className="text-text-tertiary" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border-primary space-y-4">
                          {/* Examples */}
                          <div>
                            <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                              <TrendingUp size={16} className="text-accent-cyan" />
                              Key Examples
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {element.examples.map((example, i) => (
                                <div
                                  key={i}
                                  className="text-xs px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-secondary"
                                >
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Equations */}
                          {element.equations && element.equations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                                <BarChart3 size={16} className="text-accent-cyan" />
                                Key Formulas
                              </h4>
                              <div className="space-y-2">
                                {element.equations.map((equation, i) => (
                                  <div
                                    key={i}
                                    className="text-sm px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-accent-cyan font-mono"
                                  >
                                    {equation}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Bottom Info Card */}
            <Card className="mt-6 bg-accent-cyan/5 border-accent-cyan/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent-cyan/10 rounded-lg">
                  <Landmark size={20} className="text-accent-cyan" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    How the Ontology Works
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    The 4-Level Ontology provides a hierarchical framework for understanding market dynamics.
                    <span className="text-accent-cyan font-medium"> Level 1 macro variables</span> (interest rates, inflation) flow down to affect
                    <span className="text-accent-cyan font-medium"> Level 2 sector metrics</span> (banking NIM, tech user growth), which influence
                    <span className="text-accent-cyan font-medium"> Level 3 company financials</span> (ROE, P/E ratios), ultimately impacting
                    <span className="text-accent-cyan font-medium"> Level 4 individual assets</span> (specific loans, properties, products).
                    This systematic approach enables comprehensive analysis and prediction of market movements.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
