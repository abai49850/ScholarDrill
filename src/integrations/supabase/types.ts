export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      practice_attempts: {
        Row: {
          correct_option_id: string
          created_at: string
          difficulty: number
          id: string
          is_correct: boolean
          legacy_question_id: string | null
          question_id: string | null
          selected_option_id: string | null
          subject: string
          time_spent_seconds: number
          topic: string
          user_id: string
          year_level: number
        }
        Insert: {
          correct_option_id: string
          created_at?: string
          difficulty?: number
          id?: string
          is_correct: boolean
          legacy_question_id?: string | null
          question_id?: string | null
          selected_option_id?: string | null
          subject: string
          time_spent_seconds?: number
          topic?: string
          user_id: string
          year_level: number
        }
        Update: {
          correct_option_id?: string
          created_at?: string
          difficulty?: number
          id?: string
          is_correct?: boolean
          legacy_question_id?: string | null
          question_id?: string | null
          selected_option_id?: string | null
          subject?: string
          time_spent_seconds?: number
          topic?: string
          user_id?: string
          year_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "practice_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal: number
          display_name: string
          email: string
          exam_focus: string
          id: string
          is_blocked: boolean
          region: string
          state: string | null
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
          user_id: string
          year_level: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number
          display_name?: string
          email: string
          exam_focus?: string
          id?: string
          is_blocked?: boolean
          region?: string
          state?: string | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id: string
          year_level?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal?: number
          display_name?: string
          email?: string
          exam_focus?: string
          id?: string
          is_blocked?: boolean
          region?: string
          state?: string | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id?: string
          year_level?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string
          correct_option_id: string
          created_at: string
          created_by: string | null
          difficulty: number
          exam_type: Database["public"]["Enums"]["question_exam_type"]
          explanation: string
          id: string
          is_free_sample: boolean
          legacy_id: string | null
          options: Json
          skill_tags: string[]
          source_reference: string
          status: Database["public"]["Enums"]["question_status"]
          subject: Database["public"]["Enums"]["question_subject"]
          subtopic: string
          time_limit_seconds: number
          topic: string
          updated_at: string
          year_level: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content: string
          correct_option_id: string
          created_at?: string
          created_by?: string | null
          difficulty?: number
          exam_type?: Database["public"]["Enums"]["question_exam_type"]
          explanation?: string
          id?: string
          is_free_sample?: boolean
          legacy_id?: string | null
          options: Json
          skill_tags?: string[]
          source_reference?: string
          status?: Database["public"]["Enums"]["question_status"]
          subject: Database["public"]["Enums"]["question_subject"]
          subtopic?: string
          time_limit_seconds?: number
          topic?: string
          updated_at?: string
          year_level: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          correct_option_id?: string
          created_at?: string
          created_by?: string | null
          difficulty?: number
          exam_type?: Database["public"]["Enums"]["question_exam_type"]
          explanation?: string
          id?: string
          is_free_sample?: boolean
          legacy_id?: string | null
          options?: Json
          skill_tags?: string[]
          source_reference?: string
          status?: Database["public"]["Enums"]["question_status"]
          subject?: Database["public"]["Enums"]["question_subject"]
          subtopic?: string
          time_limit_seconds?: number
          topic?: string
          updated_at?: string
          year_level?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_users: {
        Args: never
        Returns: {
          attempts_count: number
          created_at: string
          display_name: string
          email: string
          is_admin: boolean
          is_blocked: boolean
          last_active: string
          region: string
          tier: Database["public"]["Enums"]["membership_tier"]
          user_id: string
          year_level: number
        }[]
      }
      admin_set_admin: {
        Args: { _make_admin: boolean; _user_id: string }
        Returns: undefined
      }
      admin_delete_user: {
        Args: { _user_id: string }
        Returns: undefined
      }
      admin_set_user_profile: {
        Args: {
          _is_blocked?: boolean | null
          _tier?: Database["public"]["Enums"]["membership_tier"] | null
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "super_user" | "student" | "parent"
      membership_tier: "free" | "pro"
      question_exam_type: "naplan" | "selective" | "scholarship" | "general"
      question_status: "draft" | "approved"
      question_subject:
        | "maths"
        | "reading"
        | "writing"
        | "conventions"
        | "reasoning"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      membership_tier: ["free", "pro"],
      question_exam_type: ["naplan", "selective", "scholarship", "general"],
      question_status: ["draft", "approved"],
      question_subject: [
        "maths",
        "reading",
        "writing",
        "conventions",
        "reasoning",
      ],
    },
  },
} as const
