import type { SelectedProject } from "@/components/frame/selected-project";

export const bliProject: SelectedProject = {
  id: "bli",
  frameLabel: "Selected Project - 1",
  ariaLabel: "Selected Project - Bli",
  badges: [
    {
      label: "Selected Work #1",
      dotColor: "#7C4DFF",
      textColor: "#7C4DFF",
      backgroundColor: "rgba(97,85,245,0.1)",
    },
    {
      label: "Award Winning",
      dotColor: "#FF6900",
      textColor: "#FF6900",
      backgroundColor: "#FFEDD4",
    },
  ],
  title: "Bli, Your Bali Local Friend",
  description: [
    {
      type: "text",
      text: "Bli is an AI-powered local assistant designed to help residents and travelers discover real-time events, attractions, and activities across Bali. Coded in just 3 hours, Bli successfully win ",
    },
    {
      type: "link",
      text: "Build with AI: TRAE Friends@Bali Hackathon",
      href: "https://luma.com/n7bxe9m5",
    },
    { type: "text", text: "." },
  ],
  techStack: "Tech Stack: Nextjs, Typescript, OpenAI",
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

/** Add new projects here — canvas frames are generated automatically */
export const selectedProjects: SelectedProject[] = [bliProject];
