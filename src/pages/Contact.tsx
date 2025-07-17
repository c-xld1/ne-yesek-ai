import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Eksik Bilgi ⚠️",
        description: "Lütfen tüm gerekli alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Geçici olarak console'a log atalım (gerçek projede Supabase'e kaydedilecek)
      console.log('Contact Form Data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Genel İletişim',
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      });

      // Simüle edilmiş başarılı gönderim
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Mesajınız gönderildi! 📧",
        description: "En kısa sürede size geri dönüş yapacağız.",
      });

      // Form'u temizle
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Hata! ❌",
        description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-posta",
      info: "info@neyesek.ai",
      description: "7/24 e-posta desteği",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Telefon",
      info: "+90 555 123 45 67",
      description: "Pazartesi-Cuma 09:00-18:00",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Adres",
      info: "İstanbul, Türkiye",
      description: "Merkez ofisimiz",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const faqItems = [
    {
      question: "Tariflerinizi nasıl paylaşabilirim?",
      answer: "Üye olduktan sonra 'Tarif Paylaş' bölümünden kolayca tariflerinizi ekleyebilirsiniz."
    },
    {
      question: "AI önerileri nasıl çalışıyor?",
      answer: "Yapay zeka algoritması, tercihlerinizi ve geçmiş aramalarınızı analiz ederek size özel tarifler önerir."
    },
    {
      question: "Premium üyelik avantajları nelerdir?",
      answer: "Reklamsız deneyim, özel tarifler, detaylı beslenme bilgileri ve öncelikli destek hizmetleri."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-32 right-32 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-orange-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4"
          >
            Bizimle İletişime Geçin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl shadow-orange-500/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
                    className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 text-white" />
                  </motion.div>
                  Mesaj Gönder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Adınız</label>
                      <Input
                        placeholder="Adınız ve soyadınız"
                        className="h-12 border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">E-posta</label>
                      <Input
                        type="email"
                        placeholder="ornek@email.com"
                        className="h-12 border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-gray-700">Konu</label>
                    <Input
                      placeholder="Mesaj konusu"
                      className="h-12 border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-gray-700">Mesajınız</label>
                    <Textarea
                      placeholder="Mesajınızı buraya yazın..."
                      className="min-h-[120px] border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Mesajı Gönder
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-lg font-semibold text-gray-800 mb-1">{info.info}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Müşteri Memnuniyeti</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">%98</div>
                      <div className="text-sm text-gray-600">Memnuniyet</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">2 saat</div>
                      <div className="text-sm text-gray-600">Yanıt Süresi</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-sm text-gray-600">Destek</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent text-center mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
