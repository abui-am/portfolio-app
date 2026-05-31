"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFigmaCanvas } from "@/components/figma-shell/figma-canvas-context";
import { findLayerElement, getLayerBounds } from "@/components/figma-shell/layer-focus";

interface PannableCanvasViewportProps {
  children: React.ReactNode;
  initialFrameId?: string;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const REFERENCE_VIEWPORT_WIDTH_PX = 1440;
const WIDE_SCREEN_SCALE_DAMPING = 0.0;
const PINCH_ZOOM_SENSITIVITY = 0.01;
const ZOOM_STEP_PERCENT = 50;

function getNextZoomIn(scale: number) {
  const nextPercent = Math.floor((scale * 100) / ZOOM_STEP_PERCENT) * ZOOM_STEP_PERCENT + ZOOM_STEP_PERCENT;
  return clampScale(nextPercent / 100);
}

function getNextZoomOut(scale: number) {
  const nextPercent = Math.ceil((scale * 100) / ZOOM_STEP_PERCENT) * ZOOM_STEP_PERCENT - ZOOM_STEP_PERCENT;
  return clampScale(Math.max(MIN_SCALE * 100, nextPercent) / 100);
}

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

const COPYABLE_TEXT_SELECTOR =
  'p, h1, h2, h3, h4, h5, h6, li, pre, code, blockquote, figcaption, td, th, time, a, span:not([data-frame-dot]):not([aria-hidden])';

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [data-canvas-interactive], [data-figma-frame-label]',
    ),
  );
}

function isCopyableTextTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest("button, [role='button']")) return false;
  return Boolean(target.closest(COPYABLE_TEXT_SELECTOR));
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function scaleFromViewportWidth(widthPx: number) {
  if (widthPx <= 0) return clampScale(1);
  const linear = widthPx / REFERENCE_VIEWPORT_WIDTH_PX;
  if (linear <= 1) return clampScale(linear);
  const excessAboveOne = linear - 1;
  return clampScale(1 + excessAboveOne * WIDE_SCREEN_SCALE_DAMPING);
}

export function PannableCanvasViewport({ children, initialFrameId }: PannableCanvasViewportProps) {
  const { registerFocusHandler, registerZoomApi, panToLayer, notifyScaleChange } = useFigmaCanvas();
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const hasManualZoomRef = useRef(false);

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
  const hasInitialFocusRef = useRef(false);

  const setScaleAtViewportCenter = useCallback((targetScale: number) => {
    const oldScale = scaleRef.current;
    const newScale = clampScale(targetScale);
    if (newScale === oldScale) return;

    hasManualZoomRef.current = true;
    const ratio = newScale / oldScale;
    panRef.current = {
      x: panRef.current.x * ratio,
      y: panRef.current.y * ratio,
    };
    scaleRef.current = newScale;
    applyTransformRef.current();
    notifyScaleChange();
  }, [notifyScaleChange]);

  const zoomIn = useCallback(
    () => setScaleAtViewportCenter(getNextZoomIn(scaleRef.current)),
    [setScaleAtViewportCenter],
  );
  const zoomOut = useCallback(
    () => setScaleAtViewportCenter(getNextZoomOut(scaleRef.current)),
    [setScaleAtViewportCenter],
  );

  const focusOnLayer = useCallback((layerId: string) => {
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!viewport || !layer) return;

    const target = findLayerElement(layer, layerId);
    if (!target) return;

    const bounds = getLayerBounds(target);
    if (bounds.width === 0 && bounds.height === 0) return;

    const viewportRect = viewport.getBoundingClientRect();
    const targetCenterX = bounds.left + bounds.width / 2;
    const targetCenterY = bounds.top + bounds.height / 2;
    const viewportCenterX = viewportRect.left + viewportRect.width / 2;
    const viewportCenterY = viewportRect.top + viewportRect.height / 2;

    panRef.current = {
      x: panRef.current.x + (viewportCenterX - targetCenterX),
      y: panRef.current.y + (viewportCenterY - targetCenterY),
    };
    applyTransformRef.current();
  }, []);

  useLayoutEffect(() => {
    registerFocusHandler(focusOnLayer);
    return () => registerFocusHandler(null);
  }, [focusOnLayer, registerFocusHandler]);

  useLayoutEffect(() => {
    registerZoomApi({
      zoomIn,
      zoomOut,
      getScale: () => scaleRef.current,
    });
    return () => registerZoomApi(null);
  }, [zoomIn, zoomOut, registerZoomApi]);

  useEffect(() => {
    if (!initialFrameId || hasInitialFocusRef.current) return;

    const frameId = initialFrameId;
    let cancelled = false;
    let attempts = 0;

    function tryInitialFocus() {
      if (cancelled || hasInitialFocusRef.current) return;

      const layer = layerRef.current;
      const target = layer ? findLayerElement(layer, frameId) : null;

      if (!target && attempts < 20) {
        attempts += 1;
        requestAnimationFrame(tryInitialFocus);
        return;
      }

      if (!target) return;

      hasInitialFocusRef.current = true;
      panToLayer(frameId);
    }

    requestAnimationFrame(tryInitialFocus);

    return () => {
      cancelled = true;
    };
  }, [initialFrameId, panToLayer]);

  const wheelAccumRef = useRef({ x: 0, y: 0 });
  const wheelRafRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      const modKey = e.ctrlKey || e.metaKey;

      if (modKey && (e.key === "=" || e.key === "+" || e.code === "Equal")) {
        e.preventDefault();
        zoomIn();
        return;
      }

      if (modKey && (e.key === "-" || e.code === "Minus")) {
        e.preventDefault();
        zoomOut();
        return;
      }

      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [zoomIn, zoomOut]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let lastWidth = -1;

    function applyScaleFromWidth(width: number) {
      if (Math.abs(width - lastWidth) < 0.5) return;
      lastWidth = width;
      if (hasManualZoomRef.current) return;

      scaleRef.current = scaleFromViewportWidth(width);
      applyTransformRef.current();
      notifyScaleChange();
    }

    applyScaleFromWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.getBoundingClientRect().width;
      applyScaleFromWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [notifyScaleChange]);

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
      if (!el) return;

      if (e.ctrlKey) {
        hasManualZoomRef.current = true;
        const factor = Math.exp(-e.deltaY * PINCH_ZOOM_SENSITIVITY);
        const oldScale = scaleRef.current;
        const newScale = clampScale(oldScale * factor);
        if (newScale === oldScale) return;

        const viewportRect = el.getBoundingClientRect();
        const focusX = e.clientX - viewportRect.left - viewportRect.width / 2;
        const focusY = e.clientY - viewportRect.top - viewportRect.height / 2;
        const ratio = newScale / oldScale;

        panRef.current = {
          x: panRef.current.x * ratio + focusX * (1 - ratio),
          y: panRef.current.y * ratio + focusY * (1 - ratio),
        };
        scaleRef.current = newScale;
        applyTransformRef.current();
        notifyScaleChange();
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
  }, [notifyScaleChange]);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setIsGrabbing(false);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return;
    if (isInteractiveTarget(e.target)) return;
    if (isCopyableTextTarget(e.target)) return;

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
      className={`relative flex min-h-0 flex-1 items-center justify-center touch-none overflow-hidden bg-[#f5f5f5] ${isGrabbing ? "select-none" : ""}`}
      style={{ cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onAuxClick={(e) => e.button === 1 && e.preventDefault()}
      role="application"
      aria-label="Canvas. Drag to pan. Two-finger scroll to pan. Pinch or Ctrl+/- to zoom."
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
