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
  fundingRound?: string;
  employeeRange?: string;
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
    width?: number;
    height?: number;
    className?: string;
  };
}

export const experienceEntries: ExperienceEntry[] = [
  {
    role: "Product Engineer",
    company: "Apple Developer Academy @ BINUS, Bali",
    employment: "Part-time",
    period: "Mar 2026 - Present",
    location: "Park23, Kuta, Bali",
    description:
      "I joined the academy to relearn how I build apps. Most of my career has been web front-ends; this is a deliberate turn toward iOS—Swift, design, and talking to users before writing code. Ten-month scholarship at Park23 with Apple and BINUS, working in small teams on challenge briefs that end in real apps.",
    features: [
      { label: "Why I'm here", detail: "Rethink my app habits" },
      { label: "Weekly challenges", detail: "Brief → ship in Swift" },
      { label: "10-month cohort", detail: "Scholarship · Park23" },
      { label: "Team mix", detail: "Design, dev, research" },
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
    logo: {
      src: "/apple-developer-academy.webp",
      alt: "Apple Developer Academy @ BINUS logo",
      width: 155,
      height: 48,
      className: "h-12 w-auto max-w-[155px] object-contain object-left",
    },
    skills: ["iOS Development", "Project Management", "UI/UX Design", "User Research"],
    highlights: [
      "Took a step back from shipping web features fast to ask harder questions: does this app need to exist, and is it good on a phone?",
    ],
  },
  {
    role: "Frontend Engineer II",
    company: "Evermos",
    employment: "Full-time",
    location: "Bandung, Indonesia",
    period: "Jul 2025 - Mar 2026",
    fundingRound: "Series C",
    employeeRange: "500–1,000 employees",
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
    employment: "Full-time",
    period: "Dec 2022 - Jul 2025",
    location: "Remote",
    fundingRound: "Series Seed",
    employeeRange: "50–200 employees",
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
