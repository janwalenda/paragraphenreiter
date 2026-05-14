"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Swap, SwapOff, SwapOn } from "./ui/swap";

/**
 * DaisyUI `theme-controller`: the checkbox `value` is the theme applied when checked.
 * We mirror the system scheme so “off” matches the OS look and checking switches to the opposite theme.
 */
export default function ThemeController() {
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemPrefersDark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (systemPrefersDark === null) {
    return (
      <Button
        buttonStyle="ghost"
        modifier="circle"
        type="button"
        disabled
        aria-busy="true"
        aria-label="Theme"
      >
        <span className="inline-block size-4 rounded-full bg-base-content/15" />
      </Button>
    );
  }

  // System light: unchecked = light (Sun off), checked = dark (Moon on), value targets dark
  if (!systemPrefersDark) {
    return (
      <Button buttonStyle="ghost" modifier="circle" asChild>
        <Swap
          checkboxProps={{
            value: "dark",
            className: "theme-controller",
            "aria-label": "Toggle dark mode",
          }}
        >
          <SwapOn asChild>
            <Sun className="size-4" aria-hidden />
          </SwapOn>
          <SwapOff asChild>
            <Moon className="size-4" aria-hidden />
          </SwapOff>
        </Swap>
      </Button>
    );
  }

  // System dark: unchecked = dark (Moon off), checked = light (Sun on), value targets light
  return (
    <Button buttonStyle="ghost" modifier="circle" asChild>
      <Swap
        checkboxProps={{
          value: "light",
          className: "theme-controller",
          "aria-label": "Toggle light mode",
        }}
      >
        <SwapOn asChild>
          <Moon className="size-4" aria-hidden />
        </SwapOn>
        <SwapOff asChild>
          <Sun className="size-4" aria-hidden />
        </SwapOff>
      </Swap>
    </Button>
  );
}
