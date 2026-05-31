import type { ReactNode } from "react";
import Portfolio from "@/components/frame/portfolio";
import { SelectedProjectFrame } from "@/components/frame/selected-project";
import { selectedProjects } from "@/content/selected-projects";

export interface CanvasFrameEntry {
  id: string;
  label: string;
  content: ReactNode;
  active?: boolean;
}

export const PRIMARY_CANVAS_FRAME_ID = "desktop-1";

export function getCanvasFrames(): CanvasFrameEntry[] {
  return [
    {
      id: "desktop-1",
      label: "Desktop - 1",
      content: <Portfolio />,
      active: true,
    },
    ...selectedProjects.map((project) => ({
      id: project.id,
      label: project.frameLabel,
      content: <SelectedProjectFrame project={project} />,
    })),
  ];
}
