"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function MobileNav() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => {
        // This would toggle the sidebar in a real implementation
        const event = new CustomEvent("toggle-sidebar")
        window.dispatchEvent(event)
      }}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )
}

