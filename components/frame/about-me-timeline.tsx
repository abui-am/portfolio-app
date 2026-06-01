"use client";

import type { CSSProperties } from "react";
import { aboutMeTimeline } from "@/content/about-me";

const BADGE_SIZE_PX = 28;
const BADGE_CENTER_PX = BADGE_SIZE_PX / 2;

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
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full border border-[#7c4dff]/25 bg-white text-[10px] font-bold text-[#7c4dff] ring-2 ring-white"
              style={{ width: BADGE_SIZE_PX, height: BADGE_SIZE_PX }}
            >
              {entry.year.slice(2)}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[13px] leading-snug font-semibold text-[#292423]">{entry.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug break-words text-black/55">
                <span className="text-black/40">{entry.year}</span>
                <span className="text-black/25"> · </span>
                {entry.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
