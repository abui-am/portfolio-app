export type CommentStatus = "visible" | "hidden" | "rejected";

export type ModerationAction = "hide" | "reject" | "visible";

export interface PublicComment {
  commentId: string;
  content: string;
  createdAt: string;
  pageId: string;
  anchorX: number;
  anchorY: number;
  userLabel: string;
  parentId: string | null;
}

export interface AdminComment extends PublicComment {
  status: CommentStatus;
  userTokenHash: string;
  moderatedAt: string | null;
}

export interface CommentsPageData {
  comments: PublicComment[];
  ownCommentIds: string[];
}

export interface CreateCommentInput {
  pageId: string;
  content: string;
  anchorX: number;
  anchorY: number;
  userLabel?: string;
  guestId: string;
  parentId?: string;
  honeypot?: string;
}

export type CreateCommentResult =
  | { ok: true; comment: PublicComment }
  | { ok: false; error: "validation" | "rate_limit" | "banned" | "server"; message: string };

export type AdminActionResult =
  | { ok: true }
  | { ok: false; message: string };
