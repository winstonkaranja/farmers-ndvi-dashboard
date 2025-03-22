"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Eye,
  EyeOff,
  Layers,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NDVIViewerProps {
  projectId: string
}

export default function NDVIViewer({ projectId }: NDVIViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [showOriginal, setShowOriginal] = useState(false)
  const [colorMap, setColorMap] = useState("viridis")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Mock NDVI images for demonstration
  const [ndviImages, setNdviImages] = useState<
    Array<{
      id: string
      date: string
      url: string
      originalUrl: string
      ndviMin: number
      ndviMax: number
      ndviMean: number
      healthyPercentage: number
      stressedPercentage: number
      unhealthyPercentage: number
    }>
  >([
    {
      id: "1",
      date: "March 22, 2025",
      url: "/placeholder.svg?height=600&width=800&text=NDVI+March+22",
      originalUrl: "/placeholder.svg?height=600&width=800&text=Original+March+22",
      ndviMin: -0.1,
      ndviMax: 0.85,
      ndviMean: 0.52,
      healthyPercentage: 72,
      stressedPercentage: 20,
      unhealthyPercentage: 8,
    },
    {
      id: "2",
      date: "March 15, 2025",
      url: "/placeholder.svg?height=600&width=800&text=NDVI+March+15",
      originalUrl: "/placeholder.svg?height=600&width=800&text=Original+March+15",
      ndviMin: -0.2,
      ndviMax: 0.8,
      ndviMean: 0.45,
      healthyPercentage: 65,
      stressedPercentage: 25,
      unhealthyPercentage: 10,
    },
    {
      id: "3",
      date: "March 8, 2025",
      url: "/placeholder.svg?height=600&width=800&text=NDVI+March+8",
      originalUrl: "/placeholder.svg?height=600&width=800&text=Original+March+8",
      ndviMin: -0.15,
      ndviMax: 0.75,
      ndviMean: 0.42,
      healthyPercentage: 60,
      stressedPercentage: 30,
      unhealthyPercentage: 10,
    },
    {
      id: "4",
      date: "March 1, 2025",
      url: "/placeholder.svg?height=600&width=800&text=NDVI+March+1",
      originalUrl: "/placeholder.svg?height=600&width=800&text=Original+March+1",
      ndviMin: -0.25,
      ndviMax: 0.7,
      ndviMean: 0.38,
      healthyPercentage: 55,
      stressedPercentage: 30,
      unhealthyPercentage: 15,
    },
  ])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ndviImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + ndviImages.length) % ndviImages.length)
  }

  const refreshAnalysis = () => {
    setLoading(true)
    // Simulate refreshing analysis
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const currentImage = ndviImages[currentImageIndex]

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
          <Button variant="outline" size="sm" onClick={refreshAnalysis} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Analysis
              </>
            )}
          </Button>

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

      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={prevImage} className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{currentImage.date}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Image {currentImageIndex + 1} of {ndviImages.length}
          </span>
        </div>

        <Button variant="ghost" size="sm" onClick={nextImage} className="flex items-center">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
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
            <img
              src={currentImage.originalUrl || "/placeholder.svg"}
              alt="Original TIFF"
              className="max-w-full h-auto"
            />
          ) : (
            <img
              src={currentImage.url || "/placeholder.svg"}
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

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zoom Level</span>
          <span>{zoom}%</span>
        </div>
        <Slider value={[zoom]} min={50} max={200} step={5} onValueChange={(value) => setZoom(value[0])} />
      </div>

      <div className="mt-4">
        <Tabs defaultValue="timeline">
          <TabsList className="w-full">
            <TabsTrigger value="timeline" className="flex-1">
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex-1">
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="flex-1"></TabsContent>

          <TabsContent value="timeline" className="pt-4">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {ndviImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-200 relative ${
                    index === currentImageIndex
                      ? "border-2 border-[#4f531f] rounded-md"
                      : "border border-border rounded-md opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`NDVI from ${image.date}`}
                    className="w-24 h-16 object-cover rounded-[3px]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 text-center truncate">
                    {image.date}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">NDVI Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Value:</span>
                      <span className="text-sm font-medium">{currentImage.ndviMin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Value:</span>
                      <span className="text-sm font-medium">{currentImage.ndviMax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mean Value:</span>
                      <span className="text-sm font-medium">{currentImage.ndviMean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Standard Deviation:</span>
                      <span className="text-sm font-medium">0.15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vegetation Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Healthy</span>
                        <span className="text-sm font-medium">{currentImage.healthyPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${currentImage.healthyPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Stressed</span>
                        <span className="text-sm font-medium">{currentImage.stressedPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${currentImage.stressedPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Unhealthy</span>
                        <span className="text-sm font-medium">{currentImage.unhealthyPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${currentImage.unhealthyPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">NDVI Change Over Time</h3>
                <Select defaultValue="mean">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mean">Mean NDVI</SelectItem>
                    <SelectItem value="healthy">Healthy Vegetation %</SelectItem>
                    <SelectItem value="stressed">Stressed Vegetation %</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[200px] w-full bg-card rounded-md border flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=600&text=NDVI+Trend+Chart"
                  alt="NDVI Trend Chart"
                  className="max-w-full max-h-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-card border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Change Since Last Image</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mean NDVI:</span>
                      <span className="text-sm font-medium text-green-500">+0.07 (↑15.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Healthy Vegetation:</span>
                      <span className="text-sm font-medium text-green-500">+7% (↑10.8%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stressed Vegetation:</span>
                      <span className="text-sm font-medium text-green-500">-5% (↓20.0%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Change Since First Image</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mean NDVI:</span>
                      <span className="text-sm font-medium text-green-500">+0.14 (↑36.8%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Healthy Vegetation:</span>
                      <span className="text-sm font-medium text-green-500">+17% (↑30.9%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stressed Vegetation:</span>
                      <span className="text-sm font-medium text-green-500">-10% (↓33.3%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

