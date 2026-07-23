import type { Metadata } from "next";
import {
  personSeo,
  personSeoDescription,
  personSeoKeywords,
  personSeoTitle,
} from "@/content/person-seo";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site-url";

interface CreateSiteMetadataOptions {
  /** Path relative to site root, e.g. `/play`. Defaults to `/`. */
  path?: string;
  /** Override the default title when a page needs a distinct SERP label. */
  title?: string;
  /** Override the default description when a page needs distinct copy. */
  description?: string;
}

export function createSiteMetadata(options: CreateSiteMetadataOptions = {}): Metadata {
  const path = options.path ?? "/";
  const description = options.description ?? personSeoDescription;
  const canonical = absoluteUrl(path);
  const profileImage = absoluteUrl(personSeo.profileImagePath);
  const resolvedTitle =
    options.title !== undefined
      ? { absolute: options.title }
      : {
          default: personSeoTitle,
          template: `%s | ${personSeo.name}`,
        };

  return {
    metadataBase: new URL(getSiteUrl()),
    title: resolvedTitle,
    description,
    applicationName: personSeo.name,
    authors: [{ name: personSeo.name, url: canonical }],
    creator: personSeo.name,
    publisher: personSeo.name,
    keywords: [...personSeoKeywords],
    category: "technology",
    alternates: {
      canonical,
      types: {
        "text/plain": "/llms.txt",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: canonical,
      siteName: personSeo.name,
      title: options.title ?? personSeoTitle,
      description,
      images: [
        {
          url: profileImage,
          width: 1024,
          height: 1024,
          alt: `${personSeo.name} — ${personSeo.jobTitle}`,
        },
      ],
      firstName: personSeo.givenName,
      lastName: personSeo.familyName,
      username: "abui-am",
    },
    twitter: {
      card: "summary_large_image",
      title: options.title ?? personSeoTitle,
      description,
      images: [profileImage],
    },
  };
}
