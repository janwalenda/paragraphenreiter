import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tooltipVariants = cva(
  "tooltip",
  {
    variants: {
      variant: {
        default: "tooltip-primary",
        primary: "tooltip-primary",
        secondary: "tooltip-secondary",
        neutral: "tooltip-neutral",
        accent: "tooltip-accent",
        info: "tooltip-info",
        success: "tooltip-success",
        warning: "tooltip-warning",
        error: "tooltip-error",
      },

      placement: {
        left: "tooltip-left",
        right: "tooltip-right",
        top: "tooltip-top",
        bottom: "tooltip-bottom",
      },
      modifier: {
        open: "tooltip-open",
      }
    },
    defaultVariants: {
      variant: "default",
      placement: "top",
    },
  }
)

type TooltipProps = React.ComponentProps<"div">
  & VariantProps<typeof tooltipVariants>
  & {
    asChild?: boolean,
    content?: React.ReactNode,
  }

/** DaisyUI tooltip wrapper; optional `content` and placement/variant styling. */
function Tooltip({
  variant,
  className,
  children,
  placement,
  modifier,
  content,
  asChild = false,
  ...props
}: TooltipProps) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="div"
      className={cn(tooltipVariants({
        variant,
        placement,
        modifier,
        className
      }))}
      {...props}
    >
      {content && (
        <div className="tooltip-content">
          <b className="anmate-in">{content}</b>
        </div>
      )}
      {children}
    </Comp>
  );
}

export {
  Tooltip,
  tooltipVariants,
  type TooltipProps,
}
