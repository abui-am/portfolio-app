import { personSeo, personSeoDescription } from "@/content/person-seo";
import { selectedProjects } from "@/content/selected-projects";
import { experienceEntries } from "@/content/experience";
import { formatProjectDescription } from "@/lib/seo/format-description";
import { absoluteUrl } from "@/lib/seo/site-url";

export function JsonLdPerson() {
  const profileUrl = absoluteUrl("/");
  const portfolioUrl = absoluteUrl("/play");
  const personId = `${profileUrl}#person`;
  const websiteId = `${profileUrl}#website`;
  const homePageId = `${profileUrl}#webpage`;
  const profilePageId = `${portfolioUrl}#profilepage`;

  const projectEntities = selectedProjects.map((project) => ({
    "@type": "CreativeWork" as const,
    "@id": `${portfolioUrl}#project-${project.id}`,
    name: project.title,
    description: formatProjectDescription(project.description),
    author: { "@id": personId },
    url: project.demoUrl ?? project.githubUrl,
    keywords: project.techStack.map((item) => item.label).join(", "),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: personSeo.name,
        givenName: personSeo.givenName,
        familyName: personSeo.familyName,
        alternateName: [...personSeo.alternateNames],
        jobTitle: personSeo.jobTitle,
        description: personSeoDescription,
        image: absoluteUrl(personSeo.profileImagePath),
        url: profileUrl,
        mainEntityOfPage: { "@id": homePageId },
        sameAs: personSeo.sameAs,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "professional inquiries",
          url: portfolioUrl,
        },
        hasOccupation: {
          "@type": "Occupation",
          name: personSeo.jobTitle,
          occupationLocation: {
            "@type": "City",
            name: personSeo.location.area,
            containedInPlace: {
              "@type": "Country",
              name: personSeo.location.region,
            },
          },
          skills: [
            "React",
            "Next.js",
            "TypeScript",
            "Fullstack Engineering",
            "Web Development",
          ],
        },
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Fullstack Engineering",
          "Web Development",
        ],
        homeLocation: {
          "@type": "Place",
          name: `${personSeo.location.area}, ${personSeo.location.region}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: personSeo.location.area,
            addressRegion: personSeo.location.region,
            addressCountry: personSeo.location.country,
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: personSeo.name,
        description: personSeoDescription,
        url: profileUrl,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
      {
        "@type": "WebPage",
        "@id": homePageId,
        name: personSeo.name,
        description: personSeoDescription,
        url: profileUrl,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        name: `${personSeo.name} — Portfolio`,
        description: personSeoDescription,
        url: portfolioUrl,
        mainEntity: { "@id": personId },
        isPartOf: { "@id": websiteId },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${portfolioUrl}#projects`,
        name: "Selected projects",
        itemListElement: selectedProjects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": `${portfolioUrl}#project-${project.id}` },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${portfolioUrl}#experience`,
        name: "Professional experience",
        itemListElement: experienceEntries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${entry.role} at ${entry.company}`,
          description: entry.description ?? entry.highlights[0],
        })),
      },
      ...projectEntities,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
