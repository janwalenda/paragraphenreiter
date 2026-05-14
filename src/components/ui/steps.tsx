import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stepsVariants = cva(
  "steps",
  {
    variants: {
      direction: {
        horizontal: "steps-horizontal",
        vertical: "steps-vertical",
      },
      size: {
        xs: "steps-xs",
        sm: "steps-sm",
        md: "steps-md",
        lg: "steps-lg",
      },
    },
    defaultVariants: {
      direction: "horizontal",
    },
  }
)

const stepVariants = cva(
  "step",
  {
    variants: {
      variant: {
        primary: "step-primary",
        secondary: "step-secondary",
        neutral: "step-neutral",
        accent: "step-accent",
        info: "step-info",
        success: "step-success",
        warning: "step-warning",
        error: "step-error",
      },
    },
  }
)

/** Ordered list styled as DaisyUI `steps` (wizard / progress). */
function Steps({
  className,
  direction,
  size,
  children,
  ...props
}: React.ComponentProps<"ul"> & VariantProps<typeof stepsVariants>) {
  return (
    <ul
      className={cn(stepsVariants({ direction, size }), className)}
      {...props}
    >
      {children}
    </ul>
  )
}

/** Single step item inside `Steps`. */
function Step({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"li"> & VariantProps<typeof stepVariants>) {
  return (
    <li
      className={cn(stepVariants({ variant }), className)}
      {...props}
    >
      {children}
    </li>
  )
}

export { Steps, Step, stepsVariants, stepVariants }
