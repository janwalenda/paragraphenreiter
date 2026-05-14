import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "progress w-full",
  {
    variants: {
      variant: {
        primary: "progress-primary",
        secondary: "progress-secondary",
        accent: "progress-accent",
        info: "progress-info",
        success: "progress-success",
        warning: "progress-warning",
        error: "progress-error",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface ProgressProps
  extends Omit<React.ComponentProps<"progress">, "value">,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
}

/** Native `<progress>` with DaisyUI color variants and ARIA progressbar hints. */
function Progress({
  className,
  variant,
  value,
  max = 100,
  ...props
}: ProgressProps) {
  return (
    <progress
      className={cn(progressVariants({ variant }), className)}
      value={value}
      max={max}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      {...props}
    />
  )
}

export { Progress, progressVariants, type ProgressProps }
