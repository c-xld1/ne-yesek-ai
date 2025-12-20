import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Clock, TrendingUp, Heart } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  portion_size: string;
  prep_time: number;
  average_rating: number;
  order_count?: number;
  chef_profiles?: {
    business_name: string;
  };
}

interface FeaturedDishesSliderProps {
  dishes: MenuItem[];
  onAddToCart: (dish: MenuItem) => void;
}

const FeaturedDishesSlider: React.FC<FeaturedDishesSliderProps> = ({
  dishes,
  onAddToCart,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Dishes Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dishes.map((dish) => (
          <Card
            key={dish.id}
            className="min-w-[280px] hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="relative">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {dish.order_count && dish.order_count > 50 && (
                  <Badge className="bg-red-500 hover:bg-red-600 gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Çok Satan
                  </Badge>
                )}
                {dish.average_rating >= 4.5 && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    {dish.average_rating.toFixed(1)}
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 h-auto"
              >
                <Heart className="h-4 w-4" />
              </Button>

              {/* Price Badge */}
              <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-lg font-bold text-orange-600">
                  ₺{dish.price}
                </span>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {dish.name}
                </h3>
                {dish.chef_profiles && (
                  <p className="text-sm text-gray-600 truncate">
                    {dish.chef_profiles.business_name}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {dish.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {dish.category}
                </Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  {dish.prep_time} dk
                </Badge>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(dish);
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sepete Ekle
              </Button>
            </CardContent>
          </Card>
        ))}

        {dishes.length === 0 && (
          <div className="w-full text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Öne çıkan yemek bulunamadı</p>
          </div>
        )}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FeaturedDishesSlider;
