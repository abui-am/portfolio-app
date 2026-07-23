"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { banGuest, listAllComments, logoutAdmin, moderateAndBan, moderateComment } from "@/app/actions/admin";
import type { AdminComment, CommentStatus } from "@/lib/comments/types";
import { formatRelativeTime } from "@/lib/comments/display";

type StatusFilter = CommentStatus | "all";

const STATUS_LABELS: Record<CommentStatus, string> = {
  visible: "Visible",
  hidden: "Hidden",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<CommentStatus, string> = {
  visible: "bg-[#e8f3ff] text-[#18a0fb]",
  hidden: "bg-[#f5f5f5] text-[#7a7a7a]",
  rejected: "bg-[#fff0ee] text-[#ff7262]",
};

export function AdminDashboard() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    const data = await listAllComments({
      status: statusFilter,
    });
    setComments(data);
    setIsLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  function runAction(action: () => Promise<{ ok: boolean; message?: string }>) {
    startTransition(async () => {
      setMessage(null);
      const result = await action();
      if (!result.ok) {
        setMessage(result.message ?? "Action failed.");
        return;
      }
      setMessage("Updated.");
      await loadComments();
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#333]">Comment moderation</h1>
          <p className="mt-1 text-[13px] text-[#7a7a7a]">{comments.length} comments</p>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded-md border border-[#e6e6e6] px-3 py-1.5 text-[12px] font-medium text-[#333] hover:bg-[#f5f5f5]"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "visible", "hidden", "rejected"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium capitalize transition-colors ${
              statusFilter === filter ? "bg-[#18a0fb] text-white" : "bg-white text-[#333] border border-[#e6e6e6] hover:bg-[#f5f5f5]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {message ? <p className="mb-4 text-[12px] text-[#7a7a7a]">{message}</p> : null}

      {isLoading ? (
        <p className="text-[13px] text-[#b3b3b3]">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-[13px] text-[#b3b3b3]">No comments in this filter.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.commentId} className="rounded-lg border border-[#e6e6e6] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#333]">{comment.userLabel}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[comment.status]}`}>
                      {STATUS_LABELS[comment.status]}
                    </span>
                    <span className="text-[11px] text-[#b3b3b3]">{formatRelativeTime(comment.createdAt)}</span>
                    <span className="text-[11px] text-[#b3b3b3]">· {comment.pageId}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-snug whitespace-pre-wrap text-[#555]">{comment.content}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {comment.status !== "visible" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runAction(() => moderateComment(comment.commentId, "visible"))}
                    className="rounded-md border border-[#e6e6e6] px-2.5 py-1 text-[11px] font-medium hover:bg-[#f5f5f5] disabled:opacity-50"
                  >
                    Restore
                  </button>
                ) : null}
                {comment.status !== "hidden" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runAction(() => moderateComment(comment.commentId, "hide"))}
                    className="rounded-md border border-[#e6e6e6] px-2.5 py-1 text-[11px] font-medium hover:bg-[#f5f5f5] disabled:opacity-50"
                  >
                    Hide
                  </button>
                ) : null}
                {comment.status !== "rejected" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runAction(() => moderateComment(comment.commentId, "reject"))}
                    className="rounded-md border border-[#ff7262]/30 px-2.5 py-1 text-[11px] font-medium text-[#ff7262] hover:bg-[#fff0ee] disabled:opacity-50"
                  >
                    Reject
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() =>
                      comment.status === "visible" || comment.status === "hidden"
                        ? moderateAndBan(
                            comment.commentId,
                            comment.userTokenHash,
                            comment.status === "visible" ? "hide" : "hide",
                          )
                        : banGuest(comment.userTokenHash),
                    )
                  }
                  className="rounded-md border border-[#e6e6e6] px-2.5 py-1 text-[11px] font-medium text-[#7a7a7a] hover:bg-[#f5f5f5] disabled:opacity-50"
                >
                  {comment.status === "rejected" ? "Ban guest" : "Hide & ban"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runAction(() => banGuest(comment.userTokenHash))}
                  className="rounded-md border border-[#e6e6e6] px-2.5 py-1 text-[11px] font-medium text-[#7a7a7a] hover:bg-[#f5f5f5] disabled:opacity-50"
                >
                  Ban only
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
