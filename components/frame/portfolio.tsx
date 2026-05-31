"use client";

import Image from "next/image";
import { Lora, Manrope } from "next/font/google";
import type { SVGProps } from "react";
import { PortfolioTerminal } from "@/components/frame/portfolio-terminal";
import { useFrameInView } from "@/components/frame/use-frame-in-view";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";
import { buttonVariants } from "@/components/ui/button";

const CONTACT_EMAIL = "adjiem31@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/abuidillah-adjie-muliadi-bb0816190/";

const actionLinkClassName =
  "w-fit gap-2 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]";

function IconLinkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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

interface EmployerLogoProps {
  src: string;
  label: string;
  href: string;
  width?: number;
  height?: number;
  className?: string;
}

function EmployerLogo(props: EmployerLogoProps) {
  const { src, label, href, width = 48, height = 48, className = "size-12 object-contain" } = props;
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
        className={className}
        unoptimized
      />
    </a>
  );
}

export default function Portfolio() {
  const { ref, inView } = useFrameInView(0.15);

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border flex min-h-[480px] w-[1440px] flex-row items-start justify-center gap-x-[124px] bg-[#F8F8F8] px-[128px] py-10`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Hero"
    >
      <FigmaLayer name="Hero" icon="frame" className="flex w-[472px] shrink-0 flex-col gap-[13px]">
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
          Passionate Software Engineer. I’m your partner in crime for crafting scalable solution from your
          brand and products.
        </FigmaLayer>

        <FigmaLayer name="Actions" icon="group" data-frame-reveal="actions" className="flex flex-row items-start gap-[13px]">
          <FigmaLayer name="Contact me" icon="component">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={buttonVariants({ size: "lg", variant: "default", className: actionLinkClassName })}
            >
              Contact me
            </a>
          </FigmaLayer>
          <FigmaLayer name="LinkedIn" icon="component">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", variant: "outline", className: actionLinkClassName })}
            >
              <IconLinkedin className="size-5 shrink-0" />
              LinkedIn
            </a>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>

      <FigmaLayer name="Content" icon="frame" className="flex w-[537px] shrink-0 flex-col gap-4">
        <FigmaLayer name="Row" icon="group" className="flex min-w-0 w-full flex-row flex-wrap items-start gap-4">
          <FigmaLayer
            name="profile.png"
            icon="image"
            data-frame-reveal="media"
            className="relative size-[266px] shrink-0 overflow-hidden rounded-2xl bg-neutral-200"
          >
            <Image
              src="/profile.png"
              alt="Abuidillah Adjie Muliadi"
              width={266}
              height={266}
              className="size-full object-cover"
              priority
            />
          </FigmaLayer>

          <PortfolioTerminal />
        </FigmaLayer>

        <FigmaLayer name="Footer" icon="group" className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
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
            className="flex min-h-[116px] min-w-0 flex-1 flex-col justify-center rounded-2xl bg-[linear-gradient(142deg,#000000_0%,#2c2b2b_100%)] px-4 py-4 sm:px-4"
          >
            <div className="flex flex-col gap-2.5">
              <p className="text-lg leading-tight text-white">Previously worked at:</p>
              <div className="flex gap-4 ">
                <EmployerLogo href="https://evermos.com/home/" src="/evermos.svg" label="Evermos" height={48} width={48} />
                <EmployerLogo
                  href="https://dealls.com/"
                  src="/dealls.svg"
                  label="Dealls"
                  width={109}
                  height={48}
                  className="h-12 w-auto max-w-[109px] object-contain"
                />
                <EmployerLogo
                  href="https://www.binar.co.id/"
                  src="/binar.svg"
                  height={32}
                  width={80}
                  className="object-contain"
                  label="Binar Academy"
                />
                <EmployerLogo
                  href="https://www.ekrut.com/"
                  src="/ekrut.svg"
                  className="h-12 w-auto object-contain"
                  label="Ekrut"
                />
              </div>
            </div>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
