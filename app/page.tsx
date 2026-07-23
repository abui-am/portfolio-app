import type { Metadata } from "next";
import { FigmaApp } from "@/components/figma-shell/figma-app";
import { PersonEntityDocument } from "@/components/seo/person-entity-document";
import { personSeoHomeDescription, personSeoTitle } from "@/content/person-seo";
import { createSiteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createSiteMetadata({
  path: "/",
  title: personSeoTitle,
  description: personSeoHomeDescription,
});

export default function Home() {
  return (
    <>
      <PersonEntityDocument />
      <FigmaApp />
    </>
  );
}
