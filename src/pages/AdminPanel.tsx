import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, ChefHat, FileText, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalUsers: 0, totalChefs: 0, totalRecipes: 0, totalOrders: 0 });
  const [pendingChefs, setPendingChefs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate("/giris-yap"); return; }
    checkAdminRole();
  }, [user, navigate]);

  const checkAdminRole = async () => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user?.id).eq("role", "admin").single();
    if (!data) { navigate("/"); return; }
    fetchData();
  };

  const fetchData = async () => {
    const [u, c, r, o] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("chef_profiles").select("id", { count: "exact" }),
      supabase.from("recipes").select("id", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }),
    ]);
    setStats({ totalUsers: u.count || 0, totalChefs: c.count || 0, totalRecipes: r.count || 0, totalOrders: o.count || 0 });
    const { data } = await supabase.from("chef_profiles").select("*, profiles!chef_profiles_user_id_fkey(username, fullname, avatar_url)").eq("is_active", false);
    setPendingChefs(data || []);
  };

  const handleApprove = async (id: string, uid: string) => {
    await supabase.from("chef_profiles").update({ is_active: true }).eq("id", id);
    await supabase.from("user_roles").insert([{ user_id: uid, role: "chef" }]);
    toast({ title: "Onaylandı" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6"><Users className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-sm">Kullanıcı</p></Card>
          <Card className="p-6"><ChefHat className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalChefs}</p><p className="text-sm">Şef</p></Card>
          <Card className="p-6"><FileText className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalRecipes}</p><p className="text-sm">Tarif</p></Card>
          <Card className="p-6"><TrendingUp className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalOrders}</p><p className="text-sm">Sipariş</p></Card>
        </div>
        <Card className="p-6"><h2 className="text-xl font-semibold mb-4">Şef Onayları ({pendingChefs.length})</h2>
          {pendingChefs.map(c => (
            <div key={c.id} className="flex justify-between items-center p-4 border-b">
              <div><h3 className="font-semibold">{c.business_name}</h3><p className="text-sm text-muted-foreground">{c.profiles?.fullname}</p></div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(c.id, c.user_id)}><CheckCircle className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
