"use client";

import React from 'react';
import { Search, Filter, Maximize2, Layers, Info, Share2, Download, Database } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';

export default function VisualizerPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">GraphRAG Visualizer</h2>
            <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">Mapping semantic relationships through 12.4k active nodes.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717973]" />
              <input 
                type="text" 
                placeholder="Search entities (e.g. TSMC)..." 
                className="pl-10 pr-4 py-2 bg-white border border-[#c1c8c2] rounded-sm text-xs font-bold focus:outline-none focus:border-[#3e6a00] w-64"
              />
            </div>
            <button className="p-2 bg-white border border-[#c1c8c2] rounded-sm text-[#414844] hover:bg-[#f3f4f1] transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-3 bg-white border border-[#c1c8c2] rounded-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="px-3 py-1 bg-[#012d1d] text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3e6a00] animate-pulse"></div>
                Live Projection
              </div>
              <div className="px-3 py-1 bg-white/80 backdrop-blur border border-[#c1c8c2] text-[#414844] text-[10px] font-bold uppercase tracking-widest rounded-full">
                3D View
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button className="p-2 bg-white/80 backdrop-blur border border-[#c1c8c2] rounded-sm text-[#414844] hover:bg-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/80 backdrop-blur border border-[#c1c8c2] rounded-sm text-[#414844] hover:bg-white transition-colors">
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Placeholder for Graph Visualization (e.g. react-force-graph) */}
            <div className="flex-1 bg-[#f9faf6] relative">
               <div className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#c1c8c2 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <Database className="w-16 h-16 text-[#c1c8c2] mx-auto mb-4 animate-bounce" />
                    <p className="text-xs font-bold uppercase tracking-widest text-[#717973]">Initializing GraphRAG Projection Engine...</p>
                 </div>
               </div>
            </div>

            <div className="p-4 border-t border-[#c1c8c2] bg-white flex justify-between items-center">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#012d1d]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#414844]">Company</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3e6a00]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#414844]">Facility</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#414844]">Disruption</span>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#717973]">
                Nodes: 12,402 // Edges: 48,912
              </div>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
            <div className="p-6 bg-white border border-[#c1c8c2] rounded-sm flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-[#012d1d]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#012d1d]">Knowledge Graph Analysis</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-[#f3f4f1] rounded-sm border border-[#c1c8c2]">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#3e6a00] mb-1">Path Highlight</p>
                   <h4 className="text-sm font-bold text-[#012d1d] mb-3 uppercase">TSMC Supply Cascade</h4>
                   <p className="text-xs text-[#414844] leading-relaxed italic">
                     "Identified 4 secondary dependencies between TSMC Hsinchu and Port of Long Beach under high-volatility conditions."
                   </p>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#717973] border-b border-[#f3f4f1] pb-2">Node Metadata</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#414844] uppercase tracking-widest">Entity Name</span>
                      <span className="text-[10px] font-bold text-[#012d1d] uppercase">Taiwan Semiconductor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#414844] uppercase tracking-widest">Type</span>
                      <span className="text-[10px] font-bold text-[#012d1d] uppercase">Organization (Public)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#414844] uppercase tracking-widest">Centrality</span>
                      <span className="text-[10px] font-bold text-[#3e6a00] uppercase">High (0.94)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f3f4f1] flex gap-2">
                  <button className="flex-1 py-2 bg-[#012d1d] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <Share2 className="w-3 h-3" /> Export Path
                  </button>
                  <button className="p-2 bg-white border border-[#c1c8c2] rounded-sm text-[#414844] hover:bg-[#f3f4f1] transition-colors">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#012d1d] text-white rounded-sm">
               <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Layers className="w-4 h-4 text-[#3e6a00]" />
                 Inference Layers
               </h3>
               <p className="text-xs text-[#86af99] leading-relaxed font-bold">
                 Activating semantic clustering on SEC filing data to reveal hidden trade corridors.
               </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
