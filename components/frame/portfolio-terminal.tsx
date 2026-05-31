"use client";

import { useLayoutEffect, useRef } from "react";
import { PortfolioTerminalContent } from "@/components/frame/portfolio-terminal-content";

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
    <div
      className="flex h-[268px] min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ backgroundColor: terminalBg }}
    >
      <div className="flex h-9 shrink-0 items-center gap-2.5 bg-white px-4">
        <span className="size-3 rounded-full bg-[#ff4b59]" aria-hidden />
        <span className="size-3 rounded-full bg-[#ffc600]" aria-hidden />
        <span className="size-3 rounded-full bg-[#00cb48]" aria-hidden />
      </div>
      <div
        ref={scrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-2 [overflow-anchor:none]"
      >
        <pre
          ref={preRef}
          className="min-w-0 max-w-full overflow-hidden whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.45] text-white/85"
          style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
        >
          <PortfolioTerminalContent />
        </pre>
      </div>
    </div>
  );
}
