"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

export function SmoothScroll() {
  const [shouldSmoothScroll, setShouldSmoothScroll] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPreference = () => {
      setShouldSmoothScroll(!mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  if (!shouldSmoothScroll) {
    return null;
  }

  return <ReactLenis root options={{ autoRaf: true }} />;
}
