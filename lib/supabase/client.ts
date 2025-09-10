import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      contents: {
        Row: {
          id: string;
          type: "image" | "text";
          data: Record<string, any>;
          duration: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "image" | "text";
          data: Record<string, any>;
          duration: number;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "image" | "text";
          data?: Record<string, any>;
          duration?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Content = Database["public"]["Tables"]["contents"]["Row"];
export type ContentInsert = Database["public"]["Tables"]["contents"]["Insert"];
export type ContentUpdate = Database["public"]["Tables"]["contents"]["Update"];
