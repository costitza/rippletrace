"use client";

import React from 'react';
import { Leaf, ArrowUpRight, ArrowRight, Zap, Info } from 'lucide-react';

export default function DashboardPage() {
  const newsShocks = [
    {
      date: "July 24, 2024",
      title: "PORT CONGESTION IN NINGBO-ZHOUSHAN AFFECTING SEMICONDUCTOR FLOW",
      tickers: ["TSM", "INTC"]
    },
    {
      date: "July 23, 2024",
      title: "ALTERNATIVE LITHIUM SOURCE DISCOVERED IN SALTON SEA NODES",
      tickers: ["TSLA", "ALB"]
    },
    {
      date: "July 22, 2024",
      title: "EU CARBON TAX ADJUSTMENT PHASE ENTERING SECONDARY STAGE",
      tickers: ["VWAGY"]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">Conservatory Intel / 024</h2>
          <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">Real-time dependency mapping active.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#414844] font-bold uppercase tracking-widest mb-1">Last Sync</p>
          <p className="text-xs font-bold text-[#012d1d]">14:32:01 UTC</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Score Card */}
        <div className="lg:col-span-1 p-8 bg-white border border-[#c1c8c2] rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Leaf className="w-24 h-24 text-[#3e6a00]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="w-5 h-5 text-[#3e6a00]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#414844]">Portfolio Risk Score</h3>
            </div>
            
            <div className="mb-8">
              <span className="text-7xl font-bold text-[#012d1d]">82</span>
              <span className="text-sm font-bold text-[#3e6a00] uppercase tracking-widest ml-4">Stable Canopy</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#f3f4f1]">
              <div>
                <p className="text-[10px] uppercase text-[#414844] font-bold tracking-widest mb-1">Variance</p>
                <p className="text-xl font-bold text-[#012d1d]">12.4%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#414844] font-bold tracking-widest mb-1">Volatility</p>
                <p className="text-xl font-bold text-[#3e6a00]">Low</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breaking News Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-[#c1c8c2] pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#012d1d] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3e6a00]" />
              Breaking Supply Chain Shocks
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#414844] hover:text-[#012d1d] flex items-center gap-2 transition-colors">
              View All Intelligence <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {newsShocks.map((shock, index) => (
              <div key={index} className="p-6 bg-white border border-[#c1c8c2] rounded-sm hover:border-[#3e6a00] transition-colors cursor-pointer group">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#414844] mb-2">{shock.date}</p>
                <h4 className="text-lg font-bold text-[#012d1d] group-hover:text-[#3e6a00] transition-colors mb-4">{shock.title}</h4>
                <div className="flex gap-2">
                  {shock.tickers.map((ticker) => (
                    <span key={ticker} className="px-2 py-1 bg-[#f3f4f1] border border-[#c1c8c2] text-[10px] font-bold text-[#414844] uppercase tracking-widest">
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <footer className="pt-12 border-t border-[#c1c8c2] flex flex-col md:flex-row justify-between items-center gap-4 text-[#414844]">
         <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
           <span>Protocol 7.21</span>
           <span className="text-[#c1c8c2]">|</span>
           <span>Lat: 34.0522 N Long: 118.2437 W</span>
         </div>
         <p className="text-[10px] uppercase tracking-widest">
           © 2024 RippleTrace Labs // <span className="text-[#012d1d]">Securing the Digital Conservatory</span>
         </p>
      </footer>
    </div>
  );
}
