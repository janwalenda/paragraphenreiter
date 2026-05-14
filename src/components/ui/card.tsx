import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { H2 } from "./heading"

const cardVariants = cva(
  "card bg-base-100",
  {
    variants: {
      cardStyle: {
        border: "card-border",
        dash: "card-dash",
      },
      modifier: {
        side: "card-side",
        fullImage: "image-full",
      },
      size: {
        default: "card-md",
        xs: "card-xs",
        sm: "card-sm",
        lg: "card-lg",
        xl: "card-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/** Card surface with optional `asChild` composition (DaisyUI `card`). */
function Card({
  className,
  size,
  cardStyle,
  modifier,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean,
  }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="div"
      className={cn(cardVariants({ size, modifier, cardStyle, className }))}
      {...props}
    >
      {props.children}
    </Comp>
  )
}

/** Main padded region inside a `Card`. */
function CardBody({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("card-body", className)}>
      {children}
    </div>
  )
}

/** Card heading; defaults to `H2` unless `asChild` passes a custom element. */
function CardTitle({ className, asChild = false, ...props }: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : H2
  
  return (
    <Comp className={cn("card-title", className)} {...props} />
  )
}

/** Right-aligned action row inside a `Card` (DaisyUI `card-actions`). */
function CardAction({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("card-actions justify-end", className)}>
      {children}
    </div>
  )
}

export { Card, CardBody, CardTitle, CardAction, cardVariants }
