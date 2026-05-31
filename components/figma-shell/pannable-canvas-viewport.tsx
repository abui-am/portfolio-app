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
const DRAG_THRESHOLD_PX = 6;

function touchDistance(touches: TouchList) {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function touchFocusPoint(touches: TouchList, viewportRect: DOMRect) {
  const x = (touches[0].clientX + touches[1].clientX) / 2;
  const y = (touches[0].clientY + touches[1].clientY) / 2;
  return {
    focusX: x - viewportRect.left - viewportRect.width / 2,
    focusY: y - viewportRect.top - viewportRect.height / 2,
  };
}

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

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [data-canvas-interactive], [data-figma-frame-label]',
    ),
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function getScrollableAncestor(target: EventTarget | null, boundary: HTMLElement) {
  if (!(target instanceof Element)) return null;

  let node: Element | null = target;
  while (node && node !== boundary) {
    if (!(node instanceof HTMLElement)) {
      node = node.parentElement;
      continue;
    }

    if (node.dataset.canvasScroll !== undefined || node.dataset.canvasInteractive !== undefined) {
      return node;
    }

    const style = getComputedStyle(node);
    const canScrollY =
      (style.overflowY === "auto" || style.overflowY === "scroll") && node.scrollHeight > node.clientHeight + 1;
    const canScrollX =
      (style.overflowX === "auto" || style.overflowX === "scroll") && node.scrollWidth > node.clientWidth + 1;

    if (canScrollY || canScrollX) return node;
    node = node.parentElement;
  }

  return null;
}

function canScrollElement(element: HTMLElement, deltaX: number, deltaY: number) {
  const style = getComputedStyle(element);
  const canScrollY =
    (style.overflowY === "auto" || style.overflowY === "scroll") && element.scrollHeight > element.clientHeight + 1;
  const canScrollX =
    (style.overflowX === "auto" || style.overflowX === "scroll") && element.scrollWidth > element.clientWidth + 1;

  if (canScrollY && deltaY !== 0) {
    if (deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true;
    if (deltaY < 0 && element.scrollTop > 0) return true;
  }

  if (canScrollX && deltaX !== 0) {
    if (deltaX > 0 && element.scrollLeft + element.clientWidth < element.scrollWidth - 1) return true;
    if (deltaX < 0 && element.scrollLeft > 0) return true;
  }

  return false;
}

function shouldUseNativeScroll(target: EventTarget | null, boundary: HTMLElement, deltaX: number, deltaY: number) {
  const scrollable = getScrollableAncestor(target, boundary);
  if (!scrollable) return false;
  return canScrollElement(scrollable, deltaX, deltaY);
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

  const pendingDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    target: EventTarget;
  } | null>(null);

  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

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
      if (!el) return;

      if (e.ctrlKey) {
        e.preventDefault();
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

      if (shouldUseNativeScroll(e.target, el, e.deltaX, e.deltaY)) return;

      e.preventDefault();

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
    pendingDragRef.current = null;
    setIsGrabbing(false);
  }, []);

  const beginDrag = useCallback(
    (pointerId: number, startX: number, startY: number, originX: number, originY: number) => {
      dragRef.current = { pointerId, startX, startY, originX, originY };
      pendingDragRef.current = null;
      setIsGrabbing(true);
    },
    [],
  );

  const cancelPendingDrag = useCallback((viewport: HTMLDivElement, pointerId: number) => {
    pendingDragRef.current = null;
    try {
      viewport.releasePointerCapture(pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const shouldDeferToScrollable = useCallback(
    (target: EventTarget, boundary: HTMLElement, deltaX: number, deltaY: number) => {
      const scrollable = getScrollableAncestor(target, boundary);
      if (!scrollable) return false;
      if (Math.abs(deltaY) <= Math.abs(deltaX)) return false;
      return canScrollElement(scrollable, 0, deltaY);
    },
    [],
  );

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return;
    if (isInteractiveTarget(e.target)) return;
    if (pinchRef.current) return;

    const isMiddle = e.button === 1;
    const isPrimary = e.button === 0;
    if (!isPrimary && !isMiddle) return;

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    const p = panRef.current;
    pendingDragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: p.x,
      originY: p.y,
      target: e.target,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const viewport = e.currentTarget;
      const pending = pendingDragRef.current;

      if (pending && pending.pointerId === e.pointerId && !dragRef.current) {
        const dx = e.clientX - pending.startX;
        const dy = e.clientY - pending.startY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

        if (shouldDeferToScrollable(pending.target, viewport, dx, dy)) {
          cancelPendingDrag(viewport, pending.pointerId);
          return;
        }

        e.preventDefault();
        beginDrag(pending.pointerId, pending.startX, pending.startY, pending.originX, pending.originY);
      }

      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      e.preventDefault();
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      panRef.current = { x: d.originX + dx, y: d.originY + dy };
      applyTransformRef.current();
    },
    [beginDrag, cancelPendingDrag, shouldDeferToScrollable],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pendingDragRef.current?.pointerId === e.pointerId) {
        cancelPendingDrag(e.currentTarget, e.pointerId);
      }

      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      endDrag();
    },
    [cancelPendingDrag, endDrag],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 2) return;

      pendingDragRef.current = null;
      endDrag();
      hasManualZoomRef.current = true;
      pinchRef.current = {
        distance: touchDistance(e.touches),
        scale: scaleRef.current,
      };
    }

    const viewport = el;

    function onTouchMove(e: TouchEvent) {
      if (!pinchRef.current || e.touches.length !== 2) return;

      e.preventDefault();
      const distance = touchDistance(e.touches);
      if (distance <= 0) return;

      const oldScale = scaleRef.current;
      const newScale = clampScale(pinchRef.current.scale * (distance / pinchRef.current.distance));
      if (newScale === oldScale) return;

      const viewportRect = viewport.getBoundingClientRect();
      const { focusX, focusY } = touchFocusPoint(e.touches, viewportRect);
      const ratio = newScale / oldScale;

      panRef.current = {
        x: panRef.current.x * ratio + focusX * (1 - ratio),
        y: panRef.current.y * ratio + focusY * (1 - ratio),
      };
      scaleRef.current = newScale;
      applyTransformRef.current();
      notifyScaleChange();
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length >= 2) return;
      pinchRef.current = null;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [endDrag, notifyScaleChange]);

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
      className={`relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden bg-[#f5f5f5] ${isGrabbing ? "select-none" : ""}`}
      style={{ cursor, touchAction: "none" }}
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
