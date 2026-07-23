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
  sameAs: getInTouchLinks
    .filter((link) => link.href.startsWith("http"))
    .map((link) => link.href),
} as const;

export const personSeoDescription =
  "Abuidillah Adjie Muliadi is a software engineer based in Bali, Indonesia, building scalable web products with React, Next.js, and TypeScript. Explore selected projects, professional experience, and ways to contact Abuidillah Adjie Muliadi.";

export const personSeoTitle = `${personSeo.name} | Software Engineer Portfolio`;

export const personSeoKeywords = [
  personSeo.name,
  "Abuidillah Adjie Muliadi software engineer",
  "Abuidillah Adjie Muliadi portfolio",
  "Abui Muliadi",
  "software engineer Bali",
  "React developer Indonesia",
  "Next.js developer",
] as const;
