"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
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
import { getPrimaryCanvasFrames, getProjectCanvasFrames, PRIMARY_CANVAS_FRAME_ID } from "@/content/canvas-frames";
import { useIsMobile } from "@/components/figma-shell/use-is-mobile";

const TOP_BAR_PX = 40;

function FigmaMark({ className }: { className?: string }) {
  return <img src="/figma-mark.ico" alt="" className={className} aria-hidden />;
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
            : "flex h-7 shrink-0 items-center gap-0.5 rounded border border-[#e6e6e6] bg-white px-0.5"
        }
      >
        <button
          type="button"
          onClick={zoomOut}
          className={`flex items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] ${floating ? "size-7 rounded-full" : "size-6"}`}
          aria-label="Zoom out"
        >
          <Minus className="size-3.5" aria-hidden />
        </button>
        <span
          className={`shrink-0 text-center tabular-nums text-[#333] ${floating ? "min-w-12 text-[12px]" : "min-w-9 text-[11px]"}`}
        >
          {zoomLabel}
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className={`flex items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] ${floating ? "size-7 rounded-full" : "size-6"}`}
          aria-label="Zoom in"
        >
          <Plus className="size-3.5" aria-hidden />
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
      className={`flex shrink-0 items-center gap-0.5 border-b ${border} bg-white px-1 min-w-0 overflow-hidden`}
      style={{ height: TOP_BAR_PX }}
    >
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5]"
          aria-label="Home"
        >
          <Home className="size-[18px]" aria-hidden />
        </button>
        {isChromeHidden ? (
          <button
            type="button"
            onClick={onToggleChrome}
            className="flex size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5]"
            aria-label="Show UI"
            title="Show UI (Ctrl+\)"
          >
            <PanelLeftOpen className="size-[18px]" strokeWidth={2} aria-hidden />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggleMobileLayers}
              className="flex size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] lg:hidden"
              aria-label={isMobileLayersOpen ? "Close layers panel" : "Open layers panel"}
              aria-expanded={isMobileLayersOpen}
            >
              <Layers2 className="size-[18px]" aria-hidden />
            </button>
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

      <div className="mx-0.5 flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="flex h-7 min-w-0 max-w-full items-center gap-1 rounded-md bg-white pl-2 pr-1 shadow-[inset_0_0_0_1px_#e6e6e6]">
          <FigmaMark className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate text-[13px] font-medium text-[#333]">Untitled</span>
          <button type="button" className="shrink-0 rounded p-0.5 text-[#b3b3b3] hover:bg-[#f5f5f5]" aria-label="Close tab">
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="hidden h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[13px] text-[#b3b3b3] shadow-[inset_0_0_0_1px_#e6e6e6] md:flex">
          <FigmaMark className="size-3.5 shrink-0 opacity-60" />
          <span className="max-w-[120px] truncate">Untitled</span>
        </div>
        <button
          type="button"
          className="hidden size-7 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f5f5f5] sm:flex"
          aria-label="New tab"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 pr-0.5 sm:gap-1 sm:pr-1">
        <div
          className="hidden size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ff8577] to-[#ff4d6d] text-[10px] font-bold text-white sm:flex"
          aria-hidden
        >
          A
        </div>
        <button
          type="button"
          onClick={onTogglePresentation}
          className="hidden size-8 shrink-0 items-center justify-center rounded text-[#333] hover:bg-[#f5f5f5] md:flex"
          aria-label="Enter presentation mode"
        >
          <Play className="size-[18px]" aria-hidden />
        </button>
        <button
          type="button"
          className="h-7 shrink-0 rounded-md px-2 text-[11px] font-semibold text-white sm:px-3 sm:text-[12px]"
          style={{ backgroundColor: figmaBlue }}
        >
          Share
        </button>
        <div className="hidden md:block">
          <ZoomControls />
        </div>
        <div className="md:hidden">
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

function LeftPanel({
  onToggleChrome,
  onCloseMobile,
  isMobileOverlay,
}: {
  onToggleChrome: () => void;
  onCloseMobile?: () => void;
  isMobileOverlay?: boolean;
}) {
  return (
    <aside
      className={`flex h-full min-h-0 w-[240px] shrink-0 flex-col border-r ${border} bg-white ${
        isMobileOverlay ? "shadow-xl" : ""
      }`}
    >
      <div className={`flex items-center gap-2 border-b ${border} px-3 py-2`}>
        <FigmaMark className="size-[22px] shrink-0" />
        <div className="min-w-0 flex-1">
          <button type="button" className="flex w-full items-center gap-0.5 text-left">
            <span className="truncate text-[13px] font-semibold text-[#333]">Untitled</span>
            <ChevronDown className="size-3.5 shrink-0 text-[#7a7a7a]" aria-hidden />
          </button>
          <p className="truncate text-[11px] leading-4 text-[#7a7a7a]">Drafts · Free</p>
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
        {isMobileOverlay ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex size-7 shrink-0 items-center justify-center rounded text-[#7a7a7a] hover:bg-[#f5f5f5] hover:text-[#333] lg:hidden"
            aria-label="Close layers panel"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <div className={`flex items-center justify-between border-b ${border} px-3 py-2`}>
        <div className="flex gap-4 text-[12px] font-medium">
          <span className="text-[#333]">File</span>
          <span className="text-[#b3b3b3]">Assets</span>
        </div>
        <button type="button" className="rounded p-1 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Search">
          <Search className="size-4" aria-hidden />
        </button>
      </div>
      <div className={`shrink-0 border-b ${border} px-3 py-2`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Pages</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Add page">
            <Plus className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="rounded bg-[#f0f0f0] px-2 py-1.5 text-[12px] font-medium text-[#333]">Page 1</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-2 py-2">
        <div className="mb-1 flex shrink-0 items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#7a7a7a]">Layers</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Layer actions">
            <Layers2 className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15">
          <FigmaLeftPanelLayers />
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
              <Minus className="size-4" aria-hidden />
            </button>
            <button type="button" className="shrink-0 text-[#b3b3b3] hover:text-[#333]" aria-label="Visibility">
              <Eye className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        <div className={`mb-1 flex items-center justify-between border-t border-[#f0f0f0] pt-2`}>
          <span className="text-[12px] font-medium text-[#333]">Variables</span>
          <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label="Variables settings">
            <SlidersVertical className="size-3.5" aria-hidden />
          </button>
        </div>
        {["Styles", "Export"].map((label) => (
          <div key={label} className="flex items-center justify-between py-2">
            <span className="text-[12px] font-medium text-[#333]">{label}</span>
            <button type="button" className="rounded p-0.5 text-[#7a7a7a] hover:bg-[#f5f5f5]" aria-label={`Add ${label}`}>
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>
        ))}
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
          className={`cursor-pointer text-[11px] leading-4 font-medium transition-colors ${
            isHighlighted ? "text-[#18a0fb]" : "text-[#7a7a7a] hover:text-[#18a0fb]"
          }`}
        >
          {label}
        </button>
      </div>
      <div
        className={`relative overflow-hidden rounded-sm border-2 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] ${
          isHighlighted
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

function DummyCanvasFrame() {
  const primaryFrames = getPrimaryCanvasFrames();
  const projectFrames = getProjectCanvasFrames();

  return (
    <PannableCanvasViewport initialFrameId={PRIMARY_CANVAS_FRAME_ID}>
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

function PresentationOverlay({
  onExit,
  onHideToolbar,
}: {
  onExit: () => void;
  onHideToolbar: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-6 sm:px-0">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#e6e6e6] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]"
        >
          Exit presentation
        </button>
        <span className="text-[11px] text-[#7a7a7a]">Esc</span>
        <button
          type="button"
          onClick={onHideToolbar}
          className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]"
        >
          Hide toolbar
        </button>
        <ZoomControls compact floating />
      </div>
    </div>
  );
}

function PresentationToolbarReveal({
  onShowToolbar,
  onExit,
}: {
  onShowToolbar: () => void;
  onExit: () => void;
}) {
  return (
    <div
      className="group absolute inset-x-0 bottom-0 z-50 flex h-14 items-end justify-center pb-3"
      onMouseEnter={onShowToolbar}
    >
      <div className="pointer-events-none rounded-full bg-black/50 px-3 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        Move cursor here to show toolbar · Esc to exit
      </div>
      <button
        type="button"
        onClick={onExit}
        className="pointer-events-auto absolute bottom-3 right-3 rounded-md border border-[#e6e6e6] bg-white/95 px-2.5 py-1.5 text-[11px] font-medium text-[#333] opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white"
      >
        Exit
      </button>
    </div>
  );
}

function FigmaAppShell() {
  const isMobile = useIsMobile();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isChromeHidden, setIsChromeHidden] = useState(false);
  const [isPresentationToolbarHidden, setIsPresentationToolbarHidden] = useState(false);
  const [isMobileLayersOpen, setIsMobileLayersOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsChromeHidden(true);
      setIsMobileLayersOpen(false);
    }
  }, [isMobile]);

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
    setIsPresentationToolbarHidden(false);
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
    setIsPresentationToolbarHidden(false);
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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const modKey = e.ctrlKey || e.metaKey;

      if (modKey && e.key === "\\") {
        e.preventDefault();
        if (isPresentationMode) {
          setIsPresentationToolbarHidden((prev) => !prev);
          return;
        }
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
  const showDesktopLeftPanel = !arePanelsHidden;
  const showMobileLayersDrawer = isMobile && isMobileLayersOpen && !isPresentationMode;

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
        {showMobileLayersDrawer ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close layers panel"
            onClick={closeMobileLayers}
          />
        ) : null}
        {showDesktopLeftPanel ? (
          <div
            className={`${
              isMobile
                ? `fixed inset-y-0 left-0 z-50 h-full min-h-0 transition-transform duration-200 ease-out ${
                    isMobileLayersOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
                  }`
                : "flex h-full min-h-0"
            } lg:pointer-events-auto lg:static lg:flex lg:h-full lg:min-h-0 lg:translate-x-0`}
          >
            <LeftPanel
              onToggleChrome={toggleChrome}
              onCloseMobile={closeMobileLayers}
              isMobileOverlay={isMobile}
            />
          </div>
        ) : null}
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#f5f5f5]">
          <DummyCanvasFrame />
          {isPresentationMode && !isPresentationToolbarHidden ? (
            <PresentationOverlay
              onExit={exitPresentation}
              onHideToolbar={() => setIsPresentationToolbarHidden(true)}
            />
          ) : null}
          {isPresentationMode && isPresentationToolbarHidden ? (
            <PresentationToolbarReveal
              onShowToolbar={() => setIsPresentationToolbarHidden(false)}
              onExit={exitPresentation}
            />
          ) : null}
        </main>
        {!arePanelsHidden ? <div className="hidden lg:contents"><RightPanel /></div> : null}
      </div>
    </div>
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
