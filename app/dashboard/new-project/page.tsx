import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import UploadArea from "@/components/dashboard/upload-area"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Project | Farmers NDVI",
  description: "Create a new NDVI analysis project",
}

export default function NewProjectPage() {
  return (
    <DashboardShell>
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <input
                id="name"
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="field" className="text-sm font-medium">
                Field Location
              </label>
              <input
                id="field"
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="Enter field location"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 bg-background border border-input rounded-md h-24"
                placeholder="Enter project description"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Upload TIFF Files</h2>
          <UploadArea />
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#4f531f] hover:bg-[#3a3d17] text-white">Create Project</Button>
        </div>
      </div>
    </DashboardShell>
  )
}

