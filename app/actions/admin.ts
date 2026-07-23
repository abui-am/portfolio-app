"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminSession,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin/auth";
import { banGuestByTokenHash, updateCommentStatus } from "@/lib/comments/moderation";
import type { AdminActionResult, AdminComment, CommentStatus, ModerationAction } from "@/lib/comments/types";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function toAdminComment(row: {
  comment_id: string;
  content: string;
  created_at: string;
  page_id: string;
  anchor_x: number;
  anchor_y: number;
  user_label: string;
  parent_id: string | null;
  status: string;
  user_token_hash: string;
  moderated_at: string | null;
}): AdminComment {
  return {
    commentId: row.comment_id,
    content: row.content,
    createdAt: row.created_at,
    pageId: row.page_id,
    anchorX: row.anchor_x,
    anchorY: row.anchor_y,
    userLabel: row.user_label,
    parentId: row.parent_id,
    status: row.status as CommentStatus,
    userTokenHash: row.user_token_hash,
    moderatedAt: row.moderated_at,
  };
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return { error: "Invalid password" };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function listAllComments(filters?: {
  status?: CommentStatus | "all";
  pageId?: string;
}): Promise<AdminComment[]> {
  if (!(await isAdminSession())) {
    return [];
  }

  const supabase = createServiceSupabaseClient();
  let query = supabase
    .from("comments")
    .select(
      "comment_id, content, created_at, page_id, anchor_x, anchor_y, user_label, parent_id, status, user_token_hash, moderated_at",
    )
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.pageId) {
    query = query.eq("page_id", filters.pageId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listAllComments error:", error.message);
    return [];
  }

  return (data ?? []).map(toAdminComment);
}

export async function moderateComment(
  commentId: string,
  action: ModerationAction,
): Promise<AdminActionResult> {
  if (!(await isAdminSession())) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    await updateCommentStatus(commentId, action);
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not update comment." };
  }
}

export async function banGuest(userTokenHash: string): Promise<AdminActionResult> {
  if (!(await isAdminSession())) {
    return { ok: false, message: "Unauthorized" };
  }

  try {
    await banGuestByTokenHash(userTokenHash);
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not ban guest." };
  }
}

export async function moderateAndBan(
  commentId: string,
  userTokenHash: string,
  action: Exclude<ModerationAction, "visible">,
): Promise<AdminActionResult> {
  const moderateResult = await moderateComment(commentId, action);
  if (!moderateResult.ok) return moderateResult;

  const banResult = await banGuest(userTokenHash);
  if (!banResult.ok) return banResult;

  return { ok: true };
}
