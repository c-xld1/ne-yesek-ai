
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X, Bell, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/tarifler" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Tarifler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="#kategoriler" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Kategoriler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link to="/hakkimizda" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              Hakkımızda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/iletisim" className="text-gray-700 hover:text-food-600 font-medium transition-all duration-300 hover:scale-105 relative group">
              İletişim
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-food-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
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
          <div className="md:hidden">
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
          <div className="md:hidden border-t border-orange-100 bg-white/95 backdrop-blur-sm animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Ana Sayfa</Link>
              <Link to="/tarifler" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Tarifler</Link>
              <a href="#kategoriler" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Kategoriler</a>
              <Link to="/hakkimizda" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">Hakkımızda</Link>
              <Link to="/iletisim" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium hover:bg-food-50 rounded-md transition-all duration-300">İletişim</Link>
              
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
