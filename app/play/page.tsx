import type { Metadata } from "next";
import { PortfolioSite } from "@/components/site/portfolio-site";
import { personSeo, personSeoDescription } from "@/content/person-seo";
import { createSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createSiteMetadata({
  path: "/play",
  title: `${personSeo.name} | Portfolio, Projects & Experience`,
  description: personSeoDescription,
});

export default function PlayPage() {
  return <PortfolioSite />;
}
