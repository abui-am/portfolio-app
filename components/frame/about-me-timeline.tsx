"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { aboutMeTimeline } from "@/content/about-me";
import type { AboutTimelineEntry } from "@/content/about-me";

const BADGE_SIZE_PX = 28;
const BADGE_CENTER_PX = BADGE_SIZE_PX / 2;

function TimelineDetail({ entry }: { entry: AboutTimelineEntry }) {
  const parts = [entry.detail, entry.gpa ? `GPA ${entry.gpa}` : null].filter(Boolean);
  return <>{parts.join(" · ")}</>;
}

export function AboutMeTimeline() {
  return (
    <div className="w-full min-w-0 overflow-visible rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-[11px] font-bold tracking-wide text-[#7c4dff] uppercase">Life timeline</p>
      <ol className="relative mt-3">
        <span
          className="pointer-events-none absolute w-px bg-[#e6e6e6]"
          style={{
            left: BADGE_CENTER_PX,
            top: BADGE_CENTER_PX,
            bottom: BADGE_CENTER_PX,
          }}
          aria-hidden
        />
        {aboutMeTimeline.map((entry, index) => (
          <li
            key={`${entry.year}-${entry.title}`}
            className="about-timeline-item relative flex gap-3 py-2.5 first:pt-0 last:pb-0"
            style={{ "--about-timeline-index": index } as CSSProperties}
          >
            <span
              className={`relative z-10 flex shrink-0 items-center justify-center rounded-full border bg-white text-[10px] font-bold ring-2 ring-white ${
                entry.kind === "education"
                  ? "border-[#7c4dff]/40 text-[#7c4dff]"
                  : "border-[#7c4dff]/25 text-[#7c4dff]"
              }`}
              style={{ width: BADGE_SIZE_PX, height: BADGE_SIZE_PX }}
            >
              {entry.year.slice(2)}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug font-semibold text-[#292423]">{entry.title}</p>
                  <p className="mt-0.5 text-[12px] leading-snug break-words text-black/55">
                    <span className="text-black/40">{entry.year}</span>
                    <span className="text-black/25"> · </span>
                    <TimelineDetail entry={entry} />
                  </p>
                </div>
                {entry.logo ? (
                  <Image
                    src={entry.logo.src}
                    alt={entry.logo.alt}
                    width={entry.logo.width ?? 32}
                    height={entry.logo.height ?? 32}
                    className={entry.logo.className ?? "size-8 object-contain"}
                    unoptimized
                  />
                ) : null}
              </div>
              {entry.links && entry.links.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 items-center justify-center gap-1 rounded-full bg-black px-2.5 py-1 text-[11px] leading-none text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
                    >
                      <Globe className="size-3 shrink-0" aria-hidden />
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
