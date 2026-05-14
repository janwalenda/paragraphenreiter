import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DaisyUI “filter” group: radio inputs styled as buttons, with optional reset behavior.
 *
 * @see https://daisyui.com/components/filter/
 */
function Filter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter"
      className={cn("filter flex flex-wrap gap-1", className)}
      {...props}
    />
  );
}

/** Same as {@link Filter} but rendered as a `<form>` for native reset support. */
function FilterForm({ className, ...props }: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="filter-form"
      className={cn("filter flex flex-wrap gap-1", className)}
      {...props}
    />
  );
}

/**
 * Native `<input type="reset">` styled as a small square button (DaisyUI filter pattern).
 */
function FilterFormReset({
  className,
  value = "×",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type="reset"
      data-slot="filter-form-reset"
      value={value}
      className={cn("btn btn-square btn-sm shrink-0", className)}
      {...props}
    />
  );
}

type FilterRadioProps = Omit<React.ComponentProps<"input">, "type"> & {
  /**
   * When true, adds DaisyUI `filter-reset` so this radio clears the group to “all”
   * without a separate form reset control.
   */
  reset?: boolean;
};

/**
 * Radio styled as a `btn`; pass `reset` for the first “show all” chip in a filter group.
 */
function FilterRadio({ className, reset, ...props }: FilterRadioProps) {
  return (
    <input
      type="radio"
      data-slot="filter-radio"
      className={cn("btn btn-sm shrink-0", reset && "filter-reset", className)}
      {...props}
    />
  );
}

export { Filter, FilterForm, FilterFormReset, FilterRadio };
