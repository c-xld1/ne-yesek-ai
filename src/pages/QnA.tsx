import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Search, ThumbsDown, HelpCircle, Plus, User, Clock, Award } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuestions } from "@/hooks/useQnA";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";

interface QuestionFilters {
  category?: string;
  sortBy?: 'newest' | 'popular' | 'unanswered' | 'solved';
  search?: string;
}

const QnA = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'unanswered' | 'solved'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const questionsPerPage = 10;

  const filters: QuestionFilters = {
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy,
    search: searchQuery || undefined,
  };

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: questionsData, isLoading: questionsLoading } = useQuestions(filters);
  
  const questions = questionsData || [];
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = questions.slice((page - 1) * questionsPerPage, page * questionsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} gün önce`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} saat önce`;
    return 'Az önce';
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/soru/${questionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Soru & Cevap - Yemek Pişirme İpuçları | Yemek Tarifi Sitesi</title>
        <meta name="description" content="Yemek pişirme hakkında sorularınızı sorun, uzmanlardan ve topluluktan cevaplar alın. Tarif ipuçları, pişirme teknikleri ve daha fazlası." />
        <meta name="keywords" content="yemek soruları, pişirme ipuçları, tarif yardımı, mutfak sırları, yemek pişirme" />
        <link rel="canonical" href={`${window.location.origin}/soru-cevap`} />
      </Helmet>
      
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Soru & Cevap</h1>
          <p className="text-muted-foreground">Yemek pişirme hakkında sorularınızı sorun, deneyimlerinizi paylaşın</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Sorularda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => navigate('/soru-sor')}>
                <Plus className="mr-2 h-4 w-4" />
                Soru Sor
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Tümü
              </Button>
              {categoriesLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="newest">En Yeni</option>
                <option value="popular">En Popüler</option>
                <option value="unanswered">Cevaplanmamış</option>
                <option value="solved">Çözülmüş</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {questionsLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : paginatedQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz soru yok</h3>
                <p className="text-muted-foreground mb-4">İlk soruyu siz sorun!</p>
                <Button onClick={() => navigate('/soru-sor')}>Soru Sor</Button>
              </CardContent>
            </Card>
          ) : (
            paginatedQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuestionClick(question.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {question.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {question.content}
                      </p>
                    </div>
                    {question.is_solved && (
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Çözüldü
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={question.author_avatar || undefined} />
                            <AvatarFallback>{question.fullname?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground hover:text-primary transition-colors">
                            {question.fullname || question.username}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={question.author_avatar || undefined} />
                            <AvatarFallback>{question.fullname?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{question.fullname || question.username}</h4>
                            <p className="text-sm text-muted-foreground">@{question.username}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                              <span>Sorular: {questions.filter(q => q.user_id === question.user_id).length}</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.answer_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{question.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{question.dislikes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.category && (
                      <Badge variant="secondary">{question.category}</Badge>
                    )}
                    {question.tags?.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  {question.is_solved && question.answer_count > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md border-l-4 border-green-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Bu soru çözüldü olarak işaretlendi</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Önceki
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button 
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sonraki
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default QnA;
