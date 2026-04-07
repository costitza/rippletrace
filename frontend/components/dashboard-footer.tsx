"use client";

import React from 'react';

export function DashboardFooter() {
  return (
    <footer className="mt-12 pt-12 border-t border-[#c1c8c2] flex flex-col md:flex-row justify-between items-center gap-4 text-[#414844] font-mono">
      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
        <span>Protocol 7.21</span>
        <span className="text-[#c1c8c2]">|</span>
        <span>Lat: 34.0522 N Long: 118.2437 W</span>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1">
        <p className="text-[10px] uppercase tracking-widest">
          © 2024 RippleTrace Labs // <span className="text-[#012d1d]">Securing the Digital Conservatory</span>
        </p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#717973]">
          Designed for the conservatory
        </p>
      </div>
    </footer>
  );
}
