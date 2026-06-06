export interface DesignSystemColor {
  name: string;
  token: string;
  value: string;
  usage: string;
}

export interface DesignSystemTypeStyle {
  name: string;
  token: string;
  fontFamily: "sans" | "serif";
  size: string;
  lineHeight: string;
  weight?: string;
  sample: string;
}

export interface DesignSystemRevealToken {
  token: string;
  useFor: string;
  delay?: string;
}

export const designSystemHeadline = "Portfolio design system";

export const designSystemLead =
  "Tokens and patterns behind every canvas frame — purple accent, serif headlines, Manrope body, and scroll-triggered reveals.";

export const designSystemColors: DesignSystemColor[] = [
  {
    name: "Accent",
    token: "accent",
    value: "#7c4dff",
    usage: "Badges, icons, highlights",
  },
  {
    name: "Accent muted",
    token: "accent-muted",
    value: "rgba(97, 86, 245, 0.1)",
    usage: "Badge backgrounds",
  },
  {
    name: "Headline",
    token: "headline",
    value: "#292423",
    usage: "Serif headings",
  },
  {
    name: "Frame surface",
    token: "frame-bg",
    value: "#F8F8F8",
    usage: "Canvas frame background",
  },
  {
    name: "Body muted",
    token: "body-muted",
    value: "rgba(0, 0, 0, 0.6)",
    usage: "Paragraph copy",
  },
  {
    name: "Action",
    token: "action",
    value: "#000000",
    usage: "Primary buttons & CTAs",
  },
];

export const designSystemTypeStyles: DesignSystemTypeStyle[] = [
  {
    name: "Display",
    token: "display",
    fontFamily: "serif",
    size: "40px",
    lineHeight: "51px",
    sample: "Section headlines",
  },
  {
    name: "Body",
    token: "body",
    fontFamily: "sans",
    size: "15px",
    lineHeight: "relaxed",
    sample: "Descriptions and supporting copy",
  },
  {
    name: "Badge label",
    token: "badge",
    fontFamily: "sans",
    size: "11px",
    lineHeight: "1",
    weight: "700",
    sample: "ABOUT · EXPERIENCE",
  },
  {
    name: "Button",
    token: "button",
    fontFamily: "sans",
    size: "15px",
    lineHeight: "25px",
    weight: "500",
    sample: "Download CV",
  },
];

export const designSystemRevealTokens: DesignSystemRevealToken[] = [
  { token: "badge", useFor: "Status / section pills", delay: "0.08s" },
  { token: "title", useFor: "Main heading", delay: "0.18s" },
  { token: "description", useFor: "Body copy", delay: "0.28s" },
  { token: "tech", useFor: "Tech stack & metadata", delay: "0.38s" },
  { token: "actions", useFor: "Buttons & CTAs", delay: "0.48s" },
  { token: "media", useFor: "Photos & screenshots (slides from right)" },
  { token: "terminal", useFor: "Secondary panels", delay: "0.52s" },
];
