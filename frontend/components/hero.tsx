"use client";

import React from 'react';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useAuth, SignInButton } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto font-mono">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[#3e6a00] font-bold tracking-widest uppercase text-xs mb-4 block"># the analytical archedium</span>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">unmasking global disruption.</h2>
          <p className="text-lg text-[#414844] mb-10 max-w-xl leading-relaxed">
            rippletrace maps the invisible veins of global trade. utilizing advanced graphrag architectures, we navigate the complex silences of supply chains to predict failure before it propagates.
          </p>
          <div className="flex flex-wrap gap-4">
            {isSignedIn ? (
              <Link href="/dashboard" className="bg-[#012d1d] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
                Go to Dashboard
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-[#012d1d] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
                  Identify Risk
                </button>
              </SignInButton>
            )}
            <Link href="/visualizer" className="border border-[#717973] text-[#1a1c1a] px-8 py-4 rounded-full font-bold hover:bg-[#eeeeeb] transition-colors">Explore Graph</Link>
          </div>
        </div>
        
        <div className="relative aspect-square bg-[#e2e3e0] rounded-xl overflow-hidden border border-[#c1c8c2]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-2 border-[#012d1d]/20 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-1/2 h-1/2 border-2 border-[#3e6a00]/30 rounded-full flex items-center justify-center">
                <Leaf className="w-16 h-16 text-[#3e6a00]" />
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
  );
}
