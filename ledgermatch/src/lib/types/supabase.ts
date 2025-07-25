// src/lib/types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      sales_reports: {
        Row: {
          id: string;
          user_id: string;
          file_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_url?: string;
          uploaded_at?: string;
        };
      };
      // Repeat similar for receipts, bank_statements, etc.
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
