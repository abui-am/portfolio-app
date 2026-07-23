import type { Metadata } from "next";
import { PersonEntityDocument } from "@/components/seo/person-entity-document";
import { PortfolioSite } from "@/components/site/portfolio-site";
import { personSeoPlayDescription, personSeoPlayTitle } from "@/content/person-seo";
import { createSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createSiteMetadata({
  path: "/play",
  title: personSeoPlayTitle,
  description: personSeoPlayDescription,
});

export default function PlayPage() {
  return (
    <>
      <PersonEntityDocument />
      <PortfolioSite />
    </>
  );
}
