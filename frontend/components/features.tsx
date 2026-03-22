"use client";

import React from 'react';
import Link from 'next/link';
import { Network, Shield, Leaf, ArrowRight } from 'lucide-react';

export function Features() {
  return (
    <section className="bg-[#f3f4f1] py-24 font-mono">
      <div className="px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-xl border border-[#c1c8c2] hover:shadow-lg transition-shadow">
          <Network className="w-8 h-8 text-[#012d1d] mb-6" />
          <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">graphrag synthesis</h3>
          <p className="text-[#414844] text-sm leading-relaxed mb-6">Our engine cross-references thousands of SEC filings with real-time port telemetry to build a living graph of enterprise vulnerability.</p>
          <Link href="#" className="text-[#012d1d] font-bold text-xs flex items-center gap-2 hover:underline">
            View Architecture <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="p-8 bg-white rounded-xl border border-[#c1c8c2] hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <Shield className="w-8 h-8 text-[#3e6a00]" />
            <span className="text-2xl font-bold text-[#3e6a00]">12.4k</span>
          </div>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">sec risk modeling</h3>
          <p className="text-[#414844] text-sm leading-relaxed">Extracting latent risks from regulatory language through semantic clustering and sentiment drift detection.</p>
        </div>
        
        <div className="p-8 bg-white rounded-xl border border-[#c1c8c2] hover:shadow-lg transition-shadow">
          <Leaf className="w-8 h-8 text-[#401b1b] mb-6" />
          <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">organic scalability</h3>
          <p className="text-[#414844] text-sm leading-relaxed">System infrastructure that breathes with your data volume, ensuring zero latency during peak volatility events.</p>
        </div>
      </div>
    </section>
  );
}
