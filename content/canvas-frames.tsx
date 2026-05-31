import type { ReactNode } from "react";
import Experience from "@/components/frame/experience";
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
export const EXPERIENCE_FRAME_ID = "experience";

export function getCanvasFrames(): CanvasFrameEntry[] {
  return [
    {
      id: PRIMARY_CANVAS_FRAME_ID,
      label: "Desktop - 1",
      content: <Portfolio />,
      active: true,
    },
    {
      id: EXPERIENCE_FRAME_ID,
      label: "Latest Experience",
      content: <Experience />,
    },
    ...selectedProjects.map((project) => ({
      id: project.id,
      label: project.frameLabel,
      content: <SelectedProjectFrame project={project} />,
    })),
  ];
}

export function getPrimaryCanvasFrames(): CanvasFrameEntry[] {
  return getCanvasFrames().filter(
    (frame) => frame.id === PRIMARY_CANVAS_FRAME_ID || frame.id === EXPERIENCE_FRAME_ID,
  );
}

export function getProjectCanvasFrames(): CanvasFrameEntry[] {
  return getCanvasFrames().filter(
    (frame) => frame.id !== PRIMARY_CANVAS_FRAME_ID && frame.id !== EXPERIENCE_FRAME_ID,
  );
}
