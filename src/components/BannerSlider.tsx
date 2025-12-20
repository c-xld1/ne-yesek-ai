import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  title?: string;
  link?: string;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  autoPlay = false,
  interval = 5000,
}) => {
  const handleBannerClick = (banner: Banner) => {
    if (banner.link) {
      window.location.href = banner.link;
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banners.slice(0, 3).map((banner) => (
        <div
          key={banner.id}
          className="relative group rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          onClick={() => handleBannerClick(banner)}
        >
          <img
            src={banner.image_url}
            alt={banner.title || "Banner"}
            className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {banner.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h3 className="text-white text-sm md:text-base font-bold">{banner.title}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;
