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
      achievement_definitions: {
        Row: {
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          key: string
          order_index: number | null
          points: number | null
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          key: string
          order_index?: number | null
          points?: number | null
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          key?: string
          order_index?: number | null
          points?: number | null
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          chef_id: string | null
          created_at: string | null
          factors: Json | null
          id: string
          is_clicked: boolean | null
          is_shown: boolean | null
          reason: string
          recommendation_type: string
          score: number | null
          user_id: string | null
        }
        Insert: {
          chef_id?: string | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          is_clicked?: boolean | null
          is_shown?: boolean | null
          reason: string
          recommendation_type: string
          score?: number | null
          user_id?: string | null
        }
        Update: {
          chef_id?: string | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          is_clicked?: boolean | null
          is_shown?: boolean | null
          reason?: string
          recommendation_type?: string
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      blog_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          comment_count: number | null
          content: string
          created_at: string | null
          excerpt: string
          featured: boolean | null
          id: string
          image_url: string | null
          like_count: number | null
          published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          comment_count?: number | null
          content: string
          created_at?: string | null
          excerpt: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          comment_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
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
      chef_applications: {
        Row: {
          address: string
          admin_notes: string | null
          business_description: string | null
          city: string
          created_at: string | null
          cuisine_type: string
          district: string | null
          experience_years: number | null
          fullname: string
          id: string
          identity_document_url: string | null
          phone: string
          residence_document_url: string | null
          sample_menu: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          business_description?: string | null
          city: string
          created_at?: string | null
          cuisine_type: string
          district?: string | null
          experience_years?: number | null
          fullname: string
          id?: string
          identity_document_url?: string | null
          phone: string
          residence_document_url?: string | null
          sample_menu?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          business_description?: string | null
          city?: string
          created_at?: string | null
          cuisine_type?: string
          district?: string | null
          experience_years?: number | null
          fullname?: string
          id?: string
          identity_document_url?: string | null
          phone?: string
          residence_document_url?: string | null
          sample_menu?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      chef_availability: {
        Row: {
          chef_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
        }
        Insert: {
          chef_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
        }
        Update: {
          chef_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "chef_availability_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_earnings: {
        Row: {
          amount: number
          chef_id: string
          created_at: string | null
          id: string
          order_id: string | null
          payment_date: string | null
          status: string | null
        }
        Insert: {
          amount: number
          chef_id: string
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          chef_id?: string
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chef_earnings_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chef_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      chef_profiles: {
        Row: {
          address: string | null
          ai_status_label: string | null
          avg_prep_time: number | null
          business_name: string
          city: string | null
          commission_rate: number | null
          created_at: string | null
          current_daily_orders: number | null
          daily_order_limit: number | null
          delivery_radius: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          is_female: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          min_order_amount: number | null
          phone: string | null
          rating: number | null
          status: string | null
          total_earnings: number | null
          total_orders: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          ai_status_label?: string | null
          avg_prep_time?: number | null
          business_name: string
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          current_daily_orders?: number | null
          daily_order_limit?: number | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          is_female?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_earnings?: number | null
          total_orders?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          ai_status_label?: string | null
          avg_prep_time?: number | null
          business_name?: string
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          current_daily_orders?: number | null
          daily_order_limit?: number | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          is_female?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_amount?: number | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_earnings?: number | null
          total_orders?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courier_routes: {
        Row: {
          actual_delivery_time: string | null
          actual_pickup_time: string | null
          courier_id: string | null
          created_at: string | null
          delivery_latitude: number
          delivery_longitude: number
          distance_km: number | null
          estimated_delivery_time: string | null
          estimated_pickup_time: string | null
          id: string
          order_id: string | null
          pickup_latitude: number
          pickup_longitude: number
          route_order: number | null
          status: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          courier_id?: string | null
          created_at?: string | null
          delivery_latitude: number
          delivery_longitude: number
          distance_km?: number | null
          estimated_delivery_time?: string | null
          estimated_pickup_time?: string | null
          id?: string
          order_id?: string | null
          pickup_latitude: number
          pickup_longitude: number
          route_order?: number | null
          status?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          courier_id?: string | null
          created_at?: string | null
          delivery_latitude?: number
          delivery_longitude?: number
          distance_km?: number | null
          estimated_delivery_time?: string | null
          estimated_pickup_time?: string | null
          id?: string
          order_id?: string | null
          pickup_latitude?: number
          pickup_longitude?: number
          route_order?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courier_routes_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courier_routes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      couriers: {
        Row: {
          avatar_url: string | null
          avg_delivery_time: number | null
          created_at: string | null
          current_latitude: number | null
          current_load: number | null
          current_longitude: number | null
          fullname: string
          id: string
          is_active: boolean | null
          max_load: number | null
          phone: string
          status: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          avg_delivery_time?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_load?: number | null
          current_longitude?: number | null
          fullname: string
          id?: string
          is_active?: boolean | null
          max_load?: number | null
          phone: string
          status?: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          avg_delivery_time?: number | null
          created_at?: string | null
          current_latitude?: number | null
          current_load?: number | null
          current_longitude?: number | null
          fullname?: string
          id?: string
          is_active?: boolean | null
          max_load?: number | null
          phone?: string
          status?: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      delivery_slots: {
        Row: {
          chef_id: string | null
          created_at: string | null
          current_orders: number | null
          delivery_type: Database["public"]["Enums"]["delivery_type"] | null
          end_time: string
          id: string
          is_active: boolean | null
          max_orders: number | null
          slot_date: string
          start_time: string
        }
        Insert: {
          chef_id?: string | null
          created_at?: string | null
          current_orders?: number | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          end_time: string
          id?: string
          is_active?: boolean | null
          max_orders?: number | null
          slot_date: string
          start_time: string
        }
        Update: {
          chef_id?: string | null
          created_at?: string | null
          current_orders?: number | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          max_orders?: number | null
          slot_date?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_slots_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          ready_now: boolean | null
          ready_until: string | null
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
          ready_now?: boolean | null
          ready_until?: string | null
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
          ready_now?: boolean | null
          ready_until?: string | null
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
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          link: string | null
          message: string
          read: boolean
          related_recipe_id: string | null
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          link?: string | null
          message: string
          read?: boolean
          related_recipe_id?: string | null
          related_user_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          related_recipe_id?: string | null
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_recipe_id_fkey"
            columns: ["related_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
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
      order_status_logs: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          order_id: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          ai_assigned: boolean | null
          ai_notes: string | null
          chef_id: string
          courier_id: string | null
          created_at: string | null
          customer_id: string
          delay_risk_score: number | null
          delivery_address: string | null
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_time: string | null
          delivery_type: string
          estimated_delivery_time: string | null
          id: string
          notes: string | null
          slot_id: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          ai_assigned?: boolean | null
          ai_notes?: string | null
          chef_id: string
          courier_id?: string | null
          created_at?: string | null
          customer_id: string
          delay_risk_score?: number | null
          delivery_address?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_time?: string | null
          delivery_type: string
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          slot_id?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          ai_assigned?: boolean | null
          ai_notes?: string | null
          chef_id?: string
          courier_id?: string | null
          created_at?: string | null
          customer_id?: string
          delay_risk_score?: number | null
          delivery_address?: string | null
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_time?: string | null
          delivery_type?: string
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          slot_id?: string | null
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
          {
            foreignKeyName: "orders_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "delivery_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image: string | null
          created_at: string | null
          fullname: string
          id: string
          instagram: string | null
          location: string | null
          twitter: string | null
          updated_at: string | null
          user_group: string | null
          username: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          fullname: string
          id: string
          instagram?: string | null
          location?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_group?: string | null
          username: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          fullname?: string
          id?: string
          instagram?: string | null
          location?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_group?: string | null
          username?: string
          website?: string | null
          youtube?: string | null
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
      reviews: {
        Row: {
          chef_id: string
          comment: string | null
          created_at: string | null
          id: string
          order_id: string
          rating: number
          user_id: string
        }
        Insert: {
          chef_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          rating: number
          user_id: string
        }
        Update: {
          chef_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_orders: {
        Row: {
          chef_id: string
          created_at: string | null
          customer_id: string
          delivery_address: string | null
          id: string
          meal_description: string
          scheduled_date: string
          scheduled_time: string
          servings: number
          special_requests: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          chef_id: string
          created_at?: string | null
          customer_id: string
          delivery_address?: string | null
          id?: string
          meal_description: string
          scheduled_date: string
          scheduled_time: string
          servings?: number
          special_requests?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          chef_id?: string
          created_at?: string | null
          customer_id?: string
          delivery_address?: string | null
          id?: string
          meal_description?: string
          scheduled_date?: string
          scheduled_time?: string
          servings?: number
          special_requests?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_orders_chef_id_fkey"
            columns: ["chef_id"]
            isOneToOne: false
            referencedRelation: "chef_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          canonical_url: string | null
          changefreq: string | null
          created_at: string | null
          custom_meta: Json | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_key: string
          page_title: string
          priority: number | null
          robots_follow: boolean | null
          robots_index: boolean | null
          schema_data: Json | null
          schema_type: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          changefreq?: string | null
          created_at?: string | null
          custom_meta?: Json | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key: string
          page_title: string
          priority?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          schema_data?: Json | null
          schema_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          changefreq?: string | null
          created_at?: string | null
          custom_meta?: Json | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_key?: string
          page_title?: string
          priority?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          schema_data?: Json | null
          schema_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trust_scores: {
        Row: {
          calculated_at: string | null
          entity_id: string
          entity_type: string
          factors: Json | null
          id: string
          score: number
        }
        Insert: {
          calculated_at?: string | null
          entity_id: string
          entity_type: string
          factors?: Json | null
          id?: string
          score: number
        }
        Update: {
          calculated_at?: string | null
          entity_id?: string
          entity_type?: string
          factors?: Json | null
          id?: string
          score?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
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
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          status: string | null
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          pending_balance: number | null
          total_earned: number | null
          total_withdrawn: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_award_achievements: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_story_likes: { Args: { story_id: string }; Returns: undefined }
      increment_story_views: { Args: { story_id: string }; Returns: undefined }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "chef" | "user"
      courier_status: "available" | "busy" | "offline" | "break"
      delivery_type: "instant" | "scheduled"
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
      courier_status: ["available", "busy", "offline", "break"],
      delivery_type: ["instant", "scheduled"],
    },
  },
} as const
