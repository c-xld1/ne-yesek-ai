import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  ChefHat,
  FileText,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Kullanıcılar" },
    { path: "/admin/chefs", icon: ChefHat, label: "Şefler" },
    { path: "/admin/recipes", icon: FileText, label: "Tarifler" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Siparişler" },
    { path: "/admin/blog", icon: MessageSquare, label: "Blog" },
    { path: "/admin/seo", icon: Globe, label: "SEO Ayarları" },
    { path: "/admin/settings", icon: Settings, label: "Ayarlar" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/giris-yap");
  };

  const isActivePath = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-30 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700 border-r-4 border-purple-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={(user as any)?.avatar_url} />
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find((item) => isActivePath(item.path))?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-600"
            >
              Web Sitesine Dön
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
