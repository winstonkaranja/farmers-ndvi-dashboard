// app/dashboard/projects/[id]/add-images/page.tsx

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
  const projectId = params.id

  return (
    <DashboardShell>
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Images to Project #{projectId}</h1>
      </div>

      <div className="space-y-6">
        <AddProjectImages projectId={projectId} />
      </div>
    </DashboardShell>
  )
}
