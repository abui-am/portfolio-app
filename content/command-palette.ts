import { CV_DOWNLOAD_NAME, CV_PDF_HREF } from "@/content/cv-download";
import { getInTouchLinks } from "@/content/get-in-touch";
import { bliProject, gitgudProject, kochaiProject } from "@/content/selected-projects";

export type CommandPaletteAction =
  | { type: "download"; href: string; filename: string }
  | { type: "open-url"; url: string }
  | { type: "navigate"; href: string };

export interface CommandPaletteItem {
  id: string;
  label: string;
  keywords?: string[];
  action: CommandPaletteAction;
}

export const commandPaletteItems: CommandPaletteItem[] = [
  {
    id: "go-to-play-mode",
    label: "Go to play mode",
    keywords: ["play", "site", "scroll", "view"],
    action: { type: "navigate", href: "/play" },
  },
  {
    id: "download-portfolio",
    label: "Download portfolio",
    keywords: ["cv", "resume", "pdf"],
    action: {
      type: "download",
      href: CV_PDF_HREF,
      filename: CV_DOWNLOAD_NAME,
    },
  },
  {
    id: "open-bli",
    label: "Open Bli",
    keywords: ["bali", "demo", "project"],
    action: { type: "open-url", url: bliProject.demoUrl! },
  },
  {
    id: "open-kochai",
    label: "Open KochAI",
    keywords: ["kochai", "fitness", "thesis", "demo"],
    action: { type: "open-url", url: kochaiProject.demoUrl! },
  },
  {
    id: "open-gitgud",
    label: "Open GitGud",
    keywords: ["git", "github", "go"],
    action: { type: "open-url", url: gitgudProject.githubUrl ?? "https://github.com/abui-am/gitgud" },
  },
  ...getInTouchLinks.map((link) => ({
    id: `contact-${link.id}`,
    label: `Contact me via ${link.label}`,
    keywords: [
      "contact",
      "reach",
      "get in touch",
      link.id,
      link.label.toLowerCase(),
      ...(link.id === "email" ? [] : [link.display]),
    ],
    action: { type: "open-url" as const, url: link.href },
  })),
];

export function filterCommandPaletteItems(query: string, items = commandPaletteItems) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const haystack = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}
