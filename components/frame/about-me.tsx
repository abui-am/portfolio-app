"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Lora, Manrope } from "next/font/google";
import { AboutMeInteractiveCard } from "@/components/frame/about-me-card";
import { AboutMeLayersPanel } from "@/components/frame/about-me-layers";
import { AboutMePropertiesPanel } from "@/components/frame/about-me-properties";
import { AboutMeTimeline } from "@/components/frame/about-me-timeline";
import { aboutMeDefaultLayerId, aboutMeHeadline, aboutMeStory } from "@/content/about-me";
import type { AboutLayerId } from "@/content/about-me";
import { useFrameInView } from "@/components/frame/use-frame-in-view";
import { useIsSiteView } from "@/components/site/site-view-context";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";

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

export default function AboutMe() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();
  const [selectedLayerId, setSelectedLayerId] = useState<AboutLayerId>(aboutMeDefaultLayerId);
  const copyCol = isSite ? "w-full min-w-0 flex-1 lg:max-w-[472px]" : "w-[472px]";
  const visualCol = isSite ? "w-full min-w-0 flex-1 lg:max-w-[537px]" : "w-[588px] shrink-0";

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border ${
        isSite
          ? "flex w-full flex-col bg-transparent px-0 py-0"
          : "w-[1440px] bg-[#F8F8F8] px-[128px] py-10"
      }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="About Me"
    >
      <FigmaLayer
        name="About Me"
        icon="frame"
        className={`flex w-full flex-col gap-8 ${isSite ? "min-w-0" : ""}`}
      >
        {!isSite ? (
          <FigmaLayer
            name="About badge"
            icon="frame"
            data-frame-reveal="badge"
            className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-lg py-2 pr-3 pl-3"
            style={{ backgroundColor: accentMuted }}
          >
            <User className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden />
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
              About
            </span>
          </FigmaLayer>
        ) : null}

        <FigmaLayer
          name="About layout"
          icon="frame"
          className={
            isSite
              ? "flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-x-[124px]"
              : "flex w-[1184px] flex-row items-start justify-between gap-[124px]"
          }
        >
          <FigmaLayer name="Visual" icon="frame" className={`flex ${visualCol} flex-col gap-4`}>
            <FigmaLayer name="Kaizen OS card" icon="frame" data-frame-reveal="logo" className="w-full">
              <div className="frame-float w-full">
                <AboutMeInteractiveCard />
              </div>
            </FigmaLayer>

            <FigmaLayer name="Timeline" icon="frame" data-frame-reveal="tech-grid" className="w-full">
              <AboutMeTimeline />
            </FigmaLayer>

            {isSite ? (
              <FigmaLayer name="Layers mobile" icon="frame" data-frame-reveal="terminal" className="w-full lg:hidden">
                <AboutMeLayersPanel selectedId={selectedLayerId} onSelect={setSelectedLayerId} />
              </FigmaLayer>
            ) : null}
          </FigmaLayer>

          <FigmaLayer
            name="About copy"
            icon="frame"
            className={`flex ${copyCol} flex-col items-start gap-[13px] ${isSite ? "" : "shrink-0"}`}
          >
            <h2
              data-frame-reveal="title"
              className={`${copyCol} text-[40px] leading-[51px]`}
              style={{
                fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
                color: headline,
              }}
            >
              {aboutMeHeadline}
            </h2>

            <p
              data-frame-reveal="description"
              className={`${copyCol} text-[15px] leading-relaxed text-black/60`}
            >
              {aboutMeStory.lead}
            </p>

            <FigmaLayer
              name="Inspector"
              icon="group"
              data-frame-reveal="tech"
              className={`grid w-full items-start ${isSite ? "gap-3" : "grid-cols-1 gap-3"} lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)]`}
            >
              <div
                className={isSite ? "hidden min-w-0 lg:block" : "block min-w-0"}
                data-frame-reveal="terminal"
              >
                <AboutMeLayersPanel selectedId={selectedLayerId} onSelect={setSelectedLayerId} />
              </div>
              <AboutMePropertiesPanel selectedId={selectedLayerId} />
            </FigmaLayer>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
