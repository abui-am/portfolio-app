"use client";

import { MessageCircle } from "lucide-react";
import { useCommentMode } from "@/components/comments/comment-mode-context";

interface CommentToolbarProps {
  hidden?: boolean;
}

export function CommentToolbar({ hidden = false }: CommentToolbarProps) {
  const { isCommentMode, toggleCommentMode } = useCommentMode();

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-3 sm:bottom-[calc(3rem+env(safe-area-inset-bottom))] sm:px-0"
      data-canvas-interactive
    >
      <div className="pointer-events-auto rounded-full bg-white/95 py-1.5 pr-3 pl-2 shadow-[0_2px_12px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <button
          type="button"
          onClick={toggleCommentMode}
          aria-pressed={isCommentMode}
          aria-label={isCommentMode ? "Exit comment mode" : "Leave a comment on this portfolio"}
          className={`flex h-9 items-center gap-2 rounded-full px-2 transition-colors hover:bg-[#f5f5f5] ${isCommentMode ? "bg-[#e8f3ff] text-[#18a0fb]" : "text-[#333]"
            }`}
        >
          <MessageCircle
            className={`size-[18px] shrink-0 fill-[#18a0fb] text-[#18a0fb] ${isCommentMode ? "" : "opacity-90"}`}
            aria-hidden
          />
          <span className="text-[12px] font-medium">Leave a comment</span>
        </button>
      </div>
    </div>
  );
}
