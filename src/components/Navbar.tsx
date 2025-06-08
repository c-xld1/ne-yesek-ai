
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">Ne Yesek AI</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-food-600 font-medium transition-colors">Ana Sayfa</a>
            <a href="#" className="text-gray-700 hover:text-food-600 font-medium transition-colors">Tarifler</a>
            <a href="#" className="text-gray-700 hover:text-food-600 font-medium transition-colors">Kategoriler</a>
            <a href="#" className="text-gray-700 hover:text-food-600 font-medium transition-colors">Hakkımızda</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-food-600">
              <User className="h-4 w-4" />
            </Button>
            <Button className="gradient-primary text-white hover:opacity-90 transition-opacity">
              Tarif Paylaş
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-orange-100 bg-white/90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium">Ana Sayfa</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium">Tarifler</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium">Kategoriler</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-food-600 font-medium">Hakkımızda</a>
              <div className="pt-4 pb-2 border-t border-orange-100">
                <Button className="w-full gradient-primary text-white">
                  Tarif Paylaş
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
