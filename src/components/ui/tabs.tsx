import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsVariants = cva(
  "tabs",
  {
    variants: {
      tabStyle: {
        bordered: "tabs-bordered",
        lifted: "tabs-lifted",
        boxed: "tabs-boxed",
      },
      size: {
        xs: "tabs-xs",
        sm: "tabs-sm",
        md: "tabs-md",
        lg: "tabs-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/** Tab list container (DaisyUI `tabs`); children should be `Tab` buttons. */
function Tabs({
  className,
  tabStyle,
  size,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof tabsVariants>) {
  return (
    <div
      role="tablist"
      className={cn(tabsVariants({ tabStyle, size }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabProps extends React.ComponentProps<"button"> {
  active?: boolean
}

/** Single tab trigger inside `Tabs`. */
function Tab({ className, active, children, ...props }: TabProps) {
  return (
    <button
      role="tab"
      className={cn("tab", active && "tab-active", className)}
      aria-selected={active}
      {...props}
    >
      {children}
    </button>
  )
}

/** Panel region associated with a tab (DaisyUI `tab-content`). */
function TabContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="tabpanel"
      className={cn("tab-content p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, Tab, TabContent, tabsVariants }
