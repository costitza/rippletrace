"use client";

import React, { useEffect, useState } from 'react';
import { Leaf, ArrowRight, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Article {
  title: string;
  url: string;
  published: string;
  tickers: string[];
}

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">Conservatory Intel / 024</h2>
          <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">Real-time dependency mapping active.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#414844] font-bold uppercase tracking-widest mb-1">Last Sync</p>
          <p className="text-xs font-bold text-[#012d1d]">{new Date().toLocaleTimeString()} UTC</p>
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
            <Link href="/dashboard/intelligence" className="text-[10px] font-bold uppercase tracking-widest text-[#414844] hover:text-[#012d1d] flex items-center gap-2 transition-colors">
              View All Intelligence <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#717973]">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="text-xs font-bold uppercase tracking-widest">Parsing Knowledge Graph...</span>
              </div>
            ) : error ? (
              <div className="p-6 border border-red-200 bg-red-50 text-red-600 rounded-sm text-xs font-bold uppercase tracking-widest">
                Error: {error}
              </div>
            ) : articles.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-[#c1c8c2] text-[#717973]">
                <p className="text-xs font-bold uppercase tracking-widest">No active disruptions detected in the current cycle.</p>
              </div>
            ) : (
              articles.slice(0, 5).map((article, index) => (
                <a 
                  key={index} 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-6 bg-white border border-[#c1c8c2] rounded-sm hover:border-[#3e6a00] transition-colors cursor-pointer group"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#414844] mb-2">
                    {article.published ? new Date(article.published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </p>
                  <h4 className="text-lg font-bold text-[#012d1d] group-hover:text-[#3e6a00] transition-colors mb-4 line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tickers && article.tickers.length > 0 ? (
                      article.tickers.map((ticker) => (
                        <span key={ticker} className="px-2 py-1 bg-[#f3f4f1] border border-[#c1c8c2] text-[10px] font-bold text-[#414844] uppercase tracking-widest">
                          {ticker}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-[#f3f4f1] border border-[#c1c8c2] text-[10px] font-bold text-[#717973] uppercase tracking-widest italic opacity-50">
                        Analyzing Entities...
                      </span>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

import { DashboardFooter } from '@/components/dashboard-footer';

export default function DashboardPage() {
  // ... rest of component
  return (
    <div className="space-y-12">
      {/* existing content */}
      <DashboardFooter />
    </div>
  );
}
    </div>
  );
}
