import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateQuestion } from "@/hooks/useQnA";
import { useAuth } from "@/contexts/AuthContext";
import {
    HelpCircle,
    Send,
    ArrowLeft,
    Tag,
    FileText,
    AlertCircle,
    Bold,
    Italic,
    List,
    Link,
    Type
} from "lucide-react";

const QnANew = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const createQuestionMutation = useCreateQuestion();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "Genel"
    });

    const [editorToolbar, setEditorToolbar] = useState({
        bold: false,
        italic: false,
        showPreview: false
    });

    const categories = [
        "Genel",
        "Pişirme Teknikleri",
        "Malzeme Tavsiyeleri",
        "Sorun Giderme",
        "Beslenme",
        "Mutfak Aletleri",
        "Tarif Önerileri",
        "Kültürel Mutfaklar"
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const insertTextAtCursor = (textarea: HTMLTextAreaElement, textToInsert: string) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = formData.content.substring(0, start);
        const textAfter = formData.content.substring(end);
        const newText = textBefore + textToInsert + textAfter;

        setFormData(prev => ({ ...prev, content: newText }));

        // Cursor pozisyonunu ayarla
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }, 0);
    };

    const handleEditorAction = (action: string) => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);

        switch (action) {
            case 'bold':
                insertTextAtCursor(textarea, selectedText ? `**${selectedText}**` : '**kalın metin**');
                break;
            case 'italic':
                insertTextAtCursor(textarea, selectedText ? `*${selectedText}*` : '*eğik metin*');
                break;
            case 'list':
                insertTextAtCursor(textarea, '\n• Liste öğesi\n• ');
                break;
            case 'link':
                insertTextAtCursor(textarea, selectedText ? `[${selectedText}](URL)` : '[link metni](URL)');
                break;
            case 'heading':
                insertTextAtCursor(textarea, selectedText ? `## ${selectedText}` : '## Başlık');
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            toast({
                title: "Eksik Bilgi",
                description: "Lütfen başlık ve içerik alanlarını doldurun.",
                variant: "destructive"
            });
            return;
        }

        if (formData.title.length < 10) {
            toast({
                title: "Başlık Çok Kısa",
                description: "Başlık en az 10 karakter olmalıdır.",
                variant: "destructive"
            });
            return;
        }

        if (formData.content.length < 20) {
            toast({
                title: "İçerik Çok Kısa",
                description: "Soru içeriği en az 20 karakter olmalıdır.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const newQuestion = await createQuestionMutation.mutateAsync({
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category
            });

            toast({
                title: "Soru Başarıyla Oluşturuldu!",
                description: "Sorunuz yayınlandı ve diğer kullanıcılar cevap verebilir.",
            });

            // Oluşturulan sorunun detay sayfasına yönlendir
            if (newQuestion?.id) {
                navigate(`/soru-cevap/${newQuestion.id}`);
            } else {
                navigate('/soru-cevap');
            }

        } catch (error) {
            console.error('Error creating question:', error);
            toast({
                title: "Hata Oluştu",
                description: "Soru oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/soru-cevap')}
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri Dön
                        </Button>
                    </div>

                    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <HelpCircle className="h-5 w-5" />
                                Yeni Soru Oluştur
                            </CardTitle>
                            <p className="text-orange-100 mt-2 text-sm">
                                Açık ve detaylı sorular daha iyi cevaplar alır. Diğer kullanıcılara yardımcı olacak bilgileri paylaşın.
                            </p>
                        </CardHeader>

                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Kategori */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                                        <Tag className="h-4 w-4" />
                                        Kategori
                                    </Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Bir kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Başlık */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        Soru Başlığı
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Örn: Kek yapışıyor, nasıl çözerim?"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="text-base sm:text-lg w-full"
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-gray-500">
                                        {formData.title.length}/200 karakter (minimum 10 karakter)
                                    </p>
                                </div>

                                {/* İçerik */}
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="flex items-center gap-2 text-sm font-medium">
                                        <AlertCircle className="h-4 w-4" />
                                        Soru Detayı
                                    </Label>

                                    {/* Basit Metin Editörü Toolbar */}
                                    <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-2">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditorAction('bold')}
                                                className="h-8 w-8 p-0"
                                                title="Kalın"
                                            >
                                                <Bold className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditorAction('italic')}
                                                className="h-8 w-8 p-0"
                                                title="Eğik"
                                            >
                                                <Italic className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditorAction('heading')}
                                                className="h-8 w-8 p-0"
                                                title="Başlık"
                                            >
                                                <Type className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditorAction('list')}
                                                className="h-8 w-8 p-0"
                                                title="Liste"
                                            >
                                                <List className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditorAction('link')}
                                                className="h-8 w-8 p-0"
                                                title="Link"
                                            >
                                                <Link className="h-4 w-4" />
                                            </Button>
                                            <div className="h-4 w-px bg-gray-300 mx-2" />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditorToolbar(prev => ({ ...prev, showPreview: !prev.showPreview }))}
                                                className="text-xs px-2 h-8"
                                                title="Önizleme"
                                            >
                                                {editorToolbar.showPreview ? 'Düzenle' : 'Önizleme'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Metin Alanı veya Önizleme */}
                    {editorToolbar.showPreview ? (
                        <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 min-h-32 sm:min-h-40 bg-white">
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        formData.content
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                            .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
                                            .replace(/^• (.*$)/gm, '<li class="ml-4">$1</li>')
                                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
                                            .replace(/\n/g, '<br>'),
                                        { ALLOWED_TAGS: ['strong', 'em', 'h2', 'li', 'a', 'br'], ALLOWED_ATTR: ['href', 'class'] }
                                    )
                                }}
                            />
                            {!formData.content && (
                                <p className="text-gray-400 italic">Önizleme buraya gelecek...</p>
                            )}
                        </div>
                                    ) : (
                                        <Textarea
                                            id="content"
                                            placeholder="Sorunuzu detaylı bir şekilde açıklayın...

💡 Metin düzenleme ipuçları:
• **kalın metin** için çift yıldız kullanın
• *eğik metin* için tek yıldız kullanın  
• ## Başlık için çift diyez kullanın
• • Liste için madde işareti kullanın
• [link metni](URL) şeklinde link ekleyin"
                                            value={formData.content}
                                            onChange={(e) => handleInputChange('content', e.target.value)}
                                            className="min-h-32 sm:min-h-40 resize-none w-full border-t-0 rounded-t-none"
                                            maxLength={2000}
                                        />
                                    )}

                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            {formData.content.length}/2000 karakter (minimum 20 karakter)
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Markdown desteği: **kalın**, *eğik*, ## başlık, • liste
                                        </p>
                                    </div>
                                </div>

                                {/* Önizleme */}
                                {(formData.title || formData.content) && !editorToolbar.showPreview && (
                                    <div className="border rounded-lg p-4 bg-gray-50/80 backdrop-blur-sm">
                                        <h3 className="font-medium text-sm text-gray-600 mb-3">Soru Önizlemesi:</h3>
                                        <div className="space-y-3">
                                            {formData.title && (
                                                <div>
                                                    <Badge variant="outline" className="mb-2 text-xs">{formData.category}</Badge>
                                                    <h4 className="font-semibold text-base sm:text-lg break-words">{formData.title}</h4>
                                                </div>
                                            )}
                                            {formData.content && (
                                                <div
                                                    className="text-gray-700 text-sm leading-relaxed break-words"
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            formData.content
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                                .replace(/^## (.*$)/gm, '<h2 class="text-base font-semibold mt-3 mb-1">$1</h2>')
                                                                .replace(/^• (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
                                                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
                                                                .replace(/\n/g, '<br>'),
                                                            { ALLOWED_TAGS: ['strong', 'em', 'h2', 'li', 'a', 'br'], ALLOWED_ATTR: ['href', 'class'] }
                                                        )
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Gönder Butonu */}
                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/soru-cevap')}
                                        className="order-2 sm:order-1"
                                    >
                                        İptal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 sm:px-8 order-1 sm:order-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner />
                                                <span className="ml-2">Gönderiliyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Soruyu Yayınla
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Yardımcı İpuçları */}
                    <Card className="mt-6 border-l-4 border-l-blue-500 bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6">
                            <h3 className="font-semibold text-base sm:text-lg mb-4 text-blue-700">💡 İyi Bir Soru Nasıl Sorulur?</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                    <span><strong>Açık ve net olun:</strong> Probleminizi net bir şekilde tanımlayın</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                    <span><strong>Detay verin:</strong> Hangi malzemeleri kullandığınızı, ne yaptığınızı açıklayın</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                    <span><strong>Metin formatı:</strong> <code>**kalın**</code>, <code>*eğik*</code>, <code>## başlık</code> kullanın</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                    <span><strong>Kategori seçin:</strong> Doğru kategori daha hızlı cevap almanızı sağlar</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                    <span><strong>Saygılı olun:</strong> Diğer kullanıcılara karşı nazik ve saygılı davranın</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default QnANew;