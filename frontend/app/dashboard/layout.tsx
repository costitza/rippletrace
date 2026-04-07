"use client";

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f9faf6] text-[#1a1c1a] font-mono">
      <DashboardSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
