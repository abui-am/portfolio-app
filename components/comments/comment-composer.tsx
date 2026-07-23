"use client";

import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createComment } from "@/app/actions/comments";
import { CommentExpandedCard } from "@/components/comments/comment-expanded-card";
import type { PendingPin } from "@/components/comments/comment-mode-context";
import { deriveGuestLabel, getOrCreateGuestId } from "@/lib/comments/guest-id";
import type { PublicComment } from "@/lib/comments/types";

interface CommentComposerProps {
  pageId: string;
  pin: PendingPin;
  onSubmitted: (comment: PublicComment) => void;
  onDismiss: () => void;
}

export function CommentComposer({ pageId, pin, onSubmitted, onDismiss }: CommentComposerProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const guestLabel = deriveGuestLabel(getOrCreateGuestId());

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        onDismiss();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onDismiss]);

  const submit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const guestId = getOrCreateGuestId();
    const result = await createComment({
      pageId,
      content: trimmed,
      anchorX: pin.x,
      anchorY: pin.y,
      guestId,
      userLabel: deriveGuestLabel(guestId),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    onSubmitted(result.comment);
    onDismiss();
  }, [content, isSubmitting, onDismiss, onSubmitted, pageId, pin.x, pin.y]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto absolute z-30"
      style={{ left: pin.x, top: pin.y }}
      data-canvas-interactive
    >
      <div className="absolute bottom-0 left-0">
        <CommentExpandedCard userLabel={guestLabel} isOwn>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={onKeyDown}
              maxLength={2000}
              placeholder="Add a comment"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1e1e1e] outline-none placeholder:text-[#b3b3b3]"
            />
            <button
              type="button"
              onClick={() => void submit()}
              disabled={isSubmitting || !content.trim()}
              aria-label="Submit comment"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#18a0fb] text-white transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] disabled:opacity-50"
            >
              <ArrowUp className="size-3.5" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
          {error ? <p className="mt-1 text-[11px] text-[#ff7262]">{error}</p> : null}
        </CommentExpandedCard>
      </div>
    </div>
  );
}
