"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { listComments } from "@/app/actions/comments";
import { getOrCreateGuestId } from "@/lib/comments/guest-id";
import type { PublicComment } from "@/lib/comments/types";

export interface PendingPin {
  x: number;
  y: number;
}

interface CommentModeContextValue {
  pageId: string;
  isCommentMode: boolean;
  pendingPin: PendingPin | null;
  comments: PublicComment[];
  myCommentIds: Set<string>;
  selectedCommentId: string | null;
  isLoadingComments: boolean;
  toggleCommentMode: () => void;
  setPendingPin: (pin: PendingPin | null) => void;
  addComment: (comment: PublicComment) => void;
  setSelectedCommentId: (commentId: string | null) => void;
  selectComment: (commentId: string | null) => void;
  refreshComments: () => Promise<void>;
  exitCommentMode: () => void;
}

const CommentModeContext = createContext<CommentModeContextValue | null>(null);

interface CommentModeProviderProps {
  pageId: string;
  children: ReactNode;
}

export function CommentModeProvider({ pageId, children }: CommentModeProviderProps) {
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [pendingPin, setPendingPinState] = useState<PendingPin | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [myCommentIds, setMyCommentIds] = useState<Set<string>>(() => new Set());
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const setPendingPin = useCallback((pin: PendingPin | null) => {
    setPendingPinState(pin);
    if (pin) setSelectedCommentId(null);
  }, []);

  const selectComment = useCallback((commentId: string | null) => {
    setSelectedCommentId(commentId);
    if (commentId) setPendingPinState(null);
  }, []);

  const refreshComments = useCallback(async () => {
    if (!pageId) return;
    setIsLoadingComments(true);
    const guestId = getOrCreateGuestId();
    const data = await listComments(pageId, guestId);
    setComments(data.comments);
    setMyCommentIds(new Set(data.ownCommentIds));
    setIsLoadingComments(false);
  }, [pageId]);

  useEffect(() => {
    void refreshComments();
  }, [refreshComments]);

  const toggleCommentMode = useCallback(() => {
    setIsCommentMode((prev) => {
      const next = !prev;
      if (!next) {
        setPendingPin(null);
        setSelectedCommentId(null);
      }
      return next;
    });
  }, [setPendingPin]);

  const exitCommentMode = useCallback(() => {
    setIsCommentMode(false);
    setPendingPin(null);
    setSelectedCommentId(null);
  }, [setPendingPin]);

  const addComment = useCallback((comment: PublicComment) => {
    setComments((prev) => [...prev, comment]);
    setMyCommentIds((prev) => {
      const next = new Set(prev);
      next.add(comment.commentId);
      return next;
    });
  }, []);

  const value = useMemo(
    (): CommentModeContextValue => ({
      pageId,
      isCommentMode,
      pendingPin,
      comments,
      myCommentIds,
      selectedCommentId,
      isLoadingComments,
      toggleCommentMode,
      setPendingPin,
      selectComment,
      addComment,
      setSelectedCommentId: selectComment,
      refreshComments,
      exitCommentMode,
    }),
    [
      pageId,
      isCommentMode,
      pendingPin,
      comments,
      myCommentIds,
      selectedCommentId,
      isLoadingComments,
      toggleCommentMode,
      setPendingPin,
      selectComment,
      addComment,
      refreshComments,
      exitCommentMode,
    ],
  );

  return <CommentModeContext.Provider value={value}>{children}</CommentModeContext.Provider>;
}

export function useCommentMode() {
  const context = useContext(CommentModeContext);
  if (!context) {
    throw new Error("useCommentMode must be used within CommentModeProvider");
  }
  return context;
}
