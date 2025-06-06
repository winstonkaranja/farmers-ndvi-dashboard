"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ChevronDown, ChevronUp, FileImage, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ProjectTimelineProps {
  projectId: string
}

export default function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  // In a real app, we would fetch the project timeline data based on the project ID

  const [timelineItems, setTimelineItems] = useState([
    {
      id: 1,
      date: "March 22, 2025",
      title: "New NDVI Analysis",
      description: "Added new imagery and updated NDVI analysis",
      files: ["north_field_march22.tiff"],
      expanded: true,
    },
    {
      id: 2,
      date: "March 15, 2025",
      title: "Initial NDVI Analysis",
      description: "First NDVI analysis of the North Field",
      files: ["north_field_march15.tiff"],
      expanded: false,
    },
    {
      id: 3,
      date: "March 8, 2025",
      title: "Irrigation Adjustment",
      desription: "Increased irrigation in eastern section by 15%",
      files: ["irrigation_adjustment.tiff"],
      expanded: false,
    },
    {
      id: 4,
      date: "March 1, 2025",
      title: "Baseline Analysis",
      description: "Baseline NDVI analysis for the season",
      files: ["baseline_march1.tiff"],
      expanded: false,
    },
  ])

  const toggleExpanded = (id: number) => {
    setTimelineItems((prev) => prev.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Timeline</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}/add-images`}>
              <FileImage className="mr-2 h-4 w-4" />
              Add New Images
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {timelineItems.map((item) => (
          <Card key={item.id} className="relative overflow-hidden">
            <div className="absolute left-8 top-[72px] bottom-8 w-0.5 bg-border" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpanded(item.id)}>
                  {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription>{item.date}</CardDescription>
            </CardHeader>

            {item.expanded && (
              <CardContent>
                <div className="ml-6 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-[#4f531f] bg-background" />
                    <p className="text-sm">{item.description}</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-[#4f531f] bg-background" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Files:</p>
                      {item.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-md border p-2 bg-card">
                          <FileImage className="h-4 w-4 text-[#efc87d]" />
                          <span className="text-sm">{file}</span>
                          <Button variant="ghost" size="sm" className="ml-auto h-7 px-2">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-[#4f531f] bg-background" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View NDVI
                      </Button>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" asChild className="w-full max-w-md">
          <Link href={`/dashboard/projects/${projectId}/add-images`} className="flex items-center justify-center">
            <FileImage className="mr-2 h-4 w-4" />
            Add New Images to Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

