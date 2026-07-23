"use client";

import type { ReactNode } from "react";
import { CommentPinAvatar } from "@/components/comments/comment-pin";
import { formatRelativeTime } from "@/lib/comments/display";

interface CommentExpandedCardProps {
  userLabel: string;
  createdAt?: string;
  isOwn?: boolean;
  children: ReactNode;
}

export function CommentExpandedCard({ userLabel, createdAt, isOwn, children }: CommentExpandedCardProps) {
  return (
    <div className="relative w-[min(300px,calc(100vw-3rem))]">
      <div className="overflow-hidden rounded-t-2xl rounded-r-2xl rounded-br-2xl rounded-bl-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.14)]">
        <div className="p-3.5">
          <div className="flex gap-3">
            <CommentPinAvatar userLabel={userLabel} isOwn={isOwn} className="size-8! text-[12px]!" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <span className="text-[13px] font-semibold text-[#1e1e1e]">{userLabel}</span>
                {createdAt ? (
                  <span className="text-[12px] text-[#b3b3b3]">{formatRelativeTime(createdAt)}</span>
                ) : null}
              </div>
              <div className="mt-1.5">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
