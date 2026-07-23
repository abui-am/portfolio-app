import { CV_PDF_HREF } from "@/content/cv-download";
import { getInTouchLinks } from "@/content/get-in-touch";

export const personSeo = {
  name: "Abuidillah Adjie Muliadi",
  givenName: "Abuidillah Adjie",
  familyName: "Muliadi",
  alternateNames: ["Abui Muliadi", "Abuidillah A. Muliadi"] as const,
  jobTitle: "Software Engineer",
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
  "Abuidillah Adjie Muliadi — software engineer in Bali, Indonesia. React, Next.js, and TypeScript portfolio with projects and experience.";

export const personSeoHomeDescription =
  "Interactive Figma-style portfolio by Abuidillah Adjie Muliadi, a React and Next.js software engineer based in Bali, Indonesia.";

export const personSeoPlayDescription =
  "Selected projects, professional experience, and contact for Abuidillah Adjie Muliadi — React and Next.js software engineer in Bali.";

export const personSeoTitle = `${personSeo.name} | Software Engineer Portfolio`;

export const personSeoKeywords = [
  personSeo.name,
  "Abuidillah Adjie Muliadi software engineer",
  "Abuidillah Adjie Muliadi portfolio",
  "Abui Muliadi",
  "software engineer Bali",
  "software engineer Indonesia",
  "React developer Bali",
  "Next.js developer Indonesia",
  "TypeScript developer",
  "frontend engineer portfolio",
] as const;
