export type FigmaLayerIcon =
  | "frame"
  | "group"
  | "section"
  | "heading"
  | "text"
  | "placeholder"
  | "rectangle"
  | "image"
  | "component";

export interface FigmaLayerNode {
  id: string;
  label: string;
  icon: FigmaLayerIcon;
  children: FigmaLayerNode[];
}

export interface FigmaFrameNode {
  frameId: string;
  label: string;
  active?: boolean;
  order: number;
  children: FigmaLayerNode[];
}

export interface FigmaLayerRegistration {
  id: string;
  frameId: string;
  parentId: string | null;
  label: string;
  icon: FigmaLayerIcon;
  order: number;
  isFrameRoot?: boolean;
  active?: boolean;
}
