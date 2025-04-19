// app/dashboard/projects/page.tsx
import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Projects | Farmers NDVI",
  description: "View all your NDVI analysis projects",
}

async function getProjects() {
  const res = await fetch("http://localhost:8000/projects", {
    next: { revalidate: 10 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch projects")
  }

  return res.json()
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
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

      <div className="space-y-4">
        {projects.map((project: any) => (
          <div key={project.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <p className="text-xs text-gray-500 mt-1">Created on: {new Date(project.created_at).toLocaleDateString()}</p>
            <Link href={`/dashboard/projects/${project.id}`} className="text-sm text-blue-500 underline mt-2 inline-block">
              View Project →
            </Link>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
