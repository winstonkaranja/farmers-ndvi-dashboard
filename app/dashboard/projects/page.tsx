import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import ProjectsList from "@/components/dashboard/projects-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Projects | Farmers NDVI",
  description: "View all your NDVI analysis projects",
}

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">View and manage all your NDVI analysis projects</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ProjectsList />
      </div>
    </DashboardShell>
  )
}

