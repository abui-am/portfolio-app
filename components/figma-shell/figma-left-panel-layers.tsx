"use client";

import { useMemo } from "react";
import { filterLayerFrames } from "@/components/figma-shell/layer-search";
import { useFigmaLayerFrames } from "@/components/figma-shell/figma-layers-context";
import { FrameLayerTree } from "@/components/figma-shell/layer-tree";

interface FigmaLeftPanelLayersProps {
  searchQuery?: string;
}

export function FigmaLeftPanelLayers({ searchQuery = "" }: FigmaLeftPanelLayersProps) {
  const frames = useFigmaLayerFrames();
  const isFiltering = searchQuery.trim().length > 0;

  const filteredFrames = useMemo(
    () => filterLayerFrames(frames, searchQuery),
    [frames, searchQuery],
  );

  if (isFiltering && filteredFrames.length === 0) {
    return (
      <p className="px-2 py-3 text-[11px] leading-snug text-[#b3b3b3]">
        No layers match &ldquo;{searchQuery.trim()}&rdquo;
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {filteredFrames.map((frame) => (
        <FrameLayerTree
          key={frame.frameId}
          frameId={frame.frameId}
          label={frame.label}
          active={frame.active}
          nodes={frame.children}
          forceExpanded={isFiltering}
        />
      ))}
    </div>
  );
}
