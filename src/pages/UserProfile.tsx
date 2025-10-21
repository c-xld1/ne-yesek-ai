import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ChefHat, MessageSquare, DollarSign, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isChef, setIsChef] = useState(false);
  const [stats, setStats] = useState({
    recipes: 0,
    favorites: 0,
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }

    fetchProfile();
    fetchStats();
    checkChefStatus();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchStats = async () => {
    const [recipes, favorites, followers, following] = await Promise.all([
      supabase.from('recipes').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('recipe_favorites').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('follows').select('id', { count: 'exact' }).eq('following_id', user?.id),
      supabase.from('follows').select('id', { count: 'exact' }).eq('follower_id', user?.id),
    ]);

    setStats({
      recipes: recipes.count || 0,
      favorites: favorites.count || 0,
      followers: followers.count || 0,
      following: following.count || 0,
    });
  };

  const checkChefStatus = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .eq('role', 'chef')
      .single();

    setIsChef(!!data);
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız",
    });
    navigate("/");
  };

  if (!profile) return <div>Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} alt={profile.fullname} />
              <AvatarFallback>{profile.fullname?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.fullname}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
                {profile.bio && <p className="mt-2">{profile.bio}</p>}
              </div>

              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold">{stats.recipes}</div>
                  <div className="text-muted-foreground">Tarif</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{stats.followers}</div>
                  <div className="text-muted-foreground">Takipçi</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{stats.following}</div>
                  <div className="text-muted-foreground">Takip</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{stats.favorites}</div>
                  <div className="text-muted-foreground">Favori</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/profil/duzenle")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Profili Düzenle
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="recipes">
              <ChefHat className="h-4 w-4 mr-2" />
              Tariflerim
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favoriler
            </TabsTrigger>
            {isChef && (
              <TabsTrigger value="earnings">
                <DollarSign className="h-4 w-4 mr-2" />
                Kazançlar
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="recipes" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Henüz tarif paylaşmadınız
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Henüz favori tarifiniz yok
            </div>
          </TabsContent>

          {isChef && (
            <TabsContent value="earnings" className="mt-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Kazanç Özeti</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Satış</span>
                    <span className="font-semibold">₺0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bu Ay</span>
                    <span className="font-semibold">₺0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bekleyen Ödemeler</span>
                    <span className="font-semibold">₺0</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default UserProfile;
