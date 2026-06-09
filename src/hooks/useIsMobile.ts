import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  // Start false so the first client render matches the server (avoids a
  // hydration mismatch); the real value is applied in the effect after mount.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${breakpoint - 1}px)`;
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [breakpoint]);

  return isMobile;
}
