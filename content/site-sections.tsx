import type { ReactNode } from "react";
import AboutMe from "@/components/frame/about-me";
import DesignSystem from "@/components/frame/design-system";
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
    { id: "about-me", content: <AboutMe /> },
    { id: "experience", title: "Experience", content: <Experience /> },
    {
      id: SELECTED_PROJECTS_SECTION_ID,
      title: "Selected Projects",
      content: <SelectedProjectsSite />,
    },
    { id: "get-in-touch", content: <GetInTouch /> },
  ];
}
