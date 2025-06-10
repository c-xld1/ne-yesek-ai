import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import ShareRecipe from "./pages/ShareRecipe";
import Recipes from "./pages/Recipes";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CookingTips from "./pages/CookingTips";
import MenuPlanner from "./pages/MenuPlanner";
import VideoStoriesPage from "./pages/VideoStories";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QnA from "./pages/QnA";
import UserDashboard from "./pages/UserDashboard";
import Authors from "./pages/Authors";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import Seasonal from "./pages/Seasonal";
import Regional from "./pages/Regional";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tarif/:id" element={<RecipeDetail />} />
          <Route path="/tarif-paylas" element={<ShareRecipe />} />
          <Route path="/tarifler" element={<Recipes />} />
          <Route path="/kategoriler" element={<Categories />} />
          <Route path="/mevsimsel" element={<Seasonal />} />
          <Route path="/yoresel" element={<Regional />} />
          <Route path="/hikayeler" element={<VideoStoriesPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profil/:username" element={<Profile />} />
          <Route path="/giris-yap" element={<Login />} />
          <Route path="/kayit-ol" element={<Register />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/ipuclari" element={<CookingTips />} />
          <Route path="/menu-planlayici" element={<MenuPlanner />} />
          <Route path="/soru-cevap" element={<QnA />} />
          <Route path="/kontrol-paneli" element={<UserDashboard />} />
          <Route path="/yazarlar" element={<Authors />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/bildirimler" element={<Notifications />} />
          <Route path="/favoriler" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
