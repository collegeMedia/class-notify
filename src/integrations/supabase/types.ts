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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          department: Database["public"]["Enums"]["department_type"] | null
          id: string
          important: boolean | null
          semester: Database["public"]["Enums"]["semester_type"] | null
          title: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          id?: string
          important?: boolean | null
          semester?: Database["public"]["Enums"]["semester_type"] | null
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          id?: string
          important?: boolean | null
          semester?: Database["public"]["Enums"]["semester_type"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          attachments: string[] | null
          author_id: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          description: string
          due_date: string
          id: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject: string
          title: string
        }
        Insert: {
          attachments?: string[] | null
          author_id?: string | null
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          description: string
          due_date: string
          id?: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject: string
          title: string
        }
        Update: {
          attachments?: string[] | null
          author_id?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          description?: string
          due_date?: string
          id?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          subject?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_groups_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_groups_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          created_at: string
          date: string
          department: Database["public"]["Enums"]["department_type"]
          description: string
          end_time: string
          id: string
          location: string
          materials: string[] | null
          professor_id: string | null
          semester: Database["public"]["Enums"]["semester_type"]
          start_time: string
          subject: string
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          department: Database["public"]["Enums"]["department_type"]
          description: string
          end_time: string
          id?: string
          location: string
          materials?: string[] | null
          professor_id?: string | null
          semester: Database["public"]["Enums"]["semester_type"]
          start_time: string
          subject: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          department?: Database["public"]["Enums"]["department_type"]
          description?: string
          end_time?: string
          id?: string
          location?: string
          materials?: string[] | null
          professor_id?: string | null
          semester?: Database["public"]["Enums"]["semester_type"]
          start_time?: string
          subject?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lectures_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_group_id: string | null
          content: string
          created_at: string
          id: string
          sender_id: string | null
        }
        Insert: {
          chat_group_id?: string | null
          content: string
          created_at?: string
          id?: string
          sender_id?: string | null
        }
        Update: {
          chat_group_id?: string | null
          content?: string
          created_at?: string
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_group_id_fkey"
            columns: ["chat_group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"] | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          semester: Database["public"]["Enums"]["semester_type"] | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          semester?: Database["public"]["Enums"]["semester_type"] | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          semester?: Database["public"]["Enums"]["semester_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          credits: number | null
          department: Database["public"]["Enums"]["department_type"]
          description: string | null
          id: string
          name: string
          prerequisites: string[] | null
          professor_id: string | null
          semester: Database["public"]["Enums"]["semester_type"]
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number | null
          department: Database["public"]["Enums"]["department_type"]
          description?: string | null
          id?: string
          name: string
          prerequisites?: string[] | null
          professor_id?: string | null
          semester: Database["public"]["Enums"]["semester_type"]
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number | null
          department?: Database["public"]["Enums"]["department_type"]
          description?: string | null
          id?: string
          name?: string
          prerequisites?: string[] | null
          professor_id?: string | null
          semester?: Database["public"]["Enums"]["semester_type"]
        }
        Relationships: [
          {
            foreignKeyName: "subjects_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "department_admin" | "teacher" | "student"
      department_type:
        | "Computer Science"
        | "Electrical Engineering"
        | "Mechanical Engineering"
        | "Biology"
        | "Chemistry"
        | "Mathematics"
        | "Physics"
        | "Business"
        | "Economics"
        | "Psychology"
      semester_type: "Fall 2023" | "Spring 2024" | "Summer 2024" | "Fall 2024"
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
      app_role: ["admin", "department_admin", "teacher", "student"],
      department_type: [
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Biology",
        "Chemistry",
        "Mathematics",
        "Physics",
        "Business",
        "Economics",
        "Psychology",
      ],
      semester_type: ["Fall 2023", "Spring 2024", "Summer 2024", "Fall 2024"],
    },
  },
} as const
