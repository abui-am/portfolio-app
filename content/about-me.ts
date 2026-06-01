export type AboutLayerId = "curious" | "reflective" | "experimental" | "kaizen" | "framework";

export interface AboutLayerNode {
  id: AboutLayerId;
  label: string;
}

export interface AboutTraitContent {
  id: AboutLayerId;
  name: string;
  description: string;
  evidence: string[];
}

export interface AboutTimelineEntry {
  year: string;
  title: string;
  detail: string;
}

export interface AboutPrincipleStep {
  label: string;
  detail: string;
}

export const aboutMeHeadline = "About Me";

export const aboutMeStory = {
  lead: "I'm a frontend engineer with about five years in. I like poking at how things work, trying ideas, and cleaning up what bothered me last sprint. Mostly React and TypeScript.",
} as const;

export const aboutMeOs = {
  edition: "Kaizen OS v1.0",
  role: "Frontend Engineer",
  experience: "5+ years",
  stack: "React · TypeScript",
  building: ["Bli", "KochAI", "GitGud"] as const,
  status: "Active",
} as const;

export const aboutMeLayerTree: AboutLayerNode[] = [
  { id: "curious", label: "Explore latest emerging technology" },
  { id: "reflective", label: "Reflection" },
  { id: "experimental", label: "Experimentation" },
  { id: "kaizen", label: "Kaizen" },
  { id: "framework", label: "Principles" },
];

/** Default layer when the inspector opens. */
export const aboutMeDefaultLayerId: AboutLayerId = "curious";

/** All layers rendered in the properties inspector (stacked for stable height). */
export const aboutMeInspectableLayerIds: AboutLayerId[] = aboutMeLayerTree.map((layer) => layer.id);

export const aboutMeTraits: AboutTraitContent[] = [
  {
    id: "curious",
    name: "Explore latest emerging technology",
    description: "I keep an eye on what's new and try it before it becomes the default stack.",
    evidence: [
      "Joined Apple Developer Academy to learn iOS and native patterns hands-on.",
      "Side projects with RAG and fine-tuning when AI tooling moves fast.",
      "Built this Figma-style portfolio on Next.js 16 and modern React patterns.",
    ],
  },
  {
    id: "reflective",
    name: "Reflective",
    description: "I'll do a retro after a messy release instead of pretending it went fine.",
    evidence: [
      "KochAI thesis: cited real papers so answers were not made up.",
      "Facilitator at Binar Academy: React, Next.js, SSR, tests.",
      "Post-release retros on what broke and why.",
      "Code reviews that ask what to do differently next time.",
    ],
  },
  {
    id: "experimental",
    name: "Experimental",
    description: "I'd rather try a small spike than debate it in a meeting for a week.",
    evidence: [
      "Evermos: moved chunks of Vue to React without stopping the business.",
      "Bli shipped at a hackathon in hours, not a quarter.",
      "GitGud started as a weekend spike for better commit messages.",
      "Prototypes on a branch before pitching to the team.",
    ],
  },
  {
    id: "kaizen",
    name: "Kaizen",
    description: "Big rewrites scare me. Steady patches don't.",
    evidence: [
      "Everpro: oxlint, Clarity, small perf wins that added up.",
      "This portfolio is probably version four. There will be a fifth.",
      "Weekly fixes beat waiting months for one big launch.",
      "Refactor the hot path, not the whole repo at once.",
    ],
  },
];

export const aboutMePrinciples: AboutPrincipleStep[] = [
  {
    label: "Iterate",
    detail: "Ship a slice, see what people do with it, adjust.",
  },
  {
    label: "Reflect",
    detail: "What was annoying? What would I do differently? Write it down.",
  },
  {
    label: "Experiment",
    detail: "Try the idea on a branch before selling it to the team.",
  },
  {
    label: "Ship",
    detail: "Merged code counts more than slides.",
  },
];

/** Key milestones from CV, newest first */
export const aboutMeTimeline: AboutTimelineEntry[] = [
  {
    year: "2026",
    title: "Product Engineer",
    detail: "Apple Developer Academy, Bali",
  },
  {
    year: "2025",
    title: "Frontend Engineer II",
    detail: "Evermos · Everpro",
  },
  {
    year: "2022",
    title: "Senior Frontend Engineer",
    detail: "Dealls · job board & HRIS",
  },
  {
    year: "2021",
    title: "Frontend Engineer",
    detail: "EKRUT",
  },
  {
    year: "2019",
    title: "Web Developer Intern",
    detail: "Svara",
  },
];

export const aboutMePropertiesPrinciples = {
  name: "Principles",
  description: "What Iterate · Reflect · Ship means for you, not buzzwords.",
} as const;

export function getAboutTrait(id: AboutLayerId): AboutTraitContent | undefined {
  return aboutMeTraits.find((trait) => trait.id === id);
}
