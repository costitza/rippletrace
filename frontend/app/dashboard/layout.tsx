"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Settings, Radio } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Main Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'GraphRAG Visualizer',
      href: '/visualizer',
      icon: Network,
    },
  ];

  return (
    <div className="flex h-screen bg-[#f9faf6] text-[#1a1c1a] font-mono">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#c1c8c2] flex flex-col bg-[#f3f4f1]">
        <div className="p-8 border-b border-[#c1c8c2]">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold tracking-tighter text-[#012d1d]">RippleTrace</h1>
          </Link>
          <p className="text-[10px] text-[#414844] uppercase tracking-widest mt-1">The Digital Conservatory</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' || pathname.startsWith('/dashboard/')
              : pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 p-3 rounded-sm text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-[#012d1d] text-white' 
                    : 'text-[#414844] hover:bg-[#e2e3e0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-[#c1c8c2]">
           <div className="flex items-center gap-2 text-[10px] text-[#3e6a00] font-bold uppercase tracking-widest">
             <div className="w-2 h-2 rounded-full bg-[#3e6a00] animate-pulse"></div>
             System Operational
           </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-[#c1c8c2] flex items-center justify-between px-10 bg-white/50 backdrop-blur-sm">
           <div className="flex items-center gap-4">
             <Radio className="w-4 h-4 text-[#3e6a00] animate-pulse" />
             <p className="text-xs font-bold uppercase tracking-widest text-[#414844]">
               WELCOME BACK, ANALYST. <span className="text-[#012d1d]">MONITORING 1,402 ACTIVE NODES.</span>
             </p>
           </div>
           
           <div className="flex items-center gap-6">
             <button className="text-[#414844] hover:text-[#012d1d] transition-colors">
               <Settings className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-[#c1c8c2]">
               <div className="w-8 h-8 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-xs font-bold uppercase tracking-widest">
                 JD
               </div>
             </div>
           </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
