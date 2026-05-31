"use client";

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
  defaultExpanded?: boolean;
}

function LayerTreeRow({ node, depth, frameActive, defaultExpanded = true }: LayerTreeRowProps) {
  const { focusLayer } = useFigmaCanvas();
  const selectedLayerId = useSelectedLayerId();
  const hasChildren = node.children.length > 0;
  const [expanded, setExpanded] = useState(defaultExpanded);
  const paddingLeft = 4 + depth * INDENT_PX;
  const isSelected = selectedLayerId === node.id;
  const isHighlighted = isSelected || (frameActive && selectedLayerId === null);

  function handleChevronClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  }

  function handleRowClick() {
    focusLayer(node.id);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowClick();
          }
        }}
        className={`group flex w-full min-w-0 cursor-default items-center gap-0.5 rounded-sm py-[3px] pr-1.5 text-left text-[11px] leading-4 ${
          isHighlighted
            ? "bg-[#daebf7] font-medium text-[#18a0fb]"
            : "text-[#333] hover:bg-[#f5f5f5]"
        }`}
        style={{ paddingLeft }}
        aria-current={isSelected ? "true" : undefined}
      >
        <button
          type="button"
          onClick={hasChildren ? handleChevronClick : undefined}
          className={`flex size-4 shrink-0 items-center justify-center rounded-sm ${
            hasChildren ? "hover:bg-black/5" : ""
          }`}
          aria-label={hasChildren ? (expanded ? "Collapse layer" : "Expand layer") : undefined}
          tabIndex={hasChildren ? 0 : -1}
        >
          {hasChildren ? <ChevronIcon expanded={expanded} /> : null}
        </button>
        <span
          className={`flex size-4 shrink-0 items-center justify-center ${
            isHighlighted ? "text-[#18a0fb]" : "text-[#7a7a7a] group-hover:text-[#666]"
          }`}
        >
          <FigmaLayerIconGlyph type={node.icon} />
        </span>
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
      </div>
      {hasChildren && expanded
        ? [...node.children].reverse().map((child) => (
            <LayerTreeRow key={child.id} node={child} depth={depth + 1} defaultExpanded={defaultExpanded} />
          ))
        : null}
    </>
  );
}

interface LayerTreeProps {
  nodes: LayerTreeNode[];
  depth?: number;
  defaultExpanded?: boolean;
}

export function LayerTree({ nodes, depth = 0, defaultExpanded = true }: LayerTreeProps) {
  return (
    <>
      {[...nodes].reverse().map((node) => (
        <LayerTreeRow
          key={node.id}
          node={node}
          depth={depth}
          defaultExpanded={defaultExpanded}
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
}

export function FrameLayerTree({ frameId, label, active, nodes }: FrameLayerTreeProps) {
  const frameNode: LayerTreeNode = {
    id: frameId,
    label,
    icon: "frame",
    children: nodes,
  };

  return <LayerTreeRow node={frameNode} depth={0} frameActive={active} defaultExpanded />;
}
