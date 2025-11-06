import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DebugUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(10);

      console.log("=== ALL PROFILES IN DATABASE ===");
      console.log("Profiles:", data);
      console.log("Error:", error);
      console.log("=== CURRENT USER ===");
      console.log("User:", user);
    };

    checkProfiles();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Giriş Gerekli</CardTitle>
            <CardDescription>Kullanıcı bilgilerini görmek için giriş yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/giris-yap")}>Giriş Yap</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Kullanıcı Debug Bilgileri</CardTitle>
            <CardDescription>
              Konsolu açın (F12) ve daha detaylı bilgileri görün
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔗 Profil Linki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.username ? (
              <>
                <p className="text-green-600 font-medium">
                  ✅ Username mevcut: <span className="font-bold">{user.username}</span>
                </p>
                <Button onClick={() => navigate(`/profil/${user.username}`)}>
                  Profilime Git
                </Button>
              </>
            ) : (
              <>
                <p className="text-red-600 font-medium">
                  ❌ Username bulunamadı! Lütfen ayarlar sayfasından kullanıcı adınızı belirleyin.
                </p>
                <Button onClick={() => navigate("/ayarlar")}>
                  Ayarlara Git
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Database Profiller</CardTitle>
            <CardDescription>
              Konsola (F12) bakın, tüm profiller listelendi
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DebugUser;
