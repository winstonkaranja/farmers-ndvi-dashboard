"use client"

import { useEffect, useRef } from "react"

interface NDVIImage {
  id: string
  date: string
  url: string
  thumbnail: string
  ndviMin: number
  ndviMax: number
  ndviMean: number
  healthyPercentage: number
  stressedPercentage: number
  unhealthyPercentage: number
}

interface NDVIStatisticsProps {
  images: NDVIImage[]
}

export default function NDVIStatistics({ images }: NDVIStatisticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw axes labels
    ctx.fillStyle = "#999"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Time", canvas.width / 2, canvas.height - 10)

    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("NDVI Value", 0, 0)
    ctx.restore()

    // Sort images by date (oldest to newest)
    const sortedImages = [...images].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Find min and max NDVI values
    const minNDVI = Math.min(...sortedImages.map((img) => img.ndviMin)) - 0.1
    const maxNDVI = Math.max(...sortedImages.map((img) => img.ndviMax)) + 0.1

    // Draw data points and lines
    const pointRadius = 4
    const xStep = chartWidth / (sortedImages.length - 1 || 1)

    // Function to convert NDVI value to y coordinate
    const ndviToY = (ndvi: number) => {
      return canvas.height - padding - ((ndvi - minNDVI) / (maxNDVI - minNDVI)) * chartHeight
    }

    // Draw min line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
    ctx.lineWidth = 1
    sortedImages.forEach((image, i) => {
      const x = padding + i * xStep
      const y = ndviToY(image.ndviMin)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw max line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
    ctx.lineWidth = 1
    sortedImages.forEach((image, i) => {
      const x = padding + i * xStep
      const y = ndviToY(image.ndviMax)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw mean line
    ctx.beginPath()
    ctx.strokeStyle = "#efc87d"
    ctx.lineWidth = 2
    sortedImages.forEach((image, i) => {
      const x = padding + i * xStep
      const y = ndviToY(image.ndviMean)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw data points for mean
    sortedImages.forEach((image, i) => {
      const x = padding + i * xStep
      const y = ndviToY(image.ndviMean)

      ctx.beginPath()
      ctx.fillStyle = "#4f531f"
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw date labels
      ctx.fillStyle = "#999"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      const dateLabel = new Date(image.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      ctx.fillText(dateLabel, x, canvas.height - padding + 15)
    })

    // Draw legend
    const legendX = canvas.width - 150
    const legendY = padding + 20

    ctx.fillStyle = "#999"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"

    // Min line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
    ctx.lineWidth = 1
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 20, legendY)
    ctx.stroke()
    ctx.fillText("Min NDVI", legendX + 25, legendY + 4)

    // Max line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
    ctx.lineWidth = 1
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 20, legendY + 20)
    ctx.stroke()
    ctx.fillText("Max NDVI", legendX + 25, legendY + 24)

    // Mean line
    ctx.beginPath()
    ctx.strokeStyle = "#efc87d"
    ctx.lineWidth = 2
    ctx.moveTo(legendX, legendY + 40)
    ctx.lineTo(legendX + 20, legendY + 40)
    ctx.stroke()
    ctx.fillText("Mean NDVI", legendX + 25, legendY + 44)
  }, [images])

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">NDVI Value Trends</h3>
      <div className="w-full h-[300px] relative">
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          This chart shows the trend of NDVI values over time. The yellow line represents the mean NDVI value, while the
          green and red lines show the maximum and minimum values respectively.
        </p>
      </div>
    </div>
  )
}

