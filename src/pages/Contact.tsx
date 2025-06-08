
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-food-500" />,
      title: "E-posta",
      value: "info@neyesek.ai",
      description: "7/24 destek için bize yazın"
    },
    {
      icon: <Phone className="h-6 w-6 text-food-500" />,
      title: "Telefon",
      value: "+90 212 123 45 67",
      description: "Hafta içi 09:00-18:00"
    },
    {
      icon: <MapPin className="h-6 w-6 text-food-500" />,
      title: "Adres",
      value: "Maslak, İstanbul",
      description: "Türkiye"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-food-500" />,
      title: "Canlı Destek",
      value: "Online",
      description: "Hemen yardım alın"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📞 İletişim
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya geri bildirimleriniz için 
            bizimle iletişime geçin. Size yardımcı olmaktan memnuniyet duyarız!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-food-50 rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-food-600 font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sosyal Medya */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sosyal Medya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    📘 Facebook
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    📷 Instagram
                  </Button>
                </div>
                <div className="flex space-x-4 mt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    🐦 Twitter
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    📺 YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bize Mesaj Gönderin</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ad Soyad *
                      </label>
                      <Input placeholder="Adınızı ve soyadınızı yazın" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        E-posta *
                      </label>
                      <Input type="email" placeholder="E-posta adresinizi yazın" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefon
                    </label>
                    <Input placeholder="Telefon numaranızı yazın (opsiyonel)" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Konu *
                    </label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg">
                      <option>Genel Sorular</option>
                      <option>Teknik Destek</option>
                      <option>Tarif Önerisi</option>
                      <option>İş Birliği</option>
                      <option>Şikayet</option>
                      <option>Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none h-32"
                      placeholder="Mesajınızı detaylı bir şekilde yazın..."
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      <a href="#" className="text-food-600 hover:underline">
                        Gizlilik Politikası
                      </a>'nı okudum ve kabul ediyorum.
                    </label>
                  </div>

                  <Button type="submit" className="gradient-primary text-white w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SSS Bölümü */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Sık Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ne Yesek AI nasıl çalışır?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Evdeki malzemelerinizi girin, yapay zeka size en uygun 
                  tarifleri önersin. DBL skorumuza göre en verimli tarifleri bulabilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tarif paylaşmak ücretsiz mi?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Evet! Tarif paylaşmak tamamen ücretsizdir. 
                  Toplulukla tarifilerinizi paylaşabilir ve geri bildirim alabilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  DBL skoru nedir?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dakika Başına Lezzet skoru, tariflerin pişirme süresine 
                  göre lezzet değerini ölçen özel algoritmamızdır.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Mobil uygulamanız var mı?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Şu anda web platformumuz mevcut. Mobil uygulamamız 
                  yakında App Store ve Google Play'de olacak.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
