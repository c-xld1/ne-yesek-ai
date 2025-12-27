import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react';

interface AIChefCardProps {
  chef: {
    id: string;
    business_name: string;
    description?: string;
    city?: string;
    rating?: number;
    trust_score?: number;
    avg_prep_time?: number;
    is_verified?: boolean;
    ai_status_label?: string;
    meals?: any[];
  };
  distance_km: number;
  score: number;
  reasons: string[];
  estimated_delivery_time: number;
  ai_status: string;
}

const AIChefCard: React.FC<AIChefCardProps> = ({
  chef,
  distance_km,
  score,
  reasons,
  estimated_delivery_time,
  ai_status
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bugün hızlı': return 'bg-green-500';
      case 'Müsait': return 'bg-blue-500';
      case 'Yoğun': return 'bg-yellow-500';
      case 'Çok yoğun': return 'bg-red-500';
      case 'Favori': return 'bg-purple-500';
      case 'Yeni şef': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer group">
        <CardContent className="p-0">
          {/* Header with AI Status */}
          <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {chef.business_name?.charAt(0) || 'Ş'}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {chef.business_name}
                    {chef.is_verified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{chef.city || 'İstanbul'}</span>
                    <span>•</span>
                    <span>{distance_km} km</span>
                  </div>
                </div>
              </div>
              
              <Badge className={`${getStatusColor(ai_status)} text-white`}>
                <Sparkles className="w-3 h-3 mr-1" />
                {ai_status}
              </Badge>
            </div>

            {/* AI Score Indicator */}
            <div className="absolute top-2 right-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                AI Skor: {Math.round(score)}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{chef.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <span className="text-xs text-muted-foreground">Puan</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-bold">{estimated_delivery_time} dk</span>
              </div>
              <span className="text-xs text-muted-foreground">Teslimat</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="font-bold">{chef.trust_score || 100}</span>
              </div>
              <span className="text-xs text-muted-foreground">Güven</span>
            </div>
          </div>

          {/* AI Reasons */}
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {reasons.slice(0, 3).map((reason, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {reason}
                </Badge>
              ))}
            </div>

            {/* Sample Meals */}
            {chef.meals && chef.meals.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {chef.meals.slice(0, 3).map((meal: any) => (
                  <div key={meal.id} className="flex-shrink-0">
                    <img 
                      src={meal.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'}
                      alt={meal.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                ))}
                {chef.meals.length > 3 && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    +{chef.meals.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-4 pb-4 flex gap-2">
            <Button 
              className="flex-1" 
              onClick={() => navigate(`/sef/${chef.id}`)}
            >
              Menüyü Gör
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => navigate(`/neyesem/harita?chef=${chef.id}`)}
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIChefCard;
