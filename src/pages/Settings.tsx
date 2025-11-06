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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({
    fullname: "",
    username: "",
    bio: "",
    avatar_url: "",
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
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data) setProfile(data);
    if (error) console.error("Profil yükleme hatası:", error);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        fullname: profile.fullname,
        username: profile.username,
        bio: profile.bio,
      })
      .eq("id", user?.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Başarılı",
      description: "Profiliniz güncellendi",
    });
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
                  />
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
