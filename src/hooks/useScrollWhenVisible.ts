import { useEffect, type RefObject } from "react";

export function useScrollWhenVisible(
  ref: RefObject<Element | null>,
  handler: () => void,
  extraEl?: HTMLElement | null,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = false;

    const attach = () => {
      if (active) return;
      active = true;
      window.addEventListener("scroll", handler, { passive: true });
      extraEl?.addEventListener("scroll", handler, { passive: true });
      handler();
    };

    const detach = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", handler);
      extraEl?.removeEventListener("scroll", handler);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? attach() : detach(); },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      detach();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, extraEl]);
}
