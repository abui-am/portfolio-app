import type { ReactNode } from "react";
import Education from "@/components/frame/education";
import Experience from "@/components/frame/experience";
import GetInTouch from "@/components/frame/get-in-touch";
import Portfolio from "@/components/frame/portfolio";
import { SelectedProjectsSite } from "@/components/site/selected-projects-site";

export interface SiteSectionEntry {
  id: string;
  title?: string;
  content: ReactNode;
}

export const SELECTED_PROJECTS_SECTION_ID = "selected-projects";

export function getSiteSections(): SiteSectionEntry[] {
  return [
    { id: "home", content: <Portfolio /> },
    { id: "experience", title: "Experience", content: <Experience /> },
    { id: "education", title: "Education", content: <Education /> },
    {
      id: SELECTED_PROJECTS_SECTION_ID,
      title: "Selected Projects",
      content: <SelectedProjectsSite />,
    },
    { id: "get-in-touch", content: <GetInTouch /> },
  ];
}
