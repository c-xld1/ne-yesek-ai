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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      answer_likes: {
        Row: {
          answer_id: string | null
          created_at: string | null
          id: string
          is_like: boolean | null
          user_id: string | null
        }
        Insert: {
          answer_id?: string | null
          created_at?: string | null
          id?: string
          is_like?: boolean | null
          user_id?: string | null
        }
        Update: {
          answer_id?: string | null
          created_at?: string | null
          id?: string
          is_like?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answer_likes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          fullname: string | null
          id: string
          is_accepted: boolean | null
          is_best_answer: boolean | null
          likes: number | null
          question_id: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          fullname?: string | null
          id?: string
          is_accepted?: boolean | null
          is_best_answer?: boolean | null
          likes?: number | null
          question_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          fullname?: string | null
          id?: string
          is_accepted?: boolean | null
          is_best_answer?: boolean | null
          likes?: number | null
          question_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chef_profiles: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          created_at: string | null
          delivery_radius: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          latitude: number | null
          longitude: number | null
          min_order_amount: number | null
          phone: string | null
          rating: number | null
          total_orders: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name: string
          city?: string | null
          created_at?: string | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          phone?: string | null
          rating?: number | null
          total_orders?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          created_at?: string | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          phone?: string | null
          rating?: number | null
          total_orders?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          allergens: string[] | null
          category: string | null
          chef_id: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_available: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          preparation_time: number | null
          price: number
          servings: number | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          category?: string | null
          chef_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          servings?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          category?: string | null
          chef_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          servings?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          meal_id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_id: string
          order_id: string
          price: number
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          chef_id: string
          created_at: string | null
          customer_id: string
          delivery_address: string | null
          delivery_time: string | null
          delivery_type: string
          id: string
          notes: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          chef_id: string
          created_at?: string | null
          customer_id: string
          delivery_address?: string | null
          delivery_time?: string | null
          delivery_type: string
          id?: string
          notes?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          chef_id?: string
          created_at?: string | null
          customer_id?: string
          delivery_address?: string | null
          delivery_time?: string | null
          delivery_type?: string
          id?: string
          notes?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          fullname: string
          id: string
          updated_at: string | null
          user_group: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fullname: string
          id: string
          updated_at?: string | null
          user_group?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fullname?: string
          id?: string
          updated_at?: string | null
          user_group?: string | null
          username?: string
        }
        Relationships: []
      }
      question_likes: {
        Row: {
          created_at: string | null
          id: string
          is_like: boolean | null
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_like?: boolean | null
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_like?: boolean | null
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_likes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_views: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_views_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer_count: number | null
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          author_reputation: number | null
          category: string | null
          content: string
          created_at: string | null
          dislikes: number | null
          fullname: string | null
          id: string
          is_solved: boolean | null
          likes: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          username: string | null
          views: number | null
        }
        Insert: {
          answer_count?: number | null
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          author_reputation?: number | null
          category?: string | null
          content: string
          created_at?: string | null
          dislikes?: number | null
          fullname?: string | null
          id?: string
          is_solved?: boolean | null
          likes?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          views?: number | null
        }
        Update: {
          answer_count?: number | null
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          author_reputation?: number | null
          category?: string | null
          content?: string
          created_at?: string | null
          dislikes?: number | null
          fullname?: string | null
          id?: string
          is_solved?: boolean | null
          likes?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          recipe_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          recipe_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          recipe_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_favorites: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category_id: string | null
          content: string | null
          cook_time: number | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: Json | null
          is_draft: boolean | null
          is_featured: boolean | null
          likes: number | null
          prep_time: number | null
          rating: number | null
          servings: number | null
          title: string
          updated_at: string | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          is_draft?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          prep_time?: number | null
          rating?: number | null
          servings?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          is_draft?: boolean | null
          is_featured?: boolean | null
          likes?: number | null
          prep_time?: number | null
          rating?: number | null
          servings?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_stories: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_featured: boolean | null
          likes: number | null
          recipe_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          likes?: number | null
          recipe_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          likes?: number | null
          recipe_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_stories_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "chef" | "user"
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
      app_role: ["admin", "chef", "user"],
    },
  },
} as const
