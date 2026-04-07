"use client";

import React, { useEffect, useState } from 'react';
import { Leaf, ArrowLeft, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardFooter } from '@/components/dashboard-footer';

interface Article {
  title: string;
  url: string;
  published: string;
  tickers: string[];
}

export default function IntelligencePage() {
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
          <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#414844] hover:text-[#012d1d] flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Observatory
          </Link>
          <h2 className="text-3xl font-bold tracking-tighter text-[#012d1d]">Full Intelligence Inventory</h2>
          <p className="text-xs text-[#414844] uppercase tracking-widest mt-1 italic">Comprehensive archive of all detected disruptions.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#c1c8c2] pb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#012d1d] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#3e6a00]" />
            All Disruptions
          </h3>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 bg-white border border-[#c1c8c2] rounded-sm hover:border-[#3e6a00] transition-colors cursor-pointer group h-full flex flex-col"
              >
                <div className="flex-grow">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#414844] mb-2">
                    {article.published ? new Date(article.published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </p>
                  <h4 className="text-lg font-bold text-[#012d1d] group-hover:text-[#3e6a00] transition-colors mb-4 line-clamp-3">
                    {article.title}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 mt-auto border-t border-[#f3f4f1]">
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
            ))}
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
}
