import { personSeo, personSeoDescription } from "@/content/person-seo";
import { selectedProjects } from "@/content/selected-projects";
import { experienceEntries } from "@/content/experience";
import { formatProjectDescription } from "@/lib/seo/format-description";
import { absoluteUrl } from "@/lib/seo/site-url";

/** Keep `public/llms.txt` in sync when project or experience content changes. */
function buildProjectLines(): string {
  return selectedProjects
    .map((project) => {
      const description = formatProjectDescription(project.description);
      const links = [
        project.demoUrl ? `Demo: ${project.demoUrl}` : null,
        project.githubUrl ? `GitHub: ${project.githubUrl}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      return `- **${project.title}** (${project.role ?? "Engineer"}) — ${description}${links ? `\n  ${links}` : ""}`;
    })
    .join("\n");
}

function buildExperienceLines(): string {
  return experienceEntries
    .map(
      (entry) =>
        `- **${entry.role}** at ${entry.company} (${entry.period}) — ${entry.description ?? entry.highlights[0] ?? ""}`,
    )
    .join("\n");
}

interface BuildLlmsTxtOptions {
  /** Use root-relative paths for internal links (static public file). */
  relativeLinks?: boolean;
}

export function buildLlmsTxtContent(options: BuildLlmsTxtOptions = {}): string {
  const { relativeLinks = false } = options;
  const link = (path: string) => (relativeLinks ? path : absoluteUrl(path));

  const profileLines = personSeo.sameAs.map((url) => `- ${url}`).join("\n");

  return `# ${personSeo.name}

> ${personSeoDescription}

${personSeo.name} (${personSeo.alternateNames.join(", ")}) is a ${personSeo.jobTitle} based in ${personSeo.location.area}, ${personSeo.location.region}. Primary stack: React, Next.js, TypeScript.

## Canonical pages

- [Home — interactive Figma-style portfolio editor](${link("/")})
- [Portfolio — projects, experience, contact](${link("/play")})

## Selected projects

${buildProjectLines()}

## Professional experience

${buildExperienceLines()}

## Profiles & contact

${profileLines}

## Optional

- [Sitemap](${link("/sitemap.xml")})
- [Robots](${link("/robots.txt")})
- [CV (PDF)](${relativeLinks ? personSeo.cvPath : absoluteUrl(personSeo.cvPath)})
`;
}
