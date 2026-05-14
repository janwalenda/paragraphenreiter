import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, type TooltipProps } from "./tooltip"

const fileInputVariants = cva(
  "file-input",
  {
    variants: {
      variant: {
        default: "file-input-primary",
        primary: "file-input-primary",
        secondary: "file-input-secondary",
        neutral: "file-input-neutral",
        accent: "file-input-accent",
        info: "file-input-info",
        success: "file-input-success",
        warning: "file-input-warning",
        error: "file-input-error",
      },
      inputStyle: {
        ghost: "file-input-ghost",
      },
      sizeVariant: {
        default: "file-input-md",
        md: "file-input-md",
        xs: "file-input-xs",
        sm: "file-input-sm",
        lg: "file-input-lg",
        xl: "file-input-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      sizeVariant: "default",
    },
  }
)

type Variant = VariantProps<typeof fileInputVariants>

type InputProps = React.ComponentProps<"input"> & Variant & {
  asChild?: boolean,
  tooltip?: TooltipProps,
}

/** Styled `<input type="file">` with optional tooltip wrapper. */
function Input({
  className,
  variant,
  sizeVariant,
  inputStyle,
  asChild = false,
  tooltip,
  ...props
}: InputProps) {
  const Comp = asChild ? Slot : "input"

  return (
    <Tooltip variant={variant} {...tooltip}>
      <Comp
        data-slot="input"
        type="file"
        className={cn(fileInputVariants({ variant, sizeVariant, inputStyle, className }))}
        {...props}
        aria-label={tooltip?.content}
      />
    </Tooltip>
  )
}

export { Input, fileInputVariants, type InputProps }
