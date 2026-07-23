export type AboutLayerId = "explore" | "experiment" | "reflect" | "iterate";

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

export interface AboutTimelineLink {
  label: string;
  href: string;
}

export interface AboutTimelineEntry {
  year: string;
  title: string;
  detail: string;
  kind?: "work" | "education";
  gpa?: string;
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
  links?: AboutTimelineLink[];
}

export interface AboutPrincipleStep {
  label: string;
  detail: string;
}

export const aboutMeHeadline = "How it all started...";

export const aboutMeStory = {
  lead: `Growing up, I always had this question in my mind: how do things work? This curiosity began to grow into a passion for understanding how things work, and how to make them work better.
    Growing in a poor family is not easy, but I was able to graduate from university with a good GPA. Paid my own way through university by working a full-time career as a Software Engineer.
  `
} as const;

export const aboutMeOs = {
  edition: "Engineer's Profile v1.0",
  role: "Fullstack Engineer",
  experience: "5+ years",
  stack: "React · TypeScript",
  interest: ["Web Development", "AI", "Product Development", "User Experience", "User Research"] as const,
  building: ["Bli", "KochAI", "GitGud"] as const,
  status: "Active",
} as const;

export const aboutMeLayerTree: AboutLayerNode[] = [
  { id: "explore", label: "Explore" },
  { id: "experiment", label: "Experiment" },
  { id: "reflect", label: "Reflect" },
  { id: "iterate", label: "Iterate" },
];

/** Default layer when the inspector opens. */
export const aboutMeDefaultLayerId: AboutLayerId = "explore";

/** All layers rendered in the properties inspector (stacked for stable height). */
export const aboutMeInspectableLayerIds: AboutLayerId[] = aboutMeLayerTree.map((layer) => layer.id);

export const aboutMeTraits: AboutTraitContent[] = [
  {
    id: "explore",
    name: "Explore",
    description:
      "Technology changes fast. I stay curious by learning through building, not by watching from the sidelines.",
    evidence: [
      "Joined Apple Developer Academy to learn native development firsthand.",
      "Built projects with RAG and LLM fine-tuning while AI tooling evolved rapidly.",
      "Experimented with modern React and Next.js patterns through personal projects.",
    ],
  },

  {
    id: "experiment",
    name: "Experiment",
    description:
      "I prefer small prototypes over long debates. Working software creates better discussions than slide decks.",
    evidence: [
      "Built Bli during a hackathon in hours instead of weeks.",
      "Created GitGud as a weekend experiment to improve commit workflows.",
      "Validate ideas through prototypes before proposing larger investments.",
    ],
  },

  {
    id: "reflect",
    name: "Reflect",
    description:
      "Every release teaches something. I treat mistakes and successes as feedback loops for better decisions.",
    evidence: [
      "Conduct post-release retrospectives to identify root causes.",
      "Emphasized evidence-based answers in KochAI through research-backed sources.",
      "Use code reviews to discuss improvements, not just correctness.",
    ],
  },

  {
    id: "iterate",
    name: "Iterate",
    description:
      "Sustainable progress comes from continuous improvement, not massive rewrites.",
    evidence: [
      "Introduced incremental improvements at Everpro through tooling and performance optimizations.",
      "Migrated systems gradually without disrupting business operations.",
      "Continuously refine personal projects instead of treating them as finished products.",
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

/** Key milestones from CV and education, newest first */
export const aboutMeTimeline: AboutTimelineEntry[] = [
  {
    year: "2026",
    title: "Working as a Product Engineer",
    detail: "Apple Developer Academy, Bali",
    kind: "work",
  },
  {
    year: "2026",
    title: "Graduate of Computer Science",
    detail: "Telkom University",
    kind: "education",
    gpa: "3.88",
    logo: {
      src: "/telkom-university.webp",
      alt: "Telkom University logo",
      width: 40,
      height: 48,
      className: "h-8 w-auto max-w-[32px] object-contain object-left",
    },
    links: [{ label: "Visit university", href: "https://telkomuniversity.ac.id/" }],
  },
  {
    year: "2025",
    title: "Working as a Frontend Engineer II",
    detail: "Evermos · Everpro",
    kind: "work",
  },
  {
    year: "2022",
    title: "Working as a Senior Frontend Engineer",
    detail: "Dealls Jobs · KantorKu",
    kind: "work",
  },
  {
    year: "2021",
    title: "Working as a Frontend Engineer",
    detail: "EKRUT",
    kind: "work",
  },
  {
    year: "2020",
    title: "Graduate of Software Engineering",
    detail: "SMKN 1 Cimahi",
    kind: "education",
  },
  {
    year: "2019",
    title: "Working as a Web Developer Intern",
    detail: "Svara",
    kind: "work",
  },
];

export const aboutMePropertiesPrinciples = {
  name: "Principles",
  description: "What Iterate · Reflect · Ship means for you, not buzzwords.",
} as const;

export function getAboutTrait(id: AboutLayerId): AboutTraitContent | undefined {
  return aboutMeTraits.find((trait) => trait.id === id);
}
