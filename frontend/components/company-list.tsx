"use client";

import { useMemo } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyListProps {
  companies: string[];
  loading: boolean;
  error: string | null;
}

export function CompanyList({ companies, loading, error }: CompanyListProps) {
  // Shuffle all companies and take a random selection of 10
  const displayedCompanies = useMemo(() => {
    return [...companies]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [companies]);

  return (
    <section id="companies" className="py-24 border-y bg-secondary/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tracked Companies</h2>
            <p className="mt-2 text-muted-foreground font-medium">Currently monitoring these major global entities</p>
          </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {displayedCompanies.map((company) => (
              <div 
                key={company} 
                className="flex items-center gap-3 p-5 bg-background border-2 border-border/40 rounded-2xl hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Building2 className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-bold text-base truncate">{company}</span>
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
  );
}
