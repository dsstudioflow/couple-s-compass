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
      couple_profiles: {
        Row: {
          avatar_url: string | null
          combined_income: number | null
          created_at: string | null
          id: string
          partner_email: string | null
          partner_income: number | null
          partner_name: string | null
          partner_user_id: string | null
          updated_at: string | null
          user_id: string
          user_income: number | null
          user_name: string | null
          wedding_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          combined_income?: number | null
          created_at?: string | null
          id?: string
          partner_email?: string | null
          partner_income?: number | null
          partner_name?: string | null
          partner_user_id?: string | null
          updated_at?: string | null
          user_id: string
          user_income?: number | null
          user_name?: string | null
          wedding_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          combined_income?: number | null
          created_at?: string | null
          id?: string
          partner_email?: string | null
          partner_income?: number | null
          partner_name?: string | null
          partner_user_id?: string | null
          updated_at?: string | null
          user_id?: string
          user_income?: number | null
          user_name?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      housing_config: {
        Row: {
          couple_id: string
          created_at: string | null
          down_payment: number | null
          housing_type: string | null
          id: string
          interest_rate: number | null
          loan_term_months: number | null
          property_value: number | null
          rent_amount: number | null
          updated_at: string | null
        }
        Insert: {
          couple_id: string
          created_at?: string | null
          down_payment?: number | null
          housing_type?: string | null
          id?: string
          interest_rate?: number | null
          loan_term_months?: number | null
          property_value?: number | null
          rent_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          couple_id?: string
          created_at?: string | null
          down_payment?: number | null
          housing_type?: string | null
          id?: string
          interest_rate?: number | null
          loan_term_months?: number | null
          property_value?: number | null
          rent_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "housing_config_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: true
            referencedRelation: "couple_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_savings: {
        Row: {
          actual_savings: number | null
          couple_id: string
          created_at: string | null
          id: string
          month: number
          planned_savings: number | null
          year: number
        }
        Insert: {
          actual_savings?: number | null
          couple_id: string
          created_at?: string | null
          id?: string
          month: number
          planned_savings?: number | null
          year: number
        }
        Update: {
          actual_savings?: number | null
          couple_id?: string
          created_at?: string | null
          id?: string
          month?: number
          planned_savings?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_savings_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couple_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_costs: {
        Row: {
          amount: number | null
          category: string | null
          couple_id: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          couple_id: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          couple_id?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_costs_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couple_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_costs: {
        Row: {
          actual_amount: number | null
          category: string
          couple_id: string
          created_at: string | null
          id: string
          notes: string | null
          planned_amount: number | null
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          category: string
          couple_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          category?: string
          couple_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_costs_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couple_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_couple_id: { Args: never; Returns: string }
      has_couple_access: { Args: { couple_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
