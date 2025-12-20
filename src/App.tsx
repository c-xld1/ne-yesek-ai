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
import BlogDetail from "./pages/BlogDetail";
import CreateBlogPost from "./pages/CreateBlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QnA from "./pages/QnA";
import QnADetail from "./pages/QnADetail";
import Authors from "./pages/Authors";
import AdminLayout from "./components/admin/AdminLayout";
import AdminGuard from "./components/admin/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminChefs from "./pages/admin/AdminChefs";
import AdminRecipes from "./pages/admin/AdminRecipes";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import SEOAdmin from "./pages/admin/SEOAdmin";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminReports from "./pages/admin/AdminReports";
import AdminContent from "./pages/admin/AdminContent";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminBackup from "./pages/admin/AdminBackup";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminAI from "./pages/admin/AdminAI";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import Regional from "./pages/Regional";
import QnANew from "./pages/QnANew";
import ChefDashboard from "./pages/ChefDashboard";
import ChefProfile from "./pages/ChefProfile";
import ChefApplication from "./pages/ChefApplication";
import NeYesem from "./pages/NeYesem";
import Chefs from "./pages/Chefs";
import FoodDetail from "./pages/FoodDetail";
import Settings from "./pages/Settings";
import GamificationAdmin from "./pages/GamificationAdmin";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MapView from "./pages/MapView";

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
            <Route path="/tarif/:slug" element={<RecipeDetail />} />
            <Route path="/tarif-paylas" element={<ShareRecipe />} />
            <Route path="/tarifler" element={<Recipes />} />
            <Route path="/kategori/:slug" element={<Recipes />} />
            <Route path="/yoresel" element={<Regional />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/blog/yeni" element={<CreateBlogPost />} />
            <Route path="/profil/:username" element={<Profile />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/giris-yap" element={<Login />} />
            <Route path="/kayit-ol" element={<Register />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/ipuclari" element={<CookingTips />} />
            <Route path="/soru-cevap" element={<QnA />} />
            <Route path="/soru-cevap/:slug" element={<QnADetail />} />
            <Route path="/soru-cevap/yeni" element={<QnANew />} />
            <Route path="/yazarlar" element={<Authors />} />
            
            {/* Admin Routes with separate layout and guard */}
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="chefs" element={<AdminChefs />} />
              <Route path="recipes" element={<AdminRecipes />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="seo" element={<SEOAdmin />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="backup" element={<AdminBackup />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="ai" element={<AdminAI />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            <Route path="/bildirimler" element={<Notifications />} />
            <Route path="/favoriler" element={<Favorites />} />
            <Route path="/neyesem" element={<NeYesem />} />
            <Route path="/neyesem/urun/:slug" element={<FoodDetail />} />
            <Route path="/neyesem/harita" element={<MapView />} />
            <Route path="/sefler" element={<Chefs />} />
            <Route path="/sef-paneli" element={<ChefDashboard />} />
            <Route path="/sef/:slug" element={<ChefProfile />} />
            <Route path="/sef-basvuru" element={<ChefApplication />} />
            <Route path="/neyesem/sepet" element={<Cart />} />
            <Route path="/neyesem/odeme" element={<Checkout />} />
            <Route path="/ayarlar" element={<Settings />} />
            <Route path="/gamification-admin" element={<GamificationAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
