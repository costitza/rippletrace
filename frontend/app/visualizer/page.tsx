"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Maximize2, Layers, Info, Share2, Download, Database, Loader2, Network, ArrowRight, Tag } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function VisualizerPage() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [loadingTickers, setLoadingTickers] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);

  useEffect(() => {
    async function fetchTickers() {
      try {
        const response = await fetch('/api/tickers');
        const data = await response.json();
        setTickers(data.tickers || []);
      } catch (error) {
        console.error('Error fetching tickers:', error);
      } finally {
        setLoadingTickers(false);
      }
    }
    fetchTickers();
  }, []);

  const handleTickerClick = async (ticker: string) => {
    setSelectedTicker(ticker);
    setLoadingGraph(true);
    setCompanyInfo(null);
    try {
      const [graphRes, detailRes] = await Promise.all([
        fetch(`/api/graph/${ticker}`),
        fetch(`/api/company/details/${ticker}`)
      ]);

      const [gData, dData] = await Promise.all([
        graphRes.json(),
        detailRes.ok ? detailRes.json() : Promise.resolve(null)
      ]);

      setGraphData(gData);
      setCompanyInfo(dData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingGraph(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">GraphRAG Visualizer</h2>
            <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">Mapping semantic relationships through {graphData.nodes.length || '...'} active nodes.</p>
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
          <div className="lg:col-span-3 bg-white border border-[#c1c8c2] rounded-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="px-3 py-1 bg-[#012d1d] text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3e6a00] animate-pulse"></div>
                Live Projection
              </div>
            </div>

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
                     linkDirectionalArrowLength={3.5}
                     linkDirectionalArrowRelPos={1}
                     linkCurvature={0.25}
                     linkColor={() => '#414844'}
                     linkWidth={1.5}
                     nodeCanvasObject={(node: any, ctx, globalScale) => {
                       const label = node.id;
                       const fontSize = 12 / globalScale;
                       ctx.font = `${fontSize}px Arial`;
                       const textWidth = ctx.measureText(label).width;
                       const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                       ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                       ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0] as number, bckgDimensions[1] as number);

                       ctx.textAlign = 'center';
                       ctx.textBaseline = 'middle';
                       ctx.fillStyle = node.color;
                       ctx.fillText(label, node.x, node.y);
                       
                       node.__bckgDimensions = bckgDimensions;
                     }}
                     linkCanvasObjectMode={() => 'after'}
                     linkCanvasObject={(link: any, ctx, globalScale) => {
                       const MAX_FONT_SIZE = 4;
                       const LABEL_NODE_MARGIN = 4;
                       const fontSize = Math.min(MAX_FONT_SIZE, 12 / globalScale);
                       
                       const start = link.source;
                       const end = link.target;
                       
                       if (typeof start !== 'object' || typeof end !== 'object') return;
                       
                       const textPos = {
                         x: start.x + (end.x - start.x) * 0.5,
                         y: start.y + (end.y - start.y) * 0.5
                       };
                       
                       const relSize = link.type;
                       ctx.font = `${fontSize}px Arial`;
                       ctx.fillStyle = '#3e6a00';
                       ctx.fillText(relSize, textPos.x, textPos.y);
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
            <div className="p-6 bg-white border border-[#c1c8c2] rounded-sm flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-6 pr-2">
                {tickers.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => handleTickerClick(ticker)}
                      className={`w-full text-left px-4 py-3 border rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                        selectedTicker === ticker
                          ? 'bg-[#012d1d] text-white border-[#012d1d]'
                          : 'bg-[#f3f4f1] text-[#414844] border-[#c1c8c2] hover:bg-[#e2e3e0]'
                      }`}
                    >
                      {ticker}
                    </button>
                  ))
                }
              </div>

              {selectedTicker && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#717973] border-b border-[#f3f4f1] pb-2">All Connections</h5>
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin">
                       {graphData.links.map((link, i) => {
                           const srcId = typeof link.source === 'object' ? link.source.id : link.source;
                           const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
                           const srcNode = graphData.nodes.find(n => n.id === srcId);
                           const tgtNode = graphData.nodes.find(n => n.id === tgtId);
                           
                           return (
                             <div key={i} className="p-3 bg-white border border-[#c1c8c2] rounded-sm flex flex-col gap-1 shadow-sm">
                               <div className="flex justify-between items-center">
                                 <div className="flex flex-col">
                                   <span className="text-[6px] uppercase text-[#717973] font-bold">{srcNode?.label}</span>
                                   <span className="text-[9px] font-bold text-[#012d1d]">{srcId}</span>
                                 </div>
                                 <div className="flex flex-col items-center px-2">
                                    <span className="text-[6px] font-bold text-[#3e6a00] bg-[#f3f4f1] px-1 rounded-sm">{link.type}</span>
                                    <ArrowRight className="w-2 h-2 text-[#c1c8c2]" />
                                 </div>
                                 <div className="flex flex-col text-right">
                                   <span className="text-[6px] uppercase text-[#717973] font-bold">{tgtNode?.label}</span>
                                   <span className="text-[9px] font-bold text-[#012d1d]">{tgtId}</span>
                                 </div>
                               </div>
                             </div>
                           );
                         })
                       }
                    </div>
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
