
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-gradient mb-4">Ne Yesek AI</h3>
            <p className="text-gray-400 mb-4">
              Evdeki malzemelerinizle yapay zeka destekli tarif önerileri alın. 
              Yemek yapmayı keşfedin!
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                📘
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                📷
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                🐦
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                📺
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tarifler</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kategoriler</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bugün Ne Yesek?</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Kategoriler</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kahvaltı</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ana Yemek</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Çorba</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tatlı</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">15 Dakikada</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Bülten</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Yeni tariflerden ve özelliklerden haberdar olun!
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Email adresiniz"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="gradient-primary text-white hover:opacity-90">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Ne Yesek AI. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Gizlilik Politikası</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kullanım Şartları</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">İletişim</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
