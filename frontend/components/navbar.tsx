"use client";

import Link from "next/link";
import { Zap, Github, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
            <Zap className="h-7 w-7 text-white fill-white" />
          </div>
          <span className="text-3xl font-serif font-bold tracking-tighter text-primary">RippleTrace</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12">
          <Link href="#features" className="text-lg font-bold text-muted-foreground hover:text-primary hover:tracking-wider transition-all duration-300">Features</Link>
          <Link href="#companies" className="text-lg font-bold text-muted-foreground hover:text-primary hover:tracking-wider transition-all duration-300">Intelligence Node</Link>
          <Link href="https://github.com" className="flex items-center gap-2 text-lg font-bold text-muted-foreground hover:text-primary hover:tracking-wider transition-all duration-300">
            <Github className="h-6 w-6" />
            GitHub
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="lg" className="hidden sm:inline-flex font-bold px-8 text-primary hover:bg-primary/5 rounded-full text-lg">Sign In</Button>
          <Button size="lg" className="font-bold px-10 shadow-xl shadow-primary/20 rounded-full bg-primary hover:bg-secondary transition-all duration-500 text-lg">
            Launch Platform
          </Button>
        </div>
      </div>
    </nav>
  );
}
