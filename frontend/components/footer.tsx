"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-16">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">RippleTrace</span>
        </div>
        <p className="text-base text-muted-foreground font-medium">&copy; 2026 RippleTrace. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <Link href="#" className="text-base text-muted-foreground hover:text-foreground font-semibold">Privacy</Link>
          <Link href="#" className="text-base text-muted-foreground hover:text-foreground font-semibold">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
