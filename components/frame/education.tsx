"use client";

import Image from "next/image";
import { Globe, GraduationCap } from "lucide-react";
import { Lora, Manrope } from "next/font/google";
import { educationEntries } from "@/content/education";
import type { EducationEntry } from "@/content/education";
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

function EducationMeta({ entry }: { entry: EducationEntry }) {
  const parts = [entry.degree, entry.gpa ? `GPA ${entry.gpa}` : null, entry.period].filter(Boolean);
  return <>{parts.join(" · ")}</>;
}

function EducationBlock({ entry, isPrimary }: { entry: EducationEntry; isPrimary: boolean }) {
  const isSite = useIsSiteView();
  const copyCol = isSite ? "w-full min-w-0" : "w-[472px]";

  return (
    <FigmaLayer
      name={entry.school}
      icon="frame"
      className={`flex ${copyCol} flex-col items-start gap-[13px] border-t border-black/10 pt-8 first:border-t-0 first:pt-0`}
    >
      {entry.logo ? (
        <Image
          src={entry.logo.src}
          alt={entry.logo.alt}
          width={entry.logo.width ?? 48}
          height={entry.logo.height ?? 48}
          className={entry.logo.className ?? "size-12 object-contain"}
          unoptimized
        />
      ) : null}

      <h3
        data-frame-reveal={isPrimary ? "title" : undefined}
        className={`${copyCol} ${isPrimary ? "text-[40px] leading-[51px]" : "text-[28px] leading-[36px]"}`}
        style={{
          fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
          color: headline,
        }}
      >
        {entry.school}
      </h3>
      <p
        data-frame-reveal={isPrimary ? "description" : undefined}
        className={`${copyCol} text-base leading-[22px] font-medium text-black/80`}
      >
        <EducationMeta entry={entry} />
      </p>

      {entry.links && entry.links.length > 0 ? (
        <FigmaLayer
          name="Actions"
          icon="group"
          data-frame-reveal={isPrimary ? "actions" : undefined}
          className="flex flex-row flex-wrap gap-[13px]"
        >
          {entry.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
            >
              <Globe className="size-5 shrink-0" aria-hidden />
              {link.label}
            </a>
          ))}
        </FigmaLayer>
      ) : null}
    </FigmaLayer>
  );
}

export default function Education() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border ${
        isSite ? "w-full bg-transparent px-0 py-0" : "w-[1440px] bg-[#F8F8F8] px-[128px] py-10"
      }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Education"
    >
      <FigmaLayer name="Education" icon="frame" className="flex w-full flex-col gap-8">
        {!isSite ? (
          <FigmaLayer
            name="Education badge"
            icon="frame"
            data-frame-reveal="badge"
            className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-lg py-2 pr-3 pl-3"
            style={{ backgroundColor: accentMuted }}
          >
            <GraduationCap className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden />
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
              Education
            </span>
          </FigmaLayer>
        ) : null}

        <FigmaLayer name="Schools" icon="group" className="flex flex-col gap-10">
          {educationEntries.map((entry, index) => (
            <EducationBlock key={entry.school} entry={entry} isPrimary={index === 0} />
          ))}
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
