'use client';

import React, { use, useState } from 'react';
import { useParams } from 'next/navigation';
import { ALL_COMPANIES } from '@/data/companies';
import type { Company } from '@/data/companies';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, PieChart, Calculator } from 'lucide-react';
import Link from 'next/link';

// Import financial libraries (consolidated under /lib/finance)
import { calculateCAPM, calculateBeta, calculateCostOfEquity } from '@/lib/finance/capm';
import { calculateDCF, calculateWACC } from '@/lib/finance/dcf';
import { bondPrice, yieldToMaturity, macaulayDuration } from '@/lib/finance/fixedIncome';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const company = ALL_COMPANIES.find(c => c.id === companyId);
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'bonds'>('overview');

  if (!company) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Company Not Found</h1>
          <p className="text-text-secondary mb-4">ID: {companyId}</p>
          <Link href="/" className="text-accent-cyan hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // CAPM Calculations
  const riskFreeRate = 0.04; // 4% risk-free rate
  const marketReturn = 0.10; // 10% market return
  const beta = calculateBeta({
    sector: company.sector,
    vix: 15, // Current VIX
  });
  const expectedReturn = calculateCAPM({
    riskFreeRate,
    beta,
    marketReturn,
  });
  const costOfEquity = calculateCostOfEquity({
    riskFreeRate,
    beta,
    marketReturn,
  });

  // DCF Calculations
  const wacc = calculateWACC({
    equity: company.financials.equity,
    debt: company.financials.total_debt,
    costOfEquity,
    costOfDebt: 0.05, // 5% cost of debt
    taxRate: 0.21, // 21% corporate tax
  });

  const dcfValuation = calculateDCF({
    freeCashFlows: [
      company.financials.net_income * 1.1,
      company.financials.net_income * 1.15,
      company.financials.net_income * 1.20,
      company.financials.net_income * 1.22,
      company.financials.net_income * 1.25,
    ],
    wacc,
    terminalGrowthRate: 0.025, // 2.5% terminal growth
  });

  // Fixed Income (for Banking sector)
  const bondData = company.sector === 'BANKING' && company.sector_metrics?.nim ? {
    price: bondPrice({
      faceValue: 1000,
      couponRate: company.sector_metrics.nim / 100,
      yield: 0.05,
      years: 10,
      frequency: 2,
    }),
    duration: macaulayDuration({
      faceValue: 1000,
      couponRate: company.sector_metrics.nim / 100,
      yield: 0.05,
      years: 10,
      frequency: 2,
    }),
  } : null;

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {company.name} ({company.ticker})
              </h1>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded">
                  {company.sector}
                </span>
                <span>{company.country}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-accent-emerald">
                ${(company.financials.revenue / 1000).toFixed(1)}B
              </div>
              <div className="text-sm text-text-secondary">Annual Revenue</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border-primary">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-accent-cyan border-b-2 border-accent-cyan'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('valuation')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'valuation'
                ? 'text-accent-cyan border-b-2 border-accent-cyan'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Valuation (DCF + CAPM)
          </button>
          {company.sector === 'BANKING' && (
            <button
              onClick={() => setActiveTab('bonds')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'bonds'
                  ? 'text-accent-cyan border-b-2 border-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Fixed Income
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Summary */}
            <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-cyan" />
                Financial Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Revenue</span>
                  <span className="text-text-primary font-medium">
                    ${(company.financials.revenue / 1000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Net Income</span>
                  <span className="text-accent-emerald font-medium">
                    ${(company.financials.net_income / 1000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Assets</span>
                  <span className="text-text-primary font-medium">
                    ${(company.financials.total_assets / 1000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Debt</span>
                  <span className="text-accent-magenta font-medium">
                    ${(company.financials.total_debt / 1000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Equity</span>
                  <span className="text-text-primary font-medium">
                    ${(company.financials.equity / 1000).toFixed(2)}B
                  </span>
                </div>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-cyan" />
                Key Ratios
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Interest Coverage Ratio</span>
                  <span className="text-text-primary font-medium">{company.ratios.icr.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Debt-to-Equity</span>
                  <span className="text-text-primary font-medium">{company.ratios.de_ratio.toFixed(2)}</span>
                </div>
                {company.ratios.roe && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">ROE</span>
                    <span className="text-accent-emerald font-medium">{company.ratios.roe.toFixed(1)}%</span>
                  </div>
                )}
                {company.ratios.roa && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">ROA</span>
                    <span className="text-accent-emerald font-medium">{company.ratios.roa.toFixed(2)}%</span>
                  </div>
                )}
                {company.ratios.pe_ratio && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">P/E Ratio</span>
                    <span className="text-text-primary font-medium">{company.ratios.pe_ratio.toFixed(1)}x</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div className="space-y-6">
            {/* CAPM Analysis */}
            <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-cyan" />
                CAPM Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-text-secondary mb-1">Beta (β)</div>
                  <div className="text-2xl font-bold text-text-primary">{beta.toFixed(2)}</div>
                  <div className="text-xs text-text-tertiary mt-1">Sector-adjusted</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Expected Return</div>
                  <div className="text-2xl font-bold text-accent-emerald">{(expectedReturn * 100).toFixed(2)}%</div>
                  <div className="text-xs text-text-tertiary mt-1">E(Ri) = Rf + β(Rm - Rf)</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Cost of Equity</div>
                  <div className="text-2xl font-bold text-accent-cyan">{(costOfEquity * 100).toFixed(2)}%</div>
                  <div className="text-xs text-text-tertiary mt-1">Used in DCF valuation</div>
                </div>
              </div>
            </div>

            {/* DCF Valuation */}
            <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent-cyan" />
                DCF Valuation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-text-secondary mb-1">WACC</div>
                  <div className="text-2xl font-bold text-text-primary">{(wacc * 100).toFixed(2)}%</div>
                  <div className="text-xs text-text-tertiary mt-1">Weighted avg cost of capital</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Enterprise Value</div>
                  <div className="text-2xl font-bold text-accent-emerald">
                    ${(dcfValuation.enterpriseValue / 1000).toFixed(2)}B
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">NPV of cash flows</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Terminal Value</div>
                  <div className="text-2xl font-bold text-accent-cyan">
                    ${(dcfValuation.terminalValue / 1000).toFixed(2)}B
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">2.5% perpetual growth</div>
                </div>
              </div>

              <div className="text-sm text-text-tertiary">
                <strong>Formula:</strong> EV = Σ(FCF<sub>t</sub> / (1 + WACC)<sup>t</sup>) + Terminal Value
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bonds' && bondData && (
          <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent-cyan" />
              Fixed Income Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-text-secondary mb-1">Bond Price</div>
                <div className="text-2xl font-bold text-text-primary">${bondData.price.toFixed(2)}</div>
                <div className="text-xs text-text-tertiary mt-1">10-year bond, semi-annual payments</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Macaulay Duration</div>
                <div className="text-2xl font-bold text-accent-cyan">{bondData.duration.toFixed(2)} years</div>
                <div className="text-xs text-text-tertiary mt-1">Weighted average time to cash flows</div>
              </div>
            </div>

            {company.sector_metrics?.nim && (
              <div className="mt-6 p-4 bg-background-tertiary rounded border border-border-primary">
                <div className="text-sm text-text-secondary">Net Interest Margin (NIM)</div>
                <div className="text-xl font-bold text-accent-emerald">{company.sector_metrics.nim.toFixed(2)}%</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
