import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const swapVariants = cva("swap", {
  variants: {
    swapStyle: {
      rotate: "swap-rotate",
      flip: "swap-flip",
    },
    active: {
      true: "swap-active",
      false: "",
    },
  },
  defaultVariants: {
    swapStyle: "rotate",
    active: false,
  },
});

type SwapProps = React.ComponentProps<"label"> & VariantProps<typeof swapVariants> & {
  checkboxProps?: Omit<React.ComponentProps<"input">, "type">;
};

function Swap({ children, swapStyle, active, className, checkboxProps, ...props }: SwapProps) {
  return (
    <label className={cn(swapVariants({ swapStyle, active }), className)} {...props}>
      <input type="checkbox" {...checkboxProps} />
      {children}
    </label>
  );
}

function SwapOn({ asChild = false, ...props }: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp className="swap-on" {...props} />;
}

function SwapOff({ asChild = false, ...props }: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp className="swap-off" {...props} />;
}

export { Swap, type SwapProps, SwapOn, SwapOff };
