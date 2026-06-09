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
      acesso_rapido: {
        Row: {
          ativo: boolean
          created_at: string
          icon: string
          id: string
          label: string
          ordem: number
          updated_at: string
          url: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          icon?: string
          id?: string
          label: string
          ordem?: number
          updated_at?: string
          url: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          icon?: string
          id?: string
          label?: string
          ordem?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          autor: string | null
          categoria: string | null
          conteudo: string
          created_at: string
          destaque: boolean
          id: string
          imagem_url: string | null
          publicado: boolean
          publicado_em: string | null
          resumo: string | null
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          autor?: string | null
          categoria?: string | null
          conteudo: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado?: boolean
          publicado_em?: string | null
          resumo?: string | null
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          autor?: string | null
          categoria?: string | null
          conteudo?: string
          created_at?: string
          destaque?: boolean
          id?: string
          imagem_url?: string | null
          publicado?: boolean
          publicado_em?: string | null
          resumo?: string | null
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projetos_legislativos: {
        Row: {
          ano: number
          autor: string | null
          created_at: string
          data_apresentacao: string | null
          documento_url: string | null
          ementa: string
          id: string
          numero: string
          observacoes: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ano: number
          autor?: string | null
          created_at?: string
          data_apresentacao?: string | null
          documento_url?: string | null
          ementa: string
          id?: string
          numero: string
          observacoes?: string | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          autor?: string | null
          created_at?: string
          data_apresentacao?: string | null
          documento_url?: string | null
          ementa?: string
          id?: string
          numero?: string
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessoes: {
        Row: {
          ata_url: string | null
          created_at: string
          data_sessao: string
          id: string
          local: string | null
          pauta: string | null
          status: string
          tipo: string | null
          titulo: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ata_url?: string | null
          created_at?: string
          data_sessao: string
          id?: string
          local?: string | null
          pauta?: string | null
          status?: string
          tipo?: string | null
          titulo: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ata_url?: string | null
          created_at?: string
          data_sessao?: string
          id?: string
          local?: string | null
          pauta?: string | null
          status?: string
          tipo?: string | null
          titulo?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      transparencia_documentos: {
        Row: {
          ano: number | null
          arquivo_url: string | null
          categoria: string
          created_at: string
          descricao: string | null
          id: string
          mes: number | null
          publicado: boolean
          titulo: string
          updated_at: string
        }
        Insert: {
          ano?: number | null
          arquivo_url?: string | null
          categoria: string
          created_at?: string
          descricao?: string | null
          id?: string
          mes?: number | null
          publicado?: boolean
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number | null
          arquivo_url?: string | null
          categoria?: string
          created_at?: string
          descricao?: string | null
          id?: string
          mes?: number | null
          publicado?: boolean
          titulo?: string
          updated_at?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      vereadores: {
        Row: {
          ativo: boolean
          biografia: string | null
          cargo: string | null
          created_at: string
          email: string | null
          foto_url: string | null
          gabinete: string | null
          id: string
          mandato_fim: string | null
          mandato_inicio: string | null
          nome: string
          ordem: number | null
          partido: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          biografia?: string | null
          cargo?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          gabinete?: string | null
          id?: string
          mandato_fim?: string | null
          mandato_inicio?: string | null
          nome: string
          ordem?: number | null
          partido?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          biografia?: string | null
          cargo?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          gabinete?: string | null
          id?: string
          mandato_fim?: string | null
          mandato_inicio?: string | null
          nome?: string
          ordem?: number | null
          partido?: string | null
          telefone?: string | null
          updated_at?: string
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
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
