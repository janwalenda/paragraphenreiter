import * as React from "react"
import { cn } from "@/lib/utils"

interface RatioSegment {
  value: number
  label: string
  color: string
}

/** Horizontal stacked bar chart from labeled numeric segments. */
function RatioBar({
  segments,
  size = "md",
  className,
}: {
  segments: RatioSegment[]
  size?: "sm" | "md"
  className?: string
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0)
  if (total === 0) return null

  const barHeight = size === "sm" ? "h-2" : "h-3"

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs text-base-content/60">
        {segments.map((seg) => (
          <span key={seg.label}>
            {seg.label}: {Math.round((seg.value / total) * 100)}%
          </span>
        ))}
      </div>
      <div className={cn("flex rounded-full overflow-hidden", barHeight)}>
        {segments.map(
          (seg) =>
            seg.value > 0 && (
              <div
                key={seg.label}
                className={seg.color}
                style={{ width: `${(seg.value / total) * 100}%` }}
              />
            )
        )}
      </div>
    </div>
  )
}

export { RatioBar, type RatioSegment }
