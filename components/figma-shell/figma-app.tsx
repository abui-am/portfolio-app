import type { ReactNode, SVGProps } from "react";
import { PannableCanvasViewport } from "@/components/figma-shell/pannable-canvas-viewport";
import Portfolio from "../frame/portfolio";
import SelectedProjectBli from "../frame/selected-project-bli";

const TOP_BAR_PX = 40;

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconFigmaMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 57" fill="none" aria-hidden {...props}>
      <path fill="#1abcfe" d="M19 28.5h9.5a9.5 9.5 0 1 0 0-19H19v19Z" />
      <path fill="#0acf83" d="M9.5 47a9.5 9.5 0 0 0 9.5-9.5v-9H9.5A9.5 9.5 0 0 0 0 37.5 9.5 9.5 0 0 0 9.5 47Z" />
      <path fill="#ff7262" d="M19 47h9.5a9.5 9.5 0 0 0 0-19H19v19Z" />
      <path fill="#f24e1e" d="M0 18.5A9.5 9.5 0 0 0 9.5 28H19V9H9.5A9.5 9.5 0 0 0 0 18.5Z" />
      <path fill="#a259ff" d="M0 37.5A9.5 9.5 0 0 0 9.5 47H19V28H9.5A9.5 9.5 0 0 0 0 37.5Z" />
      <path fill="#1abcfe" d="M19 9h9.5a9.5 9.5 0 1 0-19 0v9H19V9Z" />
    </svg>
  );
}

function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconPlayOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M10 8.5v7l6-3.5-6-3.5z" strokeLinejoin="round" />
    </svg>
  );
}

function IconEye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconMinus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

function IconSliders(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h4M9 8h4M17 16h4" />
    </svg>
  );
}

function IconImage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function IconLayersMulti(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="m12.83 5.18 2.58 1.49a1 1 0 0 1 0 1.74L12 9.5l-3.41-2.09a1 1 0 0 1 0-1.74l2.58-1.49a2 2 0 0 1 2 0Z" />
      <path d="M18 12.13v1.73a1 1 0 0 1-.5.87l-4.9 2.83a2 2 0 0 1-2 0l-4.9-2.83a1 1 0 0 1-.5-.87v-1.73" />
      <path d="M18 16.6v1.74a1 1 0 0 1-.5.86l-4.9 2.83a2 2 0 0 1-2 0l-4.9-2.83a1 1 0 0 1-.5-.86V16.6" />
    </svg>
  );
}

const border = "border-[#e6e6e6]";
const figmaBlue = "#18a0fb";

function TopBar() {
  return (
    <header
      className={`flex shrink-0 items-center gap-0.5 border-b ${border} bg-white px-1`}
      style={{ height: TOP_BAR_PX }}
    >
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5]"
        aria-label="Home"
      >
        <IconHome className="size-[18px]" />
      </button>
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded text-[#b3b3b3] hover:bg-[#f5f5f5]"
        aria-label="Back"
      >
        <IconChevronLeft className="size-[18px]" />
      </button>
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded text-[#b3b3b3] hover:bg-[#f5f5f5]"
        aria-label="Forward"
      >
        <IconChevronRight className="size-[18px]" />
      </button>

      <div className="mx-0.5 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        <div className="flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-white pl-2 pr-1 shadow-[inset_0_0_0_1px_#e6e6e6]">
          <IconFigmaMark className="size-3.5 shrink-0" />
          <span className="max-w-[140px] truncate text-[13px] font-medium text-[#333]">Untitled</span>
          <button type="button" className="rounded p-0.5 text-[#b3b3b3] hover:bg-[#f5f5f5]" aria-label="Close tab">
            <IconClose className="size-3.5" />
          </button>
        </div>
        <div className="flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[13px] text-[#b3b3b3] shadow-[inset_0_0_0_1px_#e6e6e6]">
          <IconFigmaMark className="size-3.5 shrink-0 opacity-60" />
          <span className="max-w-[120px] truncate">Untitled</span>
        </div>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f5f5f5]"
          aria-label="New tab"
        >
          <IconPlus className="size-4" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 pr-1">
        <div
          className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-[#ff8577] to-[#ff4d6d] text-[10px] font-bold text-white"
          aria-hidden
        >
          A
        </div>
        <button type="button" className="flex size-8 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5]" aria-label="Preview">
          <IconPlayOutline className="size-[18px]" />
        </button>
        <button
          type="button"
          className="h-7 shrink-0 rounded-md px-3 text-[12px] font-semibold text-white"
          style={{ backgroundColor: figmaBlue }}
        >
          Share
        </button>
        <button
          type="button"
          className="ml-1 flex h-7 shrink-0 items-center gap-1 rounded border border-[#e6e6e6] bg-white px-2 text-[12px] tabular-nums text-[#333] hover:bg-[#fafafa]"
        >
          <span>37%</span>
          <IconChevronDown className="size-3 text-[#7a7a7a]" />
        </button>
      </div>
    </header>
  );
}

function LayerRow({
  depth,
  icon,
  label,
  active,
}: {
  depth: number;
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  const pad = 8 + depth * 12;
  return (
    <div
      className={`flex items-center gap-1 rounded py-0.5 pl-1 pr-1.5 text-[12px] leading-[18px] ${
        active ? "bg-[#e8f3ff] font-medium text-[#18a0fb]" : "text-[#333]"
      }`}
      style={{ paddingLeft: pad }}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-[#7a7a7a]">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}

function LeftPanel() {
  return (
    <aside className={`flex w-[240px] shrink-0 flex-col border-r ${border} bg-white`}>
      <div className={`flex items-center gap-2 border-b ${border} px-3 py-2`}>
        <IconFigmaMark className="size-[22px] shrink-0" />
        <div className="min-w-0 flex-1">
          <button type="button" className="flex w-full items-center gap-0.5 text-left">
            <span className="truncate text-[13px] font-semibold text-[#333]">Untitled</span>
            <IconChevronDown className="size-3.5 shrink-0 text-[#7a7a7a]" />
          </button>
          <p className="truncate text-[11px] leading-4 text-[#7a7a7a]">Drafts · Free</p>
        </div>
      </div>
      <div className={`flex items-center justify-between border-b ${border} px-3 py-2`}>
        <div className="flex gap-4 text-[12px] font-medium">
          <span className="text-[#333]">File</span>
          <span className="text-[#b3b3b3]">Assets</span>
        </div>
        <button type="button" className="rounded p-1 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Search">
          <IconSearch className="size-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        <div className={`border-b ${border} px-3 py-2`}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Pages</span>
            <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Add page">
              <IconPlus className="size-3.5" />
            </button>
          </div>
          <div className="rounded bg-[#f0f0f0] px-2 py-1.5 text-[12px] font-medium text-[#333]">Page 1</div>
        </div>
        <div className="px-2 py-2">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Layers</span>
            <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Layer actions">
              <IconLayersMulti className="size-3.5" />
            </button>
          </div>
          <div className="space-y-px">
            <LayerRow depth={0} icon={<IconImage className="size-3.5" />} label="Image" />
            <LayerRow depth={0} icon={<span className="text-[11px] font-semibold">#</span>} label="Desktop - 1" active />
            <LayerRow depth={0} icon={<span className="text-[11px] font-semibold">#</span>} label="Selected Project - 1" />
            <LayerRow depth={1} icon={<span className="text-[11px] font-semibold">#</span>} label="Hero" />
            <LayerRow depth={1} icon={<span className="text-[11px] font-semibold">#</span>} label="Section" />
            <LayerRow depth={2} icon={<span className="text-[12px] font-bold">T</span>} label="Heading" />
            <LayerRow depth={2} icon={<span className="text-[10px]">□</span>} label="Placeholder" />
            <LayerRow depth={1} icon={<span className="text-[10px]">□</span>} label="Rectangle" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function RightPanel() {
  return (
    <aside className={`flex w-[240px] shrink-0 flex-col border-l ${border} bg-white`}>
      <div className={`flex border-b ${border} px-2`}>
        <button
          type="button"
          className="border-b-2 px-3 py-2.5 text-[12px] font-semibold text-[#333]"
          style={{ borderColor: figmaBlue }}
        >
          Design
        </button>
        <button type="button" className="px-3 py-2.5 text-[12px] font-medium text-[#b3b3b3] hover:text-[#7a7a7a]">
          Prototype
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-width:thin]">
        <div className="mb-3">
          <div className="mb-1.5 text-[11px] font-semibold text-[#7a7a7a]">Page</div>
          <div className={`flex items-center gap-1.5 rounded-md border ${border} bg-[#fafafa] px-2 py-1.5`}>
            <span className="size-5 shrink-0 rounded border border-[#e6e6e6] bg-[#f5f5f5]" aria-hidden />
            <span className="min-w-0 flex-1 font-mono text-[11px] text-[#333]">#F5F5F5</span>
            <span className="shrink-0 text-[11px] text-[#7a7a7a]">100%</span>
            <button type="button" className="shrink-0 text-[#b3b3b3] hover:text-[#333]" aria-label="Remove">
              <IconMinus className="size-4" />
            </button>
            <button type="button" className="shrink-0 text-[#b3b3b3] hover:text-[#333]" aria-label="Visibility">
              <IconEye className="size-4" />
            </button>
          </div>
        </div>
        <div className={`mb-1 flex items-center justify-between border-t border-[#f0f0f0] pt-2`}>
          <span className="text-[12px] font-medium text-[#333]">Variables</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Variables settings">
            <IconSliders className="size-3.5" />
          </button>
        </div>
        {["Styles", "Export"].map((label) => (
          <div key={label} className="flex items-center justify-between py-2">
            <span className="text-[12px] font-medium text-[#333]">{label}</span>
            <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label={`Add ${label}`}>
              <IconPlus className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CanvasFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative shrink-0 w-[1440px]">
      <div className="absolute -top-5 left-0 text-[11px] font-medium text-[#18a0fb]">{label}</div>
      <div className="relative overflow-hidden rounded-sm border border-[#c7c7c7] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <div className="pointer-events-none absolute inset-0 z-10 rounded-sm ring-1 ring-[#18a0fb]/45" aria-hidden />
        <div className="relative z-0 [&_a]:cursor-pointer [&_button]:cursor-pointer">{children}</div>
      </div>
    </div>
  );
}

function DummyCanvasFrame() {
  return (
    <PannableCanvasViewport>
      <div className="flex shrink-0 flex-col gap-12">
        <CanvasFrame label="Desktop - 1">
          <Portfolio />
        </CanvasFrame>
        <CanvasFrame label="Selected Project - 1">
          <SelectedProjectBli />
        </CanvasFrame>
      </div>
    </PannableCanvasViewport>
  );
}

export function FigmaApp() {
  return (
    <div className="flex h-screen min-h-0 min-w-[1024px] flex-col bg-white text-[#333]">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <LeftPanel />
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f5f5]">
          <DummyCanvasFrame />
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
