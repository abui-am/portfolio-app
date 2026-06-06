"use client";

import Image from "next/image";
import { Lora, Manrope } from "next/font/google";
import {
  Briefcase,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  Users,
  Zap,
  ArrowLeftRight,
} from "lucide-react";
import { experienceEntries } from "@/content/experience";
import type { ExperienceEntry, ExperienceFeature } from "@/content/experience";
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

const featureIconSets: Record<string, (typeof GraduationCap)[]> = {
  academy: [GraduationCap, Sparkles, Globe, Layers],
  evermos: [ArrowLeftRight, Sparkles, Layers, Zap],
  dealls: [Briefcase, Users, Sparkles, Layers],
};

function ExperienceMeta({ entry }: { entry: ExperienceEntry }) {
  const parts = [entry.company, entry.employment, entry.period].filter(Boolean);
  return <>{parts.join(" · ")}</>;
}

function ExperienceFeatureCard({
  feature,
  icon: Icon,
}: {
  feature: ExperienceFeature;
  icon: typeof GraduationCap;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <Icon className="mb-3 size-5 text-[#7c4dff]" aria-hidden />
      <p className="text-sm leading-tight font-semibold text-white">{feature.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-white/60">{feature.detail}</p>
    </div>
  );
}

function ExperienceSkillPills({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;

  return (
    <FigmaLayer name="Skills" icon="group" data-frame-reveal="tech" className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm leading-none text-black/70"
        >
          {skill}
        </span>
      ))}
    </FigmaLayer>
  );
}

function getFeatureIcons(entry: ExperienceEntry) {
  if (entry.company.includes("Apple Developer Academy")) return featureIconSets.academy;
  if (entry.company === "Evermos") return featureIconSets.evermos;
  if (entry.company.includes("Dealls")) return featureIconSets.dealls;
  return featureIconSets.academy;
}

function ExperienceBlock({ entry, isPrimary }: { entry: ExperienceEntry; isPrimary: boolean }) {
  const icons = getFeatureIcons(entry);
  const isSite = useIsSiteView();
  const copyCol = isSite ? "w-full min-w-0 lg:max-w-[472px]" : "w-[472px]";

  return (
    <FigmaLayer
      name={entry.role}
      icon="frame"
      className={
        isSite
          ? "flex w-full min-w-0 flex-col items-start gap-8 border-t border-black/10 pt-8 first:border-t-0 first:pt-0 lg:flex-row lg:items-start lg:justify-between lg:gap-[124px]"
          : "flex w-[1184px] flex-row items-start justify-between gap-[124px] border-t border-black/10 pt-8 first:border-t-0 first:pt-0"
      }
    >
      <FigmaLayer name="Copy" icon="frame" className={`flex ${copyCol} flex-col items-start gap-[13px]`}>
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
          {entry.role}
        </h3>

        {entry.period ? (
          <p
            data-frame-reveal={isPrimary ? "role" : undefined}
            className={`${copyCol} text-base leading-[22px] font-medium text-black/80`}
          >
            <ExperienceMeta entry={entry} />
          </p>
        ) : null}

        {entry.fundingRound || entry.employeeRange ? (
          <p className={`${copyCol} text-base leading-[22px] text-black/60`}>
            {[entry.fundingRound, entry.employeeRange].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        {entry.location ? (
          <p className={`inline-flex ${copyCol} items-center gap-2 text-base leading-[22px] text-black/60`}>
            <MapPin className="size-4 shrink-0" aria-hidden />
            {entry.location}
          </p>
        ) : null}

        {entry.description ? (
          <p
            data-frame-reveal={isPrimary ? "description" : "description"}
            className={`${copyCol} text-base leading-[22px] text-black/60`}
          >
            {entry.description}
          </p>
        ) : null}

        <ExperienceSkillPills skills={entry.skills} />

        {entry.projects && entry.projects.length > 0 ? (
          <p className="text-base leading-[22px] text-black/60">
            <span className="text-black/80">Projects:</span> {entry.projects.join(", ")}
          </p>
        ) : null}

        {entry.highlights.length > 0 ? (
          <ul className="mt-1 list-none space-y-2 pl-0 text-base leading-[22px] text-black/60">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="shrink-0 text-black/40" aria-hidden>
                  ●
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {entry.links && entry.links.length > 0 ? (
          <FigmaLayer
            name="Actions"
            icon="group"
            data-frame-reveal={isPrimary ? "actions" : undefined}
            className="flex flex-row flex-wrap gap-[13px]"
          >
            {entry.links.map((link) => {
              const isFilled = isPrimary && entry.links?.length === 1;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    isFilled
                      ? "inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
                      : "inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
                  }
                >
                  <Globe className="size-5 shrink-0" aria-hidden />
                  {link.label}
                </a>
              );
            })}
          </FigmaLayer>
        ) : null}
      </FigmaLayer>

      <FigmaLayer
        name="Key insights"
        icon="frame"
        data-frame-reveal="media"
        className={
          isSite
            ? "w-full min-w-0 shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#151515_0%,#2a2a2a_100%)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] lg:max-w-[588px] lg:flex-1"
            : "w-[588px] shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#151515_0%,#2a2a2a_100%)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
        }
      >
        <FigmaLayer
          name="Highlights"
          icon="group"
          data-frame-reveal="tech-grid"
          className="mb-4 grid grid-cols-2 gap-3"
        >
          {entry.features.map((feature, index) => (
            <ExperienceFeatureCard
              key={feature.label}
              feature={feature}
              icon={icons[index] ?? Layers}
            />
          ))}
        </FigmaLayer>

        <FigmaLayer
          name={entry.codePanel.filename}
          icon="frame"
          data-frame-reveal="terminal"
          className="overflow-hidden rounded-xl border border-white/10 bg-black/25"
        >
          <div className="flex h-9 items-center gap-2.5 border-b border-white/10 bg-black/30 px-4">
            <span className="size-3 rounded-full bg-[#ff4b59]" aria-hidden />
            <span className="size-3 rounded-full bg-[#ffc600]" aria-hidden />
            <span className="size-3 rounded-full bg-[#00cb48]" aria-hidden />
            <span className="ml-2 text-xs text-white/50">{entry.codePanel.filename}</span>
          </div>
          <pre
            className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.55] text-white/85"
            style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
          >
            {entry.codePanel.snippet}
          </pre>
        </FigmaLayer>
      </FigmaLayer>
    </FigmaLayer>
  );
}

export default function Experience() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border ${isSite ? "w-full bg-transparent px-0 py-0" : "w-[1440px] bg-[#F8F8F8] px-[128px] py-10"
        }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Latest Experience"
    >
      <FigmaLayer name="Latest Experience" icon="frame" className="flex w-full flex-col gap-8">
        {!isSite ? (
          <FigmaLayer
            name="Latest Experience badge"
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
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
              Latest Experience
            </span>
          </FigmaLayer>
        ) : null}

        <FigmaLayer name="Work history" icon="group" className="flex flex-col gap-10">
          {experienceEntries.map((entry, index) => (
            <ExperienceBlock
              key={`${entry.role}-${entry.period}`}
              entry={entry}
              isPrimary={index === 0}
            />
          ))}
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
