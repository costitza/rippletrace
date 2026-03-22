"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#e2e3e0] border-t border-[#c1c8c2] px-6 py-16 font-mono">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-[#1a1c1a]">
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
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#c1c8c2] flex flex-col md:flex-row justify-between items-center gap-4 text-[#414844]">
        <p className="text-[10px] uppercase tracking-widest">Designed for the conservatory</p>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest">
          <Link href="#">Privacy</Link>
          <span>//</span>
          <Link href="#">Terms</Link>
          <span>//</span>
          <Link href="#">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
