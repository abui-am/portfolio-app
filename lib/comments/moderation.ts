import type { CommentStatus, ModerationAction } from "@/lib/comments/types";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const RATE_LIMIT_PER_HOUR = 5;

export function moderationActionToStatus(action: ModerationAction): CommentStatus {
  if (action === "hide") return "hidden";
  if (action === "reject") return "rejected";
  return "visible";
}

export async function isGuestBanned(userTokenHash: string) {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("comment_bans")
    .select("user_token_hash")
    .eq("user_token_hash", userTokenHash)
    .maybeSingle();

  if (error) {
    console.error("isGuestBanned error:", error.message);
    throw new Error("Could not verify guest status.");
  }

  return Boolean(data);
}

export async function countRecentComments(userTokenHash: string) {
  const supabase = createServiceSupabaseClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("comments")
    .select("comment_id", { count: "exact", head: true })
    .eq("user_token_hash", userTokenHash)
    .gte("created_at", oneHourAgo);

  if (error) {
    console.error("countRecentComments error:", error.message);
    throw new Error("Could not verify rate limit.");
  }

  return count ?? 0;
}

export async function assertCanCreateComment(userTokenHash: string) {
  if (await isGuestBanned(userTokenHash)) {
    return { ok: false as const, error: "banned" as const };
  }

  const recentCount = await countRecentComments(userTokenHash);
  if (recentCount >= RATE_LIMIT_PER_HOUR) {
    return { ok: false as const, error: "rate_limit" as const };
  }

  return { ok: true as const };
}

export async function banGuestByTokenHash(userTokenHash: string) {
  const supabase = createServiceSupabaseClient();
  const { error } = await supabase.from("comment_bans").upsert(
    {
      user_token_hash: userTokenHash,
      banned_by: "owner",
    },
    { onConflict: "user_token_hash" },
  );

  if (error) {
    console.error("banGuestByTokenHash error:", error.message);
    throw new Error("Could not ban guest.");
  }
}

export async function updateCommentStatus(commentId: string, action: ModerationAction) {
  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("comments")
    .update({
      status: moderationActionToStatus(action),
      moderated_at: new Date().toISOString(),
      moderated_by: "owner",
    })
    .eq("comment_id", commentId);

  if (error) {
    console.error("updateCommentStatus error:", error.message);
    throw new Error("Could not update comment.");
  }
}
