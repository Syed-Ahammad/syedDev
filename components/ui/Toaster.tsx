"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast host. Reads the resolved next-themes value so toasts match the
 * active light/dark theme. Mounted once inside ThemeProvider in the root layout.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  );
}
