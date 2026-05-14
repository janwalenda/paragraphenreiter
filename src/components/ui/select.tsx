import { Tooltip, type TooltipProps } from "@/components/ui/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const selectVariants = cva(
  "select",
  {
    variants: {
      variant: {
        primary: "select-primary",
        secondary: "select-secondary",
        neutral: "select-neutral",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export default function Select({
  variant,
  className,
  children,
  tooltip,
  asChild,
  ...props
}: React.ComponentProps<"select"> & VariantProps<typeof selectVariants> & {
  asChild?: boolean,
  tooltip?: TooltipProps,
}) {
  const variantClasses = selectVariants({ variant });
  const classN = cn(variantClasses, className);
  const Comp = asChild ? Slot : "select"


  return (
    <Tooltip variant={variant} {...tooltip}>
      <Comp {...props} className={classN} aria-label={tooltip?.content}>
        {children}
      </Comp>
    </Tooltip>
  )
}
