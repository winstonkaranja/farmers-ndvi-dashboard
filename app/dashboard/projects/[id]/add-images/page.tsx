import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AddProjectImages from "@/components/dashboard/add-project-images"

export const metadata: Metadata = {
  title: "Add Images | Farmers NDVI",
  description: "Add new images to your NDVI project",
}

export default function AddProjectImagesPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch project data based on the ID
  const projectName = "North Field Analysis"

  return (
    <DashboardShell>
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href={`/dashboard/projects/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Images to {projectName}</h1>
      </div>

      <div className="space-y-6">
        <AddProjectImages projectId={params.id} />
      </div>
    </DashboardShell>
  )
}

