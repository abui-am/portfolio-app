import type { FigmaFrameNode, FigmaLayerNode } from "@/components/figma-shell/figma-layer-types";

function normalizeLayerSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

export function layerLabelMatches(label: string, query: string) {
  const normalized = normalizeLayerSearchQuery(query);
  if (!normalized) return true;
  return label.toLowerCase().includes(normalized);
}

export function filterLayerNodes(nodes: FigmaLayerNode[], query: string): FigmaLayerNode[] {
  const normalized = normalizeLayerSearchQuery(query);
  if (!normalized) return nodes;

  const filtered: FigmaLayerNode[] = [];

  for (const node of nodes) {
    const filteredChildren = filterLayerNodes(node.children, query);
    const selfMatches = layerLabelMatches(node.label, query);

    if (selfMatches) {
      filtered.push(node);
      continue;
    }

    if (filteredChildren.length > 0) {
      filtered.push({ ...node, children: filteredChildren });
    }
  }

  return filtered;
}

export function filterLayerFrames(frames: FigmaFrameNode[], query: string): FigmaFrameNode[] {
  const normalized = normalizeLayerSearchQuery(query);
  if (!normalized) return frames;

  const filtered: FigmaFrameNode[] = [];

  for (const frame of frames) {
    const frameMatches = layerLabelMatches(frame.label, query);
    const filteredChildren = filterLayerNodes(frame.children, query);

    if (frameMatches) {
      filtered.push(frame);
      continue;
    }

    if (filteredChildren.length > 0) {
      filtered.push({ ...frame, children: filteredChildren });
    }
  }

  return filtered.sort((a, b) => a.order - b.order);
}
