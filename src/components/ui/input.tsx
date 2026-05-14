import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tooltip, type TooltipProps } from "./tooltip"

const inputVariants = cva(
  "input",
  {
    variants: {
      variant: {
        default: "input-primary",
        primary: "input-primary",
        secondary: "input-secondary",
        neutral: "input-neutral",
        accent: "input-accent",
        info: "input-info",
        success: "input-success",
        warning: "input-warning",
        error: "input-error",
      },
      inputStyle: {
        ghost: "input-ghost",
      },
      sizeVariant: {
        default: "input-md",
        md: "input-md",
        xs: "input-xs",
        sm: "input-sm",
        lg: "input-lg",
        xl: "input-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      sizeVariant: "default",
    },
  }
)

type Variant = VariantProps<typeof inputVariants>

type InputProps = React.ComponentProps<"input"> & Variant & {
  asChild?: boolean,
  tooltip?: TooltipProps,
}

/** Styled text input with optional tooltip wrapper. */
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


  if (tooltip) {
    return (
      <Tooltip variant={variant} {...tooltip}>
        <Comp
          data-slot="input"
          className={cn(inputVariants({ variant, sizeVariant, inputStyle, className }))}
          {...props}
        />
      </Tooltip>
    )
  }

  return (
    <Comp
      data-slot="input"
      className={cn(inputVariants({ variant, sizeVariant, inputStyle, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants, type InputProps }
