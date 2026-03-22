"use client";

import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { CTA } from '@/components/cta';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf6] text-[#1a1c1a] selection:bg-[#c1ecd4]">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
