import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  X, Filter, Star, Clock, Zap, Calendar,
  DollarSign, MapPin, Award
} from "lucide-react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    categories: string[];
    priceRange: [number, number];
    deliveryTypes: string[];
    selectedChef: string | null;
    rating: number;
    distance: number;
  };
  onFilterChange: (filters: any) => void;
  chefs: Array<{
    id: string;
    business_name: string;
    average_rating: number;
  }>;
}

const categories = [
  { id: "tavuk", label: "Tavuk Yemekleri", icon: "🍗" },
  { id: "et", label: "Et Yemekleri", icon: "🥩" },
  { id: "köfte", label: "Köfte", icon: "🍖" },
  { id: "balık", label: "Balık", icon: "🐟" },
  { id: "vegan", label: "Vegan", icon: "🥗" },
  { id: "tatlı", label: "Tatlılar", icon: "🍰" },
  { id: "çorba", label: "Çorbalar", icon: "🍲" },
  { id: "makarna", label: "Makarna", icon: "🍝" },
  { id: "pizza", label: "Pizza", icon: "🍕" },
  { id: "burger", label: "Burger", icon: "🍔" },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  chefs,
}) => {
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleDeliveryTypeToggle = (type: string) => {
    const newTypes = filters.deliveryTypes.includes(type)
      ? filters.deliveryTypes.filter((t) => t !== type)
      : [...filters.deliveryTypes, type];
    onFilterChange({ ...filters, deliveryTypes: newTypes });
  };

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 500],
      deliveryTypes: [],
      selectedChef: null,
      rating: 0,
      distance: 10,
    });
  };

  return (
    <>
      {/* Backdrop - Mobile only */}
      <div
  className={`fixed inset-0 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
  className={`fixed top-0 left-0 h-full w-full md:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-x-auto lg:sticky lg:top-0 lg:h-[100vh] lg:overflow-y-visible lg:shadow-none lg:border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 lg:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-bold">Filtreler</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters Content */}
          <div className="space-y-5">
            {/* Teslimat Türü */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm">Teslimat Türü</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    id="hizli"
                    checked={filters.deliveryTypes.includes("hizli")}
                    onCheckedChange={() => handleDeliveryTypeToggle("hizli")}
                  />
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-sm group-hover:text-orange-600">Hızlı Teslimat</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    id="randevulu"
                    checked={filters.deliveryTypes.includes("randevulu")}
                    onCheckedChange={() => handleDeliveryTypeToggle("randevulu")}
                  />
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm group-hover:text-orange-600">Randevulu Teslimat</span>
                </label>
              </div>
            </div>

            {/* Fiyat Aralığı */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                Fiyat Aralığı
              </h3>
              <div className="px-1">
                <Slider
                  value={filters.priceRange}
                  min={0}
                  max={500}
                  step={10}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, priceRange: value as [number, number] })
                  }
                  className="mb-3"
                />
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>₺{filters.priceRange[0]}</span>
                  <span>₺{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Kategoriler */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span>Kategoriler</span>
                {filters.categories.length > 0 && (
                  <Badge className="bg-orange-500 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {filters.categories.length}
                  </Badge>
                )}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                      filters.categories.includes(category.id)
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-white hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                Minimum Puan
              </h3>
              <div className="space-y-2">
                {[0, 4.0, 4.5].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={() => onFilterChange({ ...filters, rating })}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm group-hover:text-orange-600 flex items-center gap-1">
                      {rating > 0 ? (
                        <>
                          <span>{rating}</span>
                          <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                          <span className="text-gray-600">ve üzeri</span>
                        </>
                      ) : (
                        "Tüm Puanlar"
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Mesafe: {filters.distance} km
              </h3>
              <Slider
                value={[filters.distance]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, distance: value[0] })
                }
                className="mt-2"
              />
            </div>


          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2 bg-white pt-3 border-t">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={onClose}
            >
              Uygula
            </Button>
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={resetFilters}
            >
              Temizle
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
