
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, Bell, Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: "Kahvaltı", count: 150, icon: "🍳" },
    { name: "Ana Yemek", count: 320, icon: "🍽️" },
    { name: "Çorbalar", count: 80, icon: "🍲" },
    { name: "Tatlılar", count: 95, icon: "🧁" },
    { name: "15 Dakikada", count: 65, icon: "⚡" },
    { name: "Vegan", count: 45, icon: "🌱" },
    { name: "Et Yemekleri", count: 89, icon: "🥩" },
    { name: "Deniz Ürünleri", count: 67, icon: "🐟" },
    { name: "Hamur İşleri", count: 73, icon: "🥖" },
    { name: "Salata & Mezeler", count: 54, icon: "🥗" },
    { name: "İçecekler", count: 41, icon: "🥤" },
    { name: "Fit Tarifler", count: 38, icon: "💪" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-300">
              Ne Yesek AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Tarifler Dropdown */}
            <div className="relative group">
              <Link to="/tarifler" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group flex items-center">
                Tarifler
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              {/* Mega Menu */}
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/tarifler?kategori=${category.name}`}
                        className="flex items-center p-3 rounded-lg hover:bg-food-50 transition-colors group/item"
                      >
                        <span className="text-xl mr-3">{category.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 group-hover/item:text-food-600">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">{category.count} tarif</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/blog" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/mevsimsel" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Mevsimsel
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/yoresel" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Yöresel
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/ipuclari" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              İpuçları
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Daha Fazla Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-food-600 font-medium">
                  Daha Fazla
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/market-listesi" className="cursor-pointer">
                    🛒 Market Listesi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/haftalik-plan" className="cursor-pointer">
                    📅 Haftalık Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/menu-planlayici" className="cursor-pointer">
                    🍽️ Menü Planlayıcı
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/uyelerimiz" className="cursor-pointer">
                    👥 Üyelerimiz
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 hover:bg-food-50 transition-all duration-300 hover:scale-110">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 hover:bg-food-50 transition-all duration-300 hover:scale-110 relative">
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 hover:bg-food-50 transition-all duration-300 hover:scale-110 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-food-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 hover:bg-food-50 transition-all duration-300 hover:scale-110">
              <User className="h-4 w-4" />
            </Button>
            <Link to="/tarif-paylas">
              <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-md">
                Tarif Paylaş
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-food-600 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-orange-100 bg-white/95 backdrop-blur-sm animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Ana Sayfa</Link>
              <Link to="/tarifler" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Tarifler</Link>
              <Link to="/blog" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Blog</Link>
              <Link to="/mevsimsel" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Mevsimsel</Link>
              <Link to="/yoresel" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Yöresel</Link>
              <Link to="/ipuclari" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">İpuçları</Link>
              
              {/* Mobile Submenu */}
              <div className="pt-2 border-t border-orange-100">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">Daha Fazla</div>
                <Link to="/market-listesi" className="block px-6 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">🛒 Market Listesi</Link>
                <Link to="/haftalik-plan" className="block px-6 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">📅 Haftalık Plan</Link>
                <Link to="/menu-planlayici" className="block px-6 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">🍽️ Menü Planlayıcı</Link>
                <Link to="/uyelerimiz" className="block px-6 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">👥 Üyelerimiz</Link>
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 pb-2 border-t border-orange-100 space-y-2">
                <div className="flex justify-center space-x-4 mb-3">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 relative">
                    <Heart className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600 relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-food-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
                <Link to="/tarif-paylas">
                  <Button className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-300">
                    Tarif Paylaş
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
