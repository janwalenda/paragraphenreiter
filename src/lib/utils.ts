import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with `clsx`, then resolves Tailwind conflicts via `tailwind-merge`.
 *
 * @param inputs - Any values accepted by `clsx`.
 * @returns A single `className` string safe for DOM components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
