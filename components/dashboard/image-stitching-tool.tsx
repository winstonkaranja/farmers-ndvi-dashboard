"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Download,
  FileImage,
  Grid,
  Move,
  RefreshCw,
  RotateCw,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ImageStitchingTool() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [stitching, setStitching] = useState(false)
  const [stitchProgress, setStitchProgress] = useState(0)
  const [stitchComplete, setStitchComplete] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [overlap, setOverlap] = useState(20)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const startStitching = () => {
    if (files.length < 2) {
      setUploadError("At least 2 images are required for stitching")
      return
    }

    setStitching(true)
    setStitchProgress(0)

    // Simulate stitching progress
    const interval = setInterval(() => {
      setStitchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStitching(false)
          setStitchComplete(true)
          return 100
        }
        return prev + 2
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="stitch">Stitch Configuration</TabsTrigger>
          <TabsTrigger value="result">Stitched Result</TabsTrigger>
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
                <h3 className="text-lg font-semibold mb-2">Drag & Drop TIFF Files for Stitching</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload multiple images of your field to stitch them together
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
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFiles([])
                      setUploadError(null)
                    }}
                    disabled={uploading}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        Uploading
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </span>
                    ) : (
                      "Upload Images"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Image Stitching Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Overlap Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      For best results, ensure your images have at least 20-30% overlap between adjacent images. This
                      helps the stitching algorithm find matching features.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Image Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Use images with consistent lighting and minimal distortion. Images taken at the same altitude and
                      angle produce the best results.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stitch" className="space-y-6">
          {files.length >= 2 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="border rounded-lg overflow-hidden bg-black/50 flex items-center justify-center h-[400px] relative">
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {files.slice(0, 4).map((file, index) => (
                        <div
                          key={index}
                          className="relative border border-dashed border-white/30 rounded-md overflow-hidden"
                        >
                          <img
                            src={`/placeholder.svg?height=180&width=180&text=Image+${index + 1}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{
                              transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                              transition: "transform 0.2s ease-in-out",
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-0 pointer-events-none border-4 border-[#efc87d]/50 rounded-lg opacity-50"></div>

                    {files.length > 4 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                        +{files.length - 4} more images
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Stitching Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Image Overlap</span>
                          <span>{overlap}%</span>
                        </div>
                        <Slider
                          value={[overlap]}
                          min={10}
                          max={50}
                          step={5}
                          onValueChange={(value) => setOverlap(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Adjust the expected overlap between adjacent images
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Rotation</span>
                          <span>{rotation}°</span>
                        </div>
                        <Slider
                          value={[rotation]}
                          min={-45}
                          max={45}
                          step={5}
                          onValueChange={(value) => setRotation(value[0])}
                        />
                        <p className="text-xs text-muted-foreground">Adjust rotation if images are not aligned</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Preview Zoom</span>
                          <span>{zoom}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[zoom]}
                            min={50}
                            max={150}
                            step={10}
                            className="flex-1"
                            onValueChange={(value) => setZoom(value[0])}
                          />
                          <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col space-y-2">
                    <Button
                      className="bg-[#4f531f] hover:bg-[#3a3d17] text-white w-full"
                      onClick={startStitching}
                      disabled={stitching || files.length < 2}
                    >
                      {stitching ? (
                        <span className="flex items-center">
                          Stitching Images
                          <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Grid className="mr-2 h-4 w-4" />
                          Start Stitching
                        </span>
                      )}
                    </Button>

                    <Button variant="outline" onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
                      Back to Upload
                    </Button>
                  </div>
                </div>
              </div>

              {stitching && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Stitching Progress</span>
                    <span>{stitchProgress}%</span>
                  </div>
                  <Progress value={stitchProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {stitchProgress < 30
                      ? "Analyzing image features..."
                      : stitchProgress < 60
                        ? "Matching overlapping areas..."
                        : stitchProgress < 90
                          ? "Blending images together..."
                          : "Finalizing stitched image..."}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Grid className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Not Enough Images</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload at least 2 images to begin the stitching process
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

        <TabsContent value="result" className="space-y-6">
          {stitchComplete ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Stitched Result</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                  <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <RotateCw className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <Move className="h-4 w-4" />
                  </Button>

                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
                    src="/placeholder.svg?height=800&width=1200&text=Stitched+Field+Image"
                    alt="Stitched Field Image"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stitching Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Images Used:</span>
                        <span className="text-sm font-medium">{files.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Output Resolution:</span>
                        <span className="text-sm font-medium">4800 x 3200 px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">File Size:</span>
                        <span className="text-sm font-medium">24.8 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Overlap Used:</span>
                        <span className="text-sm font-medium">{overlap}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">Your images have been successfully stitched together. You can now:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Calculate NDVI
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="mr-2 h-4 w-4" />
                          Download Result
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Grid className="mr-2 h-4 w-4" />
                          Create New Stitch
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <FileImage className="mr-2 h-4 w-4" />
                          Add to Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Grid className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Stitched Result Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload images and complete the stitching process to see results
              </p>
              <Button
                onClick={() => document.querySelector('[data-value="upload"]')?.click()}
                className="bg-[#4f531f] hover:bg-[#3a3d17] text-white"
              >
                Start Stitching Process
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

