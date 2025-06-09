
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, User, Heart, MessageCircle, Eye, TrendingUp } from "lucide-react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = [
    "Tümü", "Mutfak İpuçları", "Beslenme", "Sağlıklı Yaşam", "Mevsimsel", 
    "Dünya Mutfakları", "Trend Tarifler", "Ekipman İncelemeleri"
  ];

  const blogPosts = [
    {
      id: 1,
      title: "2024'ün En Trend Yemek Akımları",
      excerpt: "Bu yıl mutfaklarda hangi trendler öne çıkıyor? Fermente gıdalardan sürdürülebilir beslenmeye kadar...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
      author: {
        name: "Chef Ayşe Demir",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop"
      },
      category: "Trend Tarifler",
      date: "15 Şubat 2024",
      readTime: "5 dk",
      views: 2340,
      likes: 156,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "Evde Fermente Gıda Yapımı: Başlangıç Rehberi",
      excerpt: "Sağlığınıza faydalı fermente gıdaları evde nasıl yaparsınız? Kombucha'dan kimchiye pratik tarifler...",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop",
      author: {
        name: "Dr. Mehmet Özkan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
      },
      category: "Sağlıklı Yaşam",
      date: "12 Şubat 2024",
      readTime: "8 dk",
      views: 1890,
      likes: 98,
      comments: 45,
      featured: false
    },
    {
      id: 3,
      title: "Mutfak Ekipmanları: 2024'te Neye Yatırım Yapmalı?",
      excerpt: "Mutfağınızı yenilemek mi istiyorsunuz? İşte bu yıl öne çıkan mutfak aletleri ve tavsiyeleri...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
      author: {
        name: "Zeynep Çelik",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
      },
      category: "Ekipman İncelemeleri",
      date: "10 Şubat 2024",
      readTime: "6 dk",
      views: 1567,
      likes: 89,
      comments: 12,
      featured: false
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 Mutfak Blogu
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mutfak dünyasından en güncel haberler, ipuçları ve uzman görüşleri
          </p>
        </div>

        {/* Search and Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-food-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button className="gradient-primary text-white">
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
          <Card className="mb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
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
                        {featuredPost.date}
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
                  <Button className="gradient-primary text-white">
                    Devamını Oku
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-food-500 text-white text-xs">
                  {post.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
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
                      <span>{post.date}</span>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Daha Fazla Yazı Yükle
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
