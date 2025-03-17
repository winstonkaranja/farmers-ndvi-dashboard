"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Droplets, Leaf, RefreshCw, ThumbsUp, Zap } from "lucide-react"

interface AIInsightsProps {
  projectId: string
}

export default function AIInsights({ projectId }: AIInsightsProps) {
  const [loading, setLoading] = useState(false)

  const handleRefreshInsights = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
        <Button variant="outline" size="sm" onClick={handleRefreshInsights} disabled={loading}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Droplets className="mr-2 h-5 w-5 text-blue-500" />
              Irrigation Insights
            </CardTitle>
            <CardDescription>Based on NDVI patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The eastern section of your field shows signs of water stress. Consider increasing irrigation in this area
              by 15-20% over the next week.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Irrigation Plan
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-green-500" />
              Crop Health
            </CardTitle>
            <CardDescription>Overall assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your crops are showing good overall health with an average NDVI of 0.65. The northwestern corner shows
              exceptionally healthy vegetation.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Health Report
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Potential Issues
            </CardTitle>
            <CardDescription>Areas requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We've detected potential pest activity in the southern section. The pattern of NDVI reduction suggests
              early signs of infestation.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Recommendations
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="mr-2 h-5 w-5 text-[#efc87d]" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Actionable steps based on analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                  <ThumbsUp className="h-4 w-4 text-[#4f531f]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Irrigation Adjustment</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase irrigation in the eastern section by 15-20% for the next 7 days, then reassess NDVI values.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                  <ThumbsUp className="h-4 w-4 text-[#4f531f]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Pest Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Conduct a ground inspection in the southern section to confirm pest presence. Consider targeted
                    application of organic pesticides if confirmed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[#4f531f]/20 rounded-full p-1 mt-0.5">
                  <ThumbsUp className="h-4 w-4 text-[#4f531f]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Nutrient Management</h4>
                  <p className="text-sm text-muted-foreground">
                    The central region shows signs of nitrogen deficiency. Consider applying a nitrogen-rich fertilizer
                    at a rate of 20-30 lbs/acre.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#4f531f] hover:bg-[#3a3d17] text-white">Apply Recommendations</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

