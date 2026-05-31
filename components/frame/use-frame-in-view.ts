"use client";

import { useEffect, useRef, useState } from "react";

export function useFrameInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    function startObserving() {
      if (cancelled || observer) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setInView(true);
            observer?.disconnect();
            observer = null;
          }
        },
        { threshold },
      );

      observer.observe(node);
    }

    // Wait one frame so canvas scale/pan is settled before reveal animations run.
    const raf = requestAnimationFrame(startObserving);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [threshold]);

  return { ref, inView };
}
