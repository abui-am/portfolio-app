import Link from "next/link";
import { personSeo, personSeoDescription } from "@/content/person-seo";
import { getInTouchLinks } from "@/content/get-in-touch";
import { CV_PDF_HREF } from "@/content/cv-download";

interface PersonSummaryProps {
  /** Render off-screen for crawlers on pages that already expose a visible heading. */
  visuallyHidden?: boolean;
}

export function PersonSummary({ visuallyHidden = false }: PersonSummaryProps) {
  const className = visuallyHidden
    ? "sr-only"
    : "mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6";

  return (
    <section
      className={className}
      aria-label={`About ${personSeo.name}`}
      id="about-abuidillah-adjie-muliadi"
    >
      <h1>{personSeo.name}</h1>
      <p>
        <strong>{personSeo.jobTitle}</strong> based in {personSeo.location.area},{" "}
        {personSeo.location.region}. {personSeoDescription}
      </p>
      <nav aria-label="Contact and profiles">
        <ul>
          {getInTouchLinks.map((link) => (
            <li key={link.id}>
              <a href={link.href}>{link.label}: {link.display}</a>
            </li>
          ))}
          <li>
            <Link href="/play">View portfolio and selected projects</Link>
          </li>
          <li>
            <a href={CV_PDF_HREF}>Download {personSeo.name} CV (PDF)</a>
          </li>
        </ul>
      </nav>
    </section>
  );
}
