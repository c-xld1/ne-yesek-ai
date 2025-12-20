import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Calendar, Gift, MapPin, Flame, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  action: () => void;
}

interface NeYesemQuickActionsProps {
  onFilterDeliveryType: (type: string) => void;
}

const NeYesemQuickActions: React.FC<NeYesemQuickActionsProps> = ({ onFilterDeliveryType }) => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      icon: Zap,
      label: "Hızlı Teslimat",
      description: "30 dk içinde",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      action: () => onFilterDeliveryType("hizli"),
    },
    {
      icon: Calendar,
      label: "Randevulu",
      description: "İstediğin saatte",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      action: () => onFilterDeliveryType("randevulu"),
    },
    {
      icon: Flame,
      label: "Günün Fırsatı",
      description: "%50'ye varan",
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
      action: () => {},
    },
    {
      icon: MapPin,
      label: "Yakınımdakiler",
      description: "Haritada gör",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      action: () => navigate("/neyesem/harita"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={action.action}
          className={`${action.bgColor} rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md group border border-transparent hover:border-border/50`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${action.color} bg-white/80 shadow-sm`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${action.color}`}>{action.label}</p>
              <p className="text-xs text-muted-foreground truncate">{action.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default NeYesemQuickActions;
