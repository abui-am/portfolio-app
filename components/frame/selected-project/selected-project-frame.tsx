"use client";

import Image from "next/image";
import { Lora, Manrope } from "next/font/google";
import { Globe, Sparkles, Trophy } from "lucide-react";
import type { SVGProps } from "react";
import { ProjectScreenshotCarousel } from "@/components/frame/selected-project/project-screenshot-carousel";
import { ProjectTechStack } from "@/components/frame/selected-project/project-tech-stack";
import {
  getCarouselStripHeight,
  getFrameHeight,
  SELECTED_PROJECT_LAYOUT,
} from "@/components/frame/selected-project/layout";
import type {
  SelectedProjectBadgeIcon,
  SelectedProjectDescriptionPart,
  SelectedProjectFrameProps,
} from "@/components/frame/selected-project/types";
import { useFrameInView } from "@/components/frame/use-frame-in-view";
import { useIsSiteView } from "@/components/site/site-view-context";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-portfolio-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-portfolio-serif",
});

function IconGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function logoLayerName(src: string) {
  return src.split("/").pop() ?? "logo";
}

function isRasterImageSrc(src: string) {
  return /\.(png|jpe?g|webp)$/i.test(src);
}

function ProjectLogo({
  src,
  alt,
  width,
  height,
  className,
  loadMedia,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  loadMedia: boolean;
}) {
  if (!loadMedia && isRasterImageSrc(src)) {
    return <div className={className} aria-hidden style={{ width, height }} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={isRasterImageSrc(src) ? "lazy" : undefined}
      unoptimized
    />
  );
}

function ProjectCarouselPlaceholder({
  screenshots,
  className,
}: {
  screenshots: SelectedProjectFrameProps["project"]["screenshots"];
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ height: getCarouselStripHeight(screenshots) }}
      aria-hidden
    />
  );
}

function ProjectBadgeIcon({ icon, color }: { icon: SelectedProjectBadgeIcon; color: string }) {
  const className = "size-4 shrink-0";

  if (icon === "award-winning") {
    return <Trophy data-frame-dot className={className} style={{ color }} aria-hidden />;
  }

  return <Sparkles data-frame-dot className={className} style={{ color }} aria-hidden />;
}

function truncateLabel(text: string, max = 24) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function ProjectDescription({
  description,
}: {
  description: string | SelectedProjectDescriptionPart[];
}) {
  if (typeof description === "string") {
    return <>{description}</>;
  }

  return (
    <>
      {description.map((part, index) => {
        if (part.type === "text") {
          return (
            <span key={index} className={part.bold ? "font-bold text-black/80" : undefined}>
              {part.text}
            </span>
          );
        }

        return (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline decoration-black/30 underline-offset-2 transition-colors hover:text-black hover:decoration-black/60${part.bold ? " font-bold text-black/80" : ""}`}
          >
            {part.text}
          </a>
        );
      })}
    </>
  );
}

export function SelectedProjectFrame({
  project,
  carouselViewportWidth = 1440,
  children,
}: SelectedProjectFrameProps) {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();
  const logoSize = project.logo.width ?? 261;
  const layout = SELECTED_PROJECT_LAYOUT;
  const frameHeight = getFrameHeight(project.screenshots);
  const copyCol = isSite ? "w-full min-w-0 lg:max-w-[472px]" : "w-[472px]";

  if (isSite) {
    return (
      <section
        ref={ref}
        className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} relative w-full border-t border-black/10 bg-transparent py-10 first:border-t-0 first:pt-0`}
        style={{
          fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
        }}
        aria-label={project.ariaLabel}
      >
        <FigmaLayer name="Hero" icon="frame" className="flex w-full flex-col items-start gap-8">
          <FigmaLayer
            name="Row"
            icon="group"
            className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[124px]"
          >
            <FigmaLayer name="Copy" icon="frame" className={`flex ${copyCol} flex-col items-start gap-[13px]`}>
              {project.badges.length > 0 ? (
                <FigmaLayer name="Badges" icon="group" data-frame-reveal="badge" className="flex flex-row flex-wrap items-start gap-[13px]">
                  {project.badges.map((badge) => (
                    <FigmaLayer
                      key={badge.label}
                      name={badge.label}
                      icon="frame"
                      className="flex h-[38px] items-center justify-center gap-2.5 rounded-lg px-3 py-2"
                      style={{ backgroundColor: badge.backgroundColor }}
                    >
                      {badge.icon ? (
                        <ProjectBadgeIcon icon={badge.icon} color={badge.textColor} />
                      ) : (
                        <span
                          data-frame-dot
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: badge.dotColor }}
                          aria-hidden
                        />
                      )}
                      <span
                        className="text-base leading-[22px] font-bold"
                        style={{ color: badge.textColor }}
                      >
                        {badge.label}
                      </span>
                    </FigmaLayer>
                  ))}
                </FigmaLayer>
              ) : null}

              <FigmaLayer
                name={truncateLabel(project.title)}
                icon="text"
                as="h2"
                data-frame-reveal="title"
                className={`${copyCol} text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] text-[#292524]`}
                style={{
                  fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
                }}
              >
                {project.title}
              </FigmaLayer>

              {project.role ? (
                <FigmaLayer
                  name="Role"
                  icon="text"
                  as="p"
                  data-frame-reveal="role"
                  className={`${copyCol} text-base leading-[22px] text-black/60`}
                >
                  <span className="text-black/80">Role:</span> {project.role}
                </FigmaLayer>
              ) : null}

              <FigmaLayer
                name="Description"
                icon="text"
                as="p"
                data-frame-reveal="description"
                className={`${copyCol} text-base leading-[22px] text-black/60`}
              >
                <ProjectDescription description={project.description} />
              </FigmaLayer>

              <ProjectTechStack items={project.techStack} />

              {project.demoUrl || project.githubUrl || project.githubBeUrl ? (
                <FigmaLayer name="Actions" icon="group" data-frame-reveal="actions" className="flex flex-row flex-wrap items-start gap-[13px]">
                  {project.demoUrl ? (
                    <FigmaLayer name="Demo" icon="component" className="contents">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
                      >
                        <Globe className="size-6 shrink-0" aria-hidden />
                        Demo
                      </a>
                    </FigmaLayer>
                  ) : null}
                  {project.githubUrl ? (
                    <FigmaLayer name="Github" icon="component" className="contents">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
                      >
                        <IconGithub className="size-6 shrink-0" />
                        Github
                      </a>
                    </FigmaLayer>
                  ) : null}
                  {project.githubBeUrl ? (
                    <FigmaLayer name="Github (BE)" icon="component" className="contents">
                      <a
                        href={project.githubBeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
                      >
                        <IconGithub className="size-6 shrink-0" />
                        Github (BE)
                      </a>
                    </FigmaLayer>
                  ) : null}
                </FigmaLayer>
              ) : null}

              {children}
            </FigmaLayer>

            <FigmaLayer
              name={logoLayerName(project.logo.src)}
              icon="image"
              data-frame-reveal="logo"
              className="shrink-0 self-center lg:self-start"
            >
              <div className="frame-float">
                <ProjectLogo
                  src={project.logo.src}
                  alt={project.logo.alt}
                  width={logoSize}
                  height={project.logo.height ?? logoSize}
                  className="size-40 object-contain sm:size-52 lg:size-[261px]"
                  loadMedia={inView}
                />
              </div>
            </FigmaLayer>
          </FigmaLayer>
        </FigmaLayer>

        {inView ? (
          <ProjectScreenshotCarousel screenshots={project.screenshots} ariaLabel={`${project.title} screenshots`} />
        ) : (
          <ProjectCarouselPlaceholder screenshots={project.screenshots} className="mt-8 w-full" />
        )}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} relative w-[1440px] bg-[#F8F8F8]`}
      style={{
        height: frameHeight,
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label={project.ariaLabel}
    >
      <FigmaLayer
        name="Hero"
        icon="frame"
        className="absolute inset-x-0 top-0 flex flex-col items-start gap-2.5 px-[128px] py-10"
        style={{ height: layout.heroHeight }}
      >
        <FigmaLayer
          name="Row"
          icon="group"
          className="flex w-[1184px] flex-row items-start justify-between gap-[124px]"
          style={{ height: layout.rowHeight }}
        >
          <FigmaLayer name="Copy" icon="frame" className="flex w-[472px] flex-col items-start gap-[13px]">
            {project.badges.length > 0 ? (
              <FigmaLayer name="Badges" icon="group" data-frame-reveal="badge" className="flex flex-row flex-wrap items-start gap-[13px]">
                {project.badges.map((badge) => (
                  <FigmaLayer
                    key={badge.label}
                    name={badge.label}
                    icon="frame"
                    className="flex h-[38px] items-center justify-center gap-2.5 rounded-lg px-3 py-2"
                    style={{ backgroundColor: badge.backgroundColor }}
                  >
                    {badge.icon ? (
                      <ProjectBadgeIcon icon={badge.icon} color={badge.textColor} />
                    ) : (
                      <span
                        data-frame-dot
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: badge.dotColor }}
                        aria-hidden
                      />
                    )}
                    <span
                      className="text-base leading-[22px] font-bold"
                      style={{ color: badge.textColor }}
                    >
                      {badge.label}
                    </span>
                  </FigmaLayer>
                ))}
              </FigmaLayer>
            ) : null}

            <FigmaLayer
              name={truncateLabel(project.title)}
              icon="text"
              as="h2"
              data-frame-reveal="title"
              className="w-[472px] text-[40px] leading-[51px] text-[#292524]"
              style={{
                fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
              }}
            >
              {project.title}
            </FigmaLayer>

            {project.role ? (
              <FigmaLayer
                name="Role"
                icon="text"
                as="p"
                data-frame-reveal="role"
                className="w-[472px] text-base leading-[22px] text-black/60"
              >
                <span className="text-black/80">Role:</span> {project.role}
              </FigmaLayer>
            ) : null}

            <FigmaLayer
              name="Description"
              icon="text"
              as="p"
              data-frame-reveal="description"
              className="w-[472px] text-base leading-[22px] text-black/60"
            >
              <ProjectDescription description={project.description} />
            </FigmaLayer>

            <ProjectTechStack items={project.techStack} />

            {project.demoUrl || project.githubUrl || project.githubBeUrl ? (
              <FigmaLayer name="Actions" icon="group" data-frame-reveal="actions" className="flex flex-row items-start gap-[13px]">
                {project.demoUrl ? (
                  <FigmaLayer name="Demo" icon="component" className="contents">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]"
                    >
                      <Globe className="size-6 shrink-0" aria-hidden />
                      Demo
                    </a>
                  </FigmaLayer>
                ) : null}
                {project.githubUrl ? (
                  <FigmaLayer name="Github" icon="component" className="contents">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
                    >
                      <IconGithub className="size-6 shrink-0" />
                      Github
                    </a>
                  </FigmaLayer>
                ) : null}
                {project.githubBeUrl ? (
                  <FigmaLayer name="Github (BE)" icon="component" className="contents">
                    <a
                      href={project.githubBeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[41px] items-center justify-center gap-1 rounded-full border border-black bg-white px-4 py-2 text-lg leading-[25px] text-black transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-50 active:scale-[0.98]"
                    >
                      <IconGithub className="size-6 shrink-0" />
                      Github (BE)
                    </a>
                  </FigmaLayer>
                ) : null}
              </FigmaLayer>
            ) : null}

            {children}
          </FigmaLayer>

          <FigmaLayer
            name={logoLayerName(project.logo.src)}
            icon="image"
            data-frame-reveal="logo"
            className="shrink-0"
          >
            <div className="frame-float">
              <ProjectLogo
                src={project.logo.src}
                alt={project.logo.alt}
                width={logoSize}
                height={project.logo.height ?? logoSize}
                className="size-[261px] object-contain"
                loadMedia={inView}
              />
            </div>
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>

      {inView ? (
        <ProjectScreenshotCarousel
          screenshots={project.screenshots}
          viewportWidth={carouselViewportWidth}
          ariaLabel={`${project.title} screenshots`}
        />
      ) : null}
    </section>
  );
}
