"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, Bot, Zap, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CompanyList } from "@/components/company-list";

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
    <div className="flex min-h-screen flex-col bg-surface text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section: The Analytical Archedium */}
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12">
                <span className="inline-flex items-center rounded-full px-6 py-2 text-sm font-bold bg-secondary-container text-primary uppercase tracking-widest shadow-sm">
                  Intelligence Dashboard v3.0
                </span>
              </div>
              <h1 className="text-7xl font-serif font-bold tracking-tighter sm:text-8xl lg:text-9xl leading-[0.95] mb-12">
                Trace the <span className="text-secondary italic">Ripple</span>.<br />
                Map the <span className="text-primary italic underline decoration-secondary-container underline-offset-8">Impact</span>.
              </h1>
              <p className="text-2xl leading-relaxed text-muted-foreground sm:text-3xl max-w-4xl font-medium mb-16">
                RippleTrace leverages GraphRAG architecture to decipher complex supply chain dependencies 
                and predict global market reactions to localized geopolitical shifts.
              </p>
              <div className="flex flex-col items-start gap-8 sm:flex-row">
                <Button size="lg" className="h-16 px-12 text-xl font-bold shadow-2xl shadow-primary/20 group rounded-full bg-primary hover:bg-secondary transition-all duration-500">
                  Explore Global Graph
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
                <div className="flex items-center gap-4 text-primary font-bold text-lg px-4">
                  <Activity className="h-6 w-6 animate-pulse" />
                  <span>Real-time analysis active</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -z-10 h-full w-1/2 opacity-10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]">
            <div className="h-full w-full bg-[radial-gradient(#012d1d_2px,transparent_2px)] [background-size:48px_48px]"></div>
          </div>
        </section>

        <CompanyList companies={companies} loading={loading} error={error} />

        {/* Features: The Editorial Grove Philosophy */}
        <section id="features" className="py-32 lg:py-48 bg-surface">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-16 lg:items-end mb-24">
              <div className="max-w-3xl">
                <h2 className="text-5xl font-serif font-bold tracking-tight sm:text-6xl text-primary">Precision Engineering.</h2>
                <p className="mt-8 text-2xl text-muted-foreground font-medium leading-relaxed">
                  Our dual-model strategy combines rapid extraction with deep reasoning, 
                  providing an unparalleled view into global risk.
                </p>
              </div>
              <div className="flex-1 lg:text-right">
                <Button variant="outline" className="rounded-full border-primary/20 text-primary font-bold h-14 px-8 hover:bg-primary/5 transition-all">
                  Read Technical Specs
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <Card className="border-0 bg-surface-container-low hover:bg-surface-container transition-all duration-500 cursor-default p-10 rounded-lg group shadow-none hover:shadow-2xl">
                <CardHeader className="p-0 mb-8">
                  <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Globe className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-serif font-bold text-primary">GraphRAG Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                    Built on Neo4j AuraDB, our engine maps thousands of non-linear relationships, 
                    allowing you to see the hidden threads connecting world events to your portfolio.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-surface-container-low hover:bg-surface-container transition-all duration-500 cursor-default p-10 rounded-lg group shadow-none hover:shadow-2xl">
                <CardHeader className="p-0 mb-8">
                  <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-serif font-bold text-primary">Risk Advisory Suite</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                    Powered by Gemini 3.1 Pro, we don't just show you data; we provide 
                    contextualized risk reports that identify specific vulnerabilities in your supply chain.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="py-32 bg-primary text-white overflow-hidden relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl">
              <h2 className="text-6xl font-serif font-bold mb-12 leading-tight">Ready to see the future of supply chain intelligence?</h2>
              <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-full bg-secondary-container text-primary hover:bg-white transition-all">
                Request Access
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 h-full w-full opacity-10 flex items-center justify-center">
             <Activity className="h-[120%] w-[120%] stroke-[0.1]" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
