"use client";

import { useFigmaLayerFrames } from "@/components/figma-shell/figma-layers-context";
import { FrameLayerTree } from "@/components/figma-shell/layer-tree";

export function FigmaLeftPanelLayers() {
  const frames = useFigmaLayerFrames();

  return (
    <div className="flex flex-col">
      {[...frames].reverse().map((frame) => (
        <FrameLayerTree
          key={frame.frameId}
          frameId={frame.frameId}
          label={frame.label}
          active={frame.active}
          nodes={frame.children}
        />
      ))}
    </div>
  );
}
