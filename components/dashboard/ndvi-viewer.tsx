"use client"

import { useEffect, useState } from "react"
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

function s3PathToHttpUrl(s3Path: string) {
  if (!s3Path.startsWith("s3://")) return s3Path;
  const parts = s3Path.replace("s3://", "").split("/");
  const bucket = parts.shift();
  const key = parts.join("/");
  return `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`;
}


function extractImageKey(url: string) {
  const parts = url.split(".amazonaws.com/")
  return parts.length > 1 ? parts[1] : url
}


export default function NDVIViewer({ projectId }: NDVIViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [showOriginal, setShowOriginal] = useState(false)
  const [colorMap, setColorMap] = useState("viridis")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [ndviImages, setNdviImages] = useState<any[]>([])
  const [boundingBoxes, setBoundingBoxes] = useState<any[]>([])


  const currentImage = ndviImages.length > 0 ? ndviImages[currentImageIndex] : null

  useEffect(() => {
    const fetchNDVI = async () => {
      try {
        const res = await fetch(`http://localhost:8000/projects/${projectId}/ndvi`);
        const data = await res.json();
  
        // Fetch AI insights using latest image_key
        const aiRes = await fetch("http://localhost:8000/ai-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: { latitude: 0, longitude: 0 }, // Replace if you have real coords
            image_key: data.length > 0 ? extractImageKey(data[0].url) : "",
            user_id: "demo_user",
          }),
        });
  
        const aiData = await aiRes.json();
        const aiResult = aiData?.result;
  
        console.log("🔍 AI Full Result:", aiResult);
  
        // ✅ Use NDVI result path (should be a JPEG)
        const aiSavePath = aiResult?.yolo_result?.save_path;
  
        console.log("🧠 Extracted NDVI JPEG path:", aiSavePath);
  
        // Extract and store bounding boxes (if present)
        const boxes = aiResult?.yolo_result?.bounding_boxes || [];
        setBoundingBoxes(boxes);
  
        let updatedData = data;
  
        // ✅ If AI returned a .jpg NDVI result, override the first image
        if (aiSavePath && aiSavePath.endsWith(".jpg")) {
          const key = aiSavePath.replace("s3://ndvi-images-bucket/", "");
          const jpgUrl = `https://ndvi-images-bucket.s3.eu-north-1.amazonaws.com/${key}`;
  
          console.log("✅ Final NDVI image override:", jpgUrl);
  
          updatedData = data.map((item, index) => {
            if (index === 0) {
              console.log("🔄 Overriding index 0 NDVI with:", jpgUrl);
              return { ...item, url: jpgUrl };
            }
            return item;
          });
        }
  
        console.log("🖼️ Final NDVI image URLs:", updatedData);
        setNdviImages(updatedData);
      } catch (err) {
        console.error("❌ Failed to fetch NDVI images or AI insights:", err);
      }
    };
  
    fetchNDVI();
  }, [projectId]);
  
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ndviImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + ndviImages.length) % ndviImages.length)
  }

  const refreshAnalysis = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }
  
  if (currentImage) {
    console.log("🖼️ Rendered Image URL:", showOriginal ? currentImage.originalUrl : currentImage.url)
    console.log("showOriginal =", showOriginal)
    console.log("currentImage =", currentImage)
    console.log("🚨 currentImage.url =", currentImage?.url)
  }
  

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

      {/* Timeline Nav */}
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={prevImage} className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {currentImage ? (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{currentImage.date}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Image {currentImageIndex + 1} of {ndviImages.length}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No image selected</div>
        )}

        <Button variant="ghost" size="sm" onClick={nextImage} className="flex items-center">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Image Viewer */}
      <div className="relative border rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
        <div
          className="relative"
          style={{
            transform: `scale(${zoom / 100})`,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          
          {currentImage ? (
            <div className="relative w-full">
            <img
              src={showOriginal ? currentImage.originalUrl : currentImage.url}
              alt={showOriginal ? "Original TIFF" : "NDVI Visualization"}
              className="max-w-full h-auto"
            />
          
            {!showOriginal &&
              boundingBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-red-500 bg-red-500/10 text-xs text-white"
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                  }}
                  title={box.label || "Detected Object"}
                >
                  <span className="absolute top-0 left-0 bg-black/60 px-1">{box.label}</span>
                </div>
              ))}
          </div>          
          ) : (
            <img
              src="/placeholder.svg"
              alt="No NDVI data"
              className="max-w-full h-auto opacity-50"
            />
          )}

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
      </div>

      {/* Zoom Control */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zoom Level</span>
          <span>{zoom}%</span>
        </div>
        <Slider value={[zoom]} min={50} max={200} step={5} onValueChange={(value) => setZoom(value[0])} />
      </div>

      {/* Tabs: Timeline, Stats, Comparison */}
      {/* 🔥 Keep this part as-is, or we can refactor it later if needed */}
    </div>
  )
}
