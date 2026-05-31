import type { SelectedProject } from "@/components/frame/selected-project";

export const bliProject: SelectedProject = {
  id: "bli",
  frameLabel: "Selected Project - 1",
  ariaLabel: "Selected Project - Bli",
  badges: [
    {
      label: "Selected Work #1",
      icon: "selected-work",
      dotColor: "#7C4DFF",
      textColor: "#7C4DFF",
      backgroundColor: "rgba(97,85,245,0.1)",
    },
    {
      label: "Award Winning",
      icon: "award-winning",
      dotColor: "#FF6900",
      textColor: "#FF6900",
      backgroundColor: "#FFEDD4",
    },
  ],
  title: "Bli, Your Bali Local Friend",
  role: "Product + Engineer",
  description: [
    {
      type: "text",
      text: "Bli is an AI-powered local assistant designed to help residents and travelers discover real-time events, attractions, and activities across Bali. Coded in just 3 hours, Bli successfully win ",
    },
    {
      type: "link",
      text: "Build with AI: TRAE Friends@Bali Hackathon",
      href: "https://luma.com/n7bxe9m5",
      bold: true,
    },
    { type: "text", text: "." },
  ],
  techStack: [
    { label: "Next.js", iconSrc: "/nextjs.svg" },
    { label: "TypeScript", iconSrc: "/typescript.svg" },
    { label: "OpenAI", iconSrc: "/openai.svg" },
  ],
  demoUrl: "https://bli-iota.vercel.app/",
  githubUrl: "https://github.com/abui-am/bli",
  logo: {
    src: "/content/bli/logo.svg",
    alt: "Bli logo",
  },
  screenshots: [
    { src: "/content/bli/image_1.png", width: 614, height: 379, alt: "Bli app screenshot 1" },
    { src: "/content/bli/image_2.png", width: 614, height: 379, alt: "Bli app screenshot 2" },
    { src: "/content/bli/image_3.png", width: 613, height: 379, alt: "Bli app screenshot 3" },
    { src: "/content/bli/image_5.jpeg", width: 213, height: 379, alt: "Bli app screenshot 5" },
    { src: "/content/bli/image_4.jpeg", width: 505, height: 379, alt: "Bli app screenshot 4" },
  ],
};

export const kochaiProject: SelectedProject = {
  id: "kochai",
  frameLabel: "Selected Project - 2",
  ariaLabel: "Selected Project - KochAI",
  badges: [
    {
      label: "Selected Work #2",
      icon: "selected-work",
      dotColor: "#7C4DFF",
      textColor: "#7C4DFF",
      backgroundColor: "rgba(97,85,245,0.1)",
    },
  ],
  title: "KochAI",
  description:
    "KochAI is my bachelor thesis project — a fitness chatbot built to help users get clear, science-based answers to their health and training questions. It combines Retrieval-Augmented Generation (RAG) with Supervised Fine-Tuning, allowing it to pull insights from real scientific papers while also responding in a natural, easy-to-understand way.",
  techStack: [
    { label: "Next.js", iconSrc: "/nextjs.svg" },
    { label: "Python", iconSrc: "/python.svg" },
    { label: "TypeScript", iconSrc: "/typescript.svg" },
    { label: "OpenAI", iconSrc: "/openai.svg" },
  ],
  demoUrl: "https://kochai.abui-lab.xyz/",
  githubUrl: "https://github.com/abui-am/kochai-fe",
  githubBeUrl: "https://github.com/abui-am/kochai-rag",
  logo: {
    src: "/content/kochai/logo.svg",
    alt: "KochAI logo",
  },
  screenshots: [
    { src: "/content/kochai/image_1.png", width: 614, height: 379, alt: "KochAI screenshot 1" },
    { src: "/content/kochai/image_2.png", width: 614, height: 379, alt: "KochAI screenshot 2" },
    { src: "/content/kochai/image_3.png", width: 614, height: 379, alt: "KochAI screenshot 3" },
    { src: "/content/kochai/image_4.png", width: 614, height: 379, alt: "KochAI screenshot 4" },
    { src: "/content/kochai/image_5.png", width: 614, height: 379, alt: "KochAI screenshot 5" },
    { src: "/content/kochai/image_6.png", width: 614, height: 379, alt: "KochAI screenshot 6" },
    { src: "/content/kochai/image_7.png", width: 614, height: 379, alt: "KochAI screenshot 7" },
  ],
};

export const gitgudProject: SelectedProject = {
  id: "gitgud",
  frameLabel: "Selected Project - 3",
  ariaLabel: "Selected Project - GitGud",
  badges: [
    {
      label: "Selected Work #3",
      icon: "selected-work",
      dotColor: "#7C4DFF",
      textColor: "#7C4DFF",
      backgroundColor: "rgba(97,85,245,0.1)",
    },
  ],
  title: "GitGud",
  description:
    "GitGud is an AI wrapper designed in Go that enhances the Git experience with AI-assisted commit message generation. It seamlessly wraps standard Git commands while introducing intelligent features to streamline your workflow.",
  techStack: [
    { label: "Go", iconSrc: "/go.svg" },
    { label: "OpenAI", iconSrc: "/openai.svg" },
  ],
  githubUrl: "https://github.com/abui-am/gitgud",
  logo: {
    src: "/content/gitgud/logo.png",
    alt: "GitGud logo",
    width: 261,
    height: 99,
  },
  screenshots: [
    {
      src: "/content/gitgud/image_1.png",
      width: 614,
      height: 356,
      alt: "GitGud screenshot 1",
    },
    {
      src: "/content/gitgud/image_2.png",
      width: 614,
      height: 342,
      alt: "GitGud screenshot 2",
    },
    {
      src: "/content/gitgud/image_3.png",
      width: 614,
      height: 356,
      alt: "GitGud screenshot 3",
    },
  ],
};

/** Add new projects here — canvas frames are generated automatically */
export const selectedProjects: SelectedProject[] = [bliProject, kochaiProject, gitgudProject];
