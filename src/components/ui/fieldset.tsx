import { cn } from "@/lib/utils";
import { H6 } from "./heading";

/** DaisyUI fieldset with optional styled legend. */
export default function Fieldset({
  className,
  children,
  legend,
  ...props
}: React.ComponentProps<"fieldset"> & {
  legend?: React.ReactNode;
}) {

  return (
    <fieldset className={cn([
      "fieldset p-4 rounded-field bg-base-200 relative",
      className,
    ])}
    {...props}
    >
      {legend && (
        <legend className="fieldset-legend bg-neutral text-neutral-content px-4 rounded-field hover:bg-neutral/30 backdrop-blur-2xl transition-all">
          <H6>{legend}</H6>
        </legend>
      )}
      {children}
    </fieldset>
  )
}
