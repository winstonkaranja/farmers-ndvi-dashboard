"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileImage, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"

export default function UploadArea({
    projectId,
    onUploadComplete,
  }: {
    projectId: string
    onUploadComplete?: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
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
    const supportedFiles = newFiles.filter((file) =>
      file.name.endsWith(".tif") ||
      file.name.endsWith(".tiff") ||
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".JPG") ||
      file.name.endsWith(".jpeg")
    )
    
    if (supportedFiles.length !== newFiles.length) {
      setUploadError("Only TIFF and JPEG files are supported")
    } else {
      setUploadError(null)
    }
    
    setFiles((prev) => [...prev, ...supportedFiles])    
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file) 
    })

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${projectId}/ndvi-process`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress(percentCompleted)
          },
        }
      )

      console.log("Upload successful:", response.data)
      setUploadProgress(100)
      // Redirect after successful upload
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  if (!projectId) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Please create a project before uploading images.
      </div>
    )
  }
  

  return (
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
          <h3 className="text-lg font-semibold mb-2">Drag & Drop Files</h3>
          <p className="text-sm text-muted-foreground mb-4">Or click to browse from your computer</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".tif,.tiff,.jpg,.jpeg, .JPG"
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
                  Processing
                  <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </span>
              ) : uploadProgress === 100 ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Uploaded
                </span>
              ) : (
                "Process Files"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
