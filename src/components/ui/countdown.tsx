import * as React from "react";
import { cn } from "@/lib/utils";

interface CountdownProps extends React.ComponentProps<"span"> {
  value: number;
  maxValue?: number;
}

/**
 * DaisyUI-style countdown display using CSS `--value` on nested spans.
 *
 * @param value - Total seconds to display (minutes and seconds derived).
 */
function Countdown({ value, maxValue: _maxValue, className, ...props }: CountdownProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return (
    <span
      className={cn("countdown font-mono text-2xl", className)}
      role="timer"
      aria-live="polite"
      aria-label={`${minutes} minutes and ${seconds} seconds`}
      {...props}
    >
      <span style={{ "--value": minutes } as React.CSSProperties} aria-hidden="true" />
      :
      <span style={{ "--value": seconds } as React.CSSProperties} aria-hidden="true" />
    </span>
  );
}

export { Countdown, type CountdownProps };
