"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Maximize, Download, Eye, EyeOff, Layers } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NDVIViewerProps {
  projectId: string
}

export default function NDVIViewer({ projectId }: NDVIViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [showOriginal, setShowOriginal] = useState(false)
  const [colorMap, setColorMap] = useState("viridis")

  // In a real app, we would fetch the NDVI data based on the project ID

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowOriginal(!showOriginal)}>
            {showOriginal ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View NDVI
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                View Original
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Color Map:</span>
          </div>
          <Select value={colorMap} onValueChange={setColorMap}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select colormap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viridis">Viridis</SelectItem>
              <SelectItem value="plasma">Plasma</SelectItem>
              <SelectItem value="inferno">Inferno</SelectItem>
              <SelectItem value="magma">Magma</SelectItem>
              <SelectItem value="cividis">Cividis</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Maximize className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative border rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
        <div
          className="relative"
          style={{
            transform: `scale(${zoom / 100})`,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {showOriginal ? (
            <img src="/placeholder.svg?height=600&width=800" alt="Original TIFF" className="max-w-full h-auto" />
          ) : (
            <img
              src={`/placeholder.svg?height=600&width=800&text=NDVI+Visualization+(${colorMap})`}
              alt="NDVI Visualization"
              className="max-w-full h-auto"
              style={{
                filter:
                  colorMap === "inferno"
                    ? "hue-rotate(60deg)"
                    : colorMap === "plasma"
                      ? "hue-rotate(120deg)"
                      : colorMap === "magma"
                        ? "hue-rotate(180deg)"
                        : colorMap === "cividis"
                          ? "hue-rotate(240deg)"
                          : "none",
              }}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zoom Level</span>
          <span>{zoom}%</span>
        </div>
        <Slider value={[zoom]} min={50} max={200} step={5} onValueChange={(value) => setZoom(value[0])} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-2">NDVI Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Min Value:</span>
              <span className="text-sm font-medium">-0.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Value:</span>
              <span className="text-sm font-medium">0.8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Mean Value:</span>
              <span className="text-sm font-medium">0.45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Standard Deviation:</span>
              <span className="text-sm font-medium">0.15</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-2">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span className="text-sm">-1.0 to -0.5 (Water/Non-vegetation)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
              <span className="text-sm">-0.5 to 0.0 (Soil/Urban)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 mr-2"></div>
              <span className="text-sm">0.0 to 0.33 (Sparse Vegetation)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span className="text-sm">0.33 to 0.66 (Moderate Vegetation)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-700 mr-2"></div>
              <span className="text-sm">0.66 to 1.0 (Dense Vegetation)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

