import type { ReactNode } from "react";
import AboutMe from "@/components/frame/about-me";
import DesignSystem from "@/components/frame/design-system";
import Experience from "@/components/frame/experience";
import GetInTouch from "@/components/frame/get-in-touch";
import Portfolio from "@/components/frame/portfolio";
import { SelectedProjectFrame } from "@/components/frame/selected-project";
import { selectedProjects } from "@/content/selected-projects";

export interface CanvasFrameEntry {
  id: string;
  label: string;
  /** Heading shown on the /play site view */
  sectionTitle: string;
  content: ReactNode;
  active?: boolean;
}

export const PRIMARY_CANVAS_FRAME_ID = "desktop-1";
export const ABOUT_ME_FRAME_ID = "about-me";
export const EXPERIENCE_FRAME_ID = "experience";
export const GET_IN_TOUCH_FRAME_ID = "get-in-touch";
export const DESIGN_SYSTEM_FRAME_ID = "design-system";

const PRIMARY_FRAME_IDS = new Set([
  PRIMARY_CANVAS_FRAME_ID,
  ABOUT_ME_FRAME_ID,
  EXPERIENCE_FRAME_ID,
  GET_IN_TOUCH_FRAME_ID,
]);

export const DESIGN_SYSTEM_FRAME_IDS = new Set([
  DESIGN_SYSTEM_FRAME_ID,
]);

export function getCanvasFrames(): CanvasFrameEntry[] {
  return [
    {
      id: PRIMARY_CANVAS_FRAME_ID,
      label: "Introduction",
      sectionTitle: "Home",
      content: <Portfolio />,
      active: true,
    },
    {
      id: ABOUT_ME_FRAME_ID,
      label: "About Me",
      sectionTitle: "About Me",
      content: <AboutMe />,
    },
    {
      id: EXPERIENCE_FRAME_ID,
      label: "Latest Experience",
      sectionTitle: "Experience",
      content: <Experience />,
    },
    {
      id: DESIGN_SYSTEM_FRAME_ID,
      label: "Design System",
      sectionTitle: "Design System",
      content: <DesignSystem />,
    },
    {
      id: GET_IN_TOUCH_FRAME_ID,
      label: "Get in touch",
      sectionTitle: "Get in touch with me",
      content: <GetInTouch />,
    },
    ...selectedProjects.map((project) => ({
      id: project.id,
      label: project.frameLabel,
      sectionTitle: project.title,
      content: <SelectedProjectFrame project={project} />,
    })),
  ];
}

export function getPrimaryCanvasFrames(): CanvasFrameEntry[] {
  return getCanvasFrames().filter((frame) => PRIMARY_FRAME_IDS.has(frame.id));
}

export function getProjectCanvasFrames(): CanvasFrameEntry[] {
  return getCanvasFrames().filter((frame) => !PRIMARY_FRAME_IDS.has(frame.id) && !DESIGN_SYSTEM_FRAME_IDS.has(frame.id));
}
