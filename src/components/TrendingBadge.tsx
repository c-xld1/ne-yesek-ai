
import { TrendingUp, Flame } from "lucide-react";

interface TrendingBadgeProps {
  type?: "trending" | "hot" | "new";
  pulse?: boolean;
}

const TrendingBadge = ({ type = "trending", pulse = false }: TrendingBadgeProps) => {
  const badges = {
    trending: {
      icon: TrendingUp,
      text: "Trend",
      className: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
    },
    hot: {
      icon: Flame,
      text: "Popüler",
      className: "bg-gradient-to-r from-red-500 to-orange-600 text-white"
    },
    new: {
      icon: TrendingUp,
      text: "Yeni",
      className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
    }
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badge.className} ${pulse ? 'animate-pulse' : ''}`}>
      <Icon className="h-3 w-3" />
      <span>{badge.text}</span>
    </div>
  );
};

export default TrendingBadge;
