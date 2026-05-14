import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { inputVariants } from "./input"

/** Label wrapping an input with shared variant classes and optional slot icons. */
function LabeledInput({
  className,
  variant,
  sizeVariant,
  inputStyle,
  asChild = false,
  startIcon,
  endIcon,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    asChild?: boolean,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
  }) {
  const Comp = asChild ? Slot : "label"

  return (
    <Comp
      data-slot="label"
      className={cn(inputVariants({ variant, sizeVariant, inputStyle, className }))}
    >
      {startIcon && startIcon}
      <input {...props} />
      {endIcon && endIcon}
    </Comp>
  )
}

export { LabeledInput, inputVariants as buttonVariants }
