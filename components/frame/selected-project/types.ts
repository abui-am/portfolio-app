import type { ReactNode } from "react";

export interface SelectedProjectBadge {
  label: string;
  dotColor: string;
  textColor: string;
  backgroundColor: string;
}

export interface SelectedProjectScreenshot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface SelectedProjectTextPart {
  type: "text";
  text: string;
}

export interface SelectedProjectLinkPart {
  type: "link";
  text: string;
  href: string;
}

export type SelectedProjectDescriptionPart = SelectedProjectTextPart | SelectedProjectLinkPart;

export interface SelectedProjectTechItem {
  label: string;
  iconSrc: string;
}

export interface SelectedProject {
  id: string;
  frameLabel: string;
  ariaLabel: string;
  badges: SelectedProjectBadge[];
  title: string;
  role?: string;
  /** Plain string or structured parts for inline links */
  description: string | SelectedProjectDescriptionPart[];
  techStack: SelectedProjectTechItem[];
  demoUrl?: string;
  githubUrl?: string;
  githubBeUrl?: string;
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  screenshots: SelectedProjectScreenshot[];
}

export interface SelectedProjectFrameProps {
  project: SelectedProject;
  /** Override carousel viewport width (default 1440) */
  carouselViewportWidth?: number;
  children?: ReactNode;
}
