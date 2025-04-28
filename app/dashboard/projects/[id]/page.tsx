// app/dashboard/projects/[id]/page.tsx
export const dynamic = 'force-dynamic'

import DashboardShell from "@/components/dashboard/dashboard-shell"
import NDVIViewer from "@/components/dashboard/ndvi-viewer"
import AIInsights from "@/components/dashboard/ai-insights"
import ProjectTimeline from "@/components/dashboard/project-timeline"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileImage } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface NDVIResult {
  id: number
  date: string
  url: string
  originalUrl: string
  ndviMin: number
  ndviMax: number
  ndviMean: number
  healthyPercentage: number
  stressedPercentage: number
  unhealthyPercentage: number
}

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

  // Fetch latest NDVI result for this project
  const ndviRes = await fetch(`http://localhost:8000/projects/${projectId}/ndvi`, {
    next: { revalidate: 10 },
  })

  const ndviData: NDVIResult[] = ndviRes.ok ? await ndviRes.json() : []
  const latestNDVI = ndviData.length > 0 ? ndviData[0] : null

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

        {/* Visualization tab */}
        <TabsContent value="visualization" className="space-y-6">

          {/* {latestNDVI && (
            <Card>
              <CardHeader>
                <CardTitle>Latest NDVI Summary</CardTitle>
                <CardDescription>Generated on {latestNDVI.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>NDVI Mean:</strong> {latestNDVI.ndviMean.toFixed(2)}</p>
                <p><strong>NDVI Min:</strong> {latestNDVI.ndviMin.toFixed(2)}</p>
                <p><strong>NDVI Max:</strong> {latestNDVI.ndviMax.toFixed(2)}</p>
                <Separator className="my-2" />
                <div className="grid grid-cols-3 gap-2">
                  <div><strong>Healthy:</strong> {latestNDVI.healthyPercentage}%</div>
                  <div><strong>Stressed:</strong> {latestNDVI.stressedPercentage}%</div>
                  <div><strong>Unhealthy:</strong> {latestNDVI.unhealthyPercentage}%</div>
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Your existing image toggle */}
          <NDVIViewer projectId={projectId} />
        </TabsContent>

        {/* AI Insights tab */}
        <TabsContent value="insights">
          <AIInsights projectId={projectId} />
        </TabsContent>

        {/* History tab */}
        <TabsContent value="history">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
