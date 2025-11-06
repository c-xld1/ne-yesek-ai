import { Home, Search, Plus, Map, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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
    { icon: Home, label: "Ana Sayfa", path: "/" },
    { icon: Search, label: "Keşfet", path: "/kesfet" },
    { icon: Plus, label: "Paylaş", path: "/tarif-paylas" },
    { icon: Map, label: "Harita", path: "/harita" },
    { icon: User, label: "Profil", path: "/profil", onClick: handleProfileClick },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === "/profil" && location.pathname.startsWith("/profil/"));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
