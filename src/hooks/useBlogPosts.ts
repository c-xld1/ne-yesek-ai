import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  category: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  tags: string[];
}

// Fetch all blog posts
export const useBlogPosts = (category?: string, featured?: boolean) => {
  return useQuery({
    queryKey: ["blog-posts", category, featured],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          profiles!blog_posts_author_id_fkey(
            username,
            fullname,
            avatar_url
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (category && category !== "Tümü") {
        query = query.eq("category", category);
      }

      if (featured !== undefined) {
        query = query.eq("featured", featured);
      }

      const { data, error }: any = await query;

      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }

      return (data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image_url || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
        author: {
          name: post.profiles?.fullname || post.profiles?.username || "Anonim",
          avatar: post.profiles?.avatar_url || "",
          username: post.profiles?.username || "",
        },
        category: post.category,
        date: new Date(post.created_at).toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: `${post.read_time} dk`,
        views: post.view_count || 0,
        likes: post.like_count || 0,
        comments: post.comment_count || 0,
        featured: post.featured || false,
        tags: post.tags || [],
      }));
    },
  });
};

// Fetch single blog post by slug
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error }: any = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles!blog_posts_author_id_fkey(
            username,
            fullname,
            avatar_url
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }

      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image_url || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
        author: {
          name: data.profiles?.fullname || data.profiles?.username || "Anonim",
          avatar: data.profiles?.avatar_url || "",
          username: data.profiles?.username || "",
        },
        category: data.category,
        date: new Date(data.created_at).toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: `${data.read_time} dk`,
        views: data.view_count || 0,
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        featured: data.featured || false,
        tags: data.tags || [],
      };
    },
    enabled: !!slug,
  });
};

// Like a blog post
export const useLikeBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Check if already liked
      const { data: existingLike }: any = await supabase
        .from("blog_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("blog_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);

        if (error) throw error;
        return { liked: false };
      } else {
        // Like
        const { error } = await supabase
          .from("blog_likes")
          .insert({ user_id: user.id, post_id: postId });

        if (error) throw error;
        return { liked: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
    },
  });
};

// Create blog post (for authors)
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      excerpt: string;
      content: string;
      category: string;
      image_url?: string;
      tags?: string[];
      featured?: boolean;
      published?: boolean;
    }) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Generate slug from title
      const slug = post.title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Calculate read time (rough estimate: 200 words per minute)
      const wordCount = post.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const { data, error }: any = await supabase
        .from("blog_posts")
        .insert({
          ...post,
          slug,
          author_id: user.id,
          read_time: readTime,
          published_at: post.published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};

// Get blog post comments
export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ["blog-comments", postId],
    queryFn: async () => {
      const { data, error }: any = await supabase
        .from("blog_comments")
        .select(`
          *,
          profiles!blog_comments_user_id_fkey(
            username,
            fullname,
            avatar_url
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog comments:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!postId,
  });
};
