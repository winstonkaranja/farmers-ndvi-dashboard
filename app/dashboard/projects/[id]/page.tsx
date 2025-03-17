import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import NDVIViewer from "@/components/dashboard/ndvi-viewer"
import AIInsights from "@/components/dashboard/ai-insights"
import ProjectTimeline from "@/components/dashboard/project-timeline"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Project Details | Farmers NDVI",
  description: "View and analyze your NDVI project",
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch project data based on the ID
  const projectName = "North Field Analysis"
  const projectDate = "March 15, 2025"

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
            <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
            <p className="text-muted-foreground">Created on {projectDate}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
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
          <NDVIViewer projectId={params.id} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsights projectId={params.id} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ProjectTimeline projectId={params.id} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

