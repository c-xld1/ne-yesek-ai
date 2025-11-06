import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Lock, Mail, Trash2, Upload } from "lucide-react";

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({
    fullname: "",
    username: "",
    bio: "",
    avatar_url: "",
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
  });

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

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
      website: profile.website,
      location: profile.location,
      instagram: profile.instagram,
      twitter: profile.twitter,
      youtube: profile.youtube,
    };
    console.log("Update data:", updateData);

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Güvenlik
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Hesap
            </TabsTrigger>
          </TabsList>

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

                <Button>Bildirimleri Kaydet</Button>
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
                <CardTitle>İki Faktörlü Doğrulama</CardTitle>
                <CardDescription>Hesabınız için ekstra güvenlik katmanı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA Durumu</p>
                    <p className="text-sm text-muted-foreground">Şu anda devre dışı</p>
                  </div>
                  <Button variant="outline">Etkinleştir</Button>
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
