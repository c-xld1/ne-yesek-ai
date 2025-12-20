import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Tag, Percent, Gift, Clock, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

const gradientColors = [
  "from-orange-500 via-red-500 to-pink-500",
  "from-blue-500 via-purple-500 to-pink-500",
  "from-green-500 via-teal-500 to-cyan-500",
  "from-yellow-500 via-orange-500 to-red-500",
];

const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-6 w-6" />;
      case "gift":
        return <Gift className="h-6 w-6" />;
      default:
        return <Tag className="h-6 w-6" />;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Kod Kopyalandı!",
      description: `${code} panoya kopyalandı`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background shadow-lg opacity-0 group-hover:opacity-100 transition-all h-10 w-10 p-0 rounded-full border border-border"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Promotions Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {promotions.map((promotion, index) => (
          <motion.div
            key={promotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="min-w-[300px] cursor-pointer"
          >
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradientColors[index % gradientColors.length]} p-[2px]`}>
              <div className="relative bg-background rounded-2xl p-5 h-full">
                {/* Discount Badge */}
                <div className="absolute -top-1 -right-1">
                  <div className={`bg-gradient-to-r ${gradientColors[index % gradientColors.length]} text-white font-bold text-lg px-4 py-2 rounded-bl-2xl rounded-tr-xl shadow-lg`}>
                    {promotion.type === "gift" ? "HEDİYE" : `%${promotion.discount}`}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {promotion.image_url ? (
                      <img
                        src={promotion.image_url}
                        alt={promotion.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      getIcon(promotion.type)
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-bold text-foreground text-base mb-1 line-clamp-1">
                      {promotion.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {promotion.description}
                    </p>
                  </div>
                </div>

                {/* Code and Validity */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  {promotion.code && (
                    <button
                      onClick={() => copyCode(promotion.code!)}
                      className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-colors"
                    >
                      <span className="font-mono font-bold text-sm text-foreground">{promotion.code}</span>
                      {copiedCode === promotion.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(promotion.valid_until).toLocaleDateString("tr-TR")}'e kadar</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {promotions.length === 0 && (
          <div className="w-full text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Şu anda aktif kampanya bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background shadow-lg opacity-0 group-hover:opacity-100 transition-all h-10 w-10 p-0 rounded-full border border-border"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default PromotionSlider;
