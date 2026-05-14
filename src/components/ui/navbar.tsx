import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

type NavbarProps = React.ComponentProps<"nav"> & {
  asChild?: boolean
}

type NavbarPartProps = React.ComponentProps<"div"> & {
  asChild?: boolean
}

/** Top navigation bar container (DaisyUI `navbar`). */
function Navbar({ className, asChild = false, ...props }: NavbarProps) {
  const Comp = asChild ? Slot : "nav"

  return <Comp className={cn("navbar", className)} {...props} />
}

/** Left section of a `Navbar`. */
function NavbarStart({ className, asChild = false, ...props }: NavbarPartProps) {
  const Comp = asChild ? Slot : "div"

  return <Comp className={cn("navbar-start", className)} {...props} />
}

/** Center section of a `Navbar` (e.g. title). */
function NavbarCenter({ className, asChild = false, ...props }: NavbarPartProps) {
  const Comp = asChild ? Slot : "div"

  return <Comp className={cn("navbar-center", className)} {...props} />
}

/** Right section of a `Navbar` (e.g. actions). */
function NavbarEnd({ className, asChild = false, ...props }: NavbarPartProps) {
  const Comp = asChild ? Slot : "div"

  return <Comp className={cn("navbar-end", className)} {...props} />
}

export { Navbar, NavbarStart, NavbarCenter, NavbarEnd, type NavbarProps, type NavbarPartProps }
