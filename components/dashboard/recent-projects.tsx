"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, Calendar, FileImage } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  created_at: string
  imageCount: number
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8000/projects")
        const data = await res.json()

        // Enrich with placeholder imageCount if needed
        const enriched = data.map((project: any) => ({
          ...project,
          imageCount: project.ndvi_results?.length || 0,
        }))

        // Sort by newest first
        const sorted = enriched.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        // Get the 3 most recent
        setProjects(sorted.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch recent projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <p>Loading recent projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">No recent projects yet.</p>
      ) : (
        projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(project.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <FileImage className="mr-1 h-4 w-4" />
                {project.imageCount} TIFF file{project.imageCount !== 1 && "s"}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/dashboard/projects/${project.id}`}>
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
