"use client";

import { useLayoutEffect, useRef } from "react";
import { PortfolioTerminalContent } from "@/components/frame/portfolio-terminal-content";
import { FigmaLayer } from "@/components/figma-shell/figma-layer";

const terminalBg = "#2b323f";

export function PortfolioTerminal() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    const outer = scrollRef.current;
    const pre = preRef.current;
    if (!outer || !pre) return;

    function scrollToBottom() {
      const pane = scrollRef.current;
      if (!pane) return;
      pane.scrollTop = pane.scrollHeight;
    }

    scrollToBottom();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(scrollToBottom);
    });
    ro.observe(pre);

    return () => ro.disconnect();
  }, []);

  return (
    <FigmaLayer
      name="Terminal"
      icon="frame"
      data-frame-reveal="terminal"
      className="flex h-[268px] min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ backgroundColor: terminalBg }}
    >
      <FigmaLayer
        name="Window chrome"
        icon="group"
        className="flex h-9 shrink-0 items-center gap-2.5 bg-white px-4"
      >
        <span className="size-3 rounded-full bg-[#ff4b59]" aria-hidden />
        <span className="size-3 rounded-full bg-[#ffc600]" aria-hidden />
        <span className="size-3 rounded-full bg-[#00cb48]" aria-hidden />
      </FigmaLayer>
      <FigmaLayer
        name="pnpm install abui"
        icon="text"
        className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-2 [overflow-anchor:none]"
      >
        <div ref={scrollRef}>
          <pre
            ref={preRef}
            className="min-w-0 max-w-full overflow-hidden whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.45] text-white/85"
            style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
          >
            <PortfolioTerminalContent />
          </pre>
        </div>
      </FigmaLayer>
    </FigmaLayer>
  );
}
