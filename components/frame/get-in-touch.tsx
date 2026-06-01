"use client";

import { Globe, Mail, MessageCircle } from "lucide-react";
import { Lora, Manrope } from "next/font/google";
import type { SVGProps } from "react";
import { getInTouchLinks } from "@/content/get-in-touch";
import type { GetInTouchLink } from "@/content/get-in-touch";
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

const accent = "#7c4dff";
const accentMuted = "rgba(97, 86, 245, 0.1)";
const headline = "#292423";

const actionLinkClassName =
  "inline-flex h-[41px] items-center justify-center gap-1 rounded-full bg-black px-4 py-2 text-lg leading-[25px] text-white transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-neutral-900 active:scale-[0.98]";

function IconGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function IconLinkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ContactLinkIcon({ id }: { id: string }) {
  const className = "size-5 shrink-0";

  if (id === "github") return <IconGithub className={className} />;
  if (id === "linkedin") return <IconLinkedin className={className} />;
  if (id === "email") return <Mail className={className} aria-hidden />;
  return <Globe className={className} aria-hidden />;
}

function ContactLinkButton({ link }: { link: GetInTouchLink }) {
  const isExternal = link.id !== "email";

  return (
    <FigmaLayer name={link.label} icon="component" className="contents">
      <a
        href={link.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={actionLinkClassName}
        title={link.display}
      >
        <ContactLinkIcon id={link.id} />
        {link.label}
      </a>
    </FigmaLayer>
  );
}

export default function GetInTouch() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();
  const copyCol = isSite ? "w-full min-w-0" : "w-[472px]";

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border ${
        isSite ? "w-full bg-transparent px-0 py-0" : "w-[1440px] bg-[#F8F8F8] px-[128px] py-10"
      }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Get in touch"
    >
      <FigmaLayer name="Get in touch" icon="frame" className="flex w-full flex-col gap-8">
        {!isSite ? (
          <FigmaLayer
            name="Get in touch badge"
            icon="frame"
            data-frame-reveal="badge"
            className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-lg py-2 pr-3 pl-3"
            style={{ backgroundColor: accentMuted }}
          >
            <MessageCircle className="size-3.5 shrink-0" style={{ color: accent }} aria-hidden />
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: accent }}>
              Get in touch
            </span>
          </FigmaLayer>
        ) : null}

        <FigmaLayer
          name="Contact"
          icon="frame"
          className={`flex ${copyCol} flex-col items-start gap-[13px]`}
        >
          <h2
            data-frame-reveal="title"
            className={`${copyCol} text-[40px] leading-[51px]`}
            style={{
              fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
              color: headline,
            }}
          >
            Get in touch with me
          </h2>

          <p
            data-frame-reveal="description"
            className={`${copyCol} text-[15px] leading-relaxed text-black/60`}
          >
            Reach out on GitHub, LinkedIn, or email — I&apos;m happy to chat about work, collaborations, or
            new opportunities.
          </p>

          <FigmaLayer
            name="Actions"
            icon="group"
            data-frame-reveal="actions"
            className="flex flex-row flex-wrap gap-[13px]"
          >
            {getInTouchLinks.map((link) => (
              <ContactLinkButton key={link.id} link={link} />
            ))}
          </FigmaLayer>
        </FigmaLayer>
      </FigmaLayer>
    </section>
  );
}
