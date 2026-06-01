import type { ReactNode } from "react";
import Education from "@/components/frame/education";
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
export const EXPERIENCE_FRAME_ID = "experience";
export const EDUCATION_FRAME_ID = "education";
export const GET_IN_TOUCH_FRAME_ID = "get-in-touch";

const PRIMARY_FRAME_IDS = new Set([
  PRIMARY_CANVAS_FRAME_ID,
  EXPERIENCE_FRAME_ID,
  EDUCATION_FRAME_ID,
  GET_IN_TOUCH_FRAME_ID,
]);

export function getCanvasFrames(): CanvasFrameEntry[] {
  return [
    {
      id: PRIMARY_CANVAS_FRAME_ID,
      label: "Home",
      sectionTitle: "Home",
      content: <Portfolio />,
      active: true,
    },
    {
      id: EXPERIENCE_FRAME_ID,
      label: "Latest Experience",
      sectionTitle: "Experience",
      content: <Experience />,
    },
    {
      id: EDUCATION_FRAME_ID,
      label: "Education",
      sectionTitle: "Education",
      content: <Education />,
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
  return getCanvasFrames().filter((frame) => !PRIMARY_FRAME_IDS.has(frame.id));
}
