"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";
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

export function ProjectScreenshotCarousel({
  screenshots,
  viewportWidth = 1440,
  ariaLabel,
}: ProjectScreenshotCarouselProps) {
  const scrollStep = screenshots[0]?.width ?? 614;
  const maxOffset = getMaxOffset(screenshots, viewportWidth);
  const [offset, setOffset] = useState(0);
  const layout = SELECTED_PROJECT_LAYOUT;
  const carouselStripHeight = getCarouselStripHeight(screenshots);

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

  return (
    <FigmaLayer name="Screenshots" icon="frame" className="contents">
      <FigmaLayer
        name="Carousel"
        icon="group"
        data-frame-reveal="carousel"
        className="pointer-events-none absolute inset-x-0 overflow-hidden"
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
              className="shrink-0"
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
