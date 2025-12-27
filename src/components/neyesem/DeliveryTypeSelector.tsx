import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Zap, Calendar, Clock } from 'lucide-react';

interface DeliveryTypeSelectorProps {
  selected: 'instant' | 'scheduled';
  onSelect: (type: 'instant' | 'scheduled') => void;
}

const DeliveryTypeSelector: React.FC<DeliveryTypeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={`cursor-pointer transition-all ${
            selected === 'instant' 
              ? 'border-2 border-primary bg-primary/5' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelect('instant')}
        >
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              selected === 'instant' ? 'bg-primary text-white' : 'bg-muted'
            }`}>
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-1">Hızlı Teslimat</h3>
            <p className="text-sm text-muted-foreground mb-2">
              30-60 dakika içinde
            </p>
            <Badge variant={selected === 'instant' ? 'default' : 'secondary'}>
              <Clock className="w-3 h-3 mr-1" />
              Şimdi hazır
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={`cursor-pointer transition-all ${
            selected === 'scheduled' 
              ? 'border-2 border-primary bg-primary/5' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelect('scheduled')}
        >
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
              selected === 'scheduled' ? 'bg-primary text-white' : 'bg-muted'
            }`}>
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-1">Randevulu</h3>
            <p className="text-sm text-muted-foreground mb-2">
              İstediğin gün ve saat
            </p>
            <Badge variant={selected === 'scheduled' ? 'default' : 'secondary'}>
              <Calendar className="w-3 h-3 mr-1" />
              Tarih seç
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeliveryTypeSelector;
