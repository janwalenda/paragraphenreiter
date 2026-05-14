import { cn } from "@/lib/utils";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/** Page title (`<h1>`) using the display font stack. */
export function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(raleway.className, "text-4xl font-bold", className)}
      {...props}
    />
  );
}

/** Section heading level 2. */
export function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(raleway.className, "text-3xl font-bold", className)}
      {...props}
    />
  );
}

/** Section heading level 3. */
export function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(raleway.className, "text-2xl font-bold", className)}
      {...props}
    />
  );
}

/** Section heading level 4. */
export function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(raleway.className, "text-xl font-bold", className)}
      {...props}
    />
  );
}

/** Section heading level 5. */
export function H5({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn(raleway.className, "text-lg font-bold", className)}
      {...props}
    />
  );
}

/** Section heading level 6. */
export function H6({ className, ...props }: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(raleway.className, "text-base font-bold", className)}
      {...props}
    />
  );
}
