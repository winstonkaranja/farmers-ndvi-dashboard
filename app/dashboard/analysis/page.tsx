'use client';

import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import DynamicNDVIAnalysis from "@/components/dashboard/dynamic-ndvi-analysis"

export const metadata: Metadata = {
  title: "NDVI Analysis | Farmers NDVI",
  description: "Dynamic NDVI calculation and analysis",
}

export default function AnalysisPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NDVI Analysis</h1>
          <p className="text-muted-foreground">Upload and analyze new imagery to calculate NDVI values</p>
        </div>
      </div>

      <DynamicNDVIAnalysis />
    </DashboardShell>
  )
}

