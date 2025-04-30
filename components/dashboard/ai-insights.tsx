"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertTriangle,
  Droplets,
  Leaf,
  RefreshCw,
  ThumbsUp,
  Zap,
} from "lucide-react"

interface AIInsightsProps {
  projectId: string
}

function s3ToHttpUrl(s3Path: string): string {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1"
  return s3Path
    .replace("s3://", "https://")
    .replace("ndvi-images-bucket", `ndvi-images-bucket.s3.${region}.amazonaws.com`)
}


export default function AIInsights({ projectId }: AIInsightsProps) {
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [ndviStats, setNdviStats] = useState<any>(null)
  const [pestClasses, setPestClasses] = useState<string[]>([])
  const [weatherSummary, setWeatherSummary] = useState<string | null>(null)
  const [ndviImageUrl, setNdviImageUrl] = useState<string | null>(null)

  const fetchCoordinates = async (location: string) => {
    const res = await fetch(`http://localhost:8000/geocode?location=${encodeURIComponent(location)}`);
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    }
    console.error("Failed to fetch coordinates for:", location);
    return null;
  };

  const fetchAndRunAI = async () => {
    setLoading(true)
    try {
      const projectRes = await fetch(`http://localhost:8000/projects/${projectId}`)
      const projectData = await projectRes.json()
      console.log("Project data:", projectData)

      const coords = await fetchCoordinates(projectData.location)
      if (!coords) throw new Error("Failed to get coordinates for project location.")

      const payload = {
        image_key: projectData.latest_image_key || "",
        coordinates: coords,
        user_id: "demo_user",
      }

      const aiRes = await fetch("http://localhost:8000/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const aiData = await aiRes.json()
      const output = aiData.result

      console.log("AI Result:", output)
      console.log("AI recommendation:", output?.recommendation);
      console.log("Detected pests:", pestClasses);
      console.log("NDVI Stats:", output?.ndvi_result?.ndvi_summary);


      setRecommendation(output?.recommendation?.advice || "No insights available.")
      setNdviStats(output?.ndvi_result?.ndvi_summary || null)

      // Only show pests that have scores (if available)
      const scores = output?.yolo_result?.scores || []
      const classes = output?.yolo_result?.class_labels || []
      const detected = scores.length > 0
        ? classes.filter((_: string, i: number) => scores[i] > 0.5)
        : []
      setPestClasses(detected)

      setWeatherSummary(
        output?.weather_data?.current?.temp
          ? `${output.weather_data.current.temp}, Wind: ${output.weather_data.current.wind}`
          : null
      )

      const jpgPath = output?.ndvi_result?.save_path || output?.yolo_result?.save_path
      if (jpgPath?.endsWith(".jpg")) {
        setNdviImageUrl(s3ToHttpUrl(jpgPath))
        console.log("NDVI image URL:", s3ToHttpUrl(jpgPath));
      }


    } catch (error) {
      console.error("AI Insights Error:", error)
      setRecommendation("Failed to load insights.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAndRunAI()
  }, [projectId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
        <Button variant="outline" size="sm" onClick={fetchAndRunAI} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {ndviStats && (
          <Card>
            <CardHeader>
              <CardTitle>NDVI Stats</CardTitle>
              <CardDescription>Vegetation Health Overview</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Min: {ndviStats.min}</p>
              <p>Max: {ndviStats.max}</p>
              <p>Mean: {ndviStats.mean}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detected Pests</CardTitle>
            <CardDescription>Pest threats (if detected)</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {pestClasses.length > 0 ? (
              <ul className="list-disc list-inside">
                {pestClasses.slice(0, 5).map((pest, index) => (
                  <li key={index}>{pest}</li>
                ))}
                {pestClasses.length > 5 && (
                  <p className="text-xs mt-2">+{pestClasses.length - 5} more pests</p>
                )}
              </ul>
            ) : (
              <p className="text-muted">No pests confidently detected.</p>
            )}
          </CardContent>
        </Card>

        {weatherSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
              <CardDescription>Field Conditions</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{weatherSummary}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* {ndviImageUrl ? (
        <div>
          <h3 className="font-semibold mb-2">NDVI Visualization</h3>
          <img
            src={ndviImageUrl}
            alt="NDVI Preview"
            className="w-full max-w-2xl border rounded shadow"
          />
        </div>
      ) : (
        <p className="text-muted-foreground">No NDVI or pest image available for this project.</p>
      )} */}


      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-[#efc87d]" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Actionable steps based on analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {recommendation || "Loading AI recommendation..."}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#4f531f] hover:bg-[#3a3d17] text-white">
            Apply Recommendations
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
