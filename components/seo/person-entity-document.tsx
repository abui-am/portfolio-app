import Link from "next/link";
import { personSeo, personSeoDescription } from "@/content/person-seo";
import { selectedProjects } from "@/content/selected-projects";
import { experienceEntries } from "@/content/experience";
import { getInTouchLinks } from "@/content/get-in-touch";
import { CV_PDF_HREF } from "@/content/cv-download";
import { formatProjectDescription } from "@/lib/seo/format-description";

const coreSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Fullstack Engineering",
  "Web Development",
  "Vue.js",
  "Node.js",
] as const;

function getContactLinkLabel(link: (typeof getInTouchLinks)[number]): string {
  if (link.id === "email") return link.label;
  return `${link.label}: ${link.display}`;
}

/**
 * Server-rendered entity document for LLM crawlers and non-JS clients.
 * Visible content lives in client canvas components; this block is in the initial HTML.
 */
export function PersonEntityDocument() {
  return (
    <article
      id="person-entity"
      className="sr-only"
      aria-label={`${personSeo.name} — entity profile`}
    >
      <header>
        <p>
          <strong>{personSeo.name}</strong> — {personSeo.jobTitle}
        </p>
        <p>
          Also known as {personSeo.alternateNames.join(", ")}. Based in{" "}
          {personSeo.location.area}, {personSeo.location.region}. {personSeoDescription}
        </p>
      </header>

      <section id="entity-skills" aria-labelledby="entity-skills-heading">
        <h2 id="entity-skills-heading">Tech stack — Next.js, TypeScript &amp; fullstack development</h2>
        <ul>
          {coreSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section id="entity-projects" aria-labelledby="entity-projects-heading">
        <h2 id="entity-projects-heading">Selected projects — Next.js &amp; TypeScript development work</h2>
        <ul>
          {selectedProjects.map((project) => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              {project.role ? <p>Role: {project.role}</p> : null}
              <p>{formatProjectDescription(project.description)}</p>
              <p>
                Tech stack: {project.techStack.map((item) => item.label).join(", ")}
              </p>
              <ul>
                {project.demoUrl ? (
                  <li>
                    <a href={project.demoUrl}>Live demo — {project.title}</a>
                  </li>
                ) : null}
                {project.githubUrl ? (
                  <li>
                    <a href={project.githubUrl}>Source code — {project.title}</a>
                  </li>
                ) : null}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="entity-experience" aria-labelledby="entity-experience-heading">
        <h2 id="entity-experience-heading">Fullstack engineer &amp; product engineer experience</h2>
        <ul>
          {experienceEntries.map((entry) => (
            <li key={`${entry.company}-${entry.period}`}>
              <h3>
                {entry.role} at {entry.company}
              </h3>
              <p>
                {entry.period}
                {entry.location ? ` · ${entry.location}` : ""}
                {entry.employment ? ` · ${entry.employment}` : ""}
              </p>
              {entry.description ? <p>{entry.description}</p> : null}
              {entry.highlights.length > 0 ? (
                <ul>
                  {entry.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              <p>Skills: {entry.skills.join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="entity-contact" aria-labelledby="entity-contact-heading">
        <h2 id="entity-contact-heading">Get in touch</h2>
        <nav aria-label="Contact and profiles">
          <ul>
            {getInTouchLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http") ? { rel: "me noopener noreferrer" } : {})}
                >
                  {getContactLinkLabel(link)}
                </a>
              </li>
            ))}
            <li>
              <a href="https://cal.com/abui-muliadi">Book a call: cal.com/abui-muliadi</a>
            </li>
            <li>
              <Link href="/play">Portfolio — projects and experience</Link>
            </li>
            <li>
              <a href={CV_PDF_HREF}>Download CV (PDF)</a>
            </li>
          </ul>
        </nav>
      </section>
    </article>
  );
}
