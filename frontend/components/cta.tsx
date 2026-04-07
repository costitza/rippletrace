"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth, SignInButton } from "@clerk/nextjs";

export function CTA() {
  const { isSignedIn } = useAuth();

  return (
    <section className="px-6 py-32 text-center max-w-4xl mx-auto font-mono">
      <span className="text-[#012d1d] font-bold tracking-widest uppercase text-xs mb-6 block">The Future of Traceability</span>
      <h2 className="text-4xl md:text-6xl font-bold mb-12 uppercase">ready to secure your botanical digital legacy?</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {isSignedIn ? (
          <Link href="/dashboard" className="bg-[#3e6a00] text-white px-10 py-5 rounded-full font-bold hover:opacity-90 transition-opacity">
            Go to Dashboard
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-[#3e6a00] text-white px-10 py-5 rounded-full font-bold hover:opacity-90 transition-opacity">
              Identify Risk
            </button>
          </SignInButton>
        )}
        <button className="text-[#1a1c1a] font-bold hover:underline">Read Whitepaper</button>
      </div>
    </section>
  );
}
