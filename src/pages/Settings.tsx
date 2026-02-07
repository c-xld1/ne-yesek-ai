import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PremiumHeader from "@/components/PremiumHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Lock, Mail, Trash2, Upload } from "lucide-react";

const Settings = () => {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profile, setProfile] = useState<any>({
    fullname: "",
    username: "",
    bio: "",
    avatar_url: "",
    cover_image: "",
    website: "",
    location: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    recipeComments: true,
    newFollowers: true,
    recipeLikes: true,
    weeklyDigest: false,
    orderUpdates: true,
    promotions: false,
    systemUpdates: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    showActivity: true,
    searchEngineIndexing: true,
  });
  const [preferences, setPreferences] = useState({
    language: 'tr',
    theme: 'light',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    measurementSystem: 'metric',
  });

  useEffect(() => {
    const initializePage = async () => {
      // Auth context'in yüklenmesini bekle
      if (authLoading) {
        return; // Auth henüz yükleniyor
      }

      if (!user) {
        navigate("/giris-yap");
        return;
      }

      await fetchProfile();
      setIsInitializing(false);
    };

    initializePage();
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    console.log("Fetch profile result:", { data, error });

    if (error && error.code !== 'PGRST116') {
      console.error("Profil yükleme hatası:", error);
      return;
    }

    // Eğer profil yoksa, oluştur
    if (!data) {
      console.log("Profile not found, creating one...");
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
          fullname: user.email?.split('@')[0] || "Yeni Kullanıcı",
          bio: "",
          avatar_url: "",
          cover_image: "",
          website: "",
          location: "",
          instagram: "",
          twitter: "",
          youtube: "",
        })
        .select()
        .single();

      if (createError) {
        console.error("Profil oluşturma hatası:", createError);
        toast({
          title: "Hata",
          description: "Profil oluşturulamadı. Lütfen sayfayı yenileyin.",
          variant: "destructive",
        });
        return;
      }

      console.log("Profile created:", newProfile);
      setProfile(newProfile);
      toast({
        title: "Profil Oluşturuldu",
        description: "Profiliniz oluşturuldu. Bilgilerinizi güncelleyebilirsiniz.",
      });
    } else {
      setProfile(data);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);

    console.log("=== PROFILE UPDATE START ===");
    console.log("User ID:", user?.id);
    console.log("Current profile:", profile);
    console.log("Current username in user context:", user?.username);

    // Username validation
    if (!profile.username || profile.username.trim().length === 0) {
      setLoading(false);
      toast({
        title: "Hata",
        description: "Kullanıcı adı boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    // Username formatı kontrolü (sadece harf, rakam, alt çizgi ve tire)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(profile.username)) {
      setLoading(false);
      toast({
        title: "Hata",
        description: "Kullanıcı adı sadece harf, rakam, tire (-) ve alt çizgi (_) içerebilir.",
        variant: "destructive",
      });
      return;
    }

    // Username uzunluğu kontrolü
    if (profile.username.length < 3) {
      setLoading(false);
      toast({
        title: "Hata",
        description: "Kullanıcı adı en az 3 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    if (profile.username.length > 30) {
      setLoading(false);
      toast({
        title: "Hata",
        description: "Kullanıcı adı en fazla 30 karakter olabilir.",
        variant: "destructive",
      });
      return;
    }

    // Username değişti mi kontrol et
    const currentUsername = user?.username;
    const newUsername = profile.username;

    console.log("Username değişikliği:", { currentUsername, newUsername });

    // Eğer username değiştiyse, benzersizlik kontrolü yap
    if (currentUsername !== newUsername && newUsername) {
      console.log("Checking username uniqueness...");
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", newUsername)
        .neq("id", user?.id)
        .single();

      console.log("Uniqueness check result:", { existingUser, checkError });

      if (existingUser) {
        setLoading(false);
        toast({
          title: "Hata",
          description: "Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçin.",
          variant: "destructive",
        });
        return;
      }
    }

    console.log("Updating profile in database...");
    const updateData = {
      fullname: profile.fullname,
      username: profile.username,
      bio: profile.bio,
      cover_image: profile.cover_image,
      website: profile.website,
      location: profile.location,
      instagram: profile.instagram,
      twitter: profile.twitter,
      youtube: profile.youtube,
    };
    console.log("Update data:", updateData);

    // @ts-ignore - profiles table has dynamic columns
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData as any)
      .eq("id", user?.id)
      .select();

    console.log("Update result:", { data, error });

    setLoading(false);

    if (error) {
      toast({
        title: "Hata",
        description: `Profil güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
      console.error("Profile update error:", error);
      return;
    }

    console.log("Update successful, refreshing user context...");
    // AuthContext'teki kullanıcı bilgilerini yenile
    await refreshUser();
    console.log("User context refreshed");

    toast({
      title: "✅ Başarılı",
      description: "Profiliniz güncellendi",
    });
    console.log("=== PROFILE UPDATE END ===");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    toast({
      title: "Yükleniyor...",
      description: "Avatar yükleniyor",
    });

    // Storage bucket oluşturulmadığı için şimdilik sadece URL olarak tutuyoruz
    // Gelecekte storage bucket eklendiğinde aktif edilecek
    setProfile({ ...profile, avatar_url: URL.createObjectURL(file) });
    
    toast({
      title: "✅ Başarılı",
      description: "Avatar güncellendi (geçici)",
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-cover-${Math.random()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    toast({
      title: "Yükleniyor...",
      description: "Kapak fotoğrafı yükleniyor",
    });

    // Storage bucket oluşturulmadığı için şimdilik sadece URL olarak tutuyoruz
    // Gelecekte storage bucket eklendiğinde aktif edilecek
    setProfile({ ...profile, cover_image: URL.createObjectURL(file) });
    
    toast({
      title: "✅ Başarılı",
      description: "Kapak fotoğrafı güncellendi (geçici)",
    });
  };

  const handlePasswordChange = async () => {
    toast({
      title: "Bilgi",
      description: "Şifre değiştirme özelliği yakında eklenecek",
    });
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
      return;
    }

    toast({
      title: "Bilgi",
      description: "Hesap silme özelliği yakında eklenecek",
    });
  };

  if (authLoading || isInitializing || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PremiumHeader
          title="Ayarlar & Tercihler ⚙️"
          description="Hesabınızı yönetin, gizlilik ayarlarınızı düzenleyin ve uygulama tercihlerinizi özelleştirin."
          emoji="🎨"
          primaryBadge={{
            icon: User,
            text: "Profil Yönetimi",
            animate: false
          }}
          secondaryBadge={{
            icon: Lock,
            text: "Güvenli"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Ayarlar", isActive: true }
          ]}
          className="mb-8"
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 overflow-x-auto">
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 gap-2 bg-transparent h-auto">
              <TabsTrigger 
                value="profile" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all"
              >
                <User className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Profil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all"
              >
                <Bell className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Bildirim</span>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all"
              >
                <Lock className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Gizlilik</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all"
              >
                <Mail className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Tercih</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all"
              >
                <Lock className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Güvenlik</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all"
              >
                <Mail className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Hesap</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profil Ayarları */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>Profil bilgilerinizi düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url} alt={profile.fullname} />
                    <AvatarFallback>{profile.fullname?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Avatar Yükle
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG veya GIF. Max 2MB
                    </p>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label>Kapak Fotoğrafı</Label>
                  <div className="relative w-full h-32 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg overflow-hidden">
                    {profile.cover_image ? (
                      <img 
                        src={profile.cover_image} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">Kapak fotoğrafı yok</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <Label htmlFor="cover" className="cursor-pointer">
                        <Button variant="secondary" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Kapak Yükle
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Önerilen boyut: 1500x500 piksel. JPG, PNG veya GIF. Max 5MB
                  </p>
                </div>

                {/* İsim */}
                <div className="space-y-2">
                  <Label htmlFor="fullname">Ad Soyad</Label>
                  <Input
                    id="fullname"
                    value={profile.fullname}
                    onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                  />
                </div>

                {/* Kullanıcı Adı */}
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="kullanici_adi"
                  />
                  <p className="text-xs text-muted-foreground">
                    Profil URL'niz: /profil/{profile.username || 'kullanici_adi'}
                    <br />
                    Sadece harf, rakam, tire (-) ve alt çizgi (_) kullanabilirsiniz. Min 3, max 30 karakter.
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkımda</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="Kendinizi tanıtın..."
                  />
                </div>

                {/* Lokasyon */}
                <div className="space-y-2">
                  <Label htmlFor="location">Konum</Label>
                  <Input
                    id="location"
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="İstanbul, Türkiye"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website || ""}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://www.ornek.com"
                  />
                </div>

                {/* Sosyal Medya */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Sosyal Medya Hesapları</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={profile.instagram || ""}
                      onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      placeholder="@kullanici_adi veya https://instagram.com/kullanici_adi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter (X)
                    </Label>
                    <Input
                      id="twitter"
                      value={profile.twitter || ""}
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      placeholder="@kullanici_adi veya https://twitter.com/kullanici_adi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={profile.youtube || ""}
                      onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                      placeholder="Kanal adı veya https://youtube.com/@kanal_adi"
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bildirim Ayarları */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Tercihleri</CardTitle>
                <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-posta Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      E-posta ile bildirim al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tarif Yorumları</Label>
                    <p className="text-sm text-muted-foreground">
                      Tariflerinize yorum geldiğinde bildirim al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.recipeComments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, recipeComments: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yeni Takipçiler</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni takipçi kazandığınızda bildirim al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newFollowers}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newFollowers: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tarif Beğenileri</Label>
                    <p className="text-sm text-muted-foreground">
                      Tarifleriniz beğenildiğinde bildirim al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.recipeLikes}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, recipeLikes: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Haftalık Özet</Label>
                    <p className="text-sm text-muted-foreground">
                      Haftalık aktivite özetini e-posta ile al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyDigest: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sipariş Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Sipariş durumu değiştiğinde bildirim al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, orderUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kampanya ve İndirimler</Label>
                    <p className="text-sm text-muted-foreground">
                      Özel teklifler ve kampanyalar hakkında bilgi al
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, promotions: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sistem Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni özellikler ve güncellemeler
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, systemUpdates: checked })
                    }
                  />
                </div>

                <Button>Bildirimleri Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gizlilik Ayarları */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gizlilik Ayarları</CardTitle>
                <CardDescription>Profilinizin görünürlüğünü ve gizliliğini kontrol edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profil Görünürlüğü</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                  >
                    <option value="public">Herkes Görebilir</option>
                    <option value="followers">Sadece Takipçiler</option>
                    <option value="private">Özel (Sadece Ben)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Profilinizin kimler tarafından görülebileceğini belirleyin
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-posta Adresimi Göster</Label>
                    <p className="text-sm text-muted-foreground">
                      E-posta adresiniz profilinizde görünsün mü?
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showEmail: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Konumu Göster</Label>
                    <p className="text-sm text-muted-foreground">
                      Şehir ve ülke bilginiz görünsün mü?
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showLocation}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showLocation: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mesaj Almaya İzin Ver</Label>
                    <p className="text-sm text-muted-foreground">
                      Diğer kullanıcılar size mesaj gönderebilsin mi?
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowMessages: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aktiviteyi Göster</Label>
                    <p className="text-sm text-muted-foreground">
                      Son aktivite zamanınız görünsün mü?
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showActivity}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showActivity: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Arama Motorlarında Görün</Label>
                    <p className="text-sm text-muted-foreground">
                      Profiliniz Google gibi arama motorlarında çıksın mı?
                    </p>
                  </div>
                  <Switch
                    checked={privacy.searchEngineIndexing}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, searchEngineIndexing: checked })
                    }
                  />
                </div>

                <Button>Gizlilik Ayarlarını Kaydet</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Veri ve İzinler</CardTitle>
                <CardDescription>Verilerinizi yönetin ve izinleri kontrol edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Verilerimi İndir</h4>
                  <p className="text-sm text-muted-foreground">
                    Tüm verilerinizin bir kopyasını indirin (tarifler, yorumlar, profil bilgileri)
                  </p>
                  <Button variant="outline">Veri Kopyası İste</Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium">Bağlı Uygulamalar</h4>
                  <p className="text-sm text-muted-foreground">
                    Hesabınıza erişimi olan üçüncü taraf uygulamalar
                  </p>
                  <Button variant="outline">Bağlı Uygulamaları Yönet</Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium">Çerez Tercihleri</h4>
                  <p className="text-sm text-muted-foreground">
                    Web sitesinde kullanılan çerezleri yönetin
                  </p>
                  <Button variant="outline">Çerez Ayarları</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tercihler */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uygulama Tercihleri</CardTitle>
                <CardDescription>Dil, tema ve görünüm ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dil / Language</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Tema</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                  >
                    <option value="light">Açık Tema</option>
                    <option value="dark">Koyu Tema</option>
                    <option value="auto">Sistem Ayarı</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Saat Dilimi</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  >
                    <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                    <option value="Europe/London">Londra (GMT+0)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Tarih Formatı</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  >
                    <option value="DD/MM/YYYY">GG/AA/YYYY (31/12/2024)</option>
                    <option value="MM/DD/YYYY">AA/GG/YYYY (12/31/2024)</option>
                    <option value="YYYY-MM-DD">YYYY-AA-GG (2024-12-31)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Ölçü Birimi</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={preferences.measurementSystem}
                    onChange={(e) => setPreferences({ ...preferences, measurementSystem: e.target.value })}
                  >
                    <option value="metric">Metrik (kg, litre, cm)</option>
                    <option value="imperial">İmparatorluk (lb, oz, inch)</option>
                  </select>
                </div>

                <Button>Tercihleri Kaydet</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İçerik Tercihleri</CardTitle>
                <CardDescription>Görmek istediğiniz içerik türleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vejetaryen Tarifleri Öne Çıkar</Label>
                    <p className="text-sm text-muted-foreground">
                      Vejetaryen tarifleri öncelikli göster
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hızlı Tarifler</Label>
                    <p className="text-sm text-muted-foreground">
                      30 dakikadan kısa tarifleri öne çıkar
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bölgesel Tarifler</Label>
                    <p className="text-sm text-muted-foreground">
                      Bölgenize özel tarifleri göster
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label>Alerjen Filtreleme</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bu içerikleri tariflerde otomatik filtrele
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Gluten</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Süt</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Yumurta</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Fındık</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Soya</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Balık</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Güvenlik Ayarları */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mevcut Şifre</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni Şifre</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button onClick={handlePasswordChange}>Şifreyi Güncelle</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İki Faktörlü Doğrulama (2FA)</CardTitle>
                <CardDescription>Hesabınız için ekstra güvenlik katmanı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA Durumu</p>
                    <p className="text-sm text-muted-foreground">Şu anda devre dışı</p>
                  </div>
                  <Button variant="outline">Etkinleştir</Button>
                </div>
                <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                  <p>İki faktörlü doğrulama, hesabınıza ekstra bir güvenlik katmanı ekler:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Her girişte telefonunuza kod gönderilir</li>
                    <li>Hesap güvenliğinizi önemli ölçüde artırır</li>
                    <li>Yetkisiz erişimleri engeller</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oturum Yönetimi</CardTitle>
                <CardDescription>Aktif oturumlarınızı görüntüleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Windows - Chrome</p>
                      <p className="text-sm text-muted-foreground">İstanbul, Türkiye • Şimdi aktif</p>
                    </div>
                    <Badge variant="secondary">Mevcut Oturum</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">iPhone - Safari</p>
                      <p className="text-sm text-muted-foreground">İstanbul, Türkiye • 2 saat önce</p>
                    </div>
                    <Button variant="outline" size="sm">Sonlandır</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Android - Chrome</p>
                      <p className="text-sm text-muted-foreground">Ankara, Türkiye • 1 gün önce</p>
                    </div>
                    <Button variant="outline" size="sm">Sonlandır</Button>
                  </div>
                </div>
                <Button variant="destructive" className="w-full">
                  Tüm Diğer Oturumları Sonlandır
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Günlüğü</CardTitle>
                <CardDescription>Son hesap aktiviteleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 border-b">
                    <span>Başarılı giriş</span>
                    <span className="text-muted-foreground">2 saat önce</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Profil güncellendi</span>
                    <span className="text-muted-foreground">1 gün önce</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Şifre değiştirildi</span>
                    <span className="text-muted-foreground">5 gün önce</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span>Yeni cihazdan giriş</span>
                    <span className="text-muted-foreground">1 hafta önce</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hesap Ayarları */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>E-posta Adresi</CardTitle>
                <CardDescription>Hesabınıza bağlı e-posta adresi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    E-posta adresinizi değiştirmek için destek ekibimizle iletişime geçin
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Tehlikeli Bölge</CardTitle>
                <CardDescription>Bu işlemler geri alınamaz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Hesabı Sil</h4>
                  <p className="text-sm text-muted-foreground">
                    Hesabınızı kalıcı olarak silmek, tüm verilerinizi ve tariflerinizi kalıcı olarak siler.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hesabı Kalıcı Olarak Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Settings;
