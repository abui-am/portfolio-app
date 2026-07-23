"use client";

import { CommentComposer } from "@/components/comments/comment-composer";
import { CommentPin } from "@/components/comments/comment-pin";
import { useCommentMode } from "@/components/comments/comment-mode-context";

interface CommentLayerProps {
  pageId: string;
}

export function CommentLayer({ pageId }: CommentLayerProps) {
  const {
    isCommentMode,
    pendingPin,
    setPendingPin,
    comments,
    myCommentIds,
    selectedCommentId,
    selectComment,
    addComment,
  } = useCommentMode();

  if (!isCommentMode) return null;

  function handleSubmitted(comment: Parameters<typeof addComment>[0]) {
    addComment(comment);
    selectComment(comment.commentId);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {comments.map((comment) => {
        const isSelected = selectedCommentId === comment.commentId;

        return (
          <CommentPin
            key={comment.commentId}
            comment={comment}
            isOwn={myCommentIds.has(comment.commentId)}
            isSelected={isSelected}
            onSelect={(commentId) => selectComment(selectedCommentId === commentId ? null : commentId)}
            className={isSelected ? "z-40" : undefined}
          />
        );
      })}

      {pendingPin ? (
        <CommentComposer
          pageId={pageId}
          pin={pendingPin}
          onSubmitted={handleSubmitted}
          onDismiss={() => setPendingPin(null)}
        />
      ) : null}
    </div>
  );
}
