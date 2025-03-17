import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import UploadArea from "@/components/dashboard/upload-area"
import RecentProjects from "@/components/dashboard/recent-projects"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | Farmers NDVI",
  description: "Monitor and analyze your fields using NDVI visualization",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Upload TIFF files to analyze your fields using NDVI</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <UploadArea />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <RecentProjects />
      </div>
    </DashboardShell>
  )
}

