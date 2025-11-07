
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, User, Heart, MessageCircle, Eye, TrendingUp, BookOpen, PenTool } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogPosts, isLoading, error } = useBlogPosts(selectedCategory === "Tümü" ? undefined : selectedCategory);

  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const categories = [
    "Tümü", "Mutfak İpuçları", "Beslenme", "Sağlıklı Yaşam", "Mevsimsel",
    "Dünya Mutfakları", "Trend Tarifler", "Ekipman İncelemeleri"
  ];

  // Filter posts by search query
  const filteredPosts = blogPosts?.filter(post => 
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Blog yazıları yükleniyor..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <SEOHead 
        title="Mutfak Blogu - Ne Yesek AI"
        description="Mutfak dünyasından en güncel haberler, ipuçları ve uzman görüşleri. Sağlıklı yaşam, beslenme ve yemek trendlerini keşfedin."
        keywords="mutfak blogu, yemek yazıları, mutfak ipuçları, beslenme, sağlıklı yaşam, yemek trendleri"
        url="/blog"
        type="website"
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Premium Header */}
        <PremiumHeader
          title="Mutfak Blogu"
          description="Mutfak dünyasından en güncel haberler, ipuçları ve uzman görüşleri"
          emoji="📝"
          primaryBadge={{
            icon: BookOpen,
            text: "Oku",
            animate: true
          }}
          secondaryBadge={{
            icon: PenTool,
            text: "Mutfak Yazıları"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Blog", isActive: true }
          ]}
        />

        {/* Search and Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-food-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button 
              className="gradient-primary text-white"
              onClick={() => navigate("/blog/yeni")}
            >
              + Yazı Yaz
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-8 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300" onClick={() => handlePostClick(featuredPost.id)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto overflow-hidden group">
                <img
                  src={featuredPost.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Öne Çıkan
                </Badge>
              </div>
              <CardContent className="p-8">
                <Badge className="mb-3 bg-food-100 text-food-800">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={featuredPost.author.avatar} />
                    <AvatarFallback>{featuredPost.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{featuredPost.author.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(featuredPost.date).toLocaleDateString('tr-TR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span>{featuredPost.readTime} okuma</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredPost.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {featuredPost.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {featuredPost.comments}
                    </span>
                  </div>
                  <Button 
                    className="gradient-primary text-white hover:shadow-lg transition-shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(featuredPost.id);
                    }}
                  >
                    Devamını Oku
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => handlePostClick(post.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-food-500 text-white text-xs">
                    {post.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-xs">{post.author.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{new Date(post.date).toLocaleDateString('tr-TR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery ? "Arama sonucu bulunamadı" : "Henüz blog yazısı yok"}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Farklı bir arama terimi deneyin" 
                  : "İlk blog yazısını siz yazın!"}
              </p>
            </div>
          </div>
        )}

        {/* Load More */}
        {regularPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Daha Fazla Yazı Yükle
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
