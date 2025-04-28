import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NDVI Analysis | Farmers NDVI",
  description: "Dynamic NDVI calculation and analysis",
}

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
