"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Calendar, FileImage, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"

export default function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, we would fetch the projects from an API
  const projects = [
    {
      id: "1",
      name: "North Field Analysis",
      date: "March 15, 2025",
      status: "Active",
      imageCount: 3,
    },
    {
      id: "2",
      name: "South Field Monitoring",
      date: "March 10, 2025",
      status: "Active",
      imageCount: 2,
    },
    {
      id: "3",
      name: "East Field Assessment",
      date: "March 5, 2025",
      status: "Completed",
      imageCount: 1,
    },
    {
      id: "4",
      name: "West Field Survey",
      date: "February 28, 2025",
      status: "Archived",
      imageCount: 4,
    },
    {
      id: "5",
      name: "Central Field Evaluation",
      date: "February 20, 2025",
      status: "Completed",
      imageCount: 2,
    },
  ]

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Calendar className="mr-2 h-4 w-4" />
          Filter by Date
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button variant="ghost" className="p-0 font-medium">
                  Project Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Files</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>{project.date}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.status === "Active"
                        ? "bg-green-500/20 text-green-500"
                        : project.status === "Completed"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {project.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileImage className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{project.imageCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/dashboard/projects/${project.id}`} className="w-full">
                          View Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

