import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const modalVariants = cva(
  "modal",
  {
    variants: {
      modifier: {
        open: "modal-open",
      },
      placement: {
        top: "modal-top",
        middle: "modal-middle",
        bottom: "modal-bottom",
        left: "modal-start",
        right: "modal-end",
      },
    },
    defaultVariants: {
      placement: "middle",
    },
  }
)

/** Native `<dialog>` modal with DaisyUI positioning and optional backdrop close. */
export function Modal({
  placement,
  children,
  className,
  asChild,
  backdrop = false,
  ...props
}: React.ComponentProps<"dialog"> &
  VariantProps<typeof modalVariants> & {
    asChild?: boolean,
    backdrop?: boolean,
  }) {
  const Comp = asChild ? Slot : "dialog"

  return (
    <Comp className={cn(modalVariants({ placement }))} {...props}>
      <div className={cn("modal-box", className)}>
        {children}
        <form method="dialog">
          <Button variant="neutral"
            className="absolute top-1 right-1"
            modifier="circle"
            buttonStyle="ghost"
            title="Close">
            <X />
          </Button>
        </form>
      </div>
      {backdrop && (
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      )}
    </Comp>
  )
}

/** Footer action row inside a `Modal` (DaisyUI `modal-action`). */
export function ModalAction({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean,
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp className={cn("modal-action", className)} {...props}>
      {children}
    </Comp>
  )
}
