"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { assertCanCreateComment } from "@/lib/comments/moderation";
import { hashGuestToken, hashIp } from "@/lib/comments/hash";
import { isValidGuestId, sanitizeUserLabel } from "@/lib/comments/guest-id-shared";
import type { CommentsPageData, CreateCommentResult, PublicComment } from "@/lib/comments/types";
import { createAnonSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";

const createCommentSchema = z.object({
  pageId: z.string().min(1).max(128),
  content: z.string().trim().min(1).max(2000),
  anchorX: z.number().finite(),
  anchorY: z.number().finite(),
  userLabel: z.string().trim().max(32).optional(),
  guestId: z.string(),
  parentId: z.string().uuid().optional(),
  honeypot: z.string().optional(),
});

function toPublicComment(row: {
  comment_id: string;
  content: string;
  created_at: string;
  page_id: string;
  anchor_x: number;
  anchor_y: number;
  user_label: string;
  parent_id: string | null;
}): PublicComment {
  return {
    commentId: row.comment_id,
    content: row.content,
    createdAt: row.created_at,
    pageId: row.page_id,
    anchorX: row.anchor_x,
    anchorY: row.anchor_y,
    userLabel: row.user_label,
    parentId: row.parent_id,
  };
}

export async function listComments(pageId: string, guestId?: string): Promise<CommentsPageData> {
  if (!pageId) return { comments: [], ownCommentIds: [] };

  const supabase = createAnonSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .select("comment_id, content, created_at, page_id, anchor_x, anchor_y, user_label, parent_id")
    .eq("page_id", pageId)
    .eq("status", "visible")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listComments error:", error.message);
    return { comments: [], ownCommentIds: [] };
  }

  const comments = (data ?? []).map(toPublicComment);
  let ownCommentIds: string[] = [];

  if (guestId && isValidGuestId(guestId)) {
    const userTokenHash = hashGuestToken(guestId);
    const { data: ownRows, error: ownError } = await supabase
      .from("comments")
      .select("comment_id")
      .eq("page_id", pageId)
      .eq("user_token_hash", userTokenHash)
      .eq("status", "visible");

    if (ownError) {
      console.error("listComments own ids error:", ownError.message);
    } else {
      ownCommentIds = (ownRows ?? []).map((row) => row.comment_id);
    }
  }

  return { comments, ownCommentIds };
}

export async function createComment(input: unknown): Promise<CreateCommentResult> {
  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation", message: "Invalid comment data." };
  }

  const { pageId, content, anchorX, anchorY, userLabel, guestId, parentId, honeypot } = parsed.data;

  if (honeypot) {
    return { ok: false, error: "validation", message: "Invalid comment data." };
  }

  if (!isValidGuestId(guestId)) {
    return { ok: false, error: "validation", message: "Invalid guest identity." };
  }

  const userTokenHash = hashGuestToken(guestId);
  const label = sanitizeUserLabel(userLabel, guestId);

  try {
    const gate = await assertCanCreateComment(userTokenHash);
    if (!gate.ok) {
      if (gate.error === "banned") {
        return {
          ok: false,
          error: "banned",
          message: "You cannot post comments at this time.",
        };
      }

      return {
        ok: false,
        error: "rate_limit",
        message: "Limit reached — 5 comments per hour.",
      };
    }
  } catch {
    return { ok: false, error: "server", message: "Could not submit comment. Try again." };
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const ipHash = hashIp(forwardedFor);

  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      page_id: pageId,
      content,
      anchor_x: anchorX,
      anchor_y: anchorY,
      user_label: label,
      user_token_hash: userTokenHash,
      ip_hash: ipHash,
      parent_id: parentId ?? null,
      status: "visible",
    })
    .select("comment_id, content, created_at, page_id, anchor_x, anchor_y, user_label, parent_id")
    .single();

  if (error || !data) {
    console.error("createComment insert error:", error?.message);
    return { ok: false, error: "server", message: "Could not submit comment. Try again." };
  }

  return { ok: true, comment: toPublicComment(data) };
}
