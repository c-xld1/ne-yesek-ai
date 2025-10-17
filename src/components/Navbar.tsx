import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu as MenuIcon, X, ChevronDown, User, Heart, Bell, LogIn, UserPlus, PlusCircle, Sparkles, ChefHat, Home, Bookmark } from "lucide-react";
import NavbarGuest from "./NavbarGuest";
import NavbarMember from "./NavbarMember";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";

// Açık dışa aktarma ile fonksiyon bileşeni
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);

  // Kaydırma durumunu izler ve navbar'ın görünümünü değiştirir
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tarifler?arama=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Menü kategorileri
  const menuCategories = [
    { name: "Ana Yemekler", path: "/kategori/ana-yemekler", icon: "🍖", description: "Doyurucu lezzetler" },
    { name: "Çorbalar", path: "/kategori/corbalar", icon: "🍲", description: "Sıcacık başlangıçlar" },
    { name: "Salatalar", path: "/kategori/salatalar", icon: "🥗", description: "Taze ve sağlıklı" },
    { name: "Tatlılar", path: "/kategori/tatlilar", icon: "🍰", description: "Tatlı kaçamaklar" },
    { name: "İçecekler", path: "/kategori/icecekler", icon: "🥤", description: "Serinleten lezzetler" },
    { name: "Atıştırmalıklar", path: "/kategori/atistirmaliklar", icon: "🥨", description: "Pratik lezzetler" },
    { name: "Vejetaryen", path: "/kategori/vejetaryen", icon: "🥗", description: "Sağlıklı alternatifler" }
  ];

  return (
    <>
      <nav
        className={`sticky z-50 w-full transition-all duration-500 ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-soft border-b border-orange-100/50'
          : 'bg-white/95 backdrop-blur-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 space-x-4">
            {/* Logo - Sadece Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 font-bold text-xl text-gray-900">NeYesek</span>
              </Link>
            </div>

            {/* Desktop Navigation Links with Recipes Mega Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Tarifler Mega Menu */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:bg-orange-50 flex items-center gap-1">
                  Tarifler
                  <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Mega Menu Dropdown */}
                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 z-50 border border-gray-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Kategoriler</h4>
                      <ul className="space-y-2">
                        {menuCategories.map((cat, i) => (
                          <li key={i}>
                            <Link to={cat.path} className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors">
                              <span className="text-xl">{cat.icon}</span>
                              <span className="text-sm">{cat.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Popüler Tarifler</h4>
                      <ul className="space-y-2">
                        {["Mantı", "Lahmacun", "Baklava", "Döner", "Karnıyarık"].map((item, j) => (
                          <li key={j}>
                            <Link to={`/tarif/${item.toLowerCase()}`} className="text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/populer"
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:bg-orange-50"
              >
                Popüler
              </Link>
              <Link
                to="/yoresel"
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:bg-orange-50"
              >
                Yöresel
              </Link>
              <Link
                to="/soru-cevap"
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:bg-orange-50"
              >
                Soru & Cevap
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tarif ara..."
                    className="w-full pl-10 pr-4 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                    asChild
                  >
                    <Link to="/sharerecipe">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Tarif Paylaş</span>
                    </Link>
                  </Button>
                  <NotificationCenter />
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </Button>
                  <NavbarMember />
                </div>
              ) : (
                <NavbarGuest />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MenuIcon size={24} />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-gradient-to-br from-orange-50 to-white border-t-4 border-orange-500">
                  <DrawerHeader className="text-center pb-6">
                    <DrawerTitle className="flex items-center justify-center gap-3 text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      NeYesek.AI
                    </DrawerTitle>
                    <DrawerDescription className="text-gray-600 font-medium">
                      🍽️ Lezzetli tarifleri keşfedin ve paylaşın
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="px-6 pb-6 space-y-6 max-h-[65vh] overflow-y-auto">
                    {/* Modern Search Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100">
                      <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
                          <Input
                            type="text"
                            placeholder="Hangi tarifi arıyorsunuz? 🔍"
                            className="w-full pl-12 pr-4 py-3 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl bg-orange-50/50 text-gray-700 placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>

                    {/* Quick Actions Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <DrawerClose asChild>
                        <Link
                          to="/populer"
                          className="bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <span className="text-3xl mb-2 block">🔥</span>
                            <span className="font-semibold text-sm">Popüler</span>
                          </div>
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/yoresel"
                          className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <span className="text-3xl mb-2 block">🌍</span>
                            <span className="font-semibold text-sm">Yöresel</span>
                          </div>
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/soru-cevap"
                          className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <span className="text-3xl mb-2 block">❓</span>
                            <span className="font-semibold text-sm">Soru & Cevap</span>
                          </div>
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/sharerecipe"
                          className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <span className="text-3xl mb-2 block">👨‍🍳</span>
                            <span className="font-semibold text-sm">Tarif Paylaş</span>
                          </div>
                        </Link>
                      </DrawerClose>
                    </div>

                    {/* Categories Section */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100">
                      <button
                        className="flex items-center justify-between w-full py-3 px-2 text-lg font-semibold text-gray-800 hover:bg-orange-50 rounded-xl transition-colors"
                        onClick={() => setOpenMobileCategory(openMobileCategory === 'tarifler' ? null : 'tarifler')}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-2xl">🍽️</span>
                          <span>Tarif Kategorileri</span>
                        </span>
                        <ChevronDown className={`h-5 w-5 text-orange-500 transition-transform duration-200 ${openMobileCategory === 'tarifler' ? 'rotate-180' : ''}`} />
                      </button>

                      {openMobileCategory === 'tarifler' && (
                        <div className="mt-4 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                          {menuCategories.map((category, index) => (
                            <DrawerClose key={index} asChild>
                              <Link
                                to={category.path}
                                className="flex flex-col items-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all duration-200 hover:scale-105 group"
                              >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                                  {category.icon}
                                </span>
                                <span className="font-medium text-gray-700 text-sm text-center">{category.name}</span>
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <DrawerFooter className="bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-100">
                    {/* Auth Section */}
                    {user ? (
                      <div className="space-y-4">
                        {/* User Profile Card */}
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md border border-orange-100">
                          <Avatar className="h-12 w-12 ring-2 ring-orange-200">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white font-bold text-lg">
                              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{user.username || 'Kullanıcı'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <DrawerClose asChild>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                              <User className="h-4 w-4" />
                            </Button>
                          </DrawerClose>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <DrawerClose asChild>
                            <Button variant="outline" size="lg" className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl">
                              <Heart className="mr-2 h-4 w-4" />
                              Favoriler
                            </Button>
                          </DrawerClose>
                          <DrawerClose asChild>
                            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Paylaş
                            </Button>
                          </DrawerClose>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <DrawerClose asChild>
                          <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg font-semibold">
                            <LogIn className="mr-2 h-5 w-5" />
                            Giriş Yap
                          </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button variant="outline" size="lg" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl font-semibold">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Üye Ol
                          </Button>
                        </DrawerClose>
                      </div>
                    )}
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </nav>

      {/* ... */}
    </>
  );
};

export default Navbar;
