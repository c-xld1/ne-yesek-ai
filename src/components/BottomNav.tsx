import { Home, Search, Plus, Map, User, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.username) {
      navigate(`/profil/${user.username}`);
    } else {
      navigate("/profil");
    }
  };

  const navItems = [
    { icon: Home, label: "Ana Sayfa", path: "/", gradient: "from-orange-500 to-red-500" },
    { icon: Search, label: "Keşfet", path: "/kesfet", gradient: "from-blue-500 to-cyan-500" },
    { icon: Plus, label: "Paylaş", path: "/tarif-paylas", isMain: true, gradient: "from-orange-500 to-pink-500" },
    { icon: Map, label: "Harita", path: "/harita", gradient: "from-green-500 to-emerald-500" },
    { icon: User, label: "Profil", path: "/profil", onClick: handleProfileClick, gradient: "from-purple-500 to-indigo-500" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />
      
      {/* Safe area padding for iOS */}
      <div className="relative max-w-lg mx-auto px-2 pb-safe">
        <div className="flex justify-around items-end h-16 pt-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === "/profil" && location.pathname.startsWith("/profil/"));
            
            if (item.isMain) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative -mt-5"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg",
                      "bg-gradient-to-br from-primary to-orange-600",
                      "ring-4 ring-background"
                    )}
                  >
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-orange-600 blur-lg opacity-40 -z-10" />
                </Link>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className="relative flex-1 flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "relative p-1.5 rounded-xl transition-all duration-300",
                    isActive && "bg-primary/10"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive && "scale-110"
                    )} />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
