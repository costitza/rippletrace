"use client";

import Link from "next/link";
import { LayoutDashboard, Network, Shield } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <header className="border-b border-[#c1c8c2] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#f9faf6]/80 backdrop-blur-md z-50 font-mono">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#012d1d]">RippleTrace</Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-medium text-[#414844] hover:text-[#012d1d] transition-colors">Main Dashboard</Link>
          <Link href="/visualizer" className="text-sm font-medium text-[#414844] hover:text-[#012d1d] transition-colors">GraphRAG Visualizer</Link>
          <Link href="#" className="text-sm font-medium text-[#414844] hover:text-[#012d1d] transition-colors">SEC Risk Factors</Link>
        </nav>        
        <div className="flex-1 flex justify-end items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm font-bold bg-[#012d1d] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c1c8c2] px-6 py-3 flex justify-around items-center z-50 font-mono">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#012d1d]">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Main</span>
        </Link>
        <Link href="/visualizer" className="flex flex-col items-center gap-1 text-[#414844]">
          <Network className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Graph</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-[#414844]">
          <Shield className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Risk</span>
        </Link>
      </nav>
    </>
  );
}
