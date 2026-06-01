"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";
import { useIsSiteView } from "@/components/site/site-view-context";
import {
  getCarouselNextTop,
  getCarouselStripHeight,
  SELECTED_PROJECT_LAYOUT,
} from "@/components/frame/selected-project/layout";
import type { SelectedProjectScreenshot } from "@/components/frame/selected-project/types";

interface ProjectScreenshotCarouselProps {
  screenshots: SelectedProjectScreenshot[];
  viewportWidth?: number;
  ariaLabel: string;
}

function getMaxOffset(screenshots: SelectedProjectScreenshot[], viewportWidth: number) {
  const totalWidth = screenshots.reduce((sum, shot) => sum + shot.width, 0);
  return Math.max(0, totalWidth - viewportWidth);
}

function screenshotLayerName(src: string) {
  return src.split("/").pop() ?? src;
}

function needsCarouselLetterboxBg(screenshots: SelectedProjectScreenshot[], stripHeight: number) {
  return screenshots.some((shot) => shot.height !== stripHeight);
}

export function ProjectScreenshotCarousel({
  screenshots,
  viewportWidth = 1440,
  ariaLabel,
}: ProjectScreenshotCarouselProps) {
  const isSite = useIsSiteView();
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(viewportWidth);
  const effectiveViewportWidth = isSite ? Math.max(measuredWidth, 1) : viewportWidth;

  const siteSlides = isSite
    ? screenshots.map((shot) => {
        const width = Math.min(shot.width, effectiveViewportWidth);
        const height = Math.round((shot.height / shot.width) * width);
        return { ...shot, displayWidth: width, displayHeight: height };
      })
    : null;

  const scrollStep = isSite
    ? (siteSlides?.[0]?.displayWidth ?? 614)
    : (screenshots[0]?.width ?? 614);
  const maxOffset = isSite
    ? Math.max(0, (siteSlides?.reduce((sum, shot) => sum + shot.displayWidth, 0) ?? 0) - effectiveViewportWidth)
    : getMaxOffset(screenshots, effectiveViewportWidth);
  const [offset, setOffset] = useState(0);
  const layout = SELECTED_PROJECT_LAYOUT;
  const carouselStripHeight = isSite
    ? Math.max(...(siteSlides?.map((shot) => shot.displayHeight) ?? [379]))
    : getCarouselStripHeight(screenshots);
  const letterboxBg = isSite ? false : needsCarouselLetterboxBg(screenshots, carouselStripHeight);

  useEffect(() => {
    if (!isSite) return;
    const node = containerRef.current;
    if (!node) return;

    function updateWidth() {
      const el = containerRef.current;
      if (!el) return;
      setMeasuredWidth(el.clientWidth);
    }

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isSite]);

  useEffect(() => {
    if (!isSite) return;
    setOffset(0);
  }, [isSite, measuredWidth]);

  const handleNext = useCallback(() => {
    setOffset((prev) => {
      if (prev >= maxOffset) return 0;
      return Math.min(prev + scrollStep, maxOffset);
    });
  }, [maxOffset, scrollStep]);

  const stopCanvasPan = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  if (screenshots.length === 0) return null;

  if (isSite) {
    return (
      <FigmaLayer name="Screenshots" icon="frame" className="relative mt-8 w-full">
        <div ref={containerRef} className="relative w-full">
          <FigmaLayer
            name="Carousel"
            icon="group"
            data-frame-reveal="carousel"
            className={`relative w-full overflow-hidden rounded-xl${letterboxBg ? " bg-black" : ""}`}
            style={{ height: carouselStripHeight }}
            aria-roledescription="carousel"
            aria-label={ariaLabel}
          >
            <div
              className="flex flex-row transition-transform duration-500 ease-out"
              style={{ transform: `translate3d(-${offset}px, 0, 0)` }}
            >
              {(siteSlides ?? []).map((shot) => (
                <FigmaLayer
                  key={shot.src}
                  name={screenshotLayerName(shot.src)}
                  icon="image"
                  className="flex shrink-0 items-center justify-center"
                  style={{ width: shot.displayWidth, height: carouselStripHeight }}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.displayWidth}
                    height={shot.displayHeight}
                    className="h-auto w-full max-w-full shrink-0 object-contain"
                    style={{ width: shot.displayWidth, height: shot.displayHeight }}
                    draggable={false}
                    unoptimized
                  />
                </FigmaLayer>
              ))}
            </div>
          </FigmaLayer>

          {screenshots.length > 1 ? (
            <FigmaLayer name="Next" icon="component" className="contents">
              <button
                type="button"
                onClick={handleNext}
                data-frame-reveal="arrow"
                className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-neutral-900 active:scale-95"
                aria-label="Next screenshot"
              >
                <ChevronRight className="pointer-events-none size-6 text-white" strokeWidth={2.5} aria-hidden />
              </button>
            </FigmaLayer>
          ) : null}
        </div>
      </FigmaLayer>
    );
  }

  return (
    <FigmaLayer name="Screenshots" icon="frame" className="contents">
      <FigmaLayer
        name="Carousel"
        icon="group"
        data-frame-reveal="carousel"
        className={`pointer-events-none absolute inset-x-0 overflow-hidden${letterboxBg ? " bg-black" : ""}`}
        style={{ top: layout.carouselTop, height: carouselStripHeight }}
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div
          className="flex flex-row transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(-${offset}px, 0, 0)` }}
        >
          {screenshots.map((shot) => (
            <FigmaLayer
              key={shot.src}
              name={screenshotLayerName(shot.src)}
              icon="image"
              className={`flex shrink-0 items-center${letterboxBg ? " bg-black" : ""}`}
              style={{ width: shot.width, height: carouselStripHeight }}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="shrink-0 object-contain"
                style={{ width: shot.width, height: shot.height }}
                draggable={false}
                unoptimized
              />
            </FigmaLayer>
          ))}
        </div>
      </FigmaLayer>

      {screenshots.length > 1 ? (
        <FigmaLayer name="Next" icon="component" className="contents">
          <button
            type="button"
            onClick={handleNext}
            onPointerDown={stopCanvasPan}
            data-frame-reveal="arrow"
            className="pointer-events-auto absolute z-30 flex size-10 items-center justify-center rounded-full bg-black transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-neutral-900 active:scale-95"
            style={{ top: getCarouselNextTop(screenshots), left: layout.carouselNextLeft }}
            aria-label="Next screenshot"
          >
            <ChevronRight className="pointer-events-none size-6 text-white" strokeWidth={2.5} aria-hidden />
          </button>
        </FigmaLayer>
      ) : null}
    </FigmaLayer>
  );
}
