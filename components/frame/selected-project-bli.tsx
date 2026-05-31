"use client";

import Image from "next/image";
import { Lora, Manrope } from "next/font/google";
import { useCallback, useState, type SVGProps } from "react";
import { ChevronRight } from "lucide-react";
import { useFrameInView } from "@/components/frame/use-frame-in-view";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-portfolio-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-portfolio-serif",
});

const SCREENSHOTS = [
  { src: "/content/bli/image_1.png", width: 614, height: 379, alt: "Bli app screenshot 1" },
  { src: "/content/bli/image_2.png", width: 614, height: 379, alt: "Bli app screenshot 2" },
  { src: "/content/bli/image_3.png", width: 613, height: 379, alt: "Bli app screenshot 3" },
] as const;

const VIEWPORT_WIDTH = 1440;
const SCROLL_STEP = 614;

function getMaxOffset() {
  const totalWidth = SCREENSHOTS.reduce((sum, shot) => sum + shot.width, 0);
  return Math.max(0, totalWidth - VIEWPORT_WIDTH);
}

function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.7 3.8 6.2 3.8 9s-1.3 6.3-3.8 9M12 3c-2.5 2.7-3.8 6.2-3.8 9s1.3 6.3 3.8 9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function BliScreenshotCarousel() {
  const maxOffset = getMaxOffset();
  const [offset, setOffset] = useState(0);

  const handleNext = useCallback(() => {
    setOffset((prev) => {
      if (prev >= maxOffset) return 0;
      return Math.min(prev + SCROLL_STEP, maxOffset);
    });
  }, [maxOffset]);

  const stopCanvasPan = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <div
        data-frame-reveal="carousel"
        className="pointer-events-none absolute inset-x-0 top-[423px] h-[379px] overflow-hidden"
        aria-roledescription="carousel"
        aria-label="Bli app screenshots"
      >
        <div
          className="flex flex-row transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(-${offset}px, 0, 0)` }}
        >
          {SCREENSHOTS.map((shot) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              className="h-[379px] shrink-0 object-cover"
              draggable={false}
              unoptimized
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        onPointerDown={stopCanvasPan}
        data-frame-reveal="arrow"
        className="pointer-events-auto absolute top-[573px] left-[1372px] z-30 flex size-10 items-center justify-center rounded-full bg-black transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-neutral-900 active:scale-95"
        aria-label="Next screenshot"
      >
        <ChevronRight className="pointer-events-none size-6 text-white" strokeWidth={2.5} aria-hidden />
      </button>
    </>
  );
}

export default function SelectedProjectBli() {
  const { ref, inView } = useFrameInView(0.15);

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} relative h-[860px] w-[1440px] bg-[#F8F8F8]`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Selected Project - Bli"
    >
      <div className="absolute inset-x-0 top-0 flex h-[423px] flex-col items-start gap-2.5 px-[128px] py-10">
        <div className="flex h-[343px] w-[1184px] flex-row items-start justify-between gap-[124px]">
          <div className="flex w-[472px] flex-col items-start gap-[13px]">
            <div data-frame-reveal="badge" className="flex flex-row items-start gap-[13px]">
              <div className="flex h-[38px] items-center justify-center gap-2.5 rounded-lg bg-[rgba(97,85,245,0.1)] px-3 py-2">
                <span data-frame-dot className="size-2 shrink-0 rounded-full bg-[#7C4DFF]" aria-hidden />
                <span className="text-base leading-[22px] font-bold text-[#7C4DFF]">Selected Work #1</span>
              </div>
              <div className="flex h-[38px] items-center justify-center gap-2.5 rounded-lg bg-[#FFEDD4] px-3 py-2">
                <span data-frame-dot className="size-2 shrink-0 rounded-full bg-[#FF6900]" aria-hidden />
                <span className="text-base leading-[22px] font-bold text-[#FF6900]">Award Winning</span>
              </div>
            </div>

            <h2
              data-frame-reveal="title"
              className="w-[472px] text-[40px] leading-[51px] text-[#292524]"
              style={{
                fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
              }}
            >
              Bli, Your Bali Local Friend
            </h2>

            <p data-frame-reveal="description" className="w-[472px] text-base leading-[22px] text-black/60">
              Bli is an AI-powered local assistant designed to help residents and travelers discover real-time
              events, attractions, and activities across Bali. Coded in just 3 hours, Bli successfully win{" "}
              <a
                href="https://luma.com/n7bxe9m5"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black hover:decoration-black/60"
              >
                Build with AI: TRAE Friends@Bali Hackathon
              </a>
              .
            </p>

            <p data-frame-reveal="tech" className="w-[472px] text-base leading-[22px] text-black/60">
              Tech Stack: Nextjs, Typescript, OpenAI
            </p>

            <div data-frame-reveal="actions" className="flex flex-row items-start gap-[13px]">
              <a
                href="https://bli-iota.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
              >
                <IconGlobe className="size-6 shrink-0" />
                Demo
              </a>
              <a
                href="https://github.com/abui-am/bli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
              >
                <IconGithub className="size-6 shrink-0" />
                Github
              </a>
            </div>
          </div>

          <div data-frame-reveal="logo" className="shrink-0">
            <div className="frame-float">
              <Image
                src="/content/bli/logo.svg"
                alt="Bli logo"
                width={261}
                height={261}
                className="size-[261px]"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <BliScreenshotCarousel />
    </section>
  );
}
