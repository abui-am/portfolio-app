"use client";

import { Lock } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { useFigmaCanvas, useSelectedLayerId } from "@/components/figma-shell/figma-canvas-context";
import { ChevronIcon, FigmaLayerIconGlyph } from "@/components/figma-shell/figma-layer-icons";
import type { FigmaLayerNode } from "@/components/figma-shell/figma-layer-types";

export type LayerTreeNode = FigmaLayerNode;

const INDENT_PX = 16;

interface LayerTreeRowProps {
  node: LayerTreeNode;
  depth: number;
  frameActive?: boolean;
  isFrameRoot?: boolean;
  defaultExpanded?: boolean;
  forceExpanded?: boolean;
}

function LayerTreeRow({
  node,
  depth,
  frameActive,
  isFrameRoot,
  defaultExpanded = true,
  forceExpanded = false,
}: LayerTreeRowProps) {
  const { focusLayer } = useFigmaCanvas();
  const selectedLayerId = useSelectedLayerId();
  const hasChildren = node.children.length > 0;
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isExpanded = forceExpanded || expanded;
  const paddingLeft = 4 + depth * INDENT_PX;
  const isSelected = selectedLayerId === node.id;
  const isHighlighted = isFrameRoot
    ? isSelected || (frameActive && selectedLayerId === null)
    : isSelected;

  function handleChevronClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  }

  function handleSelect() {
    focusLayer(node.id);
  }

  const rowClassName = `flex min-w-0 flex-1 items-center gap-0.5 rounded-sm py-[3px] pr-1.5 text-left text-[11px] leading-4 ${isHighlighted
    ? "bg-[#daebf7] font-medium text-[#18a0fb]"
    : "text-[#333]"
    }`;

  return (
    <>
      <div className="flex w-full min-w-0 items-center" style={{ paddingLeft }}>
        {hasChildren ? (
          <button
            type="button"
            onClick={handleChevronClick}
            className="flex size-4 shrink-0 items-center justify-center rounded-sm hover:bg-black/5"
            aria-label={isExpanded ? "Collapse layer" : "Expand layer"}
          >
            <ChevronIcon expanded={isExpanded} />
          </button>
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}

        <div className={rowClassName}>
          <span
            className={`flex size-4 shrink-0 items-center justify-center ${isHighlighted ? "text-[#18a0fb]" : "text-[#7a7a7a]"
              }`}
          >
            <FigmaLayerIconGlyph type={node.icon} />
          </span>
          <button
            type="button"
            onClick={handleSelect}
            className={`min-w-0 flex-1 truncate text-left ${isHighlighted ? "text-[#18a0fb]" : "text-[#333] hover:text-[#18a0fb]"
              }`}
            aria-current={isSelected ? "true" : undefined}
          >
            {node.label}
          </button>
          {isFrameRoot ? (
            <Lock className="size-3 shrink-0 text-[#b3b3b3]" strokeWidth={2} aria-hidden />
          ) : null}
        </div>
      </div>

      {hasChildren && isExpanded
        ? node.children.map((child) => (
          <LayerTreeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            defaultExpanded={defaultExpanded}
            forceExpanded={forceExpanded}
          />
        ))
        : null}
    </>
  );
}

interface LayerTreeProps {
  nodes: LayerTreeNode[];
  depth?: number;
  defaultExpanded?: boolean;
  forceExpanded?: boolean;
}

export function LayerTree({ nodes, depth = 0, defaultExpanded = true, forceExpanded = false }: LayerTreeProps) {
  return (
    <>
      {nodes.map((node) => (
        <LayerTreeRow
          key={node.id}
          node={node}
          depth={depth}
          defaultExpanded={defaultExpanded}
          forceExpanded={forceExpanded}
        />
      ))}
    </>
  );
}

interface FrameLayerTreeProps {
  frameId: string;
  label: string;
  active?: boolean;
  nodes: LayerTreeNode[];
  forceExpanded?: boolean;
}

export function FrameLayerTree({ frameId, label, active, nodes, forceExpanded = false }: FrameLayerTreeProps) {
  const frameNode: LayerTreeNode = {
    id: frameId,
    label,
    icon: "frame",
    children: nodes,
  };

  return (
    <LayerTreeRow
      node={frameNode}
      depth={0}
      frameActive={active}
      isFrameRoot
      defaultExpanded
      forceExpanded={forceExpanded}
    />
  );
}
