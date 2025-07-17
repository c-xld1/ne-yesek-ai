import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, ChefHat, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata! ❌",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Hata! ❌",
        description: "Şifre en az 6 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Kullanıcı adı yoksa fullname'den türetelim
      const username = formData.username || `${formData.fullname.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

      console.log('Register form data:', {
        email: formData.email,
        username: formData.username,
        generated_username: username,
        fullname: formData.fullname,
        fullname_length: formData.fullname?.length,
        fullname_type: typeof formData.fullname,
        fullname_trimmed: formData.fullname?.trim(),
        is_fullname_empty: !formData.fullname || formData.fullname.trim() === ''
      });

      if (!formData.fullname || formData.fullname.trim() === '') {
        toast({
          title: "Hata! ❌",
          description: "Ad Soyad alanı boş olamaz.",
          variant: "destructive",
        });
        return;
      }

      const { success, error } = await signUp(formData.email, formData.password, username, formData.fullname);

      console.log('SignUp result:', { success, error });

      if (success) {
        toast({
          title: "Hoş geldiniz! 🎉",
          description: "Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.",
        });
        navigate("/giris-yap");
      } else {
        // Hata mesajını özelleştir
        let errorMessage = error || "Hesap oluşturulurken bir hata oluştu.";
        if (
          errorMessage.includes("User already registered") ||
          errorMessage.includes("already registered") ||
          errorMessage.includes("duplicate key value violates unique constraint") ||
          errorMessage.toLowerCase().includes("email")
        ) {
          errorMessage = "Bu e-posta adresiyle zaten bir hesap var. Lütfen giriş yapın veya farklı bir e-posta kullanın.";
        }
        if (errorMessage.toLowerCase().includes("profil oluşturulamadı") || errorMessage.toLowerCase().includes("profile could not be created")) {
          errorMessage = "Hesabınız oluşturuldu fakat profiliniz eklenemedi. Lütfen giriş yapıp profil bilgilerinizi tamamlayın.";
        }
        toast({
          title: "Hata! ❌",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Register catch error:', error);
      toast({
        title: "Hata! ❌",
        description: error?.message || "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      console.log('Register finally block - setting loading false');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const features = [
    {
      icon: ChefHat,
      title: "Kişisel Tarifler",
      description: "Kendi tariflerinizi oluşturun ve paylaşın"
    },
    {
      icon: Heart,
      title: "Favori Listesi",
      description: "Beğendiğiniz tarifleri kaydedin"
    },
    {
      icon: Star,
      title: "Premium İçerik",
      description: "Özel chef tariflerine erişim"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Navbar />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center justify-center mb-4"
                >
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full">
                    <ChefHat className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Ne Yesek AI'ya Katılın
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Lezzetli yolculuğunuza başlayın
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Ad Soyad"
                        className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="kullaniciadi"
                        className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-300"
                        required
                        minLength={3}
                      />
                    </div>
                    <p className="text-xs text-gray-500">En az 3 karakter, benzersiz olmalı</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ornek@email.com"
                        className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-gray-200 focus:border-orange-300 focus:ring-orange-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Şifre Tekrar</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-gray-200 focus:border-orange-300 focus:ring-orange-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Hesap Oluşturuluyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Hesap Oluştur</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Zaten hesabınız var mı?{" "}
                      <Link
                        to="/giris-yap"
                        className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
                      >
                        Giriş Yapın
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
                Ne Yesek AI ile
              </h2>
              <p className="text-xl text-gray-600">
                Mutfakta yaratıcılığınızı keşfedin
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 p-8 bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-2">10,000+ Tarif</h3>
              <p className="text-orange-100">
                Dünyanın dört bir yanından lezzetler
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
