import { personSeo, personSeoDescription } from "@/content/person-seo";
import { absoluteUrl } from "@/lib/seo/site-url";

export function JsonLdPerson() {
  const profileUrl = absoluteUrl("/");
  const portfolioUrl = absoluteUrl("/play");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${profileUrl}#person`,
        name: personSeo.name,
        givenName: personSeo.givenName,
        familyName: personSeo.familyName,
        alternateName: [...personSeo.alternateNames],
        jobTitle: personSeo.jobTitle,
        description: personSeoDescription,
        email: `mailto:${personSeo.email}`,
        image: absoluteUrl(personSeo.profileImagePath),
        url: profileUrl,
        sameAs: personSeo.sameAs,
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Frontend Engineering",
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
        "@id": `${profileUrl}#website`,
        name: personSeo.name,
        description: personSeoDescription,
        url: profileUrl,
        inLanguage: "en",
        author: { "@id": `${profileUrl}#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${portfolioUrl}#profilepage`,
        name: `${personSeo.name} — Portfolio`,
        description: personSeoDescription,
        url: portfolioUrl,
        mainEntity: { "@id": `${profileUrl}#person` },
        isPartOf: { "@id": `${profileUrl}#website` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
