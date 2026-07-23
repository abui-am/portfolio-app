import Link from "next/link";
import { Edit } from "lucide-react";
import { PortfolioSiteProviders } from "@/components/site/portfolio-site-providers";
import { SiteSection } from "@/components/site/site-section";
import { personSeo } from "@/content/person-seo";
import { getSiteSections } from "@/content/site-sections";

const figmaBlue = "#0d99ff";

export function PortfolioSite() {
  const sections = getSiteSections();

  return (
    <div className="portfolio-site min-h-dvh w-full overflow-x-clip bg-white text-[#333]">
      <header className="sticky top-0 z-20 border-b border-[#e6e6e6] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <h1 className="truncate text-[13px] font-medium text-[#333]">{personSeo.name}</h1>
          <Link
            href="/"
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] font-semibold text-white transition-[transform,background-color] duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: figmaBlue }}
          >
            <Edit className="size-4" aria-hidden />
            Editor View
          </Link>
        </div>
      </header>

      <PortfolioSiteProviders>
        <main className="flex w-full flex-col items-stretch">
          {sections.map((section) => (
            <SiteSection key={section.id} id={section.id} title={section.title ?? undefined}>
              {section.content}
            </SiteSection>
          ))}
        </main>
      </PortfolioSiteProviders>
    </div>
  );
}
