"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, Bot, Zap, ArrowRight, Github, Building2, Loader2 } from "lucide-react";

export default function Home() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://localhost:8000/api/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">RippleTrace</span>
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

      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-10 flex justify-center">
                <span className="inline-flex items-center rounded-full px-5 py-1.5 text-sm font-bold bg-primary/10 text-primary ring-2 ring-inset ring-primary/20 shadow-sm">
                  Powered by GraphRAG & Gemini 3.1
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
                Trace the <span className="text-primary italic">Ripple</span>.
                <br />
                Predict the Impact.
              </h1>
              <p className="mt-10 text-xl leading-9 text-muted-foreground sm:text-2xl max-w-3xl mx-auto font-medium">
                RippleTrace uses AI-powered GraphRAG to visualize global supply chain dependencies 
                and predict how localized events disrupt the world's markets.
              </p>
              <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Button size="lg" className="h-16 px-10 text-lg font-black shadow-xl shadow-primary/25 group rounded-2xl">
                  Start Analyzing <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Button>
                <Button variant="ghost" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 -z-10 h-full w-full opacity-15 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]">
            <div className="h-full w-full bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
          </div>
        </section>

        <section id="companies" className="py-24 border-y bg-secondary/10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Tracked Companies</h2>
                <p className="mt-2 text-muted-foreground font-medium">Currently monitoring dependencies for these entities</p>
              </div>
              <Button variant="outline" className="font-bold">Refresh Data</Button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="font-bold text-muted-foreground">Querying Knowledge Graph...</p>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-8 rounded-3xl text-center">
                <p className="font-bold text-lg italic">Error connecting to the risk engine: {error}</p>
                <p className="mt-2 text-sm opacity-80 font-semibold text-foreground">Ensure your backend server is running on localhost:8000</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {companies.map((company) => (
                  <div 
                    key={company} 
                    className="flex items-center gap-3 p-4 bg-background border-2 border-border/40 rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all group"
                  >
                    <Building2 className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="font-bold text-sm truncate">{company}</span>
                  </div>
                ))}
                {companies.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed rounded-3xl">
                    <p className="text-muted-foreground font-bold italic">No companies indexed in the knowledge graph yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="features" className="py-28 sm:py-40">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Built for Global Intelligence</h2>
              <p className="mt-6 text-xl text-muted-foreground font-medium">
                Stay ahead of disruptions with our advanced graph-based risk assessment engine.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <Card className="border-2 border-border/50 bg-background hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-default p-4 rounded-3xl group">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold">Graph Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    Powered by Neo4j, our graph database maps thousands of relationships between 
                    companies, regions, and facilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 bg-background hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-default p-4 rounded-3xl group">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold">Dual-AI Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    Gemini 3 Flash handles rapid data extraction, while Gemini 3.1 Pro 
                    provides deep reasoning for risk advisory.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 bg-background hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-default p-4 rounded-3xl group">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold">Real-time Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    Stay ahead of disruptions with automated ingestion of global news events 
                    and immediate impact analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
}
