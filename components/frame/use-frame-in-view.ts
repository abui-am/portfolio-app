"use client";

import { useEffect, useRef, useState } from "react";

interface UseFrameInViewOptions {
  /** Skip IntersectionObserver — use for above-the-fold hero frames. */
  eager?: boolean;
}

export function useFrameInView(threshold = 0.15, options: UseFrameInViewOptions = {}) {
  const { eager = false } = options;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(eager);

  useEffect(() => {
    if (eager) return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    function startObserving() {
      if (cancelled || observer) return;

      const target = ref.current;
      if (!target) return;

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

      observer.observe(target);
    }

    // Wait one frame so canvas scale/pan is settled before reveal animations run.
    const raf = requestAnimationFrame(startObserving);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [eager, threshold]);

  return { ref, inView };
}
