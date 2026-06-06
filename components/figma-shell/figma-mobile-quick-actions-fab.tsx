"use client";

import { Search } from "lucide-react";

const figmaBlue = "#18a0fb";

interface FigmaMobileQuickActionsFabProps {
  onOpen: () => void;
  hidden?: boolean;
}

export function FigmaMobileQuickActionsFab({ onOpen, hidden = false }: FigmaMobileQuickActionsFabProps) {
  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed right-4 z-40 flex size-[52px] items-center justify-center rounded-full text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-colors outline-none active:bg-[#0d8de8] lg:hidden"
      style={{
        backgroundColor: figmaBlue,
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
      aria-label="Quick actions"
      data-canvas-interactive
    >
      <Search className="size-5" aria-hidden />
    </button>
  );
}
