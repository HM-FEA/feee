'use client';

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Landmark, ArrowRight, Settings, BarChart3, AlertTriangle, TrendingUp, Banknote } from 'lucide-react';

// Mock data for now
const mockData = {
  company_name: 'Sample Bank',
  loans: [] as Array<{ borrower_id: string; status: string; }>
};

export default function CircuitDiagramPage() {
  const params = useParams();
  const companyId = params.id;
  const data = mockData;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 text-accent-cyan">
              <Landmark /> {data.company_name} - Circuit Diagram
            </h1>
            <p className="text-sm text-text-secondary">Visualize financial structure and risk exposure</p>
          </div>
          <Link
            href={`/company/${companyId}/analyst-report`}
            className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all flex items-center gap-2 text-sm"
          >
            <BarChart3 size={16}/> Analysis Report
          </Link>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Rate Scenario Selector */}

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className={`bg-background-secondary border-2 border-accent-cyan rounded-lg p-6 text-center`}>
            <Banknote size={32} className="mx-auto mb-2 text-accent-cyan"/>
            <div className="text-sm text-text-secondary mb-2">Deposits</div>
            {/* Placeholder content */}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight size={32} className="text-gray-600"/>
          </div>

          <div className="bg-background-secondary border-2 border-accent-magenta rounded-lg p-6 text-center">
            <Settings size={32} className="mx-auto mb-2 text-accent-magenta"/>
            <div className="text-sm text-text-secondary mb-2">NIM Calculation</div>
            {/* Placeholder content */}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight size={32} className="text-gray-600"/>
          </div>

          <div className="bg-background-secondary border-2 border-accent-cyan rounded-lg p-6 text-center">
            <BarChart3 size={32} className="mx-auto mb-2 text-accent-cyan"/>
            <div className="text-sm text-text-secondary mb-2">Loans</div>
            {/* Placeholder content */}
          </div>
        </div>

        <div className="bg-background-secondary border border-border-primary rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-text-primary">Loan Portfolio Details</h2>
          <div className="space-y-4">
            {data.loans?.map((loan) => {
              return (
                <div key={loan.borrower_id}>
                  {/* Loan details */}
                  {loan.status === "RISK" && (
                    <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12}/> Default Risk
                    </div>
                  )}
                </div>
              );
            })}
            {(!data.loans || data.loans.length === 0) && (
              <div className="text-center py-8 text-text-secondary text-sm">
                No loan data available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
              <TrendingUp className="text-accent-cyan"/> Net Income (NI) Changes
            </h3>
            <div className="text-center py-8 text-text-secondary text-sm">
              Chart placeholder
            </div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
              <AlertTriangle className="text-status-danger"/> Portfolio Risk Level
            </h3>
            <div className="text-center py-8 text-text-secondary text-sm">
              Risk metrics placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
