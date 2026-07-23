import { personSeo } from "@/content/person-seo";

const accent = "#7c4dff";
const headline = "#292423";

/**
 * Server-rendered mobile hero so LCP is paintable before the client Figma shell hydrates.
 * Removed on mount by FigmaAppShellContent.
 */
export function MobileLcpFallback() {
  return (
    <div
      id="mobile-lcp-fallback"
      className="pointer-events-none fixed inset-0 z-20 flex flex-col bg-[#f5f5f5] pt-[calc(52px+env(safe-area-inset-top))] lg:hidden"
      aria-hidden="true"
    >
      <div className="flex flex-1 items-start justify-center px-6 pt-8">
        <div className="w-full max-w-[472px]">
          <p
            className="text-[11px] font-bold tracking-wide uppercase"
            style={{ color: accent }}
          >
            Available for work
          </p>
          <h1
            className="mt-3 text-[clamp(2rem,8vw,3.25rem)] leading-[1.12] tracking-tight"
            style={{
              color: headline,
              fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
            }}
          >
            Hi, It&apos;s Me. {personSeo.name}
          </h1>
          <p className="mt-3 max-w-[472px] text-[15px] leading-relaxed text-black/60">
            <b>Experienced Software Engineer</b> based in{" "}
            <b>
              {personSeo.location.area}, {personSeo.location.region}
            </b>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
