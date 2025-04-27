"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import UploadArea from "@/components/dashboard/upload-area"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const [name, setName] = useState("")
  const [fieldLocation, setFieldLocation] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  const fetchCoordinates = async (location: string) => {
    const res = await fetch(`http://localhost:8000/geocode?location=${encodeURIComponent(location)}`);
    const data = await res.json();
  
    if (data && data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    }
  
    console.error("Failed to fetch coordinates for:", location);
    return null;
  };  

  const handleCreateProject = async () => {
    const coords = await fetchCoordinates(fieldLocation)
  
    if (!coords) {
      alert("Could not fetch coordinates for the location")
      return
    }
  
    const response = await fetch("http://localhost:8000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location: fieldLocation,
        description,
        latitude: coords.latitude,
        longitude: coords.longitude
      }),
    })
  
    if (response.ok) {
      const project = await response.json()
      setCreatedProjectId(project.id)
    } else {
      alert("Failed to create project")
    }
  }
  

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
        {/* Project Details */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Project Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="field" className="text-sm font-medium">Field Location</label>
              <input
                id="field"
                value={fieldLocation}
                onChange={(e) => setFieldLocation(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="Enter field location"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md h-24"
                placeholder="Enter project description"
              />
            </div>
          </div>
        </div>

        {/* UploadArea shows only after project is created */}
        {createdProjectId && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Upload TIFF Files</h2>
            <UploadArea
              projectId={createdProjectId}
              onUploadComplete={() => {
                router.push(`/dashboard/projects/${createdProjectId}`)
              }}
            />
          </div>
        )}

        {/* Create Project Button */}
        {!createdProjectId && (
          <div className="flex justify-end">
            <Button
              className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}