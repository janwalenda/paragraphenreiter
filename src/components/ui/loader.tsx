import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const loaderVariants = cva(
  "loading",
  {
    variants: {
      variant: {
        default: "text-primary",
        primary: "text-primary",
        secondary: "text-secondary",
        neutral: "text-neutral",
        accent: "text-accent",
        info: "text-info",
        success: "text-success",
        warning: "text-warning",
        error: "text-error",
      },
      style: {
        default: "loading-spinner",
        spinner: "loading-spinner",
        dots: "loading-dots",
        ring: "loading-ring",
        ball: "loading-ball",
        bars: "loading-bars",
        infinity: "loading-infinity",
      },
      size: {
        default: "loading-md",
        xs: "loading-xs",
        sm: "loading-sm",
        lg: "loading-lg",
        xl: "loading-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      style: "default",
    },
  }
)

/** DaisyUI loading indicator (`loading-*`) with spinner/dots/etc. styles. */
function Loader({
  className,
  size,
  style,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof loaderVariants> & {
    asChild?: boolean,
  }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="span"
      className={cn(loaderVariants({ variant, size, style, className }))}
      {...props}
    >
      {props.children}
    </Comp>
  )
}

export { Loader, loaderVariants }
