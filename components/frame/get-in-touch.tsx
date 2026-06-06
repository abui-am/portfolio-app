"use client";

import { MessageCircle } from "lucide-react";
import { Lora, Manrope } from "next/font/google";
import { GetInTouchContactGrid } from "@/components/frame/get-in-touch-contact-grid";
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

export default function GetInTouch() {
  const { ref, inView } = useFrameInView(0.15);
  const isSite = useIsSiteView();

  return (
    <section
      ref={ref}
      className={`frame-animated ${inView ? "frame-in-view" : ""} ${manrope.variable} ${lora.variable} box-border flex min-h-0 ${isSite
        ? "w-full flex-col gap-8 bg-transparent px-0 py-0 lg:min-h-[480px] lg:flex-row lg:items-center lg:justify-center lg:gap-x-[124px]"
        : "min-h-[480px] w-[1440px] flex-row items-center justify-center gap-x-[124px] bg-[#F8F8F8] px-[128px] py-10"
        }`}
      style={{
        fontFamily: "var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif",
      }}
      aria-label="Get in touch"
    >
      <FigmaLayer
        name="Hero"
        icon="frame"
        className={
          isSite
            ? "flex w-full min-w-0 flex-1 flex-col gap-[13px] lg:max-w-[472px]"
            : "flex w-[472px] shrink-0 flex-col gap-[13px]"
        }
      >
        <FigmaLayer
          name="Get in touch"
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

        <FigmaLayer
          name="Get in touch with me"
          icon="text"
          as="h2"
          data-frame-reveal="title"
          className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.12] tracking-tight"
          style={{
            color: headline,
            fontFamily: "var(--font-portfolio-serif), ui-serif, Georgia, serif",
          }}
        >
          Get in touch with me
        </FigmaLayer>

        <FigmaLayer
          name="Reach out..."
          icon="text"
          as="p"
          data-frame-reveal="description"
          className="max-w-[472px] text-[15px] leading-relaxed text-black/60"
        >
          I&apos;m happy to chat about work, collaborations, or new opportunities — pick a channel or book a quick
          intro call.
        </FigmaLayer>
      </FigmaLayer>

      <FigmaLayer
        name="Content"
        icon="frame"
        className={
          isSite
            ? "flex w-full min-w-0 flex-1 flex-col justify-center lg:max-w-[537px]"
            : "flex w-[537px] shrink-0 flex-col justify-center"
        }
      >
        <GetInTouchContactGrid />
      </FigmaLayer>
    </section>
  );
}
