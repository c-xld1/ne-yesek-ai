import React from "react";
import { ChefHat, UtensilsCrossed, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: ChefHat, value: "200+", label: "Ev Şefi", color: "from-orange-500 to-red-500" },
  { icon: UtensilsCrossed, value: "1500+", label: "Yemek Çeşidi", color: "from-green-500 to-emerald-500" },
  { icon: Star, value: "4.9", label: "Ortalama Puan", color: "from-yellow-500 to-orange-500" },
  { icon: Truck, value: "30dk", label: "Ortalama Teslimat", color: "from-blue-500 to-cyan-500" },
];

const NeYesemHeroStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative group"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NeYesemHeroStats;
