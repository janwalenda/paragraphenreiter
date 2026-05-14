import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const dividerVariants = cva(
  "divider",
  {
    variants: {
      variant: {
        default: "",
        primary: "divider-primary",
        secondary: "divider-secondary",
        neutral: "divider-neutral",
        accent: "divider-accent",
        info: "divider-info",
        success: "divider-success",
        warning: "divider-warning",
        error: "divider-error",
      },
      direction: {
        horizontal: "divider-horizontal",
        vertical: "divider-vertical",
      },
      placement: {
        top: "divider-top",
        bottom: "divider-bottom",
        left: "divider-left",
        right: "divider-right",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type DividerProps = React.ComponentProps<"div"> & VariantProps<typeof dividerVariants> & {
  asChild?: boolean
}

/** DaisyUI divider with optional color and orientation/placement. */
function Divider({
  className,
  variant,
  direction,
  placement,
  asChild = false,
  ...props
}: DividerProps) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="div"
      className={cn(dividerVariants({ variant, direction, placement, className }))}
      {...props}
    />
  )
}

export { Divider, dividerVariants, type DividerProps }
