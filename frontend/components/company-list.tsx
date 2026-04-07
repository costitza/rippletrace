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
    <section id="companies" className="py-24 bg-surface-container">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold tracking-tight">Tracked Companies</h2>
            <p className="mt-2 text-muted-foreground font-medium text-lg">Currently monitoring these major global entities</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="font-bold text-muted-foreground">Querying Knowledge Graph...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-8 rounded-lg text-center">
            <p className="font-bold text-lg italic">Error connecting to the risk engine: {error}</p>
            <p className="mt-2 text-sm opacity-80 font-semibold text-foreground">Ensure your backend server is accessible via the API proxy</p>          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {displayedCompanies.map((company) => (
              <div 
                key={company} 
                className="flex items-center gap-3 p-6 bg-surface-container-lowest rounded-md hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-default"
              >
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Building2 className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-bold text-base truncate">{company}</span>
              </div>
            ))}
            {companies.length === 0 && (
              <div className="col-span-full py-20 text-center bg-surface-container-low rounded-lg">
                <p className="text-muted-foreground font-bold italic text-lg">No companies indexed in the knowledge graph yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
