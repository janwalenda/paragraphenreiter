import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "toast",
  {
    variants: {
      placement: {
        topStart: "toast-top toast-start",
        topCenter: "toast-top toast-center",
        topEnd: "toast-top toast-end",
        middleStart: "toast-middle toast-start",
        middleCenter: "toast-middle toast-center",
        middleEnd: "toast-middle toast-end",
        bottomStart: "toast-bottom toast-start",
        bottomCenter: "toast-bottom toast-center",
        bottomEnd: "toast-bottom toast-end",
      },
    },
    defaultVariants: {
      placement: "bottomEnd",
    },
  }
)

const alertVariants = cva(
  "alert",
  {
    variants: {
      variant: {
        info: "alert-info",
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

export interface ToastMessage {
  id: string
  message: string
  variant?: "info" | "success" | "warning" | "error"
  duration?: number
}

/** Fixed-position toast stack container (DaisyUI `toast`). */
function Toast({
  className,
  placement,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof toastVariants>) {
  return (
    <div
      className={cn(toastVariants({ placement }), "z-50", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/** Inline alert box for use inside toasts or standalone (DaisyUI `alert`). */
function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Toast, Alert, toastVariants, alertVariants }
