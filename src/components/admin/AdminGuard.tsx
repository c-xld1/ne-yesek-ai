import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user, authLoading]);

  const checkAdminAccess = async () => {
    if (authLoading) return;

    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Admin paneline erişmek için lütfen giriş yapın.",
        variant: "destructive",
      });
      navigate("/giris-yap");
      return;
    }

    console.log("=".repeat(60));
    console.log("🔑 ADMIN YETKİ KONTROLÜ");
    console.log("=".repeat(60));
    console.log("👤 User ID:", user.id);

    // Check admin role using server-side RLS
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (error || !data) {
      console.log("❌ Admin rolü bulunamadı:", error?.message);
      console.log("\n📝 Admin rolü eklemek için Supabase SQL Editor'da:");
      console.log(`INSERT INTO user_roles (user_id, role) VALUES ('${user.id}', 'admin') ON CONFLICT (user_id, role) DO NOTHING;`);
      console.log("=".repeat(60));
      
      // Security fix: No longer allow development mode bypass in production
      // Only allow bypass in true local development (localhost)
      const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      
      if (import.meta.env.DEV && isLocalhost) {
        console.log("⚠️ Local development: Erişim izni veriliyor");
        setIsAdmin(true);
        setChecking(false);
        
        toast({
          title: "Geliştirici Modu (Localhost)",
          description: "Admin rolü yok ama localhost'ta erişim sağlandı.",
          variant: "default",
        });
        return;
      }
      
      // In production or non-localhost, deny access
      toast({
        title: "Erişim Reddedildi",
        description: "Bu sayfaya erişim yetkiniz yok.",
        variant: "destructive",
      });
      navigate("/");
      setChecking(false);
      return;
    }

    console.log("✅ Admin yetkisi doğrulandı!");
    console.log("=".repeat(60));
    setIsAdmin(true);
    setChecking(false);
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Yetki kontrol ediliyor..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;
