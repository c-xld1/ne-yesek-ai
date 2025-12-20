
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRecipes, useSearchRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/LoadingSpinner";

const Recipes = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(search);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [displayCount, setDisplayCount] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [maxCookingTime, setMaxCookingTime] = useState<number>(180);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: categories } = useCategories();
  const topRef = useRef<HTMLDivElement>(null);

  const { data: allRecipes, isLoading: loadingAll, error: errorAll } = useRecipes();
  const { data: searchRecipes, isLoading: loadingSearch, error: errorSearch } = useSearchRecipes(searchTerm);
  const recipes = searchTerm.trim() ? searchRecipes : allRecipes;
  const isLoading = searchTerm.trim() ? loadingSearch : loadingAll;
  const error = searchTerm.trim() ? errorSearch : errorAll;

  // Kategori filtreleme
  const currentCategory = slug ? categories?.find(cat => cat.slug === slug) : null;
  
  // Sıralama uygulanacak tarif listesi
  let filteredRecipes = recipes || [];
  
  // Kategoriye göre filtrele (URL'den gelen)
  if (currentCategory) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.category_id === currentCategory.id);
  }
  
  // Gelişmiş filtreler
  if (selectedCategory !== "all" && !currentCategory) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.category_id === parseInt(selectedCategory));
  }
  
  if (selectedDifficulty !== "all") {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === selectedDifficulty);
  }
  
  if (maxCookingTime < 180) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
      return totalTime <= maxCookingTime;
    });
  }
  
  if (minRating > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => (recipe.rating || 0) >= minRating);
  }

  // Sort recipes
  const sortedRecipes = (filteredRecipes || []).slice().sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  // Convert to component format
  const allFormattedRecipes = sortedRecipes.map(recipe => ({
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: `${(recipe.prep_time || 0) + (recipe.cook_time || 0)} dk`,
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Anonim",
    authorAvatar: recipe.avatar_url,
    authorUsername: recipe.username,
    dblScore: Math.round((recipe.rating || 0) * 20),
    description: recipe.description || "Açıklama mevcut değil.",
    category: recipe.category_name || "Genel",
    viewCount: recipe.view_count || 0,
    likeCount: recipe.like_count || 0,
    commentCount: recipe.comment_count || 0
  }));

  // Paginated recipes
  const formattedRecipes = allFormattedRecipes.slice(0, displayCount);
  const hasMore = displayCount < allFormattedRecipes.length;

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // Infinite scroll - load more when near bottom
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 800;
      
      if (scrollPosition >= bottomPosition && hasMore && !isLoadingMore) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore]);

  // Reset display count when search or filters change
  useEffect(() => {
    setDisplayCount(12);
    if (topRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchTerm, slug, selectedDifficulty, maxCookingTime, minRating, selectedCategory]);
  
  // Clear advanced filters function
  const clearAdvancedFilters = () => {
    setSelectedDifficulty("all");
    setMaxCookingTime(180);
    setMinRating(0);
    setSelectedCategory("all");
  };
  
  // Check if any advanced filter is active
  const hasActiveFilters = selectedDifficulty !== "all" || maxCookingTime < 180 || minRating > 0 || selectedCategory !== "all";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setIsLoadingMore(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Tarifler yüklenirken hata oluştu: {error.message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // SEO bilgileri
  const pageTitle = currentCategory 
    ? `${currentCategory.name} Tarifleri` 
    : "Tüm Tarifler";
  const pageDescription = currentCategory
    ? `${currentCategory.description}. ${allFormattedRecipes.length} adet ${currentCategory.name} tarifi bulunmaktadır.`
    : `${allFormattedRecipes.length} adet lezzetli tarif sizi bekliyor. En popüler yemek tariflerini keşfedin, AI destekli öneriler alın.`;
  const pageKeywords = currentCategory
    ? `${currentCategory.name}, ${currentCategory.slug}, yemek tarifi, kolay tarifler, ne yesek ai`
    : "yemek tarifleri, tarifler, kolay yemek, ne yesek ai, yemek önerileri";

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        url={currentCategory ? `/kategori/${currentCategory.slug}` : "/tarifler"}
        type="website"
      />
      
      <Navbar />

      <PageHeader
        title={currentCategory ? currentCategory.name : "Tüm Tarifler"}
        description={
          currentCategory 
            ? `${currentCategory.description}. ${allFormattedRecipes.length} tarif bulundu.`
            : `${allFormattedRecipes.length} adet lezzetli tarif sizi bekliyor. En popüler yemek tariflerini keşfedin!`
        }
        icon={currentCategory ? (
          <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ) : (
          <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
        badge={searchTerm ? `"${searchTerm}" için arama sonuçları` : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Tarif adı, yazar veya malzeme yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`${
                  hasActiveFilters || showAdvancedFilters
                    ? "bg-orange-50 text-orange-600 border-orange-300 hover:bg-orange-100"
                    : "hover:bg-gray-100"
                } rounded-xl px-4 py-2.5 text-sm font-medium transition-all relative`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Gelişmiş Filtreler</span>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
              </Button>
              
              {/* Sort Dropdown */}
              <div className="relative flex-1 lg:flex-initial min-w-[160px]">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <select
                  aria-label="Sırala"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer transition-all"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1.5 border border-gray-200">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md" 
                      : "hover:bg-gray-200 text-gray-600"
                  } rounded-lg transition-all px-3 py-2`}
                  title="Grid Görünümü"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md" 
                      : "hover:bg-gray-200 text-gray-600"
                  } rounded-lg transition-all px-3 py-2`}
                  title="Liste Görünümü"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Gelişmiş Filtreler
                    </h3>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAdvancedFilters}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Filtreleri Temizle
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    {!currentCategory && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📂 Kategori
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer transition-all"
                        >
                          <option value="all">Tüm Kategoriler</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🎯 Zorluk Seviyesi
                      </label>
                      <div className="flex gap-2">
                        {["all", "Kolay", "Orta", "Zor"].map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedDifficulty(level)}
                            className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              selectedDifficulty === level
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {level === "all" ? "Tümü" : level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cooking Time Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⏱️ Maksimum Süre: <span className="text-orange-600">{maxCookingTime} dk</span>
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="180"
                        step="15"
                        value={maxCookingTime}
                        onChange={(e) => setMaxCookingTime(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>15 dk</span>
                        <span>180 dk</span>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⭐ Minimum Puan: <span className="text-orange-600">{minRating > 0 ? minRating.toFixed(1) : "Tümü"}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {hasActiveFilters && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-orange-900">Aktif Filtreler:</span>
                        {selectedCategory !== "all" && (
                          <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-orange-200">
                            {categories?.find(c => c.id.toString() === selectedCategory)?.name}
                          </span>
                        )}
                        {selectedDifficulty !== "all" && (
                          <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-orange-200">
                            {selectedDifficulty}
                          </span>
                        )}
                        {maxCookingTime < 180 && (
                          <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-orange-200">
                            Max {maxCookingTime} dk
                          </span>
                        )}
                        {minRating > 0 && (
                          <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-orange-200">
                            Min {minRating.toFixed(1)} ⭐
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar with Active Filters */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="font-semibold text-gray-900">{allFormattedRecipes.length}</span>
                  <span className="text-gray-600">tarif bulundu</span>
                </span>
                
                {hasMore && (
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                    {formattedRecipes.length} / {allFormattedRecipes.length} gösteriliyor
                  </span>
                )}
                
                {currentCategory && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-semibold shadow-sm">
                    📂 {currentCategory.name}
                  </span>
                )}
                
                {searchTerm && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    "{searchTerm.substring(0, 20)}{searchTerm.length > 20 ? '...' : ''}"
                  </span>
                )}
              </div>
              
              {(searchTerm || currentCategory || hasActiveFilters) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    clearAdvancedFilters();
                    if (currentCategory) {
                      window.location.href = "/tarifler";
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tüm Filtreleri Temizle
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {formattedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aradığınız kriterlere uygun tarif bulunamadı
            </h3>
            <p className="text-gray-600 mb-6">
              Farklı anahtar kelimeler deneyin veya filtreleri değiştirin
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="rounded-xl"
              >
                Aramayı Temizle
              </Button>
            )}
          </div>
        ) : (
          <>
            <motion.div 
              className={`${viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="popLayout">
                {formattedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index < 12 ? index * 0.05 : 0 
                    }}
                  >
                    <RecipeCard {...recipe} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Loading Indicator for Infinite Scroll */}
            {isLoadingMore && (
              <motion.div 
                className="mt-12 text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg className="h-8 w-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-gray-600">Daha fazla tarif yükleniyor...</p>
                </div>
              </motion.div>
            )}

            {/* End Message */}
            {!hasMore && allFormattedRecipes.length > 12 && (
              <motion.div 
                className="mt-12 text-center py-8 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Tüm tarifler gösteriliyor • <strong>{allFormattedRecipes.length}</strong> tarif</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 group"
            aria-label="Yukarı Çık"
          >
            <svg className="h-6 w-6 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {hasMore && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${(formattedRecipes.length / allFormattedRecipes.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Recipes;
