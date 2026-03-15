"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, Bot, Zap, ArrowRight } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-10 flex justify-center">
                <span className="inline-flex items-center rounded-full px-5 py-1.5 text-sm font-semibold bg-primary/10 text-primary ring-2 ring-inset ring-primary/20 shadow-sm">
                  Powered by GraphRAG & Gemini 3.1
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
                Trace the <span className="text-primary italic">Ripple</span>.
                <br />
                Predict the Impact.
              </h1>
              <p className="mt-10 text-xl leading-9 text-muted-foreground sm:text-2xl max-w-3xl mx-auto font-medium">
                RippleTrace uses AI-powered GraphRAG to visualize global supply chain dependencies 
                and predict how localized events disrupt the world's markets.
              </p>
              <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Button size="lg" className="h-16 px-10 text-lg font-bold shadow-xl shadow-primary/25 group rounded-2xl">
                  View Demo  
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 -z-10 h-full w-full opacity-15 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]">
            <div className="h-full w-full bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
          </div>
        </section>

        <CompanyList companies={companies} loading={loading} error={error} />

        <section id="features" className="py-28 sm:py-40">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for Global Intelligence</h2>
              <p className="mt-6 text-xl text-muted-foreground font-medium">
                Stay ahead of disruptions with our advanced graph-based risk assessment engine.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <Card className="border-2 border-border/50 bg-background hover:border-primary/50 hover:shadow-2xl transition-all duration-300 cursor-default p-4 rounded-3xl group">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Graph Intelligence</CardTitle>
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
                  <CardTitle className="text-2xl font-bold">Dual-AI Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    Gemini 3 Flash handles rapid data extraction, while Gemini 3.1 Pro 
                    provides deep reasoning for risk advisory.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
