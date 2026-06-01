import type { ReactNode } from "react";

interface SiteSectionProps {
  id: string;
  title?: string;
  children: ReactNode;
}

export function SiteSection({ id, title, children }: SiteSectionProps) {
  const hasTitle = Boolean(title);

  return (
    <section
      id={id}
      aria-label={hasTitle ? undefined : id}
      aria-labelledby={hasTitle ? `${id}-heading` : undefined}
      className="w-full scroll-mt-14 border-b border-[#e6e6e6] bg-white py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {hasTitle ? (
          <header className="mb-8 border-b border-[#e6e6e6] pb-4 md:mb-10">
            <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight text-[#292423] md:text-3xl">
              {title}
            </h2>
          </header>
        ) : null}
        <div className="site-section-content w-full min-w-0 max-w-full overflow-x-clip">{children}</div>
      </div>
    </section>
  );
}
