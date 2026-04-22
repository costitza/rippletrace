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
        
        let rawCompanies = data.companies || [];
        
        // Safety: If backend returns strings instead of objects, normalize them
        if (rawCompanies.length > 0 && typeof rawCompanies[0] === 'string') {
          rawCompanies = rawCompanies.map((name: string) => ({ id: name, name: name }));
        }

        // DEDUPLICATION LOGIC:
        // Use a Map to ensure we only keep one company per unique ID
        const uniqueCompanies = Array.from(
          new Map(rawCompanies.map((c: Company) => [c.id, c])).values()
        ) as Company[];

        setCompanies(uniqueCompanies);
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
      
      // ==========================================
      // DEBUGGING DIAGNOSTICS
      // ==========================================
      console.log("🟢 RAW API NODES:", data.nodes);
      console.log("🔵 RAW API LINKS:", data.links);
      
      // Create a quick lookup array of all node IDs
      const allNodeIds = data.nodes.map((n: any) => n.id);
      
      // Check every link to see if it points to a ghost node
      let brokenLinks = 0;
      data.links.forEach((link: any, index: number) => {
        const sourceExists = allNodeIds.includes(link.source);
        const targetExists = allNodeIds.includes(link.target);
        
        if (!sourceExists || !targetExists) {
          brokenLinks++;
          console.warn(
            `❌ BROKEN LINK at index ${index}:\n`,
            `Source: '${link.source}' (Exists: ${sourceExists})\n`,
            `Target: '${link.target}' (Exists: ${targetExists})\n`,
            `Link Type: ${link.type}`
          );
        }
      });
      
      if (brokenLinks === 0 && data.links.length > 0) {
        console.log("✅ All links successfully match to existing node IDs.");
      }
      // ==========================================

      setGraphData(data);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    } finally {
      setLoadingGraph(false);
    }
  };

  const safeGraphData = React.useMemo(() => {
    return {
      nodes: graphData.nodes.map(n => ({ ...n })),
      links: graphData.links.map(l => ({
        ...l,
        // If the graph already mutated it into an object, extract the string ID back out
        source: typeof l.source === 'object' ? l.source.id : l.source,
        target: typeof l.target === 'object' ? l.target.id : l.target
      }))
    };
  }, [graphData]);

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
                    graphData={safeGraphData}
                    // 1. Explicitly tell the engine what the primary key is
                    nodeId="id" 
                    
                    /// Clean Tooltips
                    nodeLabel={(node: any) => {
                      const name = node.properties?.name || node.id;
                      return `<div style="background: #012d1d; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-family: sans-serif;">
                                <strong>${node.label || 'Entity'}</strong>: ${name}
                              </div>`;
                    }}
                    
                    // Clean Nodes
                    nodeAutoColorBy="label"
                    nodeRelSize={6}
                    
                    // Link Visibility Rules
                    linkColor={() => '#9ca3af'} // Neutral visible gray
                    linkWidth={1.5}
                    linkDirectionalArrowLength={4}
                    linkDirectionalArrowRelPos={1}
                    
                    // Optional: Adds moving particles to the links so you can see the direction of the supply chain!
                    linkDirectionalParticles={2}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleWidth={2}
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
