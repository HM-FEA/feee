'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_CONFIG, buildUrl, getSectorIcon, SIMULATION_CONFIG } from '@/lib';
import { Download, Cable, FileText, Search, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface AnalystReport {
  company_id: string;
  company_name: string;
  sector: string;
  executive_summary: string;
  current_situation: string;
  rate_impact_analysis: string;
  risk_assessment: string;
  recommendation: string;
  forecast: string;
}

export default function AnalystReportPage() {
  const params = useParams();
  const company_id = params.id as string;
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [oldRate, setOldRate] = useState(SIMULATION_CONFIG.interestRate.default);
  const [newRate, setNewRate] = useState(SIMULATION_CONFIG.interestRate.default + 0.5);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const url = buildUrl(API_CONFIG.endpoints.reports.analyst);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id,
          old_rate: oldRate / 100,
          new_rate: newRate / 100,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [company_id]);

  const getSectorColorClass = (sector: string) => {
    const mapping: Record<string, string> = {
      'BANKING': 'text-accent-cyan',
      'REALESTATE': 'text-accent-magenta',
      'MANUFACTURING': 'text-accent-magenta',
      'SEMICONDUCTOR': 'text-accent-amber',
      'OPTIONS': 'text-accent-emerald',
      'CRYPTO': 'text-accent-orange',
    };
    return mapping[sector] || 'text-accent-cyan';
  };

  const handleRateChange = () => {
    fetchReport();
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
================================================================================
                         NEXUS-ALPHA ANALYST REPORT
================================================================================

Company: ${report.company_name}
Sector: ${report.sector}
Generated: ${new Date().toLocaleDateString('en-US')}

================================================================================
Executive Summary
================================================================================
${report.executive_summary}

================================================================================
Current Situation Analysis
================================================================================
${report.current_situation}

================================================================================
Interest Rate Impact Analysis (${oldRate.toFixed(1)}% → ${newRate.toFixed(1)}%)
================================================================================
${report.rate_impact_analysis}

================================================================================
Risk Assessment
================================================================================
${report.risk_assessment}

================================================================================
Investment Recommendation
================================================================================
${report.recommendation}

================================================================================
Future Outlook
================================================================================
${report.forecast}

================================================================================
DISCLAIMER: This report is generated based on historical data and assumptions.
Actual performance may differ. Please seek professional advice before making
investment decisions.
================================================================================
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.company_name}_Analyst_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!report && !loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="text-center">
          <p className="text-red-400">Unable to load report.</p>
          <Link href="/rate-simulator" className="text-cyan-400 hover:underline mt-4 inline-block">
            ← Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              {report && (
                <>
                  <h1 className="text-3xl font-bold mb-2">
                    {getSectorIcon(report.sector as any)} {report.company_name} Analyst Report
                  </h1>
                  <p className={`text-sm ${getSectorColorClass(report.sector)}`}>
                    {getSectorIcon(report.sector as any)} {report.sector} Sector
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded hover:opacity-80 transition text-sm flex items-center gap-2"
              >
                <Download size={16} /> Download
              </button>
              <Link
                href={`/company/${company_id}/circuit-diagram`}
                className="px-4 py-2 bg-accent-magenta text-white font-semibold rounded hover:opacity-80 transition text-sm flex items-center gap-2"
              >
                <Cable size={16} /> Circuit Diagram
              </Link>
            </div>
          </div>

          {/* Rate Control */}
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4 mt-4">
            <div className="flex items-center gap-6">
              <div>
                <label className="text-xs text-text-secondary block mb-2">
                  Current Rate (%) [{SIMULATION_CONFIG.interestRate.min}-{SIMULATION_CONFIG.interestRate.max}%]
                </label>
                <input
                  type="number"
                  step={SIMULATION_CONFIG.interestRate.step}
                  min={SIMULATION_CONFIG.interestRate.min}
                  max={SIMULATION_CONFIG.interestRate.max}
                  value={oldRate}
                  onChange={(e) => setOldRate(parseFloat(e.target.value))}
                  className="bg-background-primary border border-border-primary rounded px-3 py-2 text-text-primary w-24 text-sm"
                />
              </div>
              <div className="text-2xl text-text-secondary">→</div>
              <div>
                <label className="text-xs text-text-secondary block mb-2">
                  New Rate (%) [{SIMULATION_CONFIG.interestRate.min}-{SIMULATION_CONFIG.interestRate.max}%]
                </label>
                <input
                  type="number"
                  step={SIMULATION_CONFIG.interestRate.step}
                  min={SIMULATION_CONFIG.interestRate.min}
                  max={SIMULATION_CONFIG.interestRate.max}
                  value={newRate}
                  onChange={(e) => setNewRate(parseFloat(e.target.value))}
                  className="bg-background-primary border border-border-primary rounded px-3 py-2 text-text-primary w-24 text-sm"
                />
              </div>
              <button
                onClick={handleRateChange}
                className="px-6 py-2 bg-accent-cyan text-black font-semibold rounded hover:opacity-80 transition text-sm mt-5"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-400">Generating report...</p>
        </div>
      ) : report ? (
        <div className="max-w-6xl mx-auto p-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-background-secondary to-border-primary border border-border-primary rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-accent-cyan flex items-center gap-2"><FileText size={24} />Executive Summary</h2>
            <p className="text-lg text-gray-200 leading-relaxed">{report.executive_summary}</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div>
              {/* Current Situation */}
              <div className="bg-background-secondary border border-border-primary rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-accent-cyan flex items-center gap-2"><Search size={20} />Current Situation</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {report.current_situation}
                </pre>
              </div>

              {/* Risk Assessment */}
              <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2"><AlertTriangle size={20} />Risk Assessment</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {report.risk_assessment}
                </pre>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Rate Impact Analysis */}
              <div className="bg-background-secondary border border-border-primary rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-accent-magenta flex items-center gap-2"><BarChart3 size={20} />Rate Impact Analysis</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {report.rate_impact_analysis}
                </pre>
              </div>

              {/* Recommendation */}
              <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2"><CheckCircle size={20} />Investment Recommendation</h3>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {report.recommendation}
                </pre>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2"><TrendingUp size={20} />Future Outlook (6 months)</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
              {report.forecast}
            </pre>
          </div>

          {/* Footer */}
          <div className="mt-8 p-6 bg-background-secondary border border-border-primary rounded-lg text-center text-xs text-gray-500">
            <p>This report is automatically generated based on historical data and assumptions.</p>
            <p>Actual performance may differ. Please seek professional advice before making investment decisions.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
