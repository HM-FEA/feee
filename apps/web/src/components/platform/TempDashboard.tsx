"use client";

import React, { useState } from 'react';
import { companies, Company } from '@/data/companies';

// This is a temporary, minimal component for debugging interactivity.
export default function TempDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Debugging Interactivity</h1>
      <p className="mb-8 text-lg text-yellow-400">If you can click the buttons below and see the title change, then the core state management is working.</p>
      
      <h2 className="text-3xl font-mono p-4 border border-dashed border-yellow-400">
        Selected Company: <span className="text-cyan-400">{selectedCompany.name} ({selectedCompany.ticker})</span>
      </h2>

      <div className="mt-8 space-y-2 max-w-sm">
        <h3 className="text-xl font-bold">Company List</h3>
        {companies.map(company => (
          <button 
            key={company.ticker} 
            onClick={() => setSelectedCompany(company)}
            className={`w-full p-3 rounded-lg text-left transition-all flex justify-between items-center ${
              selectedCompany.ticker === company.ticker
                ? 'bg-cyan-400/20'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span>{company.name}</span>
            <span className="text-xs text-gray-400">{company.ticker}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
