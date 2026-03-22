"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#e2e3e0] border-t border-[#c1c8c2] px-6 py-12 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-[#1a1c1a]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">RippleTrace</h2>
          <p className="text-xs text-[#414844] leading-relaxed uppercase tracking-widest">Editorial Organicism © 2024</p>
        </div>
        
        <nav>
          <ul className="flex flex-wrap justify-center gap-8 text-sm text-[#414844] font-medium">
            <li><Link href="#" className="hover:text-[#012d1d] transition-colors">Main Dashboard</Link></li>
            <li><Link href="#" className="hover:text-[#012d1d] transition-colors">GraphRAG Visualizer</Link></li>
            <li><Link href="#" className="hover:text-[#012d1d] transition-colors">SEC Risk Factors</Link></li>
          </ul>
        </nav>

        <div className="w-full pt-8 border-t border-[#c1c8c2] flex flex-col md:flex-row justify-between items-center gap-4 text-[#414844]">
          <p className="text-[10px] uppercase tracking-widest">Designed for the conservatory</p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest">
            <Link href="#" className="hover:text-[#012d1d]">Privacy</Link>
            <span>//</span>
            <Link href="#" className="hover:text-[#012d1d]">Terms</Link>
            <span>//</span>
            <Link href="#" className="hover:text-[#012d1d]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
