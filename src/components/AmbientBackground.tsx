/** Decorative blurred gradient orbs behind page content (non-interactive). */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-40"
      aria-hidden
    >
      <div className="absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -right-1/4 bottom-0 h-[380px] w-[60%] rounded-full bg-secondary/20 blur-3xl" />
    </div>
  );
}
