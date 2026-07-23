"use client";

import { useCommentMode } from "@/components/comments/comment-mode-context";
import { formatRelativeTime, getAvatarColor, getInitial } from "@/lib/comments/display";

const border = "border-[#e6e6e6]";
const figmaBlue = "#18a0fb";

export function CommentSidebar() {
  const { comments, myCommentIds, isLoadingComments, selectedCommentId, setSelectedCommentId } = useCommentMode();

  return (
    <aside className={`flex w-[240px] shrink-0 flex-col border-l ${border} bg-white`}>
      <div className={`flex border-b ${border} px-2`}>
        <button
          type="button"
          className="border-b-2 px-3 py-2.5 text-[12px] font-semibold text-[#333]"
          style={{ borderColor: figmaBlue }}
        >
          Comments
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin]">
        {isLoadingComments ? (
          <p className="px-2 py-3 text-[12px] text-[#b3b3b3]">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="px-2 py-3 text-[12px] leading-snug text-[#b3b3b3]">
            No comments yet. Click the canvas to add one.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {comments.map((comment) => {
              const isOwn = myCommentIds.has(comment.commentId);
              const isSelected = selectedCommentId === comment.commentId;
              const initial = getInitial(comment.userLabel);
              const color = getAvatarColor(comment.userLabel);

              return (
                <li key={comment.commentId}>
                  <button
                    type="button"
                    onClick={() => setSelectedCommentId(isSelected ? null : comment.commentId)}
                    className={`flex w-full gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-[#f5f5f5] ${
                      isSelected ? "bg-[#e8f3ff]" : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${
                        isOwn ? "ring-1 ring-[#18a0fb]/50" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-hidden
                    >
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="truncate text-[12px] font-semibold text-[#333]">{comment.userLabel}</span>
                        <span className="shrink-0 text-[10px] text-[#b3b3b3]">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#555]">{comment.content}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
