// import type { Metadata } from "next"
// import DashboardShell from "@/components/dashboard/dashboard-shell"
// import ImageStitchingTool from "@/components/dashboard/image-stitching-tool"

// export const metadata: Metadata = {
//   title: "Image Stitching | Farmers NDVI",
//   description: "Stitch multiple TIFF images for large fields",
// }

export default function ImageStitchingPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Image Stitching</h1>
          <p className="text-muted-foreground">Combine multiple TIFF images into a single comprehensive view</p>
        </div>
      </div>

      <ImageStitchingTool />
    </DashboardShell>
  )
}

