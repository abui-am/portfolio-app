"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface PannableCanvasViewportProps {
  children: React.ReactNode;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
/** Viewport width (px) at which canvas scale is 1. Narrower → zoom out, wider → zoom in. */
const REFERENCE_VIEWPORT_WIDTH_PX = 1440;
/**
 * For widths above the reference width, only this fraction of the extra linear scale is applied,
 * so ultra-wide screens stay a bit smaller than a full width/1440 zoom-in.
 */
const WIDE_SCREEN_SCALE_DAMPING = 0.0;
/** Mac trackpad pinch sends `wheel` + `ctrlKey` (Chrome, Safari, Edge). */
const PINCH_ZOOM_SENSITIVITY = 0.01;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('a, button, input, textarea, select, label, summary, [role="button"], [role="link"]'),
  );
}

function scaleFromViewportWidth(widthPx: number) {
  if (widthPx <= 0) return clampScale(1);
  const linear = widthPx / REFERENCE_VIEWPORT_WIDTH_PX;
  if (linear <= 1) return clampScale(linear);
  const excessAboveOne = linear - 1;
  return clampScale(1 + excessAboveOne * WIDE_SCREEN_SCALE_DAMPING);
}

export function PannableCanvasViewport({ children }: PannableCanvasViewportProps) {
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  const layerRef = useRef<HTMLDivElement>(null);

  const applyTransformRef = useRef(() => {});

  applyTransformRef.current = () => {
    const el = layerRef.current;
    if (!el) return;
    const { x, y } = panRef.current;
    const s = scaleRef.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
  };

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [isGrabbing, setIsGrabbing] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const wheelAccumRef = useRef({ x: 0, y: 0 });
  const wheelRafRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let lastWidth = -1;

    function applyScaleFromWidth(width: number) {
      if (Math.abs(width - lastWidth) < 0.5) return;
      lastWidth = width;
      scaleRef.current = scaleFromViewportWidth(width);
      applyTransformRef.current();
    }

    applyScaleFromWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.getBoundingClientRect().width;
      applyScaleFromWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function flushWheelPan() {
      wheelRafRef.current = 0;
      const acc = wheelAccumRef.current;
      if (acc.x === 0 && acc.y === 0) return;
      panRef.current = {
        x: panRef.current.x - acc.x,
        y: panRef.current.y - acc.y,
      };
      wheelAccumRef.current = { x: 0, y: 0 };
      applyTransformRef.current();
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      if (e.ctrlKey) {
        const factor = Math.exp(-e.deltaY * PINCH_ZOOM_SENSITIVITY);
        scaleRef.current = clampScale(scaleRef.current * factor);
        applyTransformRef.current();
        return;
      }

      wheelAccumRef.current.x += e.deltaX;
      wheelAccumRef.current.y += e.deltaY;
      if (!wheelRafRef.current) {
        wheelRafRef.current = requestAnimationFrame(flushWheelPan);
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelRafRef.current) cancelAnimationFrame(wheelRafRef.current);
    };
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setIsGrabbing(false);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return;
    if (isInteractiveTarget(e.target)) return;

    const isMiddle = e.button === 1;
    const isPrimary = e.button === 0;
    if (!isPrimary && !isMiddle) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = panRef.current;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: p.x,
      originY: p.y,
    };
    setIsGrabbing(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    e.preventDefault();
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    panRef.current = { x: d.originX + dx, y: d.originY + dy };
    applyTransformRef.current();
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      endDrag();
    },
    [endDrag],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      endDrag();
    },
    [endDrag],
  );

  const cursor = isGrabbing ? "grabbing" : "grab";

  return (
    <div
      ref={viewportRef}
      className="relative flex min-h-0 flex-1 items-center justify-center touch-none overflow-hidden bg-[#f5f5f5] select-none"
      style={{ cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onAuxClick={(e) => e.button === 1 && e.preventDefault()}
      role="application"
      aria-label="Canvas. Drag to pan. Two-finger scroll to pan. Pinch to zoom."
    >
      <div
        ref={layerRef}
        className="flex shrink-0 will-change-transform"
        style={{
          transform: "translate3d(0px, 0px, 0) scale(1)",
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
