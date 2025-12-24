import Hero from "@/components/Hero";
import Navbar from "../components/Navbar.tsx";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import VideoStories from "@/components/VideoStories";
import CategoryShowcase from "@/components/CategoryShowcase";
import RecipeCard from "@/components/RecipeCard";
import { Newsletter } from "@/components/Newsletter";
import { useFeaturedRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import { useTestData } from "@/hooks/useTestData";
import LoadingSpinner from "@/components/LoadingSpinner";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { data: featuredRecipes, isLoading: recipesLoading, error: recipesError } = useFeaturedRecipes();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const testData = useTestData();

  // Format recipes for RecipeCard component
  const formattedRecipes = featuredRecipes?.map(recipe => ({
    id: recipe.id,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: `${(recipe.prep_time || 0) + (recipe.cook_time || 0)} dk`,
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Anonim",
    authorUsername: recipe.author_username,
    authorAvatar: recipe.author_avatar,
    dblScore: Math.round((recipe.rating || 0) * 20),
    description: recipe.description || "Açıklama mevcut değil.",
    category: recipe.category_name || "Genel"
  })) || [];

  return (
    <div className="min-h-screen gradient-page">
      <SEOHead 
        title="Ne Yesek AI - Yapay Zeka Destekli Tarif Platformu"
        description="Milyonlarca tarif, AI destekli kişisel öneriler ve mutfak deneyiminizi kolaylaştıran teknoloji. Ne Yesek AI ile lezzetli tarifler keşfedin!"
        keywords="tarif, yemek tarifi, mutfak, ai tarif, yapay zeka, ne yesek, yemek önerisi, kolay tarifler, Türk mutfağı"
        url="/"
        type="website"
      />
      <Navbar />

      <Hero />
      
      <VideoStories />

      {/* Category Showcase with Recipe Sliders */}
      <CategoryShowcase />

      {/* Featured Recipes Section */}
      {formattedRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-4 text-sm font-semibold">
              <Star className="h-4 w-4 fill-current" />
              Öne Çıkan Tarifler
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              En Popüler Lezzetler
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Toplumun en çok sevdiği ve denediği tarifleri keşfedin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {formattedRecipes.slice(0, 6).map((recipe, index) => (
              <motion.div 
                key={recipe.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="hover-lift"
              >
                <RecipeCard {...recipe} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/tarifler">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground font-semibold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Tüm Tarifleri Gör
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Error State for Recipes */}
      {recipesError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center glass-morphism rounded-2xl p-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-2xl">⚠️</span>
            </div>
            <p className="text-destructive font-semibold text-lg">Tarifler yüklenirken hata oluştu</p>
            <p className="text-muted-foreground text-sm mt-2">Lütfen daha sonra tekrar deneyin</p>
          </div>
        </section>
      )}

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
