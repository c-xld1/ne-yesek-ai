
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-food-600 to-spice-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            🍳 Haftalık Tarif Bülteni
          </h3>
          <p className="text-food-100 mb-6 max-w-2xl mx-auto">
            En yeni tarifler, mutfak ipuçları ve özel içerikler için bültenimize katılın!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              placeholder="E-posta adresiniz..." 
              className="bg-white text-gray-900"
            />
            <Button className="bg-white text-food-600 hover:bg-gray-100">
              Abone Ol
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-gradient">
              Ne Yesek AI
            </Link>
            <p className="text-gray-300 text-sm">
              Yapay zeka destekli tarif platformu. Milyonlarca tarif, kişisel öneriler ve mutfak deneyiminizi kolaylaştıran teknoloji.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li><Link to="/tarifler" className="text-gray-300 hover:text-white transition-colors">Tarifler</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/hikayeler" className="text-gray-300 hover:text-white transition-colors">Video Hikâyeler</Link></li>
              <li><Link to="/mevsimsel" className="text-gray-300 hover:text-white transition-colors">Mevsimsel</Link></li>
              <li><Link to="/yoresel" className="text-gray-300 hover:text-white transition-colors">Yöresel</Link></li>
              <li><Link to="/ipuclari" className="text-gray-300 hover:text-white transition-colors">İpuçları</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Kategoriler</h4>
            <ul className="space-y-2">
              <li><Link to="/tarifler?kategori=Ana Yemek" className="text-gray-300 hover:text-white transition-colors">Ana Yemek</Link></li>
              <li><Link to="/tarifler?kategori=Tatlılar" className="text-gray-300 hover:text-white transition-colors">Tatlılar</Link></li>
              <li><Link to="/tarifler?kategori=Çorbalar" className="text-gray-300 hover:text-white transition-colors">Çorbalar</Link></li>
              <li><Link to="/tarifler?kategori=Vegan" className="text-gray-300 hover:text-white transition-colors">Vegan</Link></li>
              <li><Link to="/tarifler?kategori=15 Dakikada" className="text-gray-300 hover:text-white transition-colors">15 Dakikada</Link></li>
              <li><Link to="/tarifler?kategori=Fit Tarifler" className="text-gray-300 hover:text-white transition-colors">Fit Tarifler</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">İletişim</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@neyesek.ai</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+90 (212) 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">İstanbul, Türkiye</span>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/iletisim">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Bize Ulaşın
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Ne Yesek AI. Tüm hakları saklıdır.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/gizlilik" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-sartlari" className="text-gray-400 hover:text-white transition-colors">
                Kullanım Şartları
              </Link>
              <Link to="/cerez-politikasi" className="text-gray-400 hover:text-white transition-colors">
                Çerez Politikası
              </Link>
              <Link to="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                Hakkımızda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
