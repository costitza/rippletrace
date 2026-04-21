"use client";

import React, { useState, useEffect } from 'react';
import { Database, Loader2, Building2, ArrowRight } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface Company {
  id: string;
  name: string;
}

export default function VisualizerPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    }
    fetchCompanies();
  }, []);

  const handleCompanyClick = async (company: Company) => {
    setSelectedCompanyId(company.id);
    setLoadingGraph(true);
    setGraphData({ nodes: [], links: [] }); // Clear previous
    try {
      const response = await fetch(`/api/graph/${encodeURIComponent(company.id)}`);
      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoadingGraph(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">Direct Relationship Map</h2>
            <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">
               Inspecting {graphData.links.length} primary connections for selected entity.
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          <div className="lg:col-span-3 bg-white border border-[#c1c8c2] rounded-sm relative overflow-hidden flex flex-col">
            <div className="flex-1 bg-[#f9faf6] relative">
               {loadingGraph ? (
                 <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
                   <Loader2 className="w-10 h-10 text-[#012d1d] animate-spin" />
                 </div>
               ) : null}
               
               {graphData.nodes.length > 0 ? (
                 <div className="w-full h-full">
                   <ForceGraph2D
                     graphData={graphData}
                     nodeLabel={(node: any) => `${node.label}: ${node.id}`}
                     nodeAutoColorBy="label"
                     linkDirectionalArrowLength={6}
                     linkDirectionalArrowRelPos={1}
                     linkDirectionalParticles={2}
                     linkDirectionalParticleSpeed={0.005}
                     linkColor={() => '#012d1d'}
                     linkWidth={2}
                     nodeCanvasObject={(node: any, ctx, globalScale) => {
                       const label = node.id;
                       const fontSize = 12 / globalScale;
                       ctx.font = `${fontSize}px Arial`;
                       const textWidth = ctx.measureText(label).width;
                       const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

                       ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                       ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0] as number, bckgDimensions[1] as number);

                       ctx.textAlign = 'center';
                       ctx.textBaseline = 'middle';
                       ctx.fillStyle = node.color;
                       ctx.fillText(label, node.x, node.y);
                     }}
                   />
                 </div>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="w-16 h-16 text-[#c1c8c2] opacity-20" />
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
            <div className="p-6 bg-white border border-[#c1c8c2] rounded-sm flex-1 overflow-hidden flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-4 h-4 text-[#012d1d]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#012d1d]">Inspected Entity</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-6 pr-2 scrollbar-thin">
                {loadingCompanies ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#c1c8c2]" />
                ) : (
                  companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanyClick(company)}
                      className={`w-full text-left px-4 py-3 border rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
                        selectedCompanyId === company.id
                          ? 'bg-[#012d1d] text-white border-[#012d1d]'
                          : 'bg-[#f3f4f1] text-[#414844] border-[#c1c8c2] hover:bg-[#e2e3e0]'
                      }`}
                    >
                      {company.name}
                    </button>
                  ))
                )}
              </div>

              {selectedCompanyId && (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#717973] border-b border-[#f3f4f1] pb-2">Direct Links</h5>
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
                    {graphData.links.map((link, i) => {
                      // Safety for react-force-graph mutated IDs
                      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
                      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
                      
                      return (
                        <div key={i} className="p-2 bg-[#f9faf6] border border-[#c1c8c2] rounded-sm flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[7px] text-[#3e6a00] font-bold uppercase">
                             <span>{link.type}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                             <span className="text-[9px] font-bold text-[#012d1d] truncate">{srcId}</span>
                             <ArrowRight className="w-2 h-2 text-[#c1c8c2]" />
                             <span className="text-[9px] font-bold text-[#012d1d] truncate text-right">{tgtId}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
