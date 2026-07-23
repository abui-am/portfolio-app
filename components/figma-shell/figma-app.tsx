"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers2,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Search,
  SlidersVertical,
  X,
} from "lucide-react";
import { PannableCanvasViewport } from "@/components/figma-shell/pannable-canvas-viewport";
import { FigmaCanvasProvider, useCanvasScale, useFigmaCanvas, useSelectedLayerId } from "@/components/figma-shell/figma-canvas-context";
import { FigmaLeftPanelLayers } from "@/components/figma-shell/figma-left-panel-layers";
import { FigmaFrameRoot } from "@/components/figma-shell/figma-layer";
import { FigmaLayersProvider } from "@/components/figma-shell/figma-layers-context";
import {
  canvasPages,
  getCanvasPage,
  getFramesForPage,
  getPrimaryFramesForPage,
  getProjectFramesForPage,
  PORTFOLIO_PAGE_ID,
} from "@/content/canvas-pages";
import { FigmaCommandPalette, useFigmaCommandPaletteShortcut } from "@/components/figma-shell/figma-command-palette";
import { FigmaMobileQuickActionsFab } from "@/components/figma-shell/figma-mobile-quick-actions-fab";
import { CommentModeProvider, useCommentMode } from "@/components/comments/comment-mode-context";
import { CommentSidebar } from "@/components/comments/comment-sidebar";
import { CommentToolbar } from "@/components/comments/comment-toolbar";
import { FigmaQuickActionsOnboarding } from "@/components/figma-shell/figma-quick-actions-onboarding";
import { MOBILE_MEDIA_QUERY } from "@/components/figma-shell/use-is-mobile";

/** Mobile top bar content height + safe-area for 44pt touch targets; desktop stays 40px via `lg:h-10`. */
const TOP_BAR_MOBILE_PX = 52;

function FigmaMark({ className }: { className?: string }) {
  return <img src="/figma-mark.ico" alt="Figma" className={className} />;
}

const border = "border-[#e6e6e6]";
const figmaBlue = "#18a0fb";

function ZoomControls({ compact = false, floating = false }: { compact?: boolean; floating?: boolean }) {
  const scale = useCanvasScale();
  const { zoomIn, zoomOut } = useFigmaCanvas();
  const zoomLabel = `${Math.round(scale * 100)}%`;

  if (compact) {
    return (
      <div
        className={
          floating
            ? "flex items-center gap-1 rounded-full border border-[#e6e6e6] bg-white/95 px-2 py-1 shadow-lg backdrop-blur-sm"
            : "flex h-11 shrink-0 items-center gap-1 rounded border border-[#e6e6e6] bg-white px-1 lg:h-7 lg:gap-0.5 lg:px-0.5"
        }
      >
        <button
          type="button"
          onClick={zoomOut}
          className={`flex items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] ${floating ? "size-11 rounded-full lg:size-7" : "size-11 lg:size-6"}`}
          aria-label="Zoom out"
        >
          <Minus className="size-4 lg:size-3.5" aria-hidden />
        </button>
        <span
          className={`shrink-0 text-center tabular-nums text-[#333] ${floating ? "min-w-12 text-[13px] lg:text-[12px]" : "min-w-11 text-[13px] lg:min-w-9 lg:text-[11px]"}`}
        >
          {zoomLabel}
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className={`flex items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] ${floating ? "size-11 rounded-full lg:size-7" : "size-11 lg:size-6"}`}
          aria-label="Zoom in"
        >
          <Plus className="size-4 lg:size-3.5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="ml-1 flex h-7 shrink-0 items-center gap-1 rounded border border-[#e6e6e6] bg-white px-2 text-[12px] tabular-nums text-[#333] hover:bg-[#fafafa]"
      aria-label={`Zoom ${zoomLabel}. Ctrl+plus to zoom in, Ctrl+minus to zoom out.`}
    >
      <span>{zoomLabel}</span>
      <ChevronDown className="size-3 text-[#7a7a7a]" aria-hidden />
    </button>
  );
}

function TopBar({
  onTogglePresentation,
  isChromeHidden,
  onToggleChrome,
  onToggleMobileLayers,
  isMobileLayersOpen,
}: {
  onTogglePresentation: () => void;
  isChromeHidden: boolean;
  onToggleChrome: () => void;
  onToggleMobileLayers: () => void;
  isMobileLayersOpen: boolean;
}) {
  return (
    <header
      className={`relative z-[60] flex h-[calc(${TOP_BAR_MOBILE_PX}px+env(safe-area-inset-top))] shrink-0 items-center gap-1 border-b ${border} bg-white px-2 min-w-0 overflow-hidden pt-[env(safe-area-inset-top)] lg:z-auto lg:h-10 lg:min-h-10 lg:gap-0.5 lg:px-1 lg:pt-0`}
    >
      <div className="flex shrink-0 items-center py-2">

        <button
          type="button"
          onClick={onToggleMobileLayers}
          className="flex size-11 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] lg:hidden"
          aria-label={isMobileLayersOpen ? "Close layers panel" : "Open layers panel"}
          aria-expanded={isMobileLayersOpen}
        >
          <Layers2 className="size-5" aria-hidden />
        </button>
        {isChromeHidden ? (
          <button
            type="button"
            onClick={onToggleChrome}
            className="hidden size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] lg:flex"
            aria-label="Show UI"
            title="Show UI (Ctrl+\)"
          >
            <PanelLeftOpen className="size-[18px]" strokeWidth={2} aria-hidden />
          </button>
        ) : (
          <>
            <button
              type="button"
              className="hidden size-8 shrink-0 items-center justify-center rounded text-[#b3b3b3] hover:bg-[#f5f5f5] lg:flex"
              aria-label="Back"
            >
              <ChevronLeft className="size-[18px]" aria-hidden />
            </button>
            <button
              type="button"
              className="hidden size-8 shrink-0 items-center justify-center rounded text-[#b3b3b3] hover:bg-[#f5f5f5] lg:flex"
              aria-label="Forward"
            >
              <ChevronRight className="size-[18px]" aria-hidden />
            </button>
          </>
        )}
      </div>
      <div className="lg:hidden flex w-full"></div>

      <div className="hidden mx-0.5  min-w-0 flex-1 items-center overflow-hidden lg:mx-0.5 lg:flex">
        <div className="flex h-10 min-w-0 max-w-full items-center gap-1.5 rounded-md bg-white pl-2.5 pr-1 shadow-[inset_0_0_0_1px_#e6e6e6] max-lg:max-w-[9rem] lg:h-7 lg:gap-1 lg:pl-2 lg:max-w-full">
          <FigmaMark className="size-4 shrink-0 lg:size-3.5" />
          <span className="hidden min-w-0 truncate text-[13px] font-medium text-[#333] lg:inline">Portfolio</span>
          <button type="button" className="hidden size-9 shrink-0 items-center justify-center rounded text-[#b3b3b3] hover:bg-[#f5f5f5] lg:flex lg:size-auto lg:p-0.5" aria-label="Close tab">
            <X className="size-4 lg:size-3.5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pr-0.5 lg:gap-1 lg:pr-1">
        <div
          className="hidden size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ff8577] to-[#ff4d6d] text-[10px] font-bold text-white sm:flex"
          aria-hidden
        >
          A
        </div>
        <button
          type="button"
          onClick={onTogglePresentation}
          className="hidden h-7 shrink-0 items-center justify-center rounded-md border border-[#e6e6e6] bg-white px-2.5 text-[11px] font-medium text-[#333] hover:bg-[#f5f5f5] sm:px-3 sm:text-[12px] md:flex"
          aria-label="Enter fullscreen"
        >
          Fullscreen
        </button>
        <Link
          href="/play"
          className="inline-flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-md text-[13px] font-semibold text-white transition-[transform,background-color] duration-200 hover:scale-[1.02] active:scale-[0.98] lg:h-7 lg:w-auto lg:px-3 lg:text-[12px]"
          style={{ backgroundColor: figmaBlue }}
          aria-label="Open portfolio in play mode"
        >
          <Play className="size-5 shrink-0 lg:size-4" aria-hidden />
          <span className="hidden lg:inline">Play</span>
        </Link>
        <div className="hidden lg:block">
          <ZoomControls />
        </div>
        <div className="lg:hidden">
          <ZoomControls compact />
        </div>
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
      className={`flex items-center gap-1 rounded py-0.5 pl-1 pr-1.5 text-[12px] leading-[18px] ${active ? "bg-[#e8f3ff] font-medium text-[#18a0fb]" : "text-[#333]"
        }`}
      style={{ paddingLeft: pad }}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-[#7a7a7a]">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}

function LeftPanel({
  activePageId,
  onSelectPage,
  onToggleChrome,
  onCloseMobile,
}: {
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onToggleChrome: () => void;
  onCloseMobile?: () => void;
}) {
  const [layerSearchQuery, setLayerSearchQuery] = useState("");
  const [isLayerSearchOpen, setIsLayerSearchOpen] = useState(false);
  const layerSearchInputRef = useRef<HTMLInputElement>(null);
  const showLayerSearch = isLayerSearchOpen || layerSearchQuery.length > 0;

  const openLayerSearch = useCallback(() => {
    setIsLayerSearchOpen(true);
    requestAnimationFrame(() => layerSearchInputRef.current?.focus());
  }, []);

  const closeLayerSearch = useCallback(() => {
    setIsLayerSearchOpen(false);
    setLayerSearchQuery("");
  }, []);

  useEffect(() => {
    closeLayerSearch();
  }, [activePageId, closeLayerSearch]);

  useEffect(() => {
    if (!isLayerSearchOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeLayerSearch();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLayerSearch, isLayerSearchOpen]);

  useEffect(() => {
    if (!showLayerSearch) return;
    requestAnimationFrame(() => layerSearchInputRef.current?.focus());
  }, [showLayerSearch]);
  return (
    <aside
      className={`flex h-full min-h-0 w-[240px] shrink-0 flex-col border-r ${border} bg-white max-lg:pt-[calc(${TOP_BAR_MOBILE_PX}px+env(safe-area-inset-top))] max-lg:shadow-xl`}
    >
      <div className={`flex items-center gap-2 border-b ${border} px-3 py-2`}>
        <FigmaMark className="size-[22px] shrink-0" />
        <div className="min-w-0 flex-1">
          <button type="button" className="flex w-full items-center gap-0.5 text-left">
            <span className="truncate text-[13px] font-semibold text-[#333]">Abuidillah Adjie Muliadi</span>
            <ChevronDown className="size-3.5 shrink-0 text-[#7a7a7a]" aria-hidden />
          </button>
          <p className="truncate text-[11px] leading-4 text-[#7a7a7a]">Made with love</p>
        </div>
        <button
          type="button"
          onClick={onToggleChrome}
          className="hidden size-7 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f5f5f5] hover:text-[#333] lg:flex"
          aria-label="Hide UI"
          title="Hide UI (Ctrl+\)"
        >
          <PanelLeftClose className="size-4" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="flex size-11 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f5f5f5] hover:text-[#333] lg:hidden"
          aria-label="Close layers panel"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className={`flex items-center justify-between border-b ${border} px-3 py-2`}>
        <div className="flex gap-4 text-[12px] font-medium">
          <span className="text-[#333]">File</span>
          <span className="text-[#b3b3b3]">Assets</span>
        </div>
        <button
          type="button"
          onClick={openLayerSearch}
          className={`flex size-11 shrink-0 items-center justify-center rounded lg:size-auto lg:p-1 ${showLayerSearch ? "bg-[#e8f3ff] text-[#18a0fb]" : "text-[#7a7a7a] hover:bg-[#f5f5f5]"}`}
          aria-label="Search layers"
          aria-pressed={showLayerSearch}
          title="Search layers"
        >
          <Search className="size-5 lg:size-4" aria-hidden />
        </button>
      </div>
      {showLayerSearch ? (
        <div className={`border-b ${border} px-3 py-2`}>
          <div className="flex items-center gap-1.5 rounded-md border border-[#e6e6e6] bg-[#fafafa] px-2 py-1.5">
            <Search className="size-3.5 shrink-0 text-[#7a7a7a]" aria-hidden />
            <input
              ref={layerSearchInputRef}
              type="search"
              value={layerSearchQuery}
              onChange={(event) => setLayerSearchQuery(event.target.value)}
              placeholder="Search layers…"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[#333] outline-none placeholder:text-[#b3b3b3] [&::-webkit-search-cancel-button]:hidden"
              aria-label="Search layers"
            />
            <button
              type="button"
              onClick={closeLayerSearch}
              className="flex size-6 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f0f0f0] hover:text-[#333]"
              aria-label="Close layer search"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
      <div className={`shrink-0 border-b ${border} px-3 py-2`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Pages</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {canvasPages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page.id)}
              className={`min-h-11 rounded px-3 py-2.5 text-left text-[15px] font-medium transition-colors lg:min-h-0 lg:px-2 lg:py-1.5 lg:text-[12px] ${activePageId === page.id ? "bg-[#f0f0f0] text-[#333]" : "text-[#333] hover:bg-[#f5f5f5]"
                }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-2 py-2">
        <div className="mb-1 flex shrink-0 items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Layers</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Layer actions">
            <Layers2 className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15">
          <FigmaLeftPanelLayers searchQuery={layerSearchQuery} />
        </div>
      </div>
    </aside>
  );
}

function CommandPaletteHint({ onOpen }: { onOpen: () => void }) {
  const [modKey, setModKey] = useState("Ctrl");

  useEffect(() => {
    setModKey(/Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘" : "Ctrl");
  }, []);

  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[11px] font-semibold text-[#7a7a7a]">Quick actions</div>
      <button
        type="button"
        onClick={onOpen}
        className={`flex w-full items-center gap-1.5 rounded-md border ${border} bg-[#fafafa] px-2 py-1.5 text-left transition-colors hover:bg-[#f5f5f5]`}
        aria-label={`Open quick actions. ${modKey}+K.`}
      >
        <Search className="size-3.5 shrink-0 text-[#7a7a7a]" aria-hidden />
        <span className="min-w-0 flex-1 text-[11px] text-[#333]">Search commands</span>
        <kbd className="shrink-0 rounded border border-[#e6e6e6] bg-white px-1.5 py-0.5 font-sans text-[10px] tabular-nums text-[#7a7a7a]">
          {modKey}+K
        </kbd>
      </button>
      <p className="mt-1.5 text-[10px] leading-snug text-[#b3b3b3]">CV, projects, play mode, contact</p>
    </div>
  );
}

function RightPanel({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
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
        <CommandPaletteHint onOpen={onOpenCommandPalette} />
        <div className={`flex items-center justify-between border-t border-[#f0f0f0] pt-2`}>
          <span className="text-[12px] font-medium text-[#333]">Variables</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Variables settings">
            <SlidersVertical className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}

const FRAME_LABEL_HEIGHT_PX = 20;

function CanvasFrame({
  id,
  label,
  active,
  children,
}: {
  id: string;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  const { focusLayer } = useFigmaCanvas();
  const selectedLayerId = useSelectedLayerId();
  const isSelected = selectedLayerId === id;
  const isHighlighted = isSelected || (active === true && selectedLayerId === null);

  return (
    <div className="relative w-[1440px] shrink-0" data-figma-frame-id={id}>
      <div className="flex shrink-0 items-end" style={{ height: FRAME_LABEL_HEIGHT_PX }}>
        <button
          type="button"
          data-figma-frame-label
          onClick={() => focusLayer(id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`cursor-pointer text-[11px] leading-4 font-medium transition-colors ${isHighlighted ? "text-[#18a0fb]" : "text-[#7a7a7a] hover:text-[#18a0fb]"
            }`}
        >
          {label}
        </button>
      </div>
      <div
        className={`relative overflow-hidden rounded-sm border-2 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] ${isHighlighted
          ? "border-[#18a0fb] shadow-[0_0_0_1px_#18a0fb,inset_0_0_0_1px_rgba(24,160,251,0.3)]"
          : "border-[#c7c7c7]"
          }`}
      >
        <FigmaFrameRoot frameId={id} label={label} active={isHighlighted}>
          <div className="relative z-0 touch-auto cursor-auto select-text [touch-action:auto] [&_a]:relative [&_a]:z-20 [&_a]:cursor-pointer [&_button]:relative [&_button]:z-20 [&_button]:cursor-pointer [&_h1]:cursor-text [&_h2]:cursor-text [&_p]:cursor-text [&_pre]:cursor-text">
            {children}
          </div>
        </FigmaFrameRoot>
      </div>
    </div>
  );
}

function DummyCanvasFrame({ pageId }: { pageId: string }) {
  const page = getCanvasPage(pageId);
  const primaryFrames = getPrimaryFramesForPage(pageId);
  const projectFrames = getProjectFramesForPage(pageId);

  if (page.layout === "single") {
    const frames = getFramesForPage(pageId);

    return (
      <PannableCanvasViewport key={pageId} initialFrameId={page.initialFrameId} pageId={pageId}>
        <div className="flex shrink-0 flex-col gap-12">
          {frames.map((frame) => (
            <CanvasFrame key={frame.id} id={frame.id} label={frame.label} active={frame.active}>
              {frame.content}
            </CanvasFrame>
          ))}
        </div>
      </PannableCanvasViewport>
    );
  }

  return (
    <PannableCanvasViewport key={pageId} initialFrameId={page.initialFrameId} pageId={pageId}>
      <div className="grid shrink-0 grid-cols-2 items-start gap-12">
        <div className="flex flex-col gap-12">
          {primaryFrames.map((frame) => (
            <CanvasFrame key={frame.id} id={frame.id} label={frame.label} active={frame.active}>
              {frame.content}
            </CanvasFrame>
          ))}
        </div>
        <div className="flex flex-col gap-12">
          {projectFrames.map((frame) => (
            <CanvasFrame key={frame.id} id={frame.id} label={frame.label} active={frame.active}>
              {frame.content}
            </CanvasFrame>
          ))}
        </div>
      </div>
    </PannableCanvasViewport>
  );
}

function PresentationOverlay({ onExit }: { onExit: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-6 sm:px-0">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#e6e6e6] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={onExit}
          className="flex h-11 items-center rounded-full px-4 text-[15px] font-medium text-[#333] hover:bg-[#f5f5f5] sm:h-auto sm:px-3 sm:py-1.5 sm:text-[12px]"
        >
          Exit presentation
        </button>
        <span className="hidden text-[11px] text-[#7a7a7a] sm:inline">Esc</span>
        <ZoomControls compact floating />
      </div>
    </div>
  );
}

function FigmaAppShellContent({
  activePageId,
  onSelectPage,
}: {
  activePageId: string;
  onSelectPage: (pageId: string) => void;
}) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isChromeHidden, setIsChromeHidden] = useState(false);
  const [isMobileLayersOpen, setIsMobileLayersOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const handleSelectPage = useCallback(
    (pageId: string) => {
      onSelectPage(pageId);
      setIsMobileLayersOpen(false);
    },
    [onSelectPage],
  );

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    function syncMobileChrome() {
      if (!mediaQuery.matches) return;
      setIsChromeHidden(true);
      setIsMobileLayersOpen(false);
    }

    syncMobileChrome();
    mediaQuery.addEventListener("change", syncMobileChrome);
    return () => mediaQuery.removeEventListener("change", syncMobileChrome);
  }, []);

  const toggleChrome = useCallback(() => {
    setIsChromeHidden((prev) => !prev);
    setIsMobileLayersOpen(false);
  }, []);

  const toggleMobileLayers = useCallback(() => {
    setIsMobileLayersOpen((prev) => {
      const next = !prev;
      if (next) setIsChromeHidden(false);
      return next;
    });
  }, []);

  const closeMobileLayers = useCallback(() => {
    setIsMobileLayersOpen(false);
  }, []);

  const exitPresentation = useCallback(async () => {
    setIsPresentationMode(false);
    setIsChromeHidden(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    }
  }, []);

  const enterPresentation = useCallback(async () => {
    setIsPresentationMode(true);
    setIsChromeHidden(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* fullscreen optional — UI chrome still hides */
    }
  }, []);

  const togglePresentation = useCallback(() => {
    if (isPresentationMode) {
      void exitPresentation();
      return;
    }
    void enterPresentation();
  }, [enterPresentation, exitPresentation, isPresentationMode]);

  useEffect(() => {
    function onFullscreenChange() {
      if (!document.fullscreenElement) {
        setIsPresentationMode(false);
      }
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useFigmaCommandPaletteShortcut(openCommandPalette);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const modKey = e.ctrlKey || e.metaKey;

      if (modKey && e.key === "\\") {
        e.preventDefault();
        if (isPresentationMode) return;
        setIsChromeHidden((prev) => !prev);
        return;
      }

      if (!isPresentationMode) return;
      if (e.key !== "Escape") return;
      e.preventDefault();
      void exitPresentation();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [exitPresentation, isPresentationMode]);

  const arePanelsHidden = isChromeHidden || isPresentationMode;
  const showMobileLayersBackdrop = isMobileLayersOpen && !isPresentationMode;
  const showDesktopLeftPanel = !isPresentationMode && !arePanelsHidden;
  const { isCommentMode } = useCommentMode();

  return (
    <div
      className={`flex h-[100dvh] min-h-0 flex-col bg-white text-[#333] ${arePanelsHidden && isPresentationMode ? "" : "lg:min-w-[1024px]"}`}
    >
      {!isPresentationMode ? (
        <TopBar
          onTogglePresentation={togglePresentation}
          isChromeHidden={isChromeHidden}
          onToggleChrome={toggleChrome}
          onToggleMobileLayers={toggleMobileLayers}
          isMobileLayersOpen={isMobileLayersOpen}
        />
      ) : null}
      <div className="relative flex min-h-0 flex-1">
        {showMobileLayersBackdrop ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 max-lg:block lg:hidden"
            aria-label="Close layers panel"
            onClick={closeMobileLayers}
          />
        ) : null}
        {!isPresentationMode ? (
          <div
            className={`fixed inset-y-0 left-0 z-50 h-dvh min-h-0 w-[240px] -translate-x-full pointer-events-none bg-white transition-transform duration-200 ease-out ${isMobileLayersOpen ? "max-lg:translate-x-0 max-lg:pointer-events-auto" : ""
              } ${showDesktopLeftPanel ? "lg:static lg:z-auto lg:flex lg:h-full lg:w-auto lg:translate-x-0 lg:bg-transparent lg:pointer-events-auto" : "lg:hidden"}`}
          >
            <LeftPanel
              activePageId={activePageId}
              onSelectPage={handleSelectPage}
              onToggleChrome={toggleChrome}
              onCloseMobile={closeMobileLayers}
            />
          </div>
        ) : null}
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f5f5]">
          <DummyCanvasFrame pageId={activePageId} />
          <FigmaQuickActionsOnboarding hidden={isPresentationMode} />
          <CommentToolbar hidden={isPresentationMode} />
          {isPresentationMode ? <PresentationOverlay onExit={exitPresentation} /> : null}
        </main>
        {!arePanelsHidden ? (
          <div className="hidden lg:contents">
            {isCommentMode ? <CommentSidebar /> : <RightPanel onOpenCommandPalette={openCommandPalette} />}
          </div>
        ) : null}
      </div>
      <FigmaCommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />
      <FigmaMobileQuickActionsFab onOpen={openCommandPalette} hidden={isPresentationMode} />
    </div>
  );
}

function FigmaAppShell() {
  const [activePageId, setActivePageId] = useState(PORTFOLIO_PAGE_ID);

  return (
    <CommentModeProvider pageId={activePageId}>
      <FigmaAppShellContent activePageId={activePageId} onSelectPage={setActivePageId} />
    </CommentModeProvider>
  );
}

export function FigmaApp() {
  return (
    <FigmaLayersProvider>
      <FigmaCanvasProvider>
        <FigmaAppShell />
      </FigmaCanvasProvider>
    </FigmaLayersProvider>
  );
}
