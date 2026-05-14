import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const menuVariants = cva(
  "menu",
  {
    variants: {
      direction: {
        vertical: "menu-vertical",
        horizontal: "menu-horizontal",
      },
      size: {
        default: "menu-md",
        xs: "menu-xs",
        sm: "menu-sm",
        lg: "menu-lg",
        xl: "menu-xl",
      },
      modifier: {
        wide: "menu-disabled",
        block: "menu-active",
        square: "menu-focus",
        circle: "menu-dropdown-show",
      }
    },
    defaultVariants: {
      direction: "vertical",
      size: "default",
    },
  }
)

/** DaisyUI menu list (`<ul>`) with horizontal/vertical layout variants. */
function Menu({
  className,
  size,
  direction,
  modifier,
  asChild = false,
  ...props
}: React.ComponentProps<"ul"> &
  VariantProps<typeof menuVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "ul"

  return (
    <Comp
      data-slot="button"
      className={cn(menuVariants({ size,  modifier, direction, className }))}
      {...props}
    />
  )
}

export { Menu, menuVariants }
