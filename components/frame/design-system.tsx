"use client";

import { Lora, Manrope } from "next/font/google";
import { Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  designSystemColors,
  designSystemHeadline,
  designSystemLead,
  designSystemRevealTokens,
  designSystemTypeStyles,
} from "@/content/design-system";
import type { DesignSystemColor, DesignSystemTypeStyle } from "@/content/design-system";
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

function ColorSwatch({ color }: { color: DesignSystemColor }) {
  const isTransparent = color.value.includes("rgba");

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-white p-3">
      <div
        className="size-10 shrink-0 rounded-lg border border-black/10"
        style={{
          backgroundColor: isTransparent ? "#fff" : color.value,
          backgroundImage: isTransparent
            ? `linear-gradient(${color.value}, ${color.value}), repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 8px 8px`
            : undefined,
        }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-black/85">{color.name}</p>
        <p className="font-mono text-[11px] text-black/45">{color.token}</p>
        <p className="truncate font-mono text-[11px] text-black/60">{color.value}</p>
      </div>
    </div>
  );
}

function TypeSample({ style }: { style: DesignSystemTypeStyle }) {
  const isSerif = style.fontFamily === "serif";

  return (
    <div className="rounded-xl border border-black/8 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-black/85">{style.name}</p>
        <p className="font-mono text-[10px] text-black/45">{style.token}</p>
      </div>
      <p
        className="text-black/80"
        style={{
          fontFamily: isSerif
            ? "var(--font-portfolio-serif), ui-serif, Georgia, serif"
            : "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
          fontSize: style.size,
          lineHeight: style.lineHeight === "relaxed" ? 1.625 : style.lineHeight,
          fontWeight: style.weight,
          color: isSerif ? headline : undefined,
        }}
      >
        {style.sample}
      </p>
      <p className="mt-2 font-mono text-[10px] text-black/45">
        {isSerif ? "Lora" : "Manrope"} · {style.size}
        {style.weight ? ` · ${style.weight}` : ""}
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-bold tracking-wide text-black/40 uppercase">{children}</p>
  );
}

export default function DesignSystem() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();
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
      aria-label="Design System"
    >
      <FigmaLayer
        name="Design System"
        icon="frame"
        className={`flex w-full flex-col gap-8 ${isSite ? "min-w-0" : ""}`}
      >
        {!isSite ? (
          <FigmaLayer
            name="Design system badge"
            icon="frame"
            data-frame-reveal="badge"
            className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-lg py-2 pr-3 pl-3"
            style={{ backgroundColor: accentMuted }}
          >
            <Palette className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden />
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
              Design system
            </span>
          </FigmaLayer>
        ) : null}

        <FigmaLayer
          name="Design system layout"
          icon="frame"
          className={
            isSite
              ? "flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-x-[124px]"
              : "flex w-[1184px] flex-row items-start justify-between gap-[124px]"
          }
        >
          <FigmaLayer
            name="Tokens"
            icon="frame"
            className={`flex ${copyCol} flex-col items-start gap-8 ${isSite ? "" : "shrink-0"}`}
          >
            <div className="flex flex-col gap-[13px]">
              <h2
                data-frame-reveal="title"
                className={`${copyCol} text-[40px] leading-[51px]`}
                style={{
                  fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
                  color: headline,
                }}
              >
                {designSystemHeadline}
              </h2>

              <p
                data-frame-reveal="description"
                className={`${copyCol} text-[15px] leading-relaxed text-black/60`}
              >
                {designSystemLead}
              </p>
            </div>

            <FigmaLayer name="Colors" icon="group" data-frame-reveal="tech" className="flex w-full flex-col gap-3">
              <SectionLabel>Colors</SectionLabel>
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {designSystemColors.map((color) => (
                  <ColorSwatch key={color.token} color={color} />
                ))}
              </div>
            </FigmaLayer>

            <FigmaLayer name="Typography" icon="group" data-frame-reveal="terminal" className="flex w-full flex-col gap-3">
              <SectionLabel>Typography</SectionLabel>
              <div className="flex w-full flex-col gap-2">
                {designSystemTypeStyles.map((style) => (
                  <TypeSample key={style.token} style={style} />
                ))}
              </div>
            </FigmaLayer>
          </FigmaLayer>

          <FigmaLayer
            name="Components"
            icon="frame"
            className={`flex ${visualCol} flex-col gap-8`}
          >
            <FigmaLayer name="Component gallery" icon="group" data-frame-reveal="media" className="flex flex-col gap-3">
              <SectionLabel>Components</SectionLabel>
              <div className="rounded-2xl border border-black/8 bg-white p-5">
                <p className="mb-4 text-sm font-semibold text-black/85">Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                    Primary
                  </Button>
                  <Button
                    variant="outline"
                    className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Outline
                  </Button>
                  <Button
                    variant="ghost"
                    className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Ghost
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-black/8 bg-white p-5">
                <p className="mb-4 text-sm font-semibold text-black/85">Badges & pills</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ backgroundColor: accentMuted }}
                  >
                    <Sparkles className="size-3.5" style={{ color: accent }} aria-hidden />
                    <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
                      Section badge
                    </span>
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm leading-none text-black/70">
                    Skill pill
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/8 bg-white p-5">
                <p className="mb-4 text-sm font-semibold text-black/85">Tooltip</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                      Hover me
                    </TooltipTrigger>
                    <TooltipContent side="top">Radix tooltip via shadcn</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </FigmaLayer>

            <FigmaLayer name="Motion" icon="group" data-frame-reveal="tech-grid" className="flex flex-col gap-3">
              <SectionLabel>Frame reveal tokens</SectionLabel>
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-black/8 bg-black/[0.02]">
                      <th className="px-4 py-2.5 font-semibold text-black/50">Token</th>
                      <th className="px-4 py-2.5 font-semibold text-black/50">Use for</th>
                      <th className="hidden px-4 py-2.5 font-semibold text-black/50 sm:table-cell">Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designSystemRevealTokens.map((token) => (
                      <tr key={token.token} className="border-b border-black/5 last:border-b-0">
                        <td className="px-4 py-2.5 font-mono text-black/70">{token.token}</td>
                        <td className="px-4 py-2.5 text-black/60">{token.useFor}</td>
                        <td className="hidden px-4 py-2.5 font-mono text-black/45 sm:table-cell">
                          {token.delay ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FigmaLayer>

            <FigmaLayer name="CTA" icon="group" data-frame-reveal="actions" className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Primary CTA
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Secondary CTA
              </Button>
            </FigmaLayer>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
