"use client";

import { ChevronRight } from "lucide-react";
import { aboutMeLayerTree } from "@/content/about-me";
import type { AboutLayerId } from "@/content/about-me";
import { FigmaLayerIconGlyph } from "@/components/figma-shell/figma-layer-icons";

interface AboutMeLayersPanelProps {
  selectedId: AboutLayerId;
  onSelect: (id: AboutLayerId) => void;
}

export function AboutMeLayersPanel({ selectedId, onSelect }: AboutMeLayersPanelProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e6e6e6] bg-white">
      <div className="border-b border-[#e6e6e6] px-3 py-2">
        <p className="text-[11px] font-semibold text-[#333]">Layers</p>
      </div>
      <div className="px-1 py-2">
        <div className="flex w-full min-w-0 items-center gap-0.5 rounded-sm py-[3px] pr-1.5 pl-1 text-[11px] text-[#333]">
          <ChevronRight className="size-4 shrink-0 rotate-90 text-[#7a7a7a]" aria-hidden />
          <span className="flex size-4 shrink-0 items-center justify-center text-[#7a7a7a]">
            <FigmaLayerIconGlyph type="frame" />
          </span>
          <span className="min-w-0 flex-1 truncate font-medium">Principles</span>
        </div>

        {aboutMeLayerTree.map((layer) => {
          const isSelected = selectedId === layer.id;

          return (
            <div
              key={layer.id}
              className="flex w-full min-w-0 items-center gap-0.5 py-[3px] pr-1.5"
              style={{ paddingLeft: 20 }}
            >
              <span className="size-4 shrink-0" aria-hidden />
              <div
                className={`flex min-w-0 flex-1 items-center gap-0.5 rounded-sm py-[2px] pr-1.5 transition-colors duration-200 ${isSelected ? "bg-[#daebf7] font-medium" : ""
                  }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center transition-colors duration-200 ${isSelected ? "text-[#18a0fb]" : "text-[#7a7a7a]"
                    }`}
                >
                  <FigmaLayerIconGlyph type={layer.id === "iterate" ? "group" : "text"} />
                </span>
                <button
                  type="button"
                  onClick={() => onSelect(layer.id)}
                  className={`min-w-0 flex-1 truncate text-left text-[11px] leading-4 transition-colors duration-200 ${isSelected ? "text-[#18a0fb]" : "text-[#333] hover:text-[#18a0fb]"
                    }`}
                  aria-current={isSelected ? "true" : undefined}
                >
                  {layer.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
