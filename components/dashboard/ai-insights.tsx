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

export default function AIInsights({ projectId }: AIInsightsProps) {
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [ndviStats, setNdviStats] = useState<any>(null)
  const [pestClasses, setPestClasses] = useState<string[]>([])
  const [weatherSummary, setWeatherSummary] = useState<string | null>(null)

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

      const coords = await fetchCoordinates(projectData.location)
      if (!coords) {
        throw new Error("Failed to get coordinates for project location.")
      }

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
      const output = aiData?.result;

      console.log("AI Result:", output);

      setRecommendation(output?.recommendation?.advice || "No insights available.")
      setNdviStats(output?.ndvi_result?.ndvi_summary || null)
      setPestClasses(output?.yolo_result?.class_labels || [])
      setWeatherSummary(
        output?.weather_data?.current?.temp
          ? `${output.weather_data.current.temp}, Wind: ${output.weather_data.current.wind}`
          : null
      )


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
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAndRunAI}
          disabled={loading}
        >
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

      {/* New Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* NDVI Stats */}
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

        {/* Pest Detection */}
        {pestClasses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detected Pests</CardTitle>
              <CardDescription>Top Threats Identified</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside">
                {pestClasses.slice(0, 5).map((pest, index) => (
                  <li key={index}>{pest}</li>
                ))}
              </ul>
              {pestClasses.length > 5 && (
                <p className="text-xs mt-2">+{pestClasses.length - 5} more pests</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weather */}
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

      {/* Recommendation Section */}
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
