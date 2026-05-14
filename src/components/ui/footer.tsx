import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { H6 } from "./heading"

type FooterProps = React.ComponentProps<"div"> & {
  asChild?: boolean
}

/** Page footer with DaisyUI `footer` layout inside a semantic `<footer>`. */
export function Footer({ asChild, children, className, ...props }: FooterProps) {
  const Comp = asChild ? Slot : "div"
  return (
    <footer className="w-full flex flex-col items-center justify-center bg-base-200 text-base-content">
      <Comp className={cn("footer sm:footer-horizontal p-4", className)} {...props}>
        {children}
      </Comp>
    </footer>
  )
}

type FooterColumnProps = React.ComponentProps<"nav"> & {
  title: string
}

/** Single titled column within `Footer`. */
export function FooterColumn({ children, className, title, ...props }: FooterColumnProps) {
  return (
    <nav className={cn("footer-column", className)} {...props}>
      <H6 className="footer-title">{title}</H6>
      {children}
    </nav>
  )
}
