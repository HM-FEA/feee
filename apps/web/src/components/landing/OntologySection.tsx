"use client";

import React from 'react';
import { Layers, Building, Globe, Package } from 'lucide-react';

const ontologyLevels = [
  { icon: <Globe className="w-10 h-10 text-cyan-300" />, title: "Level 1: Macro", description: "Global factors like interest rates and inflation." },
  { icon: <Building className="w-10 h-10 text-fuchsia-300" />, title: "Level 2: Sector", description: "Industry-specific metrics and sensitivities." },
  { icon: <Layers className="w-10 h-10 text-lime-300" />, title: "Level 3: Company", description: "Individual company financials and ratios." },
  { icon: <Package className="w-10 h-10 text-amber-300" />, title: "Level 4: Asset", description: "The finest grain of detail, like loans and products." }
];

export default function OntologySection() {
    return (
        <section className="scroll-section flex items-center justify-center bg-black">
            <div className="text-center max-w-5xl mx-auto p-8">
                <h2 className="text-5xl font-bold text-white/90 mb-4">The 4-Level Ontology</h2>
                <p className="text-lg text-white/60 mb-12">Everything is connected. Our platform models the economy from the macro level down to individual assets.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {ontologyLevels.map((level, index) => (
                        <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg">
                            <div className="mb-4">{level.icon}</div>
                            <h3 className="text-xl font-semibold text-white/80 mb-2">{level.title}</h3>
                            <p className="text-white/60 text-sm">{level.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}