import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Tag, Percent, Gift, Clock } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  code?: string;
  image_url?: string;
  valid_until: string;
  type: "percentage" | "fixed" | "gift";
}

interface PromotionSliderProps {
  promotions: Promotion[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-5 w-5" />;
      case "gift":
        return <Gift className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Promotions Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {promotions.map((promotion) => (
          <Card
            key={promotion.id}
            className="min-w-[280px] hover:shadow-lg transition-all cursor-pointer border rounded-xl overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {promotion.image_url ? (
                      <img
                        src={promotion.image_url}
                        alt={promotion.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getIcon(promotion.type)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1">
                      {promotion.title}
                    </h3>
                    {promotion.code && (
                      <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                        {promotion.code}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Discount Badge */}
                <Badge className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 flex-shrink-0">
                  %{promotion.discount}
                </Badge>
              </div>

              <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                {promotion.description}
              </p>

              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="h-3 w-3" />
                <span>{new Date(promotion.valid_until).toLocaleDateString("tr-TR")}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {promotions.length === 0 && (
          <div className="w-full text-center py-8 text-gray-500">
            <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Şu anda aktif kampanya bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PromotionSlider;
