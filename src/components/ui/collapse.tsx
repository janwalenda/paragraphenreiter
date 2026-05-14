import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const collapseVariants = cva(
  "collapse",
  {
    variants: {
      modifier: {
        arrow: "collapse-arrow",
        plus: "collapse-plus",
        open: "collapse-open",
        close: "collapse-close",
      },
    },
    defaultVariants: {
      modifier: "arrow",
    },
  }
)

/** Expandable `<details>` panel (DaisyUI `collapse`). */
export function Collapse({
  className,
  modifier,
  asChild = false,
  ...props
}: React.ComponentProps<"details"> &
  VariantProps<typeof collapseVariants> & {
    asChild?: boolean,  
  }) {

  const Comp = asChild ? Slot : "details"
  return (
    <Comp
      data-slot="details"
      className={cn(collapseVariants({ modifier, className }))}
      {...props}
    >
      {props.children}
    </Comp>
  )
}

/** Summary line / title for `Collapse`. */
export function CollapseTitle({ children, className, ...props }: React.ComponentProps<"summary">) {
  return (
    <summary className={cn("collapse-title text-xl font-semibold", className)} {...props}>
      {children}
    </summary>
  )
}

/** Expandable body region for `Collapse`. */
export function CollapseContent({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("collapse-content", className)} {...props}>
      {children}
    </div>
  )
}
