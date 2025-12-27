import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Sparkles, RefreshCw } from 'lucide-react';

interface AILocationBannerProps {
  userLocation: { latitude: number; longitude: number } | null;
  onRefreshLocation: () => void;
  matchedCount: number;
  loading: boolean;
}

const AILocationBanner: React.FC<AILocationBannerProps> = ({
  userLocation,
  onRefreshLocation,
  matchedCount,
  loading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  AI Şef Eşleştirme
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userLocation 
                    ? `Konumunuza göre ${matchedCount} onaylı kadın şef bulundu`
                    : 'Konum izni vererek size en uygun şefleri bulun'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {userLocation && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>
                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefreshLocation}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    {userLocation ? 'Yenile' : 'Konum Al'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* AI Features List */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              🎯 Mesafe optimizasyonu
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⚡ Anlık yoğunluk analizi
            </Badge>
            <Badge variant="outline" className="text-xs">
              🛡️ Güven skoru
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⏱️ Tahmini teslimat süresi
            </Badge>
            <Badge variant="outline" className="text-xs">
              ✨ Kişiselleştirilmiş öneriler
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AILocationBanner;
