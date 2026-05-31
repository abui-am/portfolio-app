export interface ExperienceFeature {
  label: string;
  detail: string;
}

export interface ExperienceLink {
  label: string;
  href: string;
}

export interface ExperienceCodePanel {
  filename: string;
  snippet: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  employment: string;
  period: string;
  location?: string;
  description?: string;
  features: ExperienceFeature[];
  codePanel: ExperienceCodePanel;
  links?: ExperienceLink[];
  skills: string[];
  projects?: string[];
  highlights: string[];
  logo?: {
    src: string;
    alt: string;
  };
}

export const experienceEntries: ExperienceEntry[] = [
  {
    role: "Apple Developer Academy @ BINUS, Bali",
    company: "",
    employment: "",
    period: "Mar 2026 - Present",
    location: "Park23, Kuta, Bali",
    description:
      "A 10-month, full-scholarship program by Apple and BINUS University—the first Apple Developer Academy in Asia open to international learners. Based at Park23 in Kuta, the academy uses Apple's challenge-based learning model to build real iOS apps with Swift while developing UI/UX design, user research, project management, and entrepreneurship skills in cross-functional teams.",
    features: [
      { label: "10-month cohort", detail: "Full scholarship program" },
      { label: "Challenge-based", detail: "Ship real iOS apps" },
      { label: "Asia-first academy", detail: "International learners" },
      { label: "T-shaped skills", detail: "Code, design, business" },
    ],
    codePanel: {
      filename: "ChallengeApp.swift",
      snippet: `struct ChallengeApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
  }
}

// Challenge-based learning
// Swift · UI/UX · User Research`,
    },
    links: [{ label: "Visit academy", href: "https://developeracademy.apps.binus.ac.id/bali/" }],
    skills: ["iOS Development", "Project Management", "UI/UX Design", "User Research"],
    highlights: [],
  },
  {
    role: "Frontend Engineer II",
    company: "Evermos",
    employment: "Full-time (Bandung)",
    period: "Jul 2025 - Mar 2026",
    description:
      "Built and maintained front-end systems for Everpro, Evermos' logistics platform serving 30,000+ sellers with multi-carrier shipping, COD disbursement, and API integrations.",
    features: [
      { label: "Vue to React migration", detail: "Modernized legacy front-end stack" },
      { label: "Cutting edge tools", detail: "oxlint · MS Clarity · Turborepo" },
      { label: "Monorepo frontend", detail: "Next.js · React · pnpm" },
      { label: "Fast-paced environment", detail: "Real-time traffic at scale" },
    ],
    codePanel: {
      filename: "shipping-dashboard.tsx",
      snippet: `export function ShippingDashboard() {
  const { orders, carriers } = useShippingQueue();

  return (
    <DashboardLayout title="Everpro Shipping">
      <BulkResiPanel orders={orders} />
      <CarrierGrid carriers={carriers} />
    </DashboardLayout>
  );
}

// Next.js · TypeScript · Turborepo`,
    },
    links: [{ label: "Visit Everpro", href: "https://everpro.id/" }],
    logo: { src: "/evermos.svg", alt: "Evermos logo" },
    skills: [
      "Typescript",
      "TailwindCSS",
      "Reactjs",
      "Nextjs",
      "AI Devtools",
      "Turborepo",
      "Vue",
      "Nuxtjs",
      "SWR",
    ],
    projects: ["Everpro Shipping Dashboard"],
    highlights: [
      "Developed and maintained scalable front-end systems using Next.js, React.js, TypeScript, and TailwindCSS and Monorepo",
      "Continuously improved development workflows, tooling, observable and performance (oxlint, MS Clarity, and Turborepo)",
      "Maintaining old system with Vue and Nuxt2",
    ],
  },
  {
    role: "Senior Frontend Engineer",
    company: "Dealls Jobs (YC W22)",
    employment: "Full-time (Remote)",
    period: "Dec 2022 - Jul 2025",
    description:
      "Led front-end development for Dealls' job portal and KantorKu's all-in-one HRIS—platforms used by thousands of companies across Indonesia.",
    features: [
      { label: "Job portal & ATS", detail: "Dealls #LebihPasti" },
      { label: "All-in-one HRIS", detail: "KantorKu platform" },
      { label: "Team leadership", detail: "Front-end mentorship" },
      { label: "Quality at scale", detail: "Jest · code reviews" },
    ],
    codePanel: {
      filename: "ats-pipeline.tsx",
      snippet: `export function ApplicantPipeline() {
  const { stages, candidates } = useAtsBoard();

  return (
    <BoardLayout title="Dealls ATS">
      <PipelineStages stages={stages} />
      <CandidateCards items={candidates} />
    </BoardLayout>
  );
}

// Next.js · TypeScript · Jest`,
    },
    links: [
      { label: "Dealls", href: "https://dealls.com/" },
      { label: "KantorKu", href: "https://kantorku.id/" },
    ],
    logo: { src: "/dealls.svg", alt: "Dealls logo" },
    skills: [
      "Typescript",
      "Javascript",
      "TailwindCSS",
      "Reactjs",
      "Nextjs",
      "Jest",
      "AI Devtools",
      "Turborepo",
    ],
    projects: ["Kantorku.id", "Dealls ATS"],
    highlights: [
      "Led and mentored a front-end team, providing technical guidance and code quality oversight",
      "Integrated AI tools to streamline development and boost team productivity",
      "Developed and maintained scalable front-end systems using Next.js, TypeScript, and TailwindCSS",
      "Collaborated with back-end engineers to ensure seamless API integration",
      "Conducted code reviews and implemented unit testing with Jest",
      "Continuously improved development workflows, tooling, and performance",
    ],
  },
];
