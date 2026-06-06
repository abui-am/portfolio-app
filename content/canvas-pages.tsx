import {
  DESIGN_SYSTEM_FRAME_ID,
  getCanvasFrames,
  getPrimaryCanvasFrames,
  getProjectCanvasFrames,
  PRIMARY_CANVAS_FRAME_ID,
  type CanvasFrameEntry,
} from "@/content/canvas-frames";

export const PORTFOLIO_PAGE_ID = "page-1";
export const DESIGN_SYSTEM_PAGE_ID = "design-system-page";

export type CanvasPageLayout = "portfolio" | "single";

export interface CanvasPage {
  id: string;
  label: string;
  layout: CanvasPageLayout;
  initialFrameId: string;
}

export const canvasPages: CanvasPage[] = [
  {
    id: PORTFOLIO_PAGE_ID,
    label: "Page 1",
    layout: "portfolio",
    initialFrameId: PRIMARY_CANVAS_FRAME_ID,
  },
  {
    id: DESIGN_SYSTEM_PAGE_ID,
    label: "Design System",
    layout: "single",
    initialFrameId: DESIGN_SYSTEM_FRAME_ID,
  },
];

export function getCanvasPage(pageId: string): CanvasPage {
  return canvasPages.find((page) => page.id === pageId) ?? canvasPages[0];
}

export function getFramesForPage(pageId: string): CanvasFrameEntry[] {
  if (pageId === DESIGN_SYSTEM_PAGE_ID) {
    return getCanvasFrames().filter((frame) => frame.id === DESIGN_SYSTEM_FRAME_ID);
  }

  return [...getPrimaryCanvasFrames(), ...getProjectCanvasFrames()];
}

export function getPrimaryFramesForPage(pageId: string): CanvasFrameEntry[] {
  if (pageId === DESIGN_SYSTEM_PAGE_ID) {
    return getFramesForPage(pageId);
  }

  return getPrimaryCanvasFrames();
}

export function getProjectFramesForPage(pageId: string): CanvasFrameEntry[] {
  if (pageId === DESIGN_SYSTEM_PAGE_ID) {
    return [];
  }

  return getProjectCanvasFrames();
}
