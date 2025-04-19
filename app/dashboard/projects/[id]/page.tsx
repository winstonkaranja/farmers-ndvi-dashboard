// app/dashboard/projects/[id]/page.tsx
export const dynamic = 'force-dynamic'

import DashboardShell from "@/components/dashboard/dashboard-shell"
import NDVIViewer from "@/components/dashboard/ndvi-viewer"
import AIInsights from "@/components/dashboard/ai-insights"
import ProjectTimeline from "@/components/dashboard/project-timeline"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileImage, Share2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Project Details | Farmers NDVI",
  description: "View and analyze your NDVI project",
}

export default async function ProjectPage({ params: { id } }: { params: { id: string } }) {
  const projectId = id


  const res = await fetch(`http://localhost:8000/projects/${projectId}`, {
    next: { revalidate: 10 },
  })

  if (!res.ok) {
    return (
      <DashboardShell>
        <h1 className="text-2xl font-bold">Project not found</h1>
      </DashboardShell>
    )
  }

  const project = await res.json()

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}/add-images`}>
              <FileImage className="mr-2 h-4 w-4" />
              Add Images
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="visualization">NDVI Visualization</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="history">Project History</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <NDVIViewer projectId={projectId} />
        </TabsContent>
        <TabsContent value="insights">
          <AIInsights projectId={projectId} />
        </TabsContent>
        <TabsContent value="history">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
