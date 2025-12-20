import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Edit2, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BadgeType {
    id: string;
    key: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    requirement_type: string;
    requirement_value: number;
    points: number;
    is_active: boolean;
    order_index: number;
}

const BadgesManager = () => {
    const [badges, setBadges] = useState<BadgeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        key: "",
        title: "",
        description: "",
        requirement_type: "recipe_count",
        requirement_value: 1,
        icon: "⭐",
        color: "#F59E0B",
        points: 10,
        is_active: true,
        order_index: 0,
    });

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from("achievement_definitions")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;

            setBadges((data || []) as BadgeType[]);
        } catch (error) {
            console.error("Error fetching badges:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Rozetler yüklenemedi",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const badgeData = {
                key: formData.key,
                title: formData.title,
                description: formData.description,
                requirement_type: formData.requirement_type,
                requirement_value: formData.requirement_value,
                icon: formData.icon,
                color: formData.color,
                points: formData.points,
                is_active: formData.is_active,
                order_index: formData.order_index,
            };

            if (editingId) {
                const { error } = await supabase
                    .from("achievement_definitions")
                    .update(badgeData)
                    .eq("id", editingId);

                if (error) throw error;

                toast({
                    title: "Başarılı",
                    description: "Rozet güncellendi",
                });
            } else {
                const { error } = await supabase
                    .from("achievement_definitions")
                    .insert([badgeData]);

                if (error) throw error;

                toast({
                    title: "Başarılı",
                    description: "Yeni rozet oluşturuldu",
                });
            }

            resetForm();
            fetchBadges();
        } catch (error) {
            console.error("Error saving badge:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Rozet kaydedilemedi",
            });
        }
    };

    const handleEdit = (badge: BadgeType) => {
        setEditingId(badge.id);
        setFormData({
            key: badge.key,
            title: badge.title,
            description: badge.description,
            requirement_type: badge.requirement_type,
            requirement_value: badge.requirement_value,
            icon: badge.icon,
            color: badge.color,
            points: badge.points || 10,
            is_active: badge.is_active,
            order_index: badge.order_index || 0,
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu rozeti silmek istediğinizden emin misiniz?")) return;

        try {
            const { error } = await supabase
                .from("achievement_definitions")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Başarılı",
                description: "Rozet silindi",
            });

            fetchBadges();
        } catch (error) {
            console.error("Error deleting badge:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Rozet silinemedi",
            });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            key: "",
            title: "",
            description: "",
            requirement_type: "recipe_count",
            requirement_value: 1,
            icon: "⭐",
            color: "#F59E0B",
            points: 10,
            is_active: true,
            order_index: 0,
        });
    };

    const getRequirementTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            recipe_count: "Tarif Sayısı",
            follower_count: "Takipçi Sayısı",
            total_likes: "Toplam Beğeni",
            total_views: "Toplam Görüntülenme",
        };
        return types[type] || type;
    };

    if (loading) {
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Create/Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Rozeti Düzenle" : "Yeni Rozet Oluştur"}</CardTitle>
                    <CardDescription>
                        Kullanıcıların kazanabileceği rozetleri tanımlayın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Rozet Anahtarı</Label>
                                <Input
                                    id="key"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                    placeholder="Örn: first_recipe"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Rozet Başlığı</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Örn: İlk Tarif"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirement_type">Gereksinim Tipi</Label>
                                <Select
                                    value={formData.requirement_type}
                                    onValueChange={(value) => setFormData({ ...formData, requirement_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recipe_count">Tarif Sayısı</SelectItem>
                                        <SelectItem value="follower_count">Takipçi Sayısı</SelectItem>
                                        <SelectItem value="total_likes">Toplam Beğeni</SelectItem>
                                        <SelectItem value="total_views">Toplam Görüntülenme</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirement_value">Gereksinim Değeri</Label>
                                <Input
                                    id="requirement_value"
                                    type="number"
                                    value={formData.requirement_value}
                                    onChange={(e) => setFormData({ ...formData, requirement_value: parseInt(e.target.value) })}
                                    placeholder="1"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">İkon (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="🍰"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Renk (Hex)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-20"
                                        required
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="#F59E0B"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="points">Puan</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                    placeholder="10"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order_index">Sıra</Label>
                                <Input
                                    id="order_index"
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Rozet kazanma koşulları..."
                                rows={2}
                                required
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

            {/* Badges List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                    <Card key={badge.id} className="relative overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 right-0 h-2"
                            style={{ backgroundColor: badge.color }}
                        />
                        <CardHeader className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{badge.icon}</span>
                                    <div>
                                        <CardTitle className="text-lg">{badge.title}</CardTitle>
                                        <Badge variant="outline" className="mt-1">
                                            {getRequirementTypeLabel(badge.requirement_type)}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant={badge.is_active ? "default" : "secondary"}>
                                    {badge.is_active ? "Aktif" : "Pasif"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <Star className="h-4 w-4" />
                                {badge.requirement_value} {getRequirementTypeLabel(badge.requirement_type).toLowerCase()} gerekli
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(badge)}
                                    className="flex-1"
                                >
                                    <Edit2 className="h-3 w-3 mr-1" />
                                    Düzenle
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(badge.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BadgesManager;
