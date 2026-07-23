"use client";

import type { PublicComment } from "@/lib/comments/types";
import { CommentExpandedCard } from "@/components/comments/comment-expanded-card";
import { getAvatarColor, getInitial } from "@/lib/comments/display";

interface CommentPinAvatarProps {
  userLabel: string;
  isOwn?: boolean;
  isSelected?: boolean;
  className?: string;
}

export function CommentPinAvatar({
  userLabel,
  isOwn = false,
  isSelected = false,
  className = "",
}: CommentPinAvatarProps) {
  const initial = getInitial(userLabel);
  const color = getAvatarColor(userLabel);

  return (
    <div
      className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white shadow-md transition-transform duration-150 motion-reduce:transition-none ${
        isOwn || isSelected ? "ring-2 ring-[#18a0fb]/40" : ""
      } ${isSelected ? "scale-110" : ""} ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

interface CommentPinProps {
  comment: PublicComment;
  isOwn?: boolean;
  isSelected?: boolean;
  onSelect?: (commentId: string) => void;
  className?: string;
}

export function CommentPin({
  comment,
  isOwn = false,
  isSelected = false,
  onSelect,
  className = "",
}: CommentPinProps) {
  return (
    <div
      className={`pointer-events-auto absolute z-20 ${className}`}
      style={{ left: comment.anchorX, top: comment.anchorY }}
      data-canvas-interactive
    >
      {isSelected ? (
        <div className="absolute bottom-0 left-0 z-30">
          <CommentExpandedCard userLabel={comment.userLabel} createdAt={comment.createdAt} isOwn={isOwn}>
            <p className="text-[13px] leading-snug whitespace-pre-wrap text-[#1e1e1e]">{comment.content}</p>
          </CommentExpandedCard>
        </div>
      ) : (
        <button
          type="button"
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 hover:scale-110 motion-reduce:transition-none"
          onClick={() => onSelect?.(comment.commentId)}
          aria-label={`Open comment by ${comment.userLabel}`}
        >
          <CommentPinAvatar userLabel={comment.userLabel} isOwn={isOwn} />
        </button>
      )}
    </div>
  );
}
