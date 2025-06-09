import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RecipeDetail from "./pages/RecipeDetail";
import ShareRecipe from "./pages/ShareRecipe";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CookingTips from "./pages/CookingTips";
import MenuPlanner from "./pages/MenuPlanner";
import VideoStoriesPage from "./pages/VideoStories";

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
          <Route path="/hikayeler" element={<VideoStoriesPage />} />
          <Route path="/profil/:username" element={<Profile />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/ipuclari" element={<CookingTips />} />
          <Route path="/menu-planlayici" element={<MenuPlanner />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
