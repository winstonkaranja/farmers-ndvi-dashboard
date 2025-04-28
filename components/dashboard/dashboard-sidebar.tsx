"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileImage, Home, Layers, Settings, X, Calculator, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardSidebar({ open, onOpenChange }: DashboardSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Projects",
      icon: Layers,
      href: "/dashboard/projects",
      active: pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/"),
    },
    // {
    //   label: "NDVI Analysis",
    //   icon: Calculator,
    //   href: "/dashboard/analysis",
    //   active: pathname === "/dashboard/analysis",
    // },
    // {
    //   label: "Image Stitching",
    //   icon: Grid,
    //   href: "/dashboard/image-stitching",
    //   active: pathname === "/dashboard/image-stitching",
    // },
    // {
    //   label: "Field Images",
    //   icon: FileImage,
    //   href: "/dashboard/images",
    //   active: pathname === "/dashboard/images",
    // },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <>
      <div
        className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card px-3 py-4 shadow-sm transition-transform lg:static lg:block",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center">
            <div className="rounded-full bg-[#4f531f] p-1 mr-2">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">NDVI Dashboard</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-8 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                route.active ? "bg-[#4f531f] text-white" : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#efc87d] p-2">
                <BarChart3 className="h-4 w-4 text-[#4f531f]" />
              </div>
              <div>
                <p className="text-sm font-medium">Pro Features</p>
                <p className="text-xs text-muted-foreground">Unlock advanced analytics</p>
              </div>
            </div>
            <Button className="mt-3 w-full bg-[#4f531f] hover:bg-[#3a3d17] text-white">Upgrade</Button>
          </div>
        </div>
      </div>
    </>
  )
}

