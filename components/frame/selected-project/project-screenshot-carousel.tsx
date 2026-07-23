"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

interface CarouselSlide {
  src: string;
  alt: string;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
}

function getMaxOffset(slides: CarouselSlide[], viewportWidth: number) {
  const totalWidth = slides.reduce((sum, shot) => sum + shot.displayWidth, 0);
  return Math.max(0, totalWidth - viewportWidth);
}

function screenshotLayerName(src: string) {
  return src.split("/").pop() ?? src;
}

function needsCarouselLetterboxBg(slides: CarouselSlide[], stripHeight: number) {
  return slides.some((shot) => shot.displayHeight !== stripHeight);
}

function getLoadedSlideIndices(slides: CarouselSlide[], offset: number, viewportWidth: number) {
  const indices = new Set<number>();
  let left = 0;

  for (let index = 0; index < slides.length; index++) {
    const slide = slides[index];
    const slideLeft = left;
    const slideRight = left + slide.displayWidth;
    const overlapsViewport = slideRight > offset && slideLeft < offset + viewportWidth;

    if (overlapsViewport) {
      indices.add(index);
      if (index > 0) indices.add(index - 1);
      if (index + 1 < slides.length) indices.add(index + 1);
    }

    left += slide.displayWidth;
  }

  if (indices.size === 0 && slides.length > 0) {
    indices.add(0);
    if (slides.length > 1) indices.add(1);
  }

  return indices;
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

  const slides = useMemo<CarouselSlide[]>(
    () =>
      screenshots.map((shot) => {
        const displayWidth = isSite ? Math.min(shot.width, effectiveViewportWidth) : shot.width;
        const displayHeight = Math.round((shot.height / shot.width) * displayWidth);
        return {
          src: shot.src,
          alt: shot.alt,
          width: shot.width,
          height: shot.height,
          displayWidth,
          displayHeight,
        };
      }),
    [effectiveViewportWidth, isSite, screenshots],
  );

  const scrollStep = slides[0]?.displayWidth ?? 614;
  const maxOffset = getMaxOffset(slides, effectiveViewportWidth);
  const [offset, setOffset] = useState(0);
  const layout = SELECTED_PROJECT_LAYOUT;
  const carouselStripHeight = slides.length > 0 ? Math.max(...slides.map((shot) => shot.displayHeight)) : 379;
  const letterboxBg = isSite ? false : needsCarouselLetterboxBg(slides, carouselStripHeight);
  const loadedSlideIndices = getLoadedSlideIndices(slides, offset, effectiveViewportWidth);

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

  function renderSlide(shot: CarouselSlide, index: number) {
    const shouldLoad = loadedSlideIndices.has(index);

    return (
      <FigmaLayer
        key={shot.src}
        name={screenshotLayerName(shot.src)}
        icon="image"
        className={`flex shrink-0 items-center justify-center${letterboxBg ? " bg-black" : ""}`}
        style={{ width: shot.displayWidth, height: carouselStripHeight }}
      >
        {shouldLoad ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.displayWidth}
            height={shot.displayHeight}
            className={
              isSite
                ? "h-auto w-full max-w-full shrink-0 object-contain"
                : "shrink-0 object-contain"
            }
            style={{ width: shot.displayWidth, height: shot.displayHeight }}
            draggable={false}
            loading="lazy"
            unoptimized
          />
        ) : (
          <div
            aria-hidden
            style={{ width: shot.displayWidth, height: shot.displayHeight }}
          />
        )}
      </FigmaLayer>
    );
  }

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
              {slides.map((shot, index) => renderSlide(shot, index))}
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
          {slides.map((shot, index) => renderSlide(shot, index))}
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
