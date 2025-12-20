import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'recipe' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  time: string;
  avatar?: string;
  data?: any;
  relatedUserId?: string;
  relatedRecipeId?: string;
  createdAt: string;
}

// Fetch all notifications for current user
export const useNotifications = (type?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", user?.id, type],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      let query = supabase
        .from("notifications")
        .select(`
          *,
          related_user:profiles!notifications_related_user_id_fkey(
            username,
            fullname,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (type && type !== 'all') {
        query = query.eq("type", type);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      return (data || []).map((notification: any) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.is_read, // Fixed: use is_read from database
        time: formatTimeAgo(notification.created_at),
        avatar: notification.related_user?.avatar_url,
        data: notification.data,
        relatedUserId: notification.related_user_id,
        relatedRecipeId: notification.related_recipe_id,
        createdAt: notification.created_at,
      }));
    },
    enabled: !!user?.id,
  });
};

// Get unread notification count
export const useUnreadNotificationCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unread-notifications-count", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return 0;
      }

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false); // Fixed: use is_read column

      if (error) {
        console.error("Error fetching unread count:", error);
        throw error;
      }

      return count || 0;
    },
    enabled: !!user?.id,
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });
};

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Az önce";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika önce`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} gün önce`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} hafta önce`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} ay önce`;
  return `${Math.floor(seconds / 31536000)} yıl önce`;
}
