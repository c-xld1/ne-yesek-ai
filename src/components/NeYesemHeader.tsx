import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CartDropdown from "@/components/CartDropdown";
import { Search, MapPin, Filter, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NeYesemHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  cart?: any[];
  showCartDropdown?: boolean;
  onCartToggle?: () => void;
  onCartClose?: () => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  showFilters?: boolean;
  onShowFilters?: () => void;
  filterCount?: number;
  showSearch?: boolean;
  showMapButton?: boolean;
  showFilterButton?: boolean;
  showCartButton?: boolean;
}

const NeYesemHeader: React.FC<NeYesemHeaderProps> = ({
  searchQuery = "",
  onSearchChange,
  cart = [],
  showCartDropdown = false,
  onCartToggle,
  onCartClose,
  onRemoveItem,
  onUpdateQuantity,
  showFilters = false,
  onShowFilters,
  filterCount = 0,
  showSearch = true,
  showMapButton = true,
  showFilterButton = true,
  showCartButton = true,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Search Bar with Map Button */}
          {showSearch && (
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Yemek, şef veya kategori ara..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-12 pr-4 h-12 text-sm rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
              
              {/* Map/Location Button */}
              {showMapButton && (
                <Button
                  onClick={() => navigate("/neyesem/harita")}
                  variant="outline"
                  className="h-12 px-4 rounded-xl border-gray-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all gap-2 hidden md:flex shrink-0"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Harita</span>
                </Button>
              )}
            </div>
          )}

          {/* Mobile Filter Button */}
          {showFilterButton && (
            <Button
              onClick={onShowFilters}
              variant="outline"
              size="sm"
              className="lg:hidden h-12 px-3 rounded-xl border-gray-200 hover:bg-gray-50 shrink-0"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              {filterCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-orange-500 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {filterCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Cart Button with Dropdown */}
          {showCartButton && (
            <div className="relative shrink-0">
              <Button
                onClick={() => {
                  if (cart.length === 0) {
                    toast({ 
                      title: "Sepetiniz Boş", 
                      description: "Sepetinize henüz ürün eklemediniz",
                      duration: 2000
                    });
                  } else {
                    onCartToggle?.();
                  }
                }}
                className="relative h-12 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline font-semibold">Sepetim</span>
                {cart.length > 0 && (
                  <Badge className="bg-white text-orange-600 h-6 min-w-[24px] rounded-full px-2 flex items-center justify-center text-xs font-bold">
                    {cart.length}
                  </Badge>
                )}
              </Button>

              {/* Cart Dropdown */}
              {onRemoveItem && onUpdateQuantity && (
                <CartDropdown
                  cart={cart}
                  isOpen={showCartDropdown}
                  onClose={onCartClose || (() => {})}
                  onRemoveItem={onRemoveItem}
                  onUpdateQuantity={onUpdateQuantity}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeYesemHeader;
