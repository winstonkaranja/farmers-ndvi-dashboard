"use client"

import type React from "react"
import axios from "axios"
import { useEffect } from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Calendar, Check, FileImage, Info, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddProjectImagesProps {
  projectId: string
}

export default function AddProjectImages({ projectId }: AddProjectImagesProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  
  interface ProjectImage {
    id: string
    filename: string
    s3_url: string
    upload_time: string
  }
  
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([])
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/project-images/")
        const data = await response.json()
        setExistingImages(data)
      } catch (err) {
        console.error("Error fetching images:", err)
      }
    }
  
    fetchImages()
  }, [])
  

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

  
  const handleUpload = async () => {
    if (files.length === 0) return;
  
    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)
  
    try {
      const formData = new FormData()
      formData.append("file", files[0]) // For now, support only one at a time
  
      const response = await fetch("http://127.0.0.1:8000/ndvi-process", {
        method: "POST",
        body: formData,
      })
  
      if (!response.ok) throw new Error("Upload failed")
  
      const data = await response.json()
      console.log("NDVI result:", data)
  
      // Show success status
      setUploadProgress(100)
      setUploading(false)
      setProcessing(true)
  
      // Simulate short NDVI processing time for UI transition
      setTimeout(() => {
        setProcessing(false)
        setUploadComplete(true)
      }, 1500)
  
    } catch (err) {
      console.error(err)
      setUploadError("NDVI processing failed. Please try again.")
      setUploading(false)
    }
  }
  

  const handleComplete = () => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Project Images</CardTitle>
          <CardDescription>These images are already part of this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {existingImages.map((image) => (
              <div key={image.id} className="flex items-center justify-between bg-card p-3 rounded-md border">
                <div className="flex items-center">
                  <FileImage className="h-5 w-5 mr-3 text-[#efc87d]" />
                  <div>
                  <span>{new Date(image.upload_time).toLocaleDateString()}</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{image.date}</span>
                      <span className="mx-2">•</span>
                      <span>{image.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Images</CardTitle>
          <CardDescription>Upload new TIFF files to update your project's NDVI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadError && (
              <div className="bg-destructive/20 text-destructive p-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {uploadError}
              </div>
            )}

            {!uploadComplete ? (
              <>
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
                    <h3 className="text-lg font-semibold mb-2">Drag & Drop TIFF Files</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload new images to update your project's NDVI analysis
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
                        <div key={index} className="flex items-center justify-between bg-card p-3 rounded-md border">
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
                          <span>{processing ? `${processProgress}%` : `${uploadProgress}%`}</span>
                        </div>
                        <Progress value={processing ? processProgress : uploadProgress} className="h-2">
                          {processing && (
                            <div className="h-full bg-[#4f531f] animate-pulse" style={{ width: "100%" }} />
                          )}
                        </Progress>
                        {processing && (
                          <p className="text-xs text-muted-foreground">
                            {processProgress < 30
                              ? "Analyzing image data..."
                              : processProgress < 60
                                ? "Calculating NDVI values..."
                                : processProgress < 90
                                  ? "Updating project analysis..."
                                  : "Finalizing results..."}
                          </p>
                        )}
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
                          "Upload & Process Images"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#4f531f]/10 border border-[#4f531f]/20 rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-[#4f531f]/20 p-1 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-[#4f531f]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Images Successfully Processed</h4>
                    <p className="text-sm text-muted-foreground">
                      {files.length} new image{files.length !== 1 ? "s" : ""} {files.length !== 1 ? "have" : "has"} been
                      added to your project and NDVI values have been recalculated.
                    </p>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">NDVI Analysis Updates</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-[#4f531f]" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Vegetation Health Improving</h5>
                        <p className="text-xs text-muted-foreground">
                          The latest images show a 12% increase in healthy vegetation compared to previous data.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-[#4f531f]" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">New Problem Areas Detected</h5>
                        <p className="text-xs text-muted-foreground">
                          The southwestern corner shows signs of water stress that wasn't present in previous analyses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#4f531f] hover:bg-[#3a3d17] text-white" onClick={handleComplete}>
                    View Updated Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

