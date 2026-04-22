"use client";

import React from 'react';
import { Radio } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
  return (
    <header className="border-b border-[#c1c8c2] flex items-center justify-between px-6 py-4 bg-[#f9faf6]/80 backdrop-blur-md sticky top-0 z-50 font-mono">
      <div className="flex items-center gap-4">
        <Radio className="w-4 h-4 text-[#3e6a00] animate-pulse" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#414844]">
          WELCOME BACK, ANALYST. <span className="text-[#012d1d]">MONITORING 1,402 ACTIVE NODES.</span>
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
           <div className="relative z-[100]">
  <UserButton afterSignOutUrl="/"/>
</div>
        </div>
      </div>
    </header>
  );
}
