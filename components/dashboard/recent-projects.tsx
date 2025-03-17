import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, FileImage } from "lucide-react"
import Link from "next/link"

export default function RecentProjects() {
  // In a real app, we would fetch the recent projects from an API
  const projects = [
    {
      id: "1",
      name: "North Field Analysis",
      date: "March 15, 2025",
      description: "NDVI analysis of the north field",
      imageCount: 3,
    },
    {
      id: "2",
      name: "South Field Monitoring",
      date: "March 10, 2025",
      description: "Regular monitoring of the south field",
      imageCount: 2,
    },
    {
      id: "3",
      name: "East Field Assessment",
      date: "March 5, 2025",
      description: "Initial assessment of the east field",
      imageCount: 1,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <CardTitle>{project.name}</CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {project.date}
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
      ))}
    </div>
  )
}

