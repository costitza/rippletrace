"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Shield, Radio } from 'lucide-react';

export function DashboardSidebar() {
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
    {
      label: 'SEC Risk Factors',
      href: '#',
      icon: Shield,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#c1c8c2] flex flex-col bg-[#f3f4f1] font-mono">
      <div className="p-8 border-b border-[#c1c8c2]">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold tracking-tighter text-[#012d1d]">RippleTrace</h1>
        </Link>
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
  );
}
