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
  Activity,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Star,
  Percent,
  Bell,
  FileBarChart,
  Layout,
  Image,
  Database,
  Shield,
  Bot,
} from "lucide-react";

interface MenuItem {
  path: string;
  icon: any;
  label: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main", "content", "analytics", "system"]);

  const menuGroups: MenuGroup[] = [
    {
      label: "Ana Menü",
      items: [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      ],
    },
    {
      label: "Kullanıcı Yönetimi",
      items: [
        { path: "/admin/users", icon: Users, label: "Kullanıcılar" },
        { path: "/admin/chefs", icon: ChefHat, label: "Şefler" },
      ],
    },
    {
      label: "İçerik Yönetimi",
      items: [
        { path: "/admin/recipes", icon: FileText, label: "Tarifler" },
        { path: "/admin/blog", icon: MessageSquare, label: "Blog" },
        { path: "/admin/reviews", icon: Star, label: "Yorumlar" },
        { path: "/admin/content", icon: Layout, label: "İçerik CMS" },
        { path: "/admin/media", icon: Image, label: "Medya" },
      ],
    },
    {
      label: "Sipariş & Kampanya",
      items: [
        { path: "/admin/orders", icon: ShoppingBag, label: "Siparişler" },
        { path: "/admin/promotions", icon: Percent, label: "Promosyonlar" },
      ],
    },
    {
      label: "Analitik & Raporlar",
      items: [
        { path: "/admin/analytics", icon: BarChart3, label: "Analitik" },
        { path: "/admin/reports", icon: FileBarChart, label: "Raporlar" },
        { path: "/admin/activity-logs", icon: Activity, label: "Aktivite Günlüğü" },
      ],
    },
    {
      label: "İletişim & Bildirim",
      items: [
        { path: "/admin/notifications", icon: Bell, label: "Bildirimler" },
      ],
    },
    {
      label: "Sistem & Güvenlik",
      items: [
        { path: "/admin/seo", icon: Globe, label: "SEO Ayarları" },
        { path: "/admin/backup", icon: Database, label: "Yedekleme" },
        { path: "/admin/security", icon: Shield, label: "Güvenlik" },
        { path: "/admin/ai", icon: Bot, label: "AI Yönetimi" },
        { path: "/admin/settings", icon: Settings, label: "Ayarlar" },
      ],
    },
  ];

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupLabel)
        ? prev.filter((g) => g !== groupLabel)
        : [...prev, groupLabel]
    );
  };

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

  const getActiveGroupLabel = () => {
    for (const group of menuGroups) {
      if (group.items.some((item) => isActivePath(item.path))) {
        return group.items.find((item) => isActivePath(item.path))?.label || "Dashboard";
      }
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        } bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-30 flex flex-col lg:translate-x-0`}
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

        {/* Navigation with Collapsible Groups */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.label);
            const hasActiveItem = group.items.some((item) => isActivePath(item.path));

            return (
              <div key={group.label} className="mb-2">
                {/* Group Header */}
                {sidebarOpen ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    <span>{group.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <div className="h-8 border-t border-gray-100" />
                )}

                {/* Group Items */}
                {(isExpanded || !sidebarOpen) && (
                  <div className={sidebarOpen ? "pl-2" : ""}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
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
                  </div>
                )}
              </div>
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
      <div className={`flex-1 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
              {getActiveGroupLabel()}
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
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
