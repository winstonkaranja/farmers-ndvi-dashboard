"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NDVIImage {
  id: string
  date: string
  url: string
  thumbnail: string
  ndviMin: number
  ndviMax: number
  ndviMean: number
  healthyPercentage: number
  stressedPercentage: number
  unhealthyPercentage: number
}

interface NDVITimelineSliderProps {
  images: NDVIImage[]
  currentIndex: number
  onSelectImage: (index: number) => void
}

export default function NDVITimelineSlider({ images, currentIndex, onSelectImage }: NDVITimelineSliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (containerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 200)
      containerRef.current.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + 200)
      containerRef.current.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative mt-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 bg-background/80 backdrop-blur-sm"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide py-2 px-8 space-x-2 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-200 relative",
                index === currentIndex
                  ? "border-2 border-[#4f531f] rounded-md"
                  : "border border-border rounded-md opacity-70 hover:opacity-100",
              )}
              onClick={() => onSelectImage(index)}
            >
              <img
                src={image.thumbnail || image.url}
                alt={`NDVI from ${image.date}`}
                className="w-20 h-20 object-cover rounded-[3px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 text-center truncate">
                {image.date}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 bg-background/80 backdrop-blur-sm"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

