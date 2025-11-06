import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import ShareRecipe from "./pages/ShareRecipe";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CookingTips from "./pages/CookingTips";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QnA from "./pages/QnA";
import QnADetail from "./pages/QnADetail";
import UserDashboard from "./pages/UserDashboard";
import Authors from "./pages/Authors";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import Regional from "./pages/Regional";
import QnANew from "./pages/QnANew";
import Discover from "./pages/Discover";
import MapView from "./pages/MapView";
import ChefDashboard from "./pages/ChefDashboard";
import ChefProfile from "./pages/ChefProfile";
import Stats from "./pages/Stats";
import ChefApplication from "./pages/ChefApplication";
import Marketplace from "./pages/Marketplace";
import InstantDelivery from "./pages/InstantDelivery";
import ScheduledOrder from "./pages/ScheduledOrder";
import Settings from "./pages/Settings";
import DebugUser from "./pages/DebugUser";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tarif/:id" element={<RecipeDetail />} />
            <Route path="/tarif-paylas" element={<ShareRecipe />} />
            <Route path="/tarifler" element={<Recipes />} />
            <Route path="/yoresel" element={<Regional />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profil/:username" element={<Profile />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/giris-yap" element={<Login />} />
            <Route path="/kayit-ol" element={<Register />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/ipuclari" element={<CookingTips />} />
            <Route path="/soru-cevap" element={<QnA />} />
            <Route path="/soru-cevap/:id" element={<QnADetail />} />
            <Route path="/soru-cevap/yeni" element={<QnANew />} />
            <Route path="/kontrol-paneli" element={<UserDashboard />} />
            <Route path="/yazarlar" element={<Authors />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/bildirimler" element={<Notifications />} />
            <Route path="/favoriler" element={<Favorites />} />
            <Route path="/kesfet" element={<Discover />} />
            <Route path="/harita" element={<MapView />} />
            <Route path="/sef-paneli" element={<ChefDashboard />} />
            <Route path="/sef/:id" element={<ChefProfile />} />
            <Route path="/sef-basvuru" element={<ChefApplication />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/hemen-teslimat" element={<InstantDelivery />} />
            <Route path="/randevulu-siparis" element={<ScheduledOrder />} />
            <Route path="/istatistikler" element={<Stats />} />
            <Route path="/ayarlar" element={<Settings />} />
            <Route path="/debug-user" element={<DebugUser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
