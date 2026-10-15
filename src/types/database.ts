export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<T extends { Row: object; Insert: object; Update: object }> = T & {
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<{
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          avatar_url: string | null;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          plan?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          plan?: string;
          created_at?: string;
          updated_at?: string;
        };
      }>;
      meetings: Table<{
        Row: {
          id: string;
          user_id: string;
          title: string;
          duration_seconds: number;
          audio_url: string | null;
          audio_path: string | null;
          status: string;
          sentiment: string | null;
          participants: string[] | null;
          recorded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          duration_seconds?: number;
          audio_url?: string | null;
          audio_path?: string | null;
          status?: string;
          sentiment?: string | null;
          participants?: string[] | null;
          recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          duration_seconds?: number;
          audio_url?: string | null;
          audio_path?: string | null;
          status?: string;
          sentiment?: string | null;
          participants?: string[] | null;
          recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      }>;
      transcripts: Table<{
        Row: {
          id: string;
          meeting_id: string;
          user_id: string;
          content: string;
          segments: Json;
          provider: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id: string;
          content?: string;
          segments?: Json;
          provider?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          user_id?: string;
          content?: string;
          segments?: Json;
          provider?: string | null;
          created_at?: string;
        };
      }>;
      summaries: Table<{
        Row: {
          id: string;
          meeting_id: string;
          user_id: string;
          executive_summary: string;
          key_points: Json;
          decisions: Json;
          risks: Json;
          follow_ups: Json;
          sentiment_score: number | null;
          sentiment_label: string | null;
          sentiment_description: string | null;
          raw_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id: string;
          executive_summary?: string;
          key_points?: Json;
          decisions?: Json;
          risks?: Json;
          follow_ups?: Json;
          sentiment_score?: number | null;
          sentiment_label?: string | null;
          sentiment_description?: string | null;
          raw_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          user_id?: string;
          executive_summary?: string;
          key_points?: Json;
          decisions?: Json;
          risks?: Json;
          follow_ups?: Json;
          sentiment_score?: number | null;
          sentiment_label?: string | null;
          sentiment_description?: string | null;
          raw_json?: Json;
          created_at?: string;
        };
      }>;
      action_items: Table<{
        Row: {
          id: string;
          meeting_id: string;
          user_id: string;
          title: string;
          assignee: string | null;
          due_date: string | null;
          priority: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id: string;
          title: string;
          assignee?: string | null;
          due_date?: string | null;
          priority?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          user_id?: string;
          title?: string;
          assignee?: string | null;
          due_date?: string | null;
          priority?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      }>;
      interviews: Table<{
        Row: {
          id: string;
          user_id: string;
          role_type: string;
          mode: string;
          confidence_score: number | null;
          technical_score: number | null;
          communication_score: number | null;
          speaking_speed: number | null;
          filler_words: number | null;
          questions: Json;
          answers: Json;
          feedback: Json;
          suggestions: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_type: string;
          mode?: string;
          confidence_score?: number | null;
          technical_score?: number | null;
          communication_score?: number | null;
          speaking_speed?: number | null;
          filler_words?: number | null;
          questions?: Json;
          answers?: Json;
          feedback?: Json;
          suggestions?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_type?: string;
          mode?: string;
          confidence_score?: number | null;
          technical_score?: number | null;
          communication_score?: number | null;
          speaking_speed?: number | null;
          filler_words?: number | null;
          questions?: Json;
          answers?: Json;
          feedback?: Json;
          suggestions?: Json;
          created_at?: string;
        };
      }>;
      resume_uploads: Table<{
        Row: {
          id: string;
          user_id: string;
          file_url: string | null;
          file_name: string | null;
          score: number | null;
          skills: Json;
          missing_skills: Json;
          interview_questions: Json;
          suggestions: Json;
          analysis_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url?: string | null;
          file_name?: string | null;
          score?: number | null;
          skills?: Json;
          missing_skills?: Json;
          interview_questions?: Json;
          suggestions?: Json;
          analysis_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_url?: string | null;
          file_name?: string | null;
          score?: number | null;
          skills?: Json;
          missing_skills?: Json;
          interview_questions?: Json;
          suggestions?: Json;
          analysis_json?: Json;
          created_at?: string;
        };
      }>;
      chat_messages: Table<{
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          meeting_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          meeting_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          content?: string;
          meeting_id?: string | null;
          created_at?: string;
        };
      }>;
      subscriptions: Table<{
        Row: {
          id: string;
          user_id: string;
          plan: string;
          revenuecat_id: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          revenuecat_id?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          revenuecat_id?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      }>;
      notifications: Table<{
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read: boolean;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
