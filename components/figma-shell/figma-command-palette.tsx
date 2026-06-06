"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, FileDown, Globe, Link2, Mail, Play, Search } from "lucide-react";
import {
  commandPaletteItems,
  filterCommandPaletteItems,
  type CommandPaletteAction,
  type CommandPaletteItem,
} from "@/content/command-palette";

interface FigmaCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function runCommandAction(action: CommandPaletteAction, navigate: (href: string) => void) {
  if (action.type === "download") {
    const anchor = document.createElement("a");
    anchor.href = action.href;
    anchor.download = action.filename;
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return;
  }

  if (action.type === "navigate") {
    navigate(action.href);
    return;
  }

  if (action.url.startsWith("mailto:")) {
    window.location.href = action.url;
    return;
  }

  window.open(action.url, "_blank", "noopener,noreferrer");
}

function CommandIcon({ item }: { item: CommandPaletteItem }) {
  if (item.action.type === "download") {
    return <FileDown className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
  }

  if (item.action.type === "navigate") {
    return <Play className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
  }

  if (item.id === "contact-linkedin") {
    return <Link2 className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
  }

  if (item.id === "contact-github") {
    return <Globe className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
  }

  if (item.id === "contact-email") {
    return <Mail className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
  }

  return <ExternalLink className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />;
}

export function FigmaCommandPalette({ open, onOpenChange }: FigmaCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => filterCommandPaletteItems(query), [query]);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const runItem = useCallback(
    (item: CommandPaletteItem) => {
      runCommandAction(item.action, router.push);
      close();
    },
    [close, router],
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredItems.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredItems.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = filteredItems[activeIndex];
        if (item) runItem(item);
      }
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [activeIndex, close, filteredItems, open, runItem]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-command-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/40 px-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-[1px] sm:pt-[min(18vh,120px)]"
      data-canvas-interactive
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick actions"
        className="w-full max-w-[560px] overflow-hidden rounded-lg border border-[#e6e6e6] bg-white shadow-[0_16px_70px_rgba(0,0,0,0.2)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[#e6e6e6] px-3 py-2.5">
          <Search className="size-4 shrink-0 text-[#7a7a7a]" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="min-w-0 flex-1 bg-transparent text-base text-[#333] outline-none placeholder:text-[#b3b3b3] sm:text-[13px]"
            aria-controls="figma-command-list"
            aria-activedescendant={
              filteredItems[activeIndex] ? `figma-command-${filteredItems[activeIndex].id}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div
          id="figma-command-list"
          ref={listRef}
          role="listbox"
          className="max-h-[min(50vh,320px)] overflow-y-auto py-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15"
        >
          {filteredItems.length === 0 ? (
            <p className="px-3 py-6 text-center text-[12px] text-[#7a7a7a]">No matching commands</p>
          ) : (
            filteredItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  id={`figma-command-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-command-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runItem(item)}
                  className={`flex min-h-11 w-full items-center gap-2.5 px-3 py-2.5 text-left text-[15px] transition-colors sm:min-h-0 sm:py-2 sm:text-[13px] ${
                    isActive ? "bg-[#e8f3ff] text-[#18a0fb]" : "text-[#333] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <CommandIcon item={item} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f0f0] px-3 py-2 text-[11px] text-[#7a7a7a]">
          <span>Select with Enter</span>
          <span className="tabular-nums">
            <kbd className="rounded border border-[#e6e6e6] bg-[#fafafa] px-1.5 py-0.5 font-sans text-[10px] text-[#333]">
              {typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘" : "Ctrl"}
            </kbd>
            <span className="mx-0.5">+</span>
            <kbd className="rounded border border-[#e6e6e6] bg-[#fafafa] px-1.5 py-0.5 font-sans text-[10px] text-[#333]">
              K
            </kbd>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function useFigmaCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const modKey = e.ctrlKey || e.metaKey;
      if (!modKey || e.key.toLowerCase() !== "k") return;
      if (isTypingTarget(e.target)) return;

      e.preventDefault();
      onOpen();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [onOpen]);
}

export { commandPaletteItems };
