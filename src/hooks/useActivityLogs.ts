import { supabase } from "@/integrations/supabase/client";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const logActivity = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from("activity_logs").insert({
      user_id: user?.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const useActivityLogs = () => {
  const fetchLogs = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          *,
          profiles:user_id(username, fullname)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
  };

  return { fetchLogs, logActivity };
};
