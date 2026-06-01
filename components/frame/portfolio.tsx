"use client";

import Image from "next/image";
import { FileDown } from "lucide-react";
import { Lora, Manrope } from "next/font/google";
import type { MouseEvent, TransitionEvent } from "react";
import { useState } from "react";

const PROFILE_TILT_MAX_DEG = 14;
import { PortfolioTerminal } from "@/components/frame/portfolio-terminal";
import { useFrameInView } from "@/components/frame/use-frame-in-view";
import { useIsSiteView } from "@/components/site/site-view-context";
import { portfolioEmployers } from "@/content/employers";
import type { PortfolioEmployer } from "@/content/employers";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";
import { buttonVariants } from "@/components/ui/button";

import { CV_DOWNLOAD_NAME, CV_PDF_HREF } from "@/content/cv-download";

const actionLinkClassName =
  "w-fit gap-2 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-portfolio-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-portfolio-serif",
});

const accent = "#7c4dff";
const accentMuted = "rgba(97, 86, 245, 0.1)";
const headline = "#292423";

interface TechIconTileProps {
  src: string;
  label: string;
}

function TechIconTile(props: TechIconTileProps) {
  const { src, label } = props;
  return (
    <div className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl bg-white transition-transform duration-200 hover:scale-105">
      <Image src={src} alt={label} width={32} height={32} className="size-8 object-contain" unoptimized />
    </div>
  );
}

function EmployerCard({ employer }: { employer: PortfolioEmployer }) {
  const { href, src, label, width = 48, height = 48, imageClassName = "size-12 object-contain" } = employer;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex shrink-0 transition-opacity duration-200 hover:opacity-80"
    >
      <Image
        src={src}
        alt={label}
        width={width}
        height={height}
        className={imageClassName}
        unoptimized
      />
    </a>
  );
}

function ProfilePhotoFlip() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleClick() {
    setIsAnimating(true);
    setIsFlipped((flipped) => !flipped);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform") return;
    setIsAnimating(false);
  }

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    if (isAnimating) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: -offsetY * PROFILE_TILT_MAX_DEG,
      y: offsetX * PROFILE_TILT_MAX_DEG,
    });
  }

  function handleMouseEnter() {
    setIsHovering(true);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  }

  const sceneTransform =
    isAnimating || !isHovering
      ? undefined
      : `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale(1.02)`;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show profile photo" : "Show sketched portrait"}
      className={`profile-flip-trigger size-full rounded-2xl bg-neutral-200${isAnimating ? " profile-flip-trigger--animating" : ""}`}
    >
      <div
        className={`profile-flip-scene size-full${isHovering && !isAnimating ? " profile-flip-scene--tracking" : ""}`}
        style={sceneTransform ? { transform: sceneTransform } : undefined}
      >
        <div
          className={`profile-flip-inner size-full${isFlipped ? " profile-flip-inner--flipped" : ""}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="profile-flip-face profile-flip-face--front">
            <Image
              src="/profile.png"
              alt="Abuidillah Adjie Muliadi"
              width={266}
              height={266}
              className="size-full object-cover"
              priority
            />
          </div>
          <div className="profile-flip-face profile-flip-face--back">
            <Image
              src="/abui-sketched.png"
              alt="Abuidillah Adjie Muliadi sketched portrait"
              width={266}
              height={266}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Portfolio() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border flex min-h-0 ${
        isSite
          ? "w-full flex-col gap-8 bg-transparent px-0 py-0 lg:min-h-[480px] lg:flex-row lg:items-start lg:justify-center lg:gap-x-[124px]"
          : "min-h-[480px] w-[1440px] flex-row items-start justify-center gap-x-[124px] bg-[#F8F8F8] px-[128px] py-10"
      }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Hero"
    >
      <FigmaLayer
        name="Hero"
        icon="frame"
        className={
          isSite
            ? "flex w-full min-w-0 flex-1 flex-col gap-[13px] lg:max-w-[472px]"
            : "flex w-[472px] shrink-0 flex-col gap-[13px]"
        }
      >
        <FigmaLayer
          name="Available for work"
          icon="frame"
          data-frame-reveal="badge"
          className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-lg py-2 pr-3 pl-3"
          style={{ backgroundColor: accentMuted }}
        >
          <span
            data-frame-dot
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <span
            className="text-[11px] font-bold tracking-wide uppercase"
            style={{ color: accent }}
          >
            Available for work
          </span>
        </FigmaLayer>

        <FigmaLayer
          name="Hi, It's Me..."
          icon="text"
          as="h1"
          data-frame-reveal="title"
          className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.12] tracking-tight"
          style={{
            color: headline,
            fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
          }}
        >
          Hi, It’s Me. Abuidillah Adjie Muliadi
        </FigmaLayer>

        <FigmaLayer
          name="Passionate Software..."
          icon="text"
          as="p"
          data-frame-reveal="description"
          className="max-w-[472px] text-[15px] leading-relaxed text-black/60"
        >
          Passionate Software Engineer. I’m your partner in crime for crafting scalable solutions from your
          brand and products.
        </FigmaLayer>

        <FigmaLayer
          name="React & TypeScript"
          icon="text"
          as="p"
          data-frame-reveal="tech"
          className="max-w-[472px] text-[15px] leading-relaxed text-black/60"
        >
          Highly skilled with Reactjs and Typescript, I’ll build what you envision.
        </FigmaLayer>

        <FigmaLayer
          name="Actions"
          icon="group"
          data-frame-reveal="actions"
          className="flex flex-row flex-wrap items-start gap-[13px]"
        >
          <FigmaLayer name="CV" icon="component">
            <a
              href={CV_PDF_HREF}
              download={CV_DOWNLOAD_NAME}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", variant: "default", className: actionLinkClassName })}
            >
              <FileDown className="size-5 shrink-0" aria-hidden />
              Download CV
            </a>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>

      <FigmaLayer
        name="Content"
        icon="frame"
        className={
          isSite
            ? "flex w-full min-w-0 flex-1 flex-col gap-4 lg:max-w-[537px]"
            : "flex w-[537px] shrink-0 flex-col gap-4"
        }
      >
        <FigmaLayer
          name="Row"
          icon="group"
          className={
            isSite
              ? "flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap"
              : "flex min-w-0 w-full flex-row flex-wrap items-start gap-4"
          }
        >
          <FigmaLayer
            name="profile.png"
            icon="image"
            data-frame-reveal="media"
            className={
              isSite
                ? "relative mx-auto aspect-square w-full max-w-[266px] shrink-0 rounded-2xl sm:mx-0"
                : "relative size-[266px] shrink-0 rounded-2xl"
            }
          >
            <ProfilePhotoFlip />
          </FigmaLayer>

          <PortfolioTerminal />
        </FigmaLayer>

        <FigmaLayer
          name="Footer"
          icon="group"
          className={isSite ? "flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-stretch" : "flex flex-row items-stretch gap-4"}
        >
          <FigmaLayer name="Tech stack" icon="group" data-frame-reveal="tech-grid" className="flex shrink-0 flex-col gap-2">
            <div className="flex flex-row gap-4">
              <TechIconTile src="/react.svg" label="React" />
              <TechIconTile src="/nextjs.svg" label="Next.js" />
              <TechIconTile src="/figma.svg" label="Figma" />
            </div>
            <div className="flex flex-row gap-4">
              <TechIconTile src="/typescript.svg" label="TypeScript" />
              <TechIconTile src="/tailwind.svg" label="Tailwind CSS" />
              <TechIconTile src="/turborepo.svg" label="Turborepo" />
            </div>
          </FigmaLayer>

          <FigmaLayer
            name="Employers"
            icon="rectangle"
            data-frame-reveal="employers"
            className={`flex min-h-[116px] min-w-0 flex-col justify-center rounded-2xl bg-[linear-gradient(142deg,#000000_0%,#2c2b2b_100%)] px-4 py-4 ${isSite ? "w-full flex-1" : "flex-1"}`}
          >
            <div className="flex flex-col gap-2.5">
              <p className="text-lg leading-tight text-white">Previously worked at:</p>
              <div className="flex flex-wrap items-center gap-4">
                {portfolioEmployers.map((employer) => (
                  <EmployerCard key={employer.id} employer={employer} />
                ))}
              </div>
            </div>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
