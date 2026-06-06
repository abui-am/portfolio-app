"use client";

import { useState, type MouseEvent } from "react";
import { aboutMeOs } from "@/content/about-me";

const TILT_MAX_DEG = 12;

function WindowChrome() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="about-os-stat rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 backdrop-blur-sm transition-[border-color,background-color] duration-300">
      <p className="text-[9px] font-semibold tracking-[0.14em] text-white/35 uppercase">{label}</p>
      <p className="mt-1 text-[13px] leading-snug font-semibold text-white/90">{value}</p>
    </div>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1">
      <span className="about-os-status-dot size-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
      <span className="text-[9px] font-bold tracking-wider text-emerald-300 uppercase">{aboutMeOs.status}</span>
    </span>
  );
}

export function AboutMeInteractiveCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: -offsetY * TILT_MAX_DEG,
      y: offsetX * TILT_MAX_DEG,
    });
    setGlare({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleMouseLeave() {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  }

  const transform = isHovering
    ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale(1.02)`
    : undefined;

  return (
    <div className="about-card-scene w-full [perspective:1200px]">
      <div
        className="about-card-track relative w-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transform-none motion-reduce:transition-none"
        style={{ transform }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        role="img"
        aria-label={`${aboutMeOs.edition}. ${aboutMeOs.role}, ${aboutMeOs.experience}. ${aboutMeOs.status}.`}
      >
        <div className="about-os-shell relative min-h-[220px] w-full overflow-hidden rounded-[22px] p-px shadow-[0_28px_56px_-12px_rgba(0,0,0,0.45)]">
          <div className="about-os-glow pointer-events-none absolute -top-16 -right-10 size-48 rounded-full opacity-70 blur-3xl" aria-hidden />
          <div className="about-os-glow-secondary pointer-events-none absolute -bottom-20 -left-12 size-40 rounded-full opacity-50 blur-3xl" aria-hidden />

          <div className="relative overflow-hidden rounded-[21px] bg-[linear-gradient(155deg,#1f1f23_0%,#0a0a0c_42%,#121018_100%)]">
            <div className="about-card-noise pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" aria-hidden />
            <div className="about-os-grid pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />

            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: isHovering ? 1 : 0.55,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(124,77,255,0.18) 0%, transparent 42%)`,
              }}
              aria-hidden
            />

            <div className="relative flex min-h-[218px] flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <WindowChrome />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[11px] font-semibold tracking-wide text-white/90">
                      {aboutMeOs.edition}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-white/30">
                      <span className="text-[#9b8cff]">~</span>
                      /profile/abui
                    </p>
                  </div>
                </div>
                <StatusBadge />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatTile label="Role" value={aboutMeOs.role} />
                <StatTile label="Experience" value={aboutMeOs.experience} />
                <StatTile label="Stack" value={aboutMeOs.stack} />
              </div>

              <div className="mt-auto">
                <p className="mb-2 text-[9px] font-semibold tracking-[0.14em] text-white/35 uppercase">Interest</p>
                <div className="flex flex-wrap gap-1.5">
                  {aboutMeOs.interest.map((interest) => (
                    <span
                      key={interest}
                      className="about-os-pill rounded-full border border-[#7c4dff]/25 bg-[#7c4dff]/10 px-2.5 py-1 font-mono text-[10px] font-medium text-[#c4b5ff]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

              </div>
              <div className="mt-auto">
                <p className="mb-2 text-[9px] font-semibold tracking-[0.14em] text-white/35 uppercase">Currently Building</p>
                <div className="flex flex-wrap gap-1.5">
                  {aboutMeOs.building.map((project) => (
                    <span
                      key={project}
                      className="about-os-pill rounded-full border border-[#7c4dff]/25 bg-[#7c4dff]/10 px-2.5 py-1 font-mono text-[10px] font-medium text-[#c4b5ff]"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
