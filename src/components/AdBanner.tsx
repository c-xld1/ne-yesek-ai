import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  type?: "horizontal" | "vertical";
  sponsor?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  title,
  description,
  imageUrl,
  link,
  type = "horizontal",
  sponsor,
}) => {
  const handleClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  if (type === "vertical") {
    return (
      <Card
        className={`overflow-hidden rounded-2xl border-0 shadow-lg ${
          link ? "cursor-pointer hover:shadow-2xl transition-all" : ""
        }`}
        onClick={handleClick}
      >
        <div className="relative group">
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 backdrop-blur-sm z-10 text-xs">
            Sponsorlu
          </Badge>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            {description && <p className="text-sm text-white/90 mb-3">{description}</p>}
            {sponsor && (
              <p className="text-xs text-white/70">
                Sponsor: {sponsor}
              </p>
            )}
            {link && (
              <div className="flex items-center gap-1 text-sm font-medium mt-2">
                Detaylı Bilgi <ExternalLink className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden rounded-2xl border-0 shadow-lg ${
        link ? "cursor-pointer hover:shadow-2xl transition-all" : ""
      }`}
      onClick={handleClick}
    >
      <div className="relative group">
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 backdrop-blur-sm z-10 text-xs">
          Sponsorlu
        </Badge>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-2">{title}</h3>
              {description && <p className="text-sm text-white/90">{description}</p>}
            </div>
            {link && (
              <ExternalLink className="h-6 w-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
            )}
          </div>
          {sponsor && (
            <p className="text-xs text-white/70 mt-3">
              Sponsor: {sponsor}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AdBanner;
