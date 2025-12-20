import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users, Clock, Plus, Edit2, Trash2, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Competition {
    id: string;
    title: string;
    description: string;
    theme: string;
    status: string;
    start_date: string;
    end_date: string;
    rules: string[];
    prizes: Record<string, string>;
    entry_count?: number;
    vote_count?: number;
}

const CompetitionsManager = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([
        {
            id: "1",
            title: "En Yaratıcı Kahvaltı",
            description: "Türk kahvaltısına modern bir dokunuş ekleyin",
            theme: "kahvalti",
            status: "active",
            start_date: "2025-01-01",
            end_date: "2025-01-31",
            rules: ["Özgün tarif olmalı", "Fotoğraf eklenmeli"],
            prizes: { "1": "500 TL", "2": "300 TL", "3": "200 TL" },
            entry_count: 25,
            vote_count: 150,
        },
        {
            id: "2",
            title: "Sağlıklı Atıştırmalıklar",
            description: "Düşük kalorili ama lezzetli atıştırmalık tarifleri",
            theme: "saglikli",
            status: "upcoming",
            start_date: "2025-02-01",
            end_date: "2025-02-28",
            rules: ["Kalori bilgisi eklenmeli", "Porsiyon başına max 200 kcal"],
            prizes: { "1": "400 TL", "2": "250 TL" },
            entry_count: 0,
            vote_count: 0,
        },
    ]);
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        theme: "",
        status: "upcoming",
        start_date: "",
        end_date: "",
        rules: "",
        prizes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newCompetition: Competition = {
                id: editingId || Date.now().toString(),
                title: formData.title,
                description: formData.description,
                theme: formData.theme,
                status: formData.status,
                start_date: formData.start_date,
                end_date: formData.end_date,
                rules: formData.rules ? JSON.parse(formData.rules) : [],
                prizes: formData.prizes ? JSON.parse(formData.prizes) : {},
                entry_count: 0,
                vote_count: 0,
            };

            if (editingId) {
                setCompetitions(competitions.map(c => c.id === editingId ? newCompetition : c));
                toast({
                    title: "Başarılı",
                    description: "Yarışma güncellendi",
                });
            } else {
                setCompetitions([...competitions, newCompetition]);
                toast({
                    title: "Başarılı",
                    description: "Yeni yarışma oluşturuldu",
                });
            }

            resetForm();
        } catch (error) {
            console.error("Error saving competition:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Yarışma kaydedilemedi. JSON formatını kontrol edin.",
            });
        }
    };

    const handleEdit = (competition: Competition) => {
        setEditingId(competition.id);
        setFormData({
            title: competition.title,
            description: competition.description,
            theme: competition.theme,
            status: competition.status,
            start_date: competition.start_date,
            end_date: competition.end_date,
            rules: JSON.stringify(competition.rules, null, 2),
            prizes: JSON.stringify(competition.prizes, null, 2),
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu yarışmayı silmek istediğinizden emin misiniz?")) return;

        setCompetitions(competitions.filter(c => c.id !== id));
        toast({
            title: "Başarılı",
            description: "Yarışma silindi",
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            theme: "",
            status: "upcoming",
            start_date: "",
            end_date: "",
            rules: "",
            prizes: "",
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: "bg-green-100 text-green-700",
            upcoming: "bg-blue-100 text-blue-700",
            ended: "bg-gray-100 text-gray-700",
        };
        return colors[status] || colors.upcoming;
    };

    return (
        <div className="space-y-6">
            {/* Info Alert */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Bilgi</AlertTitle>
                <AlertDescription>
                    Yarışmalar şu anda demo modunda çalışmaktadır. Tam işlevsellik için veritabanı tabloları oluşturulmalıdır.
                </AlertDescription>
            </Alert>

            {/* Create/Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Yarışmayı Düzenle" : "Yeni Yarışma Oluştur"}</CardTitle>
                    <CardDescription>
                        Topluluk için yeni bir tarif yarışması oluşturun veya mevcut yarışmayı düzenleyin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Yarışma Başlığı</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Örn: En Yaratıcı Kahvaltı"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="theme">Tema</Label>
                                <Input
                                    id="theme"
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    placeholder="Örn: kahvalti"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Başlangıç Tarihi</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">Bitiş Tarihi</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Durum</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Yaklaşan</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="ended">Sona Ermiş</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Yarışma hakkında detaylı açıklama..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rules">Kurallar (JSON Array)</Label>
                            <Textarea
                                id="rules"
                                value={formData.rules}
                                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                placeholder='["Kural 1", "Kural 2"]'
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prizes">Ödüller (JSON Object)</Label>
                            <Textarea
                                id="prizes"
                                value={formData.prizes}
                                onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                                placeholder='{"1": "Birinci Ödül", "2": "İkinci Ödül"}'
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">
                                {editingId ? "Güncelle" : "Oluştur"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    İptal
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Competitions List */}
            <div className="grid grid-cols-1 gap-4">
                {competitions.map((competition) => (
                    <Card key={competition.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-orange-500" />
                                        {competition.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {competition.description}
                                    </CardDescription>
                                </div>
                                <Badge className={getStatusBadge(competition.status)}>
                                    {competition.status === "active" && "Aktif"}
                                    {competition.status === "upcoming" && "Yaklaşan"}
                                    {competition.status === "ended" && "Sona Ermiş"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(competition.start_date).toLocaleDateString("tr-TR")} - {new Date(competition.end_date).toLocaleDateString("tr-TR")}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {competition.entry_count || 0} Katılımcı
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {competition.vote_count || 0} Oy
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(competition)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-1" />
                                        Düzenle
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(competition.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Sil
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CompetitionsManager;
