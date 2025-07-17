import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, MessageCircle, ThumbsUp, User, Clock, Award, HelpCircle, BookOpen, Eye } from "lucide-react";
// import { useQuestions, useCreateQuestion, QuestionFilters } from "@/hooks/useQnA";
import { useAuth } from "@/contexts/AuthContext";

// Geçici type tanımları
interface QuestionFilters {
  category?: string;
  sortBy?: 'newest' | 'popular' | 'unanswered' | 'solved';
  search?: string;
}

const QnA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "unanswered" | "solved">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: QuestionFilters = {
    category: selectedCategory === "Tümü" ? undefined : selectedCategory,
    sortBy,
    search: searchQuery.trim() || undefined
  };

  // Geçici mock data - Supabase çalışmazsa
  const mockQuestions = [
    {
      id: "1",
      title: "Kek yapışıyor, nasıl çözerim?",
      content: "Her kek yaptığımda kalıba yapışıyor ve güzel çıkmıyor. Ne yapabilirim?",
      category: "Sorun Giderme",
      author_id: "user1",
      author_name: "Ayşe K.",
      author_avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop",
      author_reputation: 156,
      views: 340,
      likes: 23,
      dislikes: 2,
      is_solved: true,
      created_at: "2025-07-09T10:00:00.000Z",
      updated_at: "2025-07-09T10:00:00.000Z",
      answer_count: 8,
      best_answer: {
        id: "a1",
        content: "Kalıbı tereyağıyla iyice yağlayın, sonra un serpin. Ayrıca pişirme kağıdı kullanmayı deneyin.",
        author_name: "Chef Mehmet",
        likes: 45
      }
    },
    {
      id: "2",
      title: "Mercimek çorbası tuzsuz çıktı, nasıl düzeltebilirim?",
      content: "Çorbayı pişirdim ama çok tuzsuz oldu. Sonradan tuz ekliyorum ama tadı güzel olmuyor.",
      category: "Pişirme Teknikleri",
      author_id: "user2",
      author_name: "Zeynep M.",
      author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      author_reputation: 89,
      views: 267,
      likes: 18,
      dislikes: 1,
      is_solved: false,
      created_at: "2025-07-09T08:00:00.000Z",
      updated_at: "2025-07-09T08:00:00.000Z",
      answer_count: 5,
      best_answer: null
    },
    {
      id: "3",
      title: "Hangi yağ daha sağlıklı?",
      content: "Zeytinyağı mı, ayçiçek yağı mı yoksa tereyağı mı daha sağlıklı? Hangi yemekte hangisini kullanmalıyım?",
      category: "Beslenme",
      author_id: "user3",
      author_name: "Fatma Y.",
      author_avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop",
      author_reputation: 234,
      views: 789,
      likes: 56,
      dislikes: 3,
      is_solved: true,
      created_at: "2025-07-08T15:00:00.000Z",
      updated_at: "2025-07-08T15:00:00.000Z",
      answer_count: 12,
      best_answer: {
        id: "a2",
        content: "Zeytinyağı soğuk yemeklerde, ayçiçek yağı kızartmalarda, tereyağı ise hamur işlerinde tercih edilmeli.",
        author_name: "Beslenme Uzmanı",
        likes: 78
      }
    }
  ];

  // Hook'ları geçici olarak devre dışı bırak, mock data kullan
  const questions = mockQuestions;
  const isLoading = false;
  const error = null;

  // const { data: questions = [], isLoading, error } = useQuestions(filters);
  // const createQuestionMutation = useCreateQuestion();

  const categories = [
    "Tümü", "Pişirme Teknikleri", "Malzeme Soruları", "Ekipman",
    "Beslenme", "Başlangıç Soruları", "Sorun Giderme", "Tarif İstekleri"
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} gün önce`;
    if (hours > 0) return `${hours} saat önce`;
    if (minutes > 0) return `${minutes} dakika önce`;
    return "Az önce";
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/soru-cevap/${questionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PremiumHeader
          title="Soru & Cevap"
          description="Mutfakla ilgili sorularınızı sorun, deneyimli yemek severlerden cevap alın. Toplulukla bilgi paylaşın."
          emoji="❓"
          primaryBadge={{
            icon: HelpCircle,
            text: "Soru Sor",
            animate: true
          }}
          secondaryBadge={{
            icon: BookOpen,
            text: "Bilgi Paylaş"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/", isActive: false },
            { label: "Soru & Cevap", isActive: true }
          ]}
        />

        {/* Search and Ask Question */}
        <Card className="overflow-hidden border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400" />
                  <Input
                    type="text"
                    placeholder="Sorularda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-orange-200 focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                  />
                </div>
              </div>

              {user ? (
                <Button
                  onClick={() => navigate('/soru-cevap/yeni')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Soru Sor
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/giris-yap")}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Soru Sor
                </Button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "popular" | "unanswered" | "solved")}
                  className="border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  title="Sıralama Seçenekleri"
                >
                  <option value="newest">En Yeni</option>
                  <option value="popular">En Popüler</option>
                  <option value="unanswered">Cevaplanmamış</option>
                  <option value="solved">Çözülmüş</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Hata oluştu</h3>
              <p className="text-red-600">Sorular yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
            </CardContent>
          </Card>
        ) : questions.length === 0 ? (
          <Card className="border-orange-200 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "Tümü" ? "Arama sonucu bulunamadı" : "Henüz soru yok"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== "Tümü"
                  ? "Arama kriterlerinizi değiştirmeyi deneyin."
                  : "İlk soruyu siz sorun!"
                }
              </p>
              {user && (
                <Button
                  onClick={() => navigate('/soru-cevap/yeni')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Soru Sor
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card
                key={question.id}
                className="hover:shadow-xl transition-all duration-300 border-orange-200 bg-white/90 backdrop-blur-sm cursor-pointer transform hover:-translate-y-1 group"
                onClick={() => handleQuestionClick(question.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-orange-100 group-hover:ring-orange-200 transition-all">
                      <AvatarImage src={question.author_avatar} />
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                        {question.author_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {question.title}
                        </h3>
                        {question.is_solved && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 shadow-sm">
                            <Award className="h-3 w-3 mr-1" />
                            Çözüldü
                          </Badge>
                        )}
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 shadow-sm">
                          {question.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{question.content}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{question.author_name}</span>
                          <span className="text-orange-600 font-medium">({question.author_reputation} puan)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(question.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="font-medium">{question.answer_count || 0}</span> cevap
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="font-medium">{question.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">{question.views}</span> görüntülenme
                        </div>
                      </div>

                      {question.best_answer && (
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-800">En İyi Cevap</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2 line-clamp-2 leading-relaxed">{question.best_answer.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">{question.best_answer.author_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span className="font-medium">{question.best_answer.likes}</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && questions.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-orange-200 text-orange-600 hover:bg-orange-50 shadow-md">
              Daha Fazla Soru Yükle
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default QnA;
