"use client";

import { Calendar, Mail } from "lucide-react";
import type { SVGProps } from "react";
import { getInTouchGridTiles } from "@/content/get-in-touch";
import type { GetInTouchGridTile } from "@/content/get-in-touch";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";

const accent = "#7c4dff";
const accentMuted = "rgba(97, 86, 245, 0.1)";

const compactTileClassName =
  "group flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center transition-[transform,background-color] duration-200 hover:bg-[rgba(97,86,245,0.06)] hover:scale-[1.02] active:scale-[0.98] sm:min-h-[80px]";

const featuredTileClassName =
  "group flex min-h-[132px] w-full flex-col justify-between gap-4 rounded-2xl bg-[linear-gradient(142deg,#000000_0%,#2c2b2b_100%)] px-5 py-5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:min-h-[116px] sm:flex-row sm:items-center";

const featuredCtaClassName =
  "inline-flex h-[41px] w-full shrink-0 items-center justify-center rounded-full bg-white px-4 text-[15px] font-medium leading-none text-black transition-[transform,background-color] duration-200 group-hover:bg-neutral-100 active:scale-[0.98] sm:w-auto";

function IconGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function IconLinkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TileIcon({ tile }: { tile: GetInTouchGridTile }) {
  const className = "size-5 shrink-0";

  if (tile.id === "github") {
    return <IconGithub className={className} style={{ color: accent }} />;
  }

  if (tile.id === "linkedin") {
    return <IconLinkedin className={className} style={{ color: accent }} />;
  }

  if (tile.id === "email") {
    return <Mail className={className} style={{ color: accent }} strokeWidth={2} aria-hidden />;
  }

  return <Calendar className={className} style={{ color: accent }} strokeWidth={2} aria-hidden />;
}

function FeaturedCalTile({ tile }: { tile: GetInTouchGridTile }) {
  return (
    <FigmaLayer name={tile.label} icon="component" className="w-full min-w-0">
      <a
        href={tile.href}
        target="_blank"
        rel="noopener noreferrer"
        className={featuredTileClassName}
        title={tile.display}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Calendar className="size-7 shrink-0 text-white" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-tight text-white">{tile.label}</p>
            {tile.subtitle ? (
              <p className="mt-1 text-[15px] leading-snug text-white/60">{tile.subtitle}</p>
            ) : null}
          </div>
        </div>
        <span className={featuredCtaClassName}>Schedule a call</span>
      </a>
    </FigmaLayer>
  );
}

function CompactContactTile({ tile }: { tile: GetInTouchGridTile }) {
  const content = (
    <>
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 group-hover:bg-[rgba(97,86,245,0.16)]"
        style={{ backgroundColor: accentMuted }}
      >
        <TileIcon tile={tile} />
      </span>
      <span className="text-[12px] font-semibold leading-tight text-[#292423] sm:text-[13px]">{tile.label}</span>
    </>
  );

  if (tile.id === "email") {
    return (
      <FigmaLayer name={tile.label} icon="component" className="min-w-0">
        <a href={tile.href} className={compactTileClassName} title="Send an email">
          {content}
        </a>
      </FigmaLayer>
    );
  }

  const rel = tile.external ? "me noopener noreferrer" : undefined;

  return (
    <FigmaLayer name={tile.label} icon="component" className="min-w-0">
      <a
        href={tile.href}
        target="_blank"
        rel={rel}
        className={compactTileClassName}
        title={tile.display}
      >
        {content}
      </a>
    </FigmaLayer>
  );
}

export function GetInTouchContactGrid() {
  const featuredTile = getInTouchGridTiles.find((tile) => tile.featured);
  const secondaryTiles = getInTouchGridTiles.filter((tile) => !tile.featured);

  return (
    <FigmaLayer
      name="Contact grid"
      icon="group"
      data-frame-reveal="media"
      className="flex w-full flex-col gap-4"
    >
      {featuredTile ? <FeaturedCalTile tile={featuredTile} /> : null}

      <FigmaLayer
        name="Channels"
        icon="group"
        className="grid grid-cols-3 gap-1 rounded-2xl border border-black/5 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:gap-2 sm:p-2.5"
      >
        {secondaryTiles.map((tile) => (
          <CompactContactTile key={tile.id} tile={tile} />
        ))}
      </FigmaLayer>
    </FigmaLayer>
  );
}
