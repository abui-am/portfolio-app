import {
  ChevronRight,
  Component,
  Frame,
  Group,
  Heading,
  Image,
  LayoutGrid,
  Square,
  SquareDashed,
  Type,
} from "lucide-react";
import type { FigmaLayerIcon } from "@/components/figma-shell/figma-layer-types";

const iconProps = {
  className: "size-3.5 shrink-0",
  strokeWidth: 2,
  "aria-hidden": true as const,
};

export function FigmaLayerIconGlyph({ type }: { type: FigmaLayerIcon }) {
  switch (type) {
    case "group":
      return <Group {...iconProps} />;
    case "section":
      return <LayoutGrid {...iconProps} />;
    case "heading":
      return <Heading {...iconProps} />;
    case "text":
      return <Type {...iconProps} />;
    case "rectangle":
      return <Square {...iconProps} />;
    case "placeholder":
      return <SquareDashed {...iconProps} />;
    case "image":
      return <Image {...iconProps} />;
    case "component":
      return <Component {...iconProps} />;
    case "frame":
    default:
      return <Frame {...iconProps} />;
  }
}

export function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <ChevronRight
      className={`size-3 shrink-0 text-[#7a7a7a] transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
      strokeWidth={2}
      aria-hidden
    />
  );
}
