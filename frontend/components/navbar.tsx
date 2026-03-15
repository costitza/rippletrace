"use client";

import Link from "next/link";
import { Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">RippleTrace</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-base font-semibold hover:text-primary transition-colors">Features</Link>
          <Link href="#companies" className="text-base font-semibold hover:text-primary transition-colors">Tracked Companies</Link>
          <Link href="https://github.com" className="flex items-center gap-2 text-base font-semibold hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
            GitHub
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Button variant="outline" size="lg" className="hidden sm:inline-flex font-bold px-6">Sign In</Button>
          <Button size="lg" className="font-bold px-6 shadow-md shadow-primary/10">Launch App</Button>
        </div>
      </div>
    </nav>
  );
}
