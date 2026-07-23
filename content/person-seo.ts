import { CV_PDF_HREF } from "@/content/cv-download";
import { getInTouchLinks } from "@/content/get-in-touch";

export const personSeo = {
  name: "Abuidillah Adjie Muliadi",
  givenName: "Abuidillah Adjie",
  familyName: "Muliadi",
  alternateNames: ["Abui Muliadi", "Abuidillah A. Muliadi"] as const,
  jobTitle: "Frontend Engineer",
  location: {
    area: "Bali",
    region: "Indonesia",
    country: "ID",
  },
  email: "adjiem31@gmail.com",
  profileImagePath: "/profile.png",
  cvPath: CV_PDF_HREF,
  sameAs: [
    ...getInTouchLinks.filter((link) => link.href.startsWith("http")).map((link) => link.href),
    "https://cal.com/abui-muliadi",
  ],
} as const;

export const personSeoDescription =
  "Frontend engineer in Bali specializing in Next.js and TypeScript web development. Selected projects, tech stack, professional work, and get in touch.";

export const personSeoHomeDescription =
  "Next.js and TypeScript frontend development portfolio in Bali. Selected project work, tech stack, and ways to get in touch with Abuidillah Adjie Muliadi.";

export const personSeoPlayDescription =
  "Selected projects and frontend engineer experience — Next.js, TypeScript, and web development work in Bali. Tech stack, professional experience, get in touch.";

export const personSeoTitle = `${personSeo.name} | Frontend Engineer — Next.js & TypeScript`;

export const personSeoPlayTitle = `${personSeo.name} | Selected Projects — Next.js Frontend Engineer`;

export const personSeoKeywords = [
  personSeo.name,
  "Abuidillah Adjie Muliadi software engineer",
  "Abuidillah Adjie Muliadi portfolio",
  "Abui Muliadi",
  "frontend engineer Bali",
  "Next.js TypeScript developer",
  "Next.js frontend engineer",
  "TypeScript web development",
  "selected projects portfolio",
  "tech stack Next.js",
] as const;
