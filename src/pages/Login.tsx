import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, Loader2, ChefHat, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const { login, signInWithGoogle, signInWithFacebook, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen kullanıcı adı/e-posta ve şifre alanlarını doldurun.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { success, error } = await login(formData.identifier, formData.password);

      if (success) {
        toast({
          title: "Başarılı!",
          description: "Giriş başarılı! Yönlendiriliyorsunuz...",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Giriş başarısız",
          description: error || "E-posta veya şifre hatalı.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Giriş başarısız",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-page">
      <Navbar />

      <div className="flex items-center justify-center py-8 md:py-16 px-4 sm:px-6 lg:px-8 pb-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="card-glass border-border/50">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-2">
                <ChefHat className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Hoş Geldiniz
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Lezzetli tariflerin dünyasına giriş yapın
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Kullanıcı adı veya e-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="ornek@email.com"
                      className="pl-10 h-12 rounded-xl bg-background border-border focus-visible:ring-primary/30"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-12 h-12 rounded-xl bg-background border-border focus-visible:ring-primary/30"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Beni hatırla</span>
                  </label>
                  <Link to="/sifremi-unuttum" className="text-sm text-primary hover:underline font-medium">
                    Şifremi unuttum
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş Yapılıyor...
                    </div>
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-border" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                  veya
                </span>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-border hover:bg-muted"
                  onClick={async () => {
                    const { success, error } = await signInWithGoogle();
                    if (!success) {
                      toast({
                        variant: "destructive",
                        title: "Hata",
                        description: error || "Google ile giriş yapılamadı.",
                      });
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google ile Giriş
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-border hover:bg-muted"
                  onClick={async () => {
                    const { success, error } = await signInWithFacebook();
                    if (!success) {
                      toast({
                        variant: "destructive",
                        title: "Hata",
                        description: error || "Facebook ile giriş yapılamadı.",
                      });
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook ile Giriş
                </Button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Hesabın yok mu?{" "}
                  <Link to="/kayit-ol" className="text-primary hover:underline font-semibold">
                    Hemen kayıt ol
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Login;
