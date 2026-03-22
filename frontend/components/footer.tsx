"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-container py-24">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center justify-between gap-12 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary fill-primary" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-primary">RippleTrace</span>
        </div>
        <p className="text-lg text-muted-foreground font-medium italic">&copy; 2026 RippleTrace Intelligence Suite. All rights reserved.</p>
        <div className="flex items-center gap-10">
          <Link href="#" className="text-lg text-muted-foreground hover:text-primary font-bold transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-lg text-muted-foreground hover:text-primary font-bold transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
