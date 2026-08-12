import Lenis from "lenis";

function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let lenis: Lenis | null = null;

  const syncPreference = () => {
    if (prefersReducedMotion.matches) {
      lenis?.destroy();
      lenis = null;
      return;
    }

    if (!lenis) {
      lenis = new Lenis({ autoRaf: true });
    }
  };

  syncPreference();
  prefersReducedMotion.addEventListener("change", syncPreference);
}

initSmoothScroll();
