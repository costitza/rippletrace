"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CircleUser, 
  Bell, 
  Network, 
  Shield, 
  Leaf, 
  ArrowRight, 
  LayoutDashboard, 
  Activity 
} from 'lucide-react';
import { CompanyList } from "@/components/company-list";

const RippleTraceLanding = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://localhost:8000/api/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf6] text-[#1a1c1a] font-mono selection:bg-[#c1ecd4]">
      {/* Header */}
      <header className="border-b border-[#c1c8c2] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#f9faf6]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tighter text-[#012d1d]">RippleTrace</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:text-[#012d1d] transition-colors">Main Dashboard</Link>
            <Link href="#" className="text-sm font-medium hover:text-[#012d1d] transition-colors">GraphRAG Visualizer</Link>
            <Link href="#" className="text-sm font-medium hover:text-[#012d1d] transition-colors">SEC Risk Factors</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#eeeeeb] rounded-full transition-colors">
            <CircleUser className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-[#eeeeeb] rounded-full transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#3e6a00] font-bold tracking-widest uppercase text-xs mb-4 block"># the analytical archedium</span>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">unmasking global disruption.</h2>
              <p className="text-lg text-[#414844] mb-10 max-w-xl leading-relaxed">
                rippletrace maps the invisible veins of global trade. utilizing advanced graphrag architectures, we navigate the complex silences of supply chains to predict failure before it propagates.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#012d1d] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">Identify Risk</button>
                <button className="border border-[#717973] text-[#1a1c1a] px-8 py-4 rounded-full font-bold hover:bg-[#eeeeeb] transition-colors">Explore Graph</button>
              </div>
            </div>
            
            <div className="relative aspect-square bg-[#e2e3e0] rounded-xl overflow-hidden border border-[#c1c8c2]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-[#012d1d]/20 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border-2 border-[#3e6a00]/30 rounded-full flex items-center justify-center">
                    <Network className="w-16 h-16 text-[#012d1d]" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-lg border border-[#c1c8c2]">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-[#414844] mb-1">Network Health</p>
                    <p className="text-3xl font-bold">98.4%</p>
                  </div>
                  <div className="h-12 w-24 bg-[#c1ecd4] rounded flex items-end gap-1 p-2">
                    <div className="w-full bg-[#012d1d] h-1/2"></div>
                    <div className="w-full bg-[#012d1d] h-3/4"></div>
                    <div className="w-full bg-[#012d1d] h-2/3"></div>
                    <div className="w-full bg-[#012d1d] h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company List Integration */}
        <section id="companies" className="bg-[#f3f4f1] py-16 border-y border-[#c1c8c2]">
           <div className="px-6 max-w-7xl mx-auto">
             <CompanyList companies={companies} loading={loading} error={error} />
           </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#f3f4f1] py-24">
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

        {/* Closing Section */}
        <section className="px-6 py-32 text-center max-w-4xl mx-auto">
          <span className="text-[#012d1d] font-bold tracking-widest uppercase text-xs mb-6 block">The Future of Traceability</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-12 uppercase">ready to secure your botanical digital legacy?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-[#3e6a00] text-white px-10 py-5 rounded-full font-bold hover:opacity-90 transition-opacity">Request Early Access</button>
            <button className="text-[#1a1c1a] font-bold hover:underline">Read Whitepaper</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e2e3e0] border-t border-[#c1c8c2] px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold mb-4">RippleTrace</h2>
            <p className="text-xs text-[#414844] leading-relaxed">Editorial Organicism © 2024</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-[#414844]">
              <li><Link href="#" className="hover:text-[#012d1d]">Main Dashboard</Link></li>
              <li><Link href="#" className="hover:text-[#012d1d]">GraphRAG Visualizer</Link></li>
              <li><Link href="#" className="hover:text-[#012d1d]">SEC Risk Factors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-[#414844]">
              <li><Link href="#" className="hover:text-[#012d1d]">Methodology</Link></li>
              <li><Link href="#" className="hover:text-[#012d1d]">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#012d1d]">System Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-4 text-sm text-[#414844]">
              <li><Link href="#" className="hover:text-[#012d1d]">Intelligence Brief</Link></li>
              <li><Link href="#" className="hover:text-[#012d1d]">Contact Curators</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#c1c8c2] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-[#414844]">Designed for the conservatory</p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-[#414844]">
            <Link href="#">Privacy</Link>
            <span>//</span>
            <Link href="#">Terms</Link>
            <span>//</span>
            <Link href="#">Cookies</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c1c8c2] px-6 py-3 flex justify-around items-center z-50">
        <Link href="#" className="flex flex-col items-center gap-1 text-[#012d1d]">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Main</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#414844]">
          <Network className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Graph</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#414844]">
          <Shield className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Risk</span>
        </Link>
      </nav>
    </div>
  );
};

export default RippleTraceLanding;
