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
              <Link
                to="/neyesem"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <ChefHat className="h-4 w-4" />
                Ne Yesem?
              </Link>
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
                    <Link to="/tarif-paylas">
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
              {user && <NotificationCenter />}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-orange-100/50 hover:from-primary/20 hover:to-orange-100"
                  >
                    <MenuIcon size={20} className="text-primary" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-background border-t-0 rounded-t-3xl max-h-[90vh]">
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
                  </div>
                  
                  <DrawerHeader className="text-center pb-4 pt-0">
                    <DrawerTitle className="flex items-center justify-center gap-3 text-xl font-bold">
                      <div className="p-2 bg-gradient-to-br from-primary to-orange-600 rounded-xl shadow-lg">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                        NeYesek.AI
                      </span>
                    </DrawerTitle>
                    <DrawerDescription className="text-muted-foreground text-sm">
                      Lezzetli tarifleri keşfedin
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[55vh]">
                    {/* Search Card */}
                    <div className="bg-muted/50 rounded-2xl p-3">
                      <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Tarif ara..."
                            className="w-full pl-10 pr-4 py-2.5 h-10 border-0 bg-background rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: "🔥", label: "Popüler", path: "/populer", color: "from-red-500 to-orange-500" },
                        { icon: "🌍", label: "Yöresel", path: "/yoresel", color: "from-green-500 to-emerald-500" },
                        { icon: "❓", label: "S&C", path: "/soru-cevap", color: "from-blue-500 to-cyan-500" },
                        { icon: "🍽️", label: "Ne Yesem", path: "/neyesem", color: "from-purple-500 to-pink-500" },
                      ].map((item, i) => (
                        <DrawerClose key={i} asChild>
                          <Link
                            to={item.path}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95`}
                          >
                            <span className="text-xl mb-1">{item.icon}</span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>

                    {/* Categories Accordion */}
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <button
                        className="flex items-center justify-between w-full p-3 text-left"
                        onClick={() => setOpenMobileCategory(openMobileCategory === 'tarifler' ? null : 'tarifler')}
                      >
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <span className="text-lg">🍽️</span>
                          Kategoriler
                        </span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${openMobileCategory === 'tarifler' ? 'rotate-180' : ''}`} />
                      </button>

                      {openMobileCategory === 'tarifler' && (
                        <div className="px-3 pb-3 grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-200">
                          {menuCategories.map((category, index) => (
                            <DrawerClose key={index} asChild>
                              <Link
                                to={category.path}
                                className="flex flex-col items-center p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                              >
                                <span className="text-xl mb-1">{category.icon}</span>
                                <span className="text-[10px] font-medium text-foreground text-center leading-tight">{category.name}</span>
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Menu Links */}
                    <div className="space-y-1">
                      {[
                        { icon: Home, label: "Ana Sayfa", path: "/" },
                        { icon: ChefHat, label: "Şefler", path: "/sefler" },
                        { icon: Bookmark, label: "Favorilerim", path: "/favoriler" },
                      ].map((item, i) => (
                        <DrawerClose key={i} asChild>
                          <Link
                            to={item.path}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                          >
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{item.label}</span>
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </div>

                  <DrawerFooter className="border-t border-border bg-muted/30 pt-4">
                    {user ? (
                      <div className="space-y-3">
                        {/* User Card */}
                        <DrawerClose asChild>
                          <Link
                            to={user.username ? `/profil/${user.username}` : "/profil"}
                            className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-primary/20 transition-colors"
                          >
                            <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-orange-600 text-primary-foreground font-semibold">
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate">{user.username || 'Kullanıcı'}</div>
                              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
                          </Link>
                        </DrawerClose>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <DrawerClose asChild>
                            <Link to="/favoriler">
                              <Button variant="outline" className="w-full rounded-xl h-10 border-border">
                                <Heart className="mr-2 h-4 w-4" />
                                Favoriler
                              </Button>
                            </Link>
                          </DrawerClose>
                          <DrawerClose asChild>
                            <Link to="/tarif-paylas">
                              <Button className="w-full rounded-xl h-10 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-primary-foreground">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Paylaş
                              </Button>
                            </Link>
                          </DrawerClose>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <DrawerClose asChild>
                          <Link to="/giris-yap">
                            <Button variant="outline" className="w-full rounded-xl h-11 border-border font-medium">
                              <LogIn className="mr-2 h-4 w-4" />
                              Giriş Yap
                            </Button>
                          </Link>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Link to="/kayit-ol">
                            <Button className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-primary-foreground font-medium">
                              <UserPlus className="mr-2 h-4 w-4" />
                              Üye Ol
                            </Button>
                          </Link>
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
    </>
  );
};

export default Navbar;
