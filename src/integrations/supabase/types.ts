export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            affiliate_links: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    url: string;
                    affiliate_url: string;
                    image_url: string | null;
                    category: string | null;
                    commission_rate: number | null;
                    commission_type: string | null;
                    click_count: number | null;
                    conversion_count: number | null;
                    revenue: number | null;
                    is_active: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    url: string;
                    affiliate_url: string;
                    image_url?: string | null;
                    category?: string | null;
                    commission_rate?: number | null;
                    commission_type?: string | null;
                    click_count?: number | null;
                    conversion_count?: number | null;
                    revenue?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    url?: string;
                    affiliate_url?: string;
                    image_url?: string | null;
                    category?: string | null;
                    commission_rate?: number | null;
                    commission_type?: string | null;
                    click_count?: number | null;
                    conversion_count?: number | null;
                    revenue?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            answers: {
                Row: {
                    id: string;
                    content: string;
                    author_id: string;
                    question_id: string;
                    upvotes: number | null;
                    downvotes: number | null;
                    is_accepted: boolean | null;
                    is_flagged: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    content: string;
                    author_id: string;
                    question_id: string;
                    upvotes?: number | null;
                    downvotes?: number | null;
                    is_accepted?: boolean | null;
                    is_flagged?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    content?: string;
                    author_id?: string;
                    question_id?: string;
                    upvotes?: number | null;
                    downvotes?: number | null;
                    is_accepted?: boolean | null;
                    is_flagged?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "answers_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "answers_question_id_fkey";
                        columns: ["question_id"];
                        referencedRelation: "questions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            blog_posts: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    excerpt: string | null;
                    content: string;
                    featured_image: string | null;
                    author_id: string | null;
                    category_id: string | null;
                    meta_title: string | null;
                    meta_description: string | null;
                    tags: string[] | null;
                    views: number | null;
                    likes_count: number | null;
                    comments_count: number | null;
                    shares_count: number | null;
                    status: string | null;
                    is_featured: boolean | null;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    slug: string;
                    excerpt?: string | null;
                    content: string;
                    featured_image?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    meta_title?: string | null;
                    meta_description?: string | null;
                    tags?: string[] | null;
                    views?: number | null;
                    likes_count?: number | null;
                    comments_count?: number | null;
                    shares_count?: number | null;
                    status?: string | null;
                    is_featured?: boolean | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    slug?: string;
                    excerpt?: string | null;
                    content?: string;
                    featured_image?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    meta_title?: string | null;
                    meta_description?: string | null;
                    tags?: string[] | null;
                    views?: number | null;
                    likes_count?: number | null;
                    comments_count?: number | null;
                    shares_count?: number | null;
                    status?: string | null;
                    is_featured?: boolean | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "blog_posts_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "blog_posts_category_id_fkey";
                        columns: ["category_id"];
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    color: string | null;
                    sort_order: number | null;
                    is_active: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    color?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    color?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            comments: {
                Row: {
                    id: string;
                    content: string;
                    author_id: string;
                    recipe_id: string;
                    parent_comment_id: string | null;
                    likes_count: number | null;
                    replies_count: number | null;
                    is_approved: boolean | null;
                    is_flagged: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    content: string;
                    author_id: string;
                    recipe_id: string;
                    parent_comment_id?: string | null;
                    likes_count?: number | null;
                    replies_count?: number | null;
                    is_approved?: boolean | null;
                    is_flagged?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    content?: string;
                    author_id?: string;
                    recipe_id?: string;
                    parent_comment_id?: string | null;
                    likes_count?: number | null;
                    replies_count?: number | null;
                    is_approved?: boolean | null;
                    is_flagged?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "comments_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_parent_comment_id_fkey";
                        columns: ["parent_comment_id"];
                        referencedRelation: "comments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    }
                ];
            };
            favorites: {
                Row: {
                    id: string;
                    user_id: string;
                    recipe_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipe_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    recipe_id?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "favorites_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "favorites_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            follows: {
                Row: {
                    id: string;
                    follower_id: string;
                    following_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    follower_id: string;
                    following_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    follower_id?: string;
                    following_id?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "follows_follower_id_fkey";
                        columns: ["follower_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "follows_following_id_fkey";
                        columns: ["following_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            likes: {
                Row: {
                    id: string;
                    user_id: string;
                    recipe_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipe_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    recipe_id?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "likes_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "likes_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    type: string;
                    title: string;
                    message: string | null;
                    data: Json | null;
                    related_user_id: string | null;
                    related_recipe_id: string | null;
                    related_comment_id: string | null;
                    is_read: boolean | null;
                    is_sent: boolean | null;
                    created_at: string;
                    read_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    type: string;
                    title: string;
                    message?: string | null;
                    data?: Json | null;
                    related_user_id?: string | null;
                    related_recipe_id?: string | null;
                    related_comment_id?: string | null;
                    is_read?: boolean | null;
                    is_sent?: boolean | null;
                    created_at?: string;
                    read_at?: string | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    type?: string;
                    title?: string;
                    message?: string | null;
                    data?: Json | null;
                    related_user_id?: string | null;
                    related_recipe_id?: string | null;
                    related_comment_id?: string | null;
                    is_read?: boolean | null;
                    is_sent?: boolean | null;
                    created_at?: string;
                    read_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "notifications_related_comment_id_fkey";
                        columns: ["related_comment_id"];
                        referencedRelation: "comments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "notifications_related_recipe_id_fkey";
                        columns: ["related_recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "notifications_related_user_id_fkey";
                        columns: ["related_user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "notifications_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    fullname: string | null;
                    bio: string | null;
                    avatar_url: string | null;
                    website: string | null;
                    location: string | null;
                    birth_date: string | null;
                    gender: string | null;
                    phone: string | null;
                    is_premium: boolean | null;
                    premium_expires_at: string | null;
                    is_verified: boolean | null;
                    is_active: boolean | null;
                    follower_count: number | null;
                    following_count: number | null;
                    recipe_count: number | null;
                    total_likes: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    fullname?: string | null;
                    bio?: string | null;
                    avatar_url?: string | null;
                    website?: string | null;
                    location?: string | null;
                    birth_date?: string | null;
                    gender?: string | null;
                    phone?: string | null;
                    is_premium?: boolean | null;
                    premium_expires_at?: string | null;
                    is_verified?: boolean | null;
                    is_active?: boolean | null;
                    follower_count?: number | null;
                    following_count?: number | null;
                    recipe_count?: number | null;
                    total_likes?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    username?: string;
                    fullname?: string | null;
                    bio?: string | null;
                    avatar_url?: string | null;
                    website?: string | null;
                    location?: string | null;
                    birth_date?: string | null;
                    gender?: string | null;
                    phone?: string | null;
                    is_premium?: boolean | null;
                    premium_expires_at?: string | null;
                    is_verified?: boolean | null;
                    is_active?: boolean | null;
                    follower_count?: number | null;
                    following_count?: number | null;
                    recipe_count?: number | null;
                    total_likes?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey";
                        columns: ["id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            qna_categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    color: string | null;
                    icon: string | null;
                    sort_order: number | null;
                    is_active: boolean | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    color?: string | null;
                    icon?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    color?: string | null;
                    icon?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            questions: {
                Row: {
                    id: string;
                    title: string;
                    content: string;
                    author_id: string;
                    category_id: string | null;
                    tags: string[] | null;
                    views: number | null;
                    upvotes: number | null;
                    downvotes: number | null;
                    answers_count: number | null;
                    is_solved: boolean | null;
                    is_featured: boolean | null;
                    is_closed: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    content: string;
                    author_id: string;
                    category_id?: string | null;
                    tags?: string[] | null;
                    views?: number | null;
                    upvotes?: number | null;
                    downvotes?: number | null;
                    answers_count?: number | null;
                    is_solved?: boolean | null;
                    is_featured?: boolean | null;
                    is_closed?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    content?: string;
                    author_id?: string;
                    category_id?: string | null;
                    tags?: string[] | null;
                    views?: number | null;
                    upvotes?: number | null;
                    downvotes?: number | null;
                    answers_count?: number | null;
                    is_solved?: boolean | null;
                    is_featured?: boolean | null;
                    is_closed?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "questions_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "questions_category_id_fkey";
                        columns: ["category_id"];
                        referencedRelation: "qna_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            ratings: {
                Row: {
                    id: string;
                    user_id: string;
                    recipe_id: string;
                    rating: number;
                    review: string | null;
                    helpful_count: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    recipe_id: string;
                    rating: number;
                    review?: string | null;
                    helpful_count?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    recipe_id?: string;
                    rating?: number;
                    review?: string | null;
                    helpful_count?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "ratings_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "ratings_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            recipes: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string | null;
                    content: string | null;
                    image_url: string | null;
                    video_url: string | null;
                    author_id: string | null;
                    category_id: string | null;
                    regional_category_id: string | null;
                    prep_time: number | null;
                    cooking_time: number | null;
                    total_time: number | null;
                    servings: number | null;
                    difficulty: string | null;
                    ingredients: Json | null;
                    instructions: Json | null;
                    nutritional_info: Json | null;
                    tags: string[] | null;
                    cuisine_type: string | null;
                    meal_type: string | null;
                    dietary_preferences: string[] | null;
                    rating: number | null;
                    rating_count: number | null;
                    views: number | null;
                    likes_count: number | null;
                    comments_count: number | null;
                    saves_count: number | null;
                    shares_count: number | null;
                    is_featured: boolean | null;
                    is_published: boolean | null;
                    is_premium: boolean | null;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    slug: string;
                    description?: string | null;
                    content?: string | null;
                    image_url?: string | null;
                    video_url?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    regional_category_id?: string | null;
                    prep_time?: number | null;
                    cooking_time?: number | null;
                    servings?: number | null;
                    difficulty?: string | null;
                    ingredients?: Json | null;
                    instructions?: Json | null;
                    nutritional_info?: Json | null;
                    tags?: string[] | null;
                    cuisine_type?: string | null;
                    meal_type?: string | null;
                    dietary_preferences?: string[] | null;
                    rating?: number | null;
                    rating_count?: number | null;
                    views?: number | null;
                    likes_count?: number | null;
                    comments_count?: number | null;
                    saves_count?: number | null;
                    shares_count?: number | null;
                    is_featured?: boolean | null;
                    is_published?: boolean | null;
                    is_premium?: boolean | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    slug?: string;
                    description?: string | null;
                    content?: string | null;
                    image_url?: string | null;
                    video_url?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    regional_category_id?: string | null;
                    prep_time?: number | null;
                    cooking_time?: number | null;
                    servings?: number | null;
                    difficulty?: string | null;
                    ingredients?: Json | null;
                    instructions?: Json | null;
                    nutritional_info?: Json | null;
                    tags?: string[] | null;
                    cuisine_type?: string | null;
                    meal_type?: string | null;
                    dietary_preferences?: string[] | null;
                    rating?: number | null;
                    rating_count?: number | null;
                    views?: number | null;
                    likes_count?: number | null;
                    comments_count?: number | null;
                    saves_count?: number | null;
                    shares_count?: number | null;
                    is_featured?: boolean | null;
                    is_published?: boolean | null;
                    is_premium?: boolean | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "recipes_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "recipes_category_id_fkey";
                        columns: ["category_id"];
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "recipes_regional_category_id_fkey";
                        columns: ["regional_category_id"];
                        referencedRelation: "regional_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            regional_categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    region: string;
                    description: string | null;
                    latitude: number | null;
                    longitude: number | null;
                    image_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    region: string;
                    description?: string | null;
                    latitude?: number | null;
                    longitude?: number | null;
                    image_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    region?: string;
                    description?: string | null;
                    latitude?: number | null;
                    longitude?: number | null;
                    image_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            shopping_list_items: {
                Row: {
                    id: string;
                    shopping_list_id: string;
                    recipe_id: string | null;
                    ingredient_name: string;
                    amount: string | null;
                    unit: string | null;
                    category: string | null;
                    is_checked: boolean | null;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    shopping_list_id: string;
                    recipe_id?: string | null;
                    ingredient_name: string;
                    amount?: string | null;
                    unit?: string | null;
                    category?: string | null;
                    is_checked?: boolean | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    shopping_list_id?: string;
                    recipe_id?: string | null;
                    ingredient_name?: string;
                    amount?: string | null;
                    unit?: string | null;
                    category?: string | null;
                    is_checked?: boolean | null;
                    notes?: string | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "shopping_list_items_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "shopping_list_items_shopping_list_id_fkey";
                        columns: ["shopping_list_id"];
                        referencedRelation: "shopping_lists";
                        referencedColumns: ["id"];
                    }
                ];
            };
            shopping_lists: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    is_default: boolean | null;
                    is_shared: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    is_default?: boolean | null;
                    is_shared?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    is_default?: boolean | null;
                    is_shared?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "shopping_lists_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            video_stories: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    video_url: string;
                    thumbnail_url: string | null;
                    author_id: string | null;
                    recipe_id: string | null;
                    duration: number | null;
                    quality: string | null;
                    aspect_ratio: string | null;
                    views: number | null;
                    likes: number | null;
                    comments_count: number | null;
                    shares_count: number | null;
                    is_featured: boolean | null;
                    is_active: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    video_url: string;
                    thumbnail_url?: string | null;
                    author_id?: string | null;
                    recipe_id?: string | null;
                    duration?: number | null;
                    quality?: string | null;
                    aspect_ratio?: string | null;
                    views?: number | null;
                    likes?: number | null;
                    comments_count?: number | null;
                    shares_count?: number | null;
                    is_featured?: boolean | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    video_url?: string;
                    thumbnail_url?: string | null;
                    author_id?: string | null;
                    recipe_id?: string | null;
                    duration?: number | null;
                    quality?: string | null;
                    aspect_ratio?: string | null;
                    views?: number | null;
                    likes?: number | null;
                    comments_count?: number | null;
                    shares_count?: number | null;
                    is_featured?: boolean | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "video_stories_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "video_stories_recipe_id_fkey";
                        columns: ["recipe_id"];
                        referencedRelation: "recipes";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            popular_recipes_weekly: {
                Row: {
                    author_id: string | null;
                    author_username: string | null;
                    category_id: string | null;
                    category_name: string | null;
                    comments_count: number | null;
                    content: string | null;
                    cooking_time: number | null;
                    created_at: string;
                    cuisine_type: string | null;
                    description: string | null;
                    dietary_preferences: string[] | null;
                    difficulty: string | null;
                    id: string;
                    image_url: string | null;
                    ingredients: Json | null;
                    instructions: Json | null;
                    is_featured: boolean | null;
                    is_premium: boolean | null;
                    is_published: boolean | null;
                    likes_count: number | null;
                    meal_type: string | null;
                    nutritional_info: Json | null;
                    popularity_score: number | null;
                    prep_time: number | null;
                    published_at: string | null;
                    rating: number | null;
                    rating_count: number | null;
                    regional_category_id: string | null;
                    saves_count: number | null;
                    servings: number | null;
                    shares_count: number | null;
                    slug: string;
                    tags: string[] | null;
                    title: string;
                    total_time: number | null;
                    updated_at: string;
                    video_url: string | null;
                    views: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "recipes_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "recipes_category_id_fkey";
                        columns: ["category_id"];
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "recipes_regional_category_id_fkey";
                        columns: ["regional_category_id"];
                        referencedRelation: "regional_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            recipe_analytics: {
                Row: {
                    author_id: string | null;
                    author_username: string | null;
                    category_id: string | null;
                    category_name: string | null;
                    comments_count: number | null;
                    created_at: string;
                    created_date: string | null;
                    created_month: string | null;
                    created_week: string | null;
                    id: string;
                    likes_count: number | null;
                    rating: number | null;
                    rating_count: number | null;
                    saves_count: number | null;
                    title: string;
                    views: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "recipes_author_id_fkey";
                        columns: ["author_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "recipes_category_id_fkey";
                        columns: ["category_id"];
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_activity_summary: {
                Row: {
                    average_rating_given: number | null;
                    follower_count: number | null;
                    following_count: number | null;
                    joined_date: string;
                    total_comments: number | null;
                    total_likes_given: number | null;
                    total_ratings_given: number | null;
                    total_recipe_likes_received: number | null;
                    total_recipe_views: number | null;
                    total_recipes: number | null;
                    user_id: string;
                    username: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Functions: {
            get_popular_recipes: {
                Args: {
                    time_period?: string;
                    limit_count?: number;
                };
                Returns: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string;
                    image_url: string;
                    cooking_time: number;
                    difficulty: string;
                    rating: number;
                    views: number;
                    likes_count: number;
                    author_username: string;
                    category_name: string;
                }[];
            };
            get_recipe_recommendations: {
                Args: {
                    user_id: string;
                    limit_count?: number;
                };
                Returns: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string;
                    image_url: string;
                    cooking_time: number;
                    difficulty: string;
                    rating: number;
                    views: number;
                    likes_count: number;
                    author_username: string;
                    category_name: string;
                    recommendation_score: number;
                }[];
            };
            get_recipe_stats: {
                Args: {
                    recipe_id: string;
                };
                Returns: Json;
            };
            get_trending_tags: {
                Args: {
                    limit_count?: number;
                };
                Returns: {
                    tag: string;
                    count: number;
                }[];
            };
            get_user_activity_feed: {
                Args: {
                    user_id: string;
                    limit_count?: number;
                    offset_count?: number;
                };
                Returns: {
                    id: string;
                    type: string;
                    title: string;
                    content: string;
                    image_url: string;
                    author_username: string;
                    author_avatar_url: string;
                    created_at: string;
                    related_data: Json;
                }[];
            };
            increment_recipe_views: {
                Args: {
                    recipe_id: string;
                };
                Returns: undefined;
            };
            refresh_recipe_search_index: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            search_recipes: {
                Args: {
                    search_term: string;
                    category_filter?: string;
                    difficulty_filter?: string;
                    max_cooking_time?: number;
                    min_rating?: number;
                    limit_count?: number;
                    offset_count?: number;
                };
                Returns: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string;
                    image_url: string;
                    cooking_time: number;
                    difficulty: string;
                    rating: number;
                    views: number;
                    likes_count: number;
                    author_username: string;
                    category_name: string;
                    rank: number;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
