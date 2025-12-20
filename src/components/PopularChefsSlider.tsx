import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Award, ChefHat, Clock, MapPin } from "lucide-react";

interface Chef {
  id: string;
  slug?: string;
  business_name: string;
  bio?: string;
  city: string;
  address?: string;
  average_rating: number;
  total_reviews: number;
  badges?: string[];
  specialty?: string[];
  average_prep_time?: number;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface PopularChefsSliderProps {
  chefs: Chef[];
}

const PopularChefsSlider: React.FC<PopularChefsSliderProps> = ({ chefs }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleChefClick = (chef: Chef) => {
    navigate(`/sef/${chef.slug || chef.id}`);
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

      {/* Chefs Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {chefs.map((chef) => (
          <Card
            key={chef.id}
            className="min-w-[280px] hover:shadow-lg transition-all cursor-pointer border rounded-xl overflow-hidden"
            onClick={() => handleChefClick(chef)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                    {chef.profiles?.avatar_url ? (
                      <img
                        src={chef.profiles.avatar_url}
                        alt={chef.business_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ChefHat className="h-8 w-8" />
                    )}
                  </div>
                  {chef.badges && chef.badges.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-gray-900 mb-0.5 line-clamp-1">
                    {chef.business_name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{chef.city}</span>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded">
                      <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                      <span className="font-bold text-xs text-orange-700">
                        {chef.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({chef.total_reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialty Tags */}
              {chef.specialty && chef.specialty.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {chef.specialty.slice(0, 2).map((spec) => (
                    <Badge
                      key={spec}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Prep Time */}
              {chef.average_prep_time && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{chef.average_prep_time} dk</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {chefs.length === 0 && (
          <div className="w-full text-center py-8 text-gray-500">
            <ChefHat className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Popüler şef bulunamadı</p>
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

export default PopularChefsSlider;
