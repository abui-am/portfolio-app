import type { SelectedProjectScreenshot } from "@/components/frame/selected-project/types";

export const SELECTED_PROJECT_LAYOUT = {
  frameWidth: 1440,
  frameHeight: 895,
  heroHeight: 458,
  rowHeight: 378,
  carouselTop: 458,
  carouselHeight: 379,
  carouselNextTop: 628,
  carouselNextLeft: 1372,
} as const;

export function getCarouselStripHeight(screenshots: SelectedProjectScreenshot[]) {
  if (screenshots.length === 0) return SELECTED_PROJECT_LAYOUT.carouselHeight;

  return Math.max(...screenshots.map((shot) => shot.height));
}

export function getFrameHeight(screenshots: SelectedProjectScreenshot[]) {
  const layout = SELECTED_PROJECT_LAYOUT;
  return layout.frameHeight - layout.carouselHeight + getCarouselStripHeight(screenshots);
}

export function getCarouselNextTop(screenshots: SelectedProjectScreenshot[]) {
  const layout = SELECTED_PROJECT_LAYOUT;
  const stripHeight = getCarouselStripHeight(screenshots);
  return layout.carouselTop + stripHeight / 2 - 20;
}
