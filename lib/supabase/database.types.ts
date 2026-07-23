export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CommentStatus = "visible" | "hidden" | "rejected";

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          anchor_x: number;
          anchor_y: number;
          comment_id: string;
          content: string;
          created_at: string;
          ip_hash: string | null;
          moderated_at: string | null;
          moderated_by: string | null;
          page_id: string;
          parent_id: string | null;
          status: CommentStatus;
          user_label: string;
          user_token_hash: string;
        };
        Insert: {
          anchor_x: number;
          anchor_y: number;
          comment_id?: string;
          content: string;
          created_at?: string;
          ip_hash?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          page_id: string;
          parent_id?: string | null;
          status?: CommentStatus;
          user_label: string;
          user_token_hash: string;
        };
        Update: {
          anchor_x?: number;
          anchor_y?: number;
          comment_id?: string;
          content?: string;
          created_at?: string;
          ip_hash?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          page_id?: string;
          parent_id?: string | null;
          status?: CommentStatus;
          user_label?: string;
          user_token_hash?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["comment_id"];
          },
        ];
      };
      comment_bans: {
        Row: {
          banned_at: string;
          banned_by: string;
          user_token_hash: string;
        };
        Insert: {
          banned_at?: string;
          banned_by?: string;
          user_token_hash: string;
        };
        Update: {
          banned_at?: string;
          banned_by?: string;
          user_token_hash?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_comment_secured: {
        Args: {
          p_write_secret: string;
          p_page_id: string;
          p_content: string;
          p_anchor_x: number;
          p_anchor_y: number;
          p_user_label: string;
          p_user_token_hash: string;
          p_ip_hash?: string | null;
          p_parent_id?: string | null;
        };
        Returns: Database["public"]["Tables"]["comments"]["Row"];
      };
      moderate_comment_secured: {
        Args: {
          p_write_secret: string;
          p_comment_id: string;
          p_action: string;
        };
        Returns: Database["public"]["Tables"]["comments"]["Row"];
      };
      ban_guest_secured: {
        Args: {
          p_write_secret: string;
          p_user_token_hash: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
