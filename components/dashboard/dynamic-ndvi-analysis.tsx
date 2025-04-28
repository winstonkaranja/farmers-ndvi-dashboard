"use client";

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Info,
  Layers,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import NDVITimelineSlider from "@/components/dashboard/ndvi-timeline-slider"
import NDVIStatistics from "@/components/dashboard/ndvi-statistics"

interface NDVIImage {
  id: string
  date: string
  filename: string
  url: string
  ndviMin: number
  ndviMax: number
  ndviMean: number
  healthyPercentage: number
  stressedPercentage: number
  unhealthyPercentage: number
}

export default function DynamicNDVIAnalysis() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [ndviImages, setNdviImages] = useState<NDVIImage[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch NDVI metadata on load
  useEffect(() => {
    const fetchNDVIData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/ndvi-data")
        const data = await response.json()
        setNdviImages(data)
      } catch (error) {
        console.error("Error fetching NDVI data:", error)
      }
    }

    fetchNDVIData()
  }, [])

  // const currentImage = ndviImages[currentImageIndex]
  
  // Mock NDVI images for demonstration
  // const [ndviImages, setNdviImages] = useState<
  //   Array<{
  //     id: string
  //     date: string
  //     url: string
  //     thumbnail: string
  //     ndviMin: number
  //     ndviMax: number
  //     ndviMean: number
  //     healthyPercentage: number
  //     stressedPercentage: number
  //     unhealthyPercentage: number
  //   }>
  // >([
  //   {
  //     id: "1",
  //     date: "March 15, 2025",
  //     url: "/placeholder.svg?height=600&width=800&text=NDVI+March+15",
  //     thumbnail: "/placeholder.svg?height=80&width=80&text=Mar+15",
  //     ndviMin: -0.2,
  //     ndviMax: 0.8,
  //     ndviMean: 0.45,
  //     healthyPercentage: 65,
  //     stressedPercentage: 25,
  //     unhealthyPercentage: 10,
  //   },
  //   {
  //     id: "2",
  //     date: "March 8, 2025",
  //     url: "/placeholder.svg?height=600&width=800&text=NDVI+March+8",
  //     thumbnail: "/placeholder.svg?height=80&width=80&text=Mar+8",
  //     ndviMin: -0.15,
  //     ndviMax: 0.75,
  //     ndviMean: 0.42,
  //     healthyPercentage: 60,
  //     stressedPercentage: 30,
  //     unhealthyPercentage: 10,
  //   },
  //   {
  //     id: "3",
  //     date: "March 1, 2025",
  //     url: "/placeholder.svg?height=600&width=800&text=NDVI+March+1",
  //     thumbnail: "/placeholder.svg?height=80&width=80&text=Mar+1",
  //     ndviMin: -0.25,
  //     ndviMax: 0.7,
  //     ndviMean: 0.38,
  //     healthyPercentage: 55,
  //     stressedPercentage: 30,
  //     unhealthyPercentage: 15,
  //   },
  // ])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Filter for TIFF files
    const tiffFiles = newFiles.filter((file) => file.name.endsWith(".tif") || file.name.endsWith(".tiff"))

    if (tiffFiles.length !== newFiles.length) {
      setUploadError("Only TIFF files are supported")
    } else {
      setUploadError(null)
    }

    setFiles((prev) => [...prev, ...tiffFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setProcessing(true)

          // Simulate NDVI processing
          setTimeout(() => {
            setProcessing(false)

            // Add new mock NDVI image
            const today = new Date()
            const newImage = {
              id: (ndviImages.length + 1).toString(),
              date: today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              url: `/placeholder.svg?height=600&width=800&text=NDVI+${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
              thumbnail: `/placeholder.svg?height=80&width=80&text=${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
              ndviMin: -0.1 - Math.random() * 0.2,
              ndviMax: 0.7 + Math.random() * 0.2,
              ndviMean: 0.35 + Math.random() * 0.15,
              healthyPercentage: 50 + Math.floor(Math.random() * 20),
              stressedPercentage: 20 + Math.floor(Math.random() * 15),
              unhealthyPercentage: 5 + Math.floor(Math.random() * 10),
            }

            setNdviImages((prev) => [newImage, ...prev])
            setCurrentImageIndex(0)
            setFiles([])
          }, 3000)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ndviImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + ndviImages.length) % ndviImages.length)
  }

  const currentImage = ndviImages[currentImageIndex]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Upload New Images</TabsTrigger>
          <TabsTrigger value="visualization">NDVI Visualization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis & Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="space-y-4">
            {uploadError && (
              <div className="bg-destructive/20 text-destructive p-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {uploadError}
              </div>
            )}

            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center",
                isDragging ? "border-[#efc87d] bg-[#efc87d]/10" : "border-border",
                files.length > 0 ? "pb-4" : "pb-8",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-[#4f531f]/20 p-3 mb-4">
                  <Upload className="h-6 w-6 text-[#4f531f]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drag & Drop TIFF Files for NDVI Calculation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload new aerial or satellite imagery to calculate updated NDVI values
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".tif,.tiff"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-[#4f531f] text-[#4f531f] hover:bg-[#4f531f] hover:text-white"
                >
                  Browse Files
                </Button>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-card p-3 rounded-md">
                      <div className="flex items-center">
                        <FileImage className="h-5 w-5 mr-3 text-[#efc87d]" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={uploading || processing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                {(uploading || processing) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{processing ? "Processing NDVI..." : "Uploading..."}</span>
                      <span>{processing ? "Please wait" : `${uploadProgress}%`}</span>
                    </div>
                    <Progress value={processing ? 100 : uploadProgress} className="h-2">
                      {processing && <div className="h-full bg-[#4f531f] animate-pulse" style={{ width: "100%" }} />}
                    </Progress>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFiles([])
                      setUploadError(null)
                    }}
                    disabled={uploading || processing}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
                    onClick={handleUpload}
                    disabled={uploading || processing || files.length === 0}
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        Uploading
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </span>
                    ) : processing ? (
                      <span className="flex items-center">
                        Processing NDVI
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </span>
                    ) : (
                      "Calculate NDVI"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {ndviImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent NDVI Calculations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ndviImages.slice(0, 4).map((image, index) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`NDVI from ${image.date}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{image.date}</CardTitle>
                        <CardDescription className="text-xs">Mean NDVI: {image.ndviMean.toFixed(2)}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          {ndviImages.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={prevImage}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{currentImage.date}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={nextImage}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                  <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative border rounded-lg overflow-hidden bg-black/50 flex items-center justify-center h-[500px]">
                <div
                  className="relative"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  <img
                    src={currentImage.url || "/placeholder.svg"}
                    alt={`NDVI Visualization from ${currentImage.date}`}
                    className="max-w-full h-auto"
                  />

                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    {currentImage.date}
                  </div>
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

              <NDVITimelineSlider
                images={ndviImages}
                currentIndex={currentImageIndex}
                onSelectImage={(index) => setCurrentImageIndex(index)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No NDVI Images Available</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload new imagery to calculate NDVI values and view visualizations
              </p>
              <Button
                onClick={() => document.querySelector('[data-value="upload"]')?.click()}
                className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
              >
                Upload Images
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {ndviImages.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">NDVI Trend Analysis</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>

              <NDVIStatistics images={ndviImages} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vegetation Health Trends</CardTitle>
                    <CardDescription>Changes in vegetation health over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full bg-card rounded-md border flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=300&width=400&text=Vegetation+Health+Chart"
                        alt="Vegetation Health Chart"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NDVI Distribution</CardTitle>
                    <CardDescription>Distribution of NDVI values across the field</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full bg-card rounded-md border flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=300&width=400&text=NDVI+Distribution+Chart"
                        alt="NDVI Distribution Chart"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
                  <CardDescription>Automated analysis based on NDVI trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-[#4f531f]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Vegetation Health Improving</h4>
                        <p className="text-sm text-muted-foreground">
                          The average NDVI has increased by 18% over the past 2 weeks, indicating improved vegetation
                          health. The eastern section shows the most significant improvement.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-[#4f531f]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Potential Irrigation Issue</h4>
                        <p className="text-sm text-muted-foreground">
                          The southwestern corner shows a consistent decline in NDVI values over the last 3 analyses.
                          This may indicate an irrigation system issue or soil nutrient deficiency.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-[#4f531f]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Recommended Action</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on the NDVI trend analysis, consider increasing irrigation in the southwestern section
                          by 15-20% and conducting a soil test to check for nutrient deficiencies.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Analysis Data Available</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload at least one image to generate NDVI analysis and trends
              </p>
              <Button
                onClick={() => document.querySelector('[data-value="upload"]')?.click()}
                className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
              >
                Upload Images
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

