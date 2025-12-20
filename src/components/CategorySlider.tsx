import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  label: string;
  icon: string;
  count?: number;
  gradient?: string;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const gradients = [
  "from-orange-400 to-red-500",
  "from-green-400 to-emerald-500",
  "from-blue-400 to-cyan-500",
  "from-purple-400 to-pink-500",
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-teal-400 to-green-500",
  "from-indigo-400 to-purple-500",
  "from-red-400 to-orange-500",
  "from-cyan-400 to-blue-500",
];

const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
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
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background shadow-lg opacity-0 group-hover:opacity-100 transition-all h-10 w-10 p-0 rounded-full border border-border"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* All Categories Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory("all")}
          className={`relative flex flex-col items-center justify-center min-w-[90px] h-24 rounded-2xl transition-all duration-300 overflow-hidden ${
            selectedCategory === "all" || selectedCategory === null
              ? "ring-2 ring-primary ring-offset-2"
              : ""
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 ${
            selectedCategory === "all" || selectedCategory === null ? "opacity-100" : "opacity-80"
          }`} />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-3xl mb-1 drop-shadow-sm">🍽️</span>
            <span className="text-xs font-semibold text-foreground">Tümü</span>
          </div>
        </motion.button>

        {/* Category Items */}
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category.id)}
            className={`relative flex flex-col items-center justify-center min-w-[90px] h-24 rounded-2xl transition-all duration-300 overflow-hidden group/cat ${
              selectedCategory === category.id
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} ${
              selectedCategory === category.id ? "opacity-100" : "opacity-75 group-hover/cat:opacity-90"
            } transition-opacity`} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-3xl mb-1 drop-shadow-md">{category.icon}</span>
              <span className="text-xs font-semibold text-white drop-shadow-md text-center px-2 line-clamp-1">
                {category.label}
              </span>
              {category.count && category.count > 0 && (
                <span className="text-[10px] text-white/80 font-medium">
                  {category.count} yemek
                </span>
              )}
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cat:translate-x-full transition-transform duration-700" />
            </div>
          </motion.button>
        ))}
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

export default CategorySlider;
