import { FigmaApp } from "@/components/figma-shell/figma-app";
import { PersonSummary } from "@/components/seo/person-summary";

export default function Home() {
  return (
    <>
      <PersonSummary visuallyHidden />
      <FigmaApp />
    </>
  );
}
