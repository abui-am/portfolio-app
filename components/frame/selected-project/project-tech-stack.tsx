import Image from "next/image";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";
import type { SelectedProjectTechItem } from "@/components/frame/selected-project/types";

interface ProjectTechStackProps {
  items: SelectedProjectTechItem[];
}

export function ProjectTechStack({ items }: ProjectTechStackProps) {
  return (
    <FigmaLayer
      name="Tech stack"
      icon="group"
      data-frame-reveal="tech"
      className="flex w-[472px] flex-wrap items-center gap-x-1.5 gap-y-1 text-base leading-[22px] text-black/60"
    >
      <span className="shrink-0">Tech Stack:</span>
      {items.map((item, index) => (
        <FigmaLayer key={item.label} name={item.label} icon="component" className="contents">
          <span className="inline-flex items-center gap-1">
            {index > 0 ? <span aria-hidden>,</span> : null}
            <Image
              src={item.iconSrc}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0 object-contain"
              unoptimized
              aria-hidden
            />
            <span>{item.label}</span>
          </span>
        </FigmaLayer>
      ))}
    </FigmaLayer>
  );
}
