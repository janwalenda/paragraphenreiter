import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, type TooltipProps } from "./tooltip"

const rangeVariants = cva(
  "range",
  {
    variants: {
      variant: {
        default: "",
        primary: "range-primary",
        secondary: "range-secondary",
        neutral: "range-neutral",
        accent: "range-accent",
        info: "range-info",
        success: "range-success",
        warning: "range-warning",
        error: "range-error",
      },
      rangeSize: {
        default: "range-md",
        xs: "range-xs",
        sm: "range-sm",
        md: "range-md",
        lg: "range-lg",
        xl: "range-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      rangeSize: "default",
    },
  }
)

type RangeProps = React.ComponentProps<"input"> & VariantProps<typeof rangeVariants> & {
  asChild?: boolean
  tooltip?: TooltipProps
}

/** Styled `<input type="range">` with optional tooltip wrapper. */
function Range({
  className,
  variant,
  rangeSize,
  asChild = false,
  tooltip,
  ...props
}: RangeProps) {
  const Comp = asChild ? Slot : "input"

  return (
    <>
      {tooltip ? (
        <Tooltip variant={variant} content={tooltip?.content} placement={tooltip?.placement}>
          <Comp
            type="range"
            data-slot="input"
            className={cn(rangeVariants({ variant, rangeSize, className }))}
            {...props}
          />
        </Tooltip>
      ) : (
        <Comp
          type="range"
          data-slot="input"
          className={cn(rangeVariants({ variant, rangeSize, className }))}
          {...props}
        />
      )}
    </>
  )
}

export { Range, rangeVariants, type RangeProps }
