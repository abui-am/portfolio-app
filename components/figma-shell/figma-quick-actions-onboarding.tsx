"use client";

import { useEffect, useState } from "react";
import { FileDown, Play, Search, X } from "lucide-react";
import { deferUntilIdle } from "@/lib/defer-until-idle";

const STORAGE_KEY = "portfolio-figma-quick-actions-onboarding-dismissed";
const figmaBlue = "#18a0fb";

interface FigmaQuickActionsOnboardingProps {
  hidden?: boolean;
}

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

function PreviewMock() {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-[#e6e6e6] bg-[#f5f5f5]"
      style={{
        backgroundImage: "radial-gradient(circle, #d9d9d9 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      }}
    >
      <div className="m-3 overflow-hidden rounded-md border border-[#e6e6e6] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#e6e6e6] px-2.5 py-2">
          <Search className="size-3.5 shrink-0 text-[#7a7a7a]" aria-hidden />
          <span className="text-[11px] text-[#b3b3b3]">Type a command or search...</span>
        </div>
        <ul className="py-1">
          <li className="flex items-center gap-2 bg-[#e8f3ff] px-2.5 py-1.5 text-[11px] text-[#18a0fb]">
            <FileDown className="size-3 shrink-0" aria-hidden />
            Download portfolio
          </li>
          <li className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-[#333]">
            <Play className="size-3 shrink-0 text-[#7a7a7a]" aria-hidden />
            Go to play mode
          </li>
        </ul>
      </div>
    </div>
  );
}

export function FigmaQuickActionsOnboarding({ hidden = false }: FigmaQuickActionsOnboardingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [modKey, setModKey] = useState("Ctrl");

  useEffect(() => {
    setModKey(/Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘" : "Ctrl");
    if (readDismissed()) return;

    function scheduleShow() {
      return deferUntilIdle(() => {
        if (!readDismissed()) setIsVisible(true);
      }, 6000);
    }

    let cleanup: (() => void) | undefined;

    if (document.readyState === "complete") {
      cleanup = scheduleShow();
      return () => cleanup?.();
    }

    function onLoad() {
      cleanup = scheduleShow();
    }

    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, []);

  function dismiss() {
    persistDismissed();
    setIsVisible(false);
  }

  if (hidden || !isVisible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 flex justify-end sm:inset-x-auto sm:right-5 sm:bottom-[calc(6rem+env(safe-area-inset-bottom))]"
      data-canvas-interactive
    >
      <div
        role="dialog"
        aria-labelledby="quick-actions-onboarding-title"
        aria-describedby="quick-actions-onboarding-desc"
        className="pointer-events-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-start justify-between gap-2 border-b border-[#e6e6e6] px-3 py-2.5">
          <h2 id="quick-actions-onboarding-title" className="text-[13px] font-semibold text-[#333]">
            Quick actions, anywhere
          </h2>
          <button
            type="button"
            onClick={dismiss}
            className="flex size-11 shrink-0 items-center justify-center rounded text-[#7a7a7a] transition-colors hover:bg-[#f5f5f5] hover:text-[#333]"
            aria-label="Dismiss quick actions tip"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="px-3 pt-3">
          <PreviewMock />
        </div>

        <div className="flex items-end justify-between gap-3 px-3 py-3">
          <p id="quick-actions-onboarding-desc" className="max-w-[200px] text-[13px] leading-snug text-[#333]">
            Press{" "}
            <kbd className="rounded border border-[#e6e6e6] bg-[#fafafa] px-1 py-px font-sans text-[10px] text-[#333]">
              {modKey}+K
            </kbd>{" "}
            to download my CV, open my portfolio, play mode, or get in touch.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-11 shrink-0 items-center rounded-md px-4 text-[15px] font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: figmaBlue }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
