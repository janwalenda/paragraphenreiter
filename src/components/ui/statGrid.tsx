import * as React from "react"
import { cn } from "@/lib/utils"

interface StatItem {
  value: number | string
  label: string
}

const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

/** Responsive grid of label/value stat cells; column count follows `items.length`. */
function StatGrid({
  items,
  className,
}: {
  items: StatItem[]
  className?: string
}) {
  const cols = gridColsMap[items.length] ?? "grid-cols-3"

  return (
    <div className={cn(`grid ${cols} gap-3 text-center`, className)}>
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-xs text-base-content/60">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export { StatGrid, type StatItem }
