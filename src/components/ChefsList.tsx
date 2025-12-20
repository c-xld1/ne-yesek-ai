import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, ChefHat, Clock, MapPin, TrendingUp, Package } from "lucide-react";

interface Chef {
  id: string;
  business_name: string;
  bio?: string;
  city: string;
  address?: string;
  average_rating: number;
  total_reviews: number;
  badges?: string[];
  specialty?: string[];
  average_prep_time?: number;
  minimum_order_amount?: number;
  is_accepting_orders?: boolean;
  order_count?: number;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface ChefsListProps {
  chefs: Chef[];
}

const ChefsList: React.FC<ChefsListProps> = ({ chefs }) => {
  const navigate = useNavigate();

  const handleChefClick = (chefId: string) => {
    navigate(`/sef/${chefId}`);
  };

  // Sort by popularity (rating * review count)
  const sortedChefs = [...chefs].sort((a, b) => {
    const scoreA = a.average_rating * a.total_reviews;
    const scoreB = b.average_rating * b.total_reviews;
    return scoreB - scoreA;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedChefs.map((chef, index) => (
        <Card
          key={chef.id}
          className="hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 overflow-hidden"
          onClick={() => handleChefClick(chef.id)}
        >
          <CardContent className="p-0">
            {/* Header with Avatar and Trending Badge */}
            <div className="relative bg-gradient-to-br from-orange-400 to-red-500 p-6">
              {index < 3 && (
                <Badge className="absolute top-2 right-2 bg-white text-orange-600 hover:bg-white gap-1">
                  <TrendingUp className="h-3 w-3" />
                  #{index + 1} Popüler
                </Badge>
              )}
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 border-4 border-white/50">
                  {chef.profiles?.avatar_url ? (
                    <img
                      src={chef.profiles.avatar_url}
                      alt={chef.business_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ChefHat className="h-10 w-10 text-orange-500" />
                  )}
                </div>

                <div className="flex-1 text-white">
                  <h3 className="font-bold text-xl mb-1">{chef.business_name}</h3>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <MapPin className="h-3 w-3" />
                    <span>{chef.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                  <span className="font-bold text-orange-700 text-lg">
                    {chef.average_rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {chef.total_reviews} değerlendirme
                </span>
                {chef.badges && chef.badges.length > 0 && (
                  <Award className="h-5 w-5 text-orange-500 ml-auto" />
                )}
              </div>

              {/* Bio */}
              {chef.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {chef.bio}
                </p>
              )}

              {/* Specialty */}
              {chef.specialty && chef.specialty.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {chef.specialty.slice(0, 3).map((spec) => (
                    <Badge
                      key={spec}
                      variant="outline"
                      className="text-xs border-orange-300 text-orange-700"
                    >
                      {spec}
                    </Badge>
                  ))}
                  {chef.specialty.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{chef.specialty.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {chef.average_prep_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{chef.average_prep_time} dk</span>
                  </div>
                )}
                
                {chef.minimum_order_amount && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4 text-orange-500" />
                    <span>Min. ₺{chef.minimum_order_amount}</span>
                  </div>
                )}

                {chef.order_count && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span>{chef.order_count}+ sipariş tamamlandı</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              {chef.badges && chef.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {chef.badges.slice(0, 2).map((badge) => (
                    <Badge
                      key={badge}
                      variant="secondary"
                      className="text-xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Order Status & Button */}
              <div className="space-y-2">
                {chef.is_accepting_orders ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-full justify-center">
                    Sipariş Alıyor
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 w-full justify-center">
                    Şu Anda Kapalı
                  </Badge>
                )}
                
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChefClick(chef.id);
                  }}
                >
                  Menüyü Görüntüle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {sortedChefs.length === 0 && (
        <div className="col-span-full text-center py-16 text-gray-500">
          <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Şef Bulunamadı</h3>
          <p>Şu anda aktif şef bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default ChefsList;
