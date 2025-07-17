import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    User,
    Clock,
    Award,
    Reply,
    Star,
    Eye,
    ArrowLeft
} from "lucide-react";
// import {
//     useQuestion,
//     useCreateAnswer,
//     useToggleQuestionLike,
//     useToggleAnswerLike,
//     useMarkBestAnswer,
//     useAddQuestionView
// } from "@/hooks/useQnA";
import { useAuth } from "@/contexts/AuthContext";

const QnADetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [answerContent, setAnswerContent] = useState("");
    const [isAnswering, setIsAnswering] = useState(false);

    // Mock data
    const mockQuestion = {
        id: id || "1",
        title: "Kek yapışıyor, nasıl çözerim?",
        content: "Her kek yaptığımda kalıba yapışıyor ve güzel çıkmıyor. Ne yapabilirim? Özellikle çikolatalı keklerde bu problem daha çok oluyor. Kalıbı yağlayıp unla bulguluyorum ama yine de yapışıyor.",
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
        answers: [
            {
                id: "a1",
                content: "Kalıbı tereyağıyla iyice yağlayın, sonra un serpin. Ayrıca pişirme kağıdı kullanmayı deneyin. Bu yöntem %100 çalışır.",
                author_name: "Chef Mehmet",
                author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
                likes: 45,
                dislikes: 1,
                is_best_answer: true,
                created_at: "2025-07-09T10:30:00.000Z",
                updated_at: "2025-07-09T10:30:00.000Z"
            },
            {
                id: "a2",
                content: "Benim de başıma geliyordu. Kalıbı 5 dakika buzdolabında soğutmayı deneyin, sonra kek hamurunu dökün.",
                author_name: "Zeynep Y.",
                author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
                likes: 12,
                dislikes: 0,
                is_best_answer: false,
                created_at: "2025-07-09T11:00:00.000Z",
                updated_at: "2025-07-09T11:00:00.000Z"
            }
        ]
    };

    const question = mockQuestion;
    const isLoading = false;
    const error = null;

    // const { data: question, isLoading, error } = useQuestion(id!);
    // const createAnswerMutation = useCreateAnswer();
    // const toggleQuestionLike = useToggleQuestionLike();
    // const toggleAnswerLike = useToggleAnswerLike();
    // const markBestAnswer = useMarkBestAnswer();
    // const addView = useAddQuestionView();

    // Sayfa yüklendiğinde view ekle - mock
    useEffect(() => {
        if (id) {
            console.log("View eklendi (mock):", id);
        }
    }, [id]);

    const handleSubmitAnswer = async () => {
        if (!answerContent.trim() || !id) return;

        // Mock cevap ekleme
        console.log("Cevap eklendi (mock):", {
            question_id: id,
            content: answerContent.trim()
        });

        setAnswerContent("");
        setIsAnswering(false);
        alert("Cevabınız başarıyla eklendi! (Mock data)");
    };

    const handleQuestionLike = (isLike: boolean) => {
        console.log("Soru beğenildi (mock):", { question_id: id, is_like: isLike });
    };

    const handleAnswerLike = (answerId: string, isLike: boolean) => {
        console.log("Cevap beğenildi (mock):", { answer_id: answerId, is_like: isLike });
    };

    const handleMarkBestAnswer = (answerId: string) => {
        console.log("En iyi cevap seçildi (mock):", { answer_id: answerId, question_id: id });
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Soru bulunamadı</h2>
                            <p className="text-red-600 mb-4">Aradığınız soru mevcut değil veya kaldırılmış olabilir.</p>
                            <Button onClick={() => navigate("/soru-cevap")} variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Sorulara Dön
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <PremiumHeader
                    title="Soru Detayı"
                    description="Soruyu inceleyin, cevapları okuyun ve kendi deneyimlerinizi paylaşın."
                    emoji="💬"
                    primaryBadge={{
                        icon: MessageCircle,
                        text: `${question.answers?.length || 0} Cevap`,
                        animate: false
                    }}
                    secondaryBadge={{
                        icon: Eye,
                        text: `${question.views} Görüntülenme`
                    }}
                    breadcrumbItems={[
                        { label: "Ana Sayfa", href: "/", isActive: false },
                        { label: "Soru & Cevap", href: "/soru-cevap", isActive: false },
                        { label: question.title, isActive: true }
                    ]}
                />

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/soru-cevap")}
                    className="mb-6 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Sorulara Dön
                </Button>

                {/* Question Card */}
                <Card className="mb-8 border-orange-200 bg-white/90 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 ring-2 ring-orange-100">
                                <AvatarImage src={question.author_avatar} />
                                <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                                    {question.author_name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
                                    {question.is_solved && (
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            <Award className="h-3 w-3 mr-1" />
                                            Çözüldü
                                        </Badge>
                                    )}
                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                        {question.category}
                                    </Badge>
                                </div>

                                <div className="prose max-w-none mb-6">
                                    <p className="text-gray-700 text-lg leading-relaxed">{question.content}</p>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{question.author_name}</span>
                                        <span className="text-orange-600">({question.author_reputation} puan)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {formatDate(question.created_at)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {question.views} görüntülenme
                                    </div>
                                </div>

                                {/* Question Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuestionLike(true)}
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {question.likes}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuestionLike(false)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <ThumbsDown className="h-4 w-4 mr-1" />
                                        {question.dislikes}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Answers Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Cevaplar ({question.answers?.length || 0})
                    </h2>

                    {question.answers && question.answers.length > 0 ? (
                        <div className="space-y-6">
                            {question.answers
                                .sort((a, b) => {
                                    if (a.is_best_answer && !b.is_best_answer) return -1;
                                    if (!a.is_best_answer && b.is_best_answer) return 1;
                                    return b.likes - a.likes;
                                })
                                .map((answer) => (
                                    <Card
                                        key={answer.id}
                                        className={`border-orange-200 bg-white/90 backdrop-blur-sm ${answer.is_best_answer ? 'ring-2 ring-green-200 bg-green-50/50' : ''
                                            }`}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar className="w-12 h-12 ring-2 ring-orange-100">
                                                    <AvatarImage src={answer.author_avatar} />
                                                    <AvatarFallback className="bg-orange-100 text-orange-700">
                                                        {answer.author_name[0]}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    {answer.is_best_answer && (
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                En İyi Cevap
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    <div className="prose max-w-none mb-4">
                                                        <p className="text-gray-700">{answer.content}</p>
                                                    </div>

                                                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span className="font-medium">{answer.author_name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {formatDate(answer.created_at)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleAnswerLike(answer.id, true)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                                            {answer.likes}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleAnswerLike(answer.id, false)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <ThumbsDown className="h-4 w-4 mr-1" />
                                                            {answer.dislikes}
                                                        </Button>

                                                        {/* Best Answer Button - Only for question author */}
                                                        {user?.id === question.author_id && !question.is_solved && !answer.is_best_answer && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleMarkBestAnswer(answer.id)}
                                                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                            >
                                                                <Star className="h-4 w-4 mr-1" />
                                                                En İyi Cevap Seç
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    ) : (
                        <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <MessageCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz cevap yok</h3>
                                <p className="text-gray-600 mb-4">Bu soruya ilk cevabı veren siz olun!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Add Answer Section */}
                {user ? (
                    <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cevabınızı Yazın</h3>

                            {!isAnswering ? (
                                <Button
                                    onClick={() => setIsAnswering(true)}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                                >
                                    <Reply className="h-4 w-4 mr-2" />
                                    Cevap Yaz
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <Textarea
                                        value={answerContent}
                                        onChange={(e) => setAnswerContent(e.target.value)}
                                        placeholder="Cevabınızı buraya yazın..."
                                        className="min-h-[120px] border-orange-200 focus:ring-orange-500"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSubmitAnswer}
                                            disabled={!answerContent.trim()}
                                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                                        >
                                            Cevabı Gönder
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsAnswering(false);
                                                setAnswerContent("");
                                            }}
                                        >
                                            İptal
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cevap yazmak için giriş yapın</h3>
                            <p className="text-gray-600 mb-4">Bu soruya cevap verebilmek için üye olmanız gerekiyor.</p>
                            <Button
                                onClick={() => navigate("/giris-yap")}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                            >
                                Giriş Yap
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default QnADetail;
