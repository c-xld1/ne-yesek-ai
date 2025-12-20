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
    category: string;
    rarity: string;
    is_active: boolean;
    user_badge_count?: number;
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
        category: "specialty",
        icon: "⭐",
        color: "#F59E0B",
        rarity: "common",
        is_active: true,
    });

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from("badges")
                .select(`
                    *,
                    user_badges(count)
                `)
                .order("badge_type", { ascending: true })
                .order("points_required", { ascending: true });

            if (error) throw error;

            setBadges(data || []);
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
                category: formData.category,
                icon: formData.icon,
                color: formData.color,
                rarity: formData.rarity,
                is_active: formData.is_active,
            };

            if (editingId) {
                const { error } = await supabase
                    .from("badges")
                    .update(badgeData)
                    .eq("id", editingId);

                if (error) throw error;

                toast({
                    title: "Başarılı",
                    description: "Rozet güncellendi",
                });
            } else {
                const { error } = await supabase
                    .from("badges")
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
            name: badge.name,
            description: badge.description,
            badge_type: badge.badge_type,
            icon: badge.icon,
            color: badge.color,
            requirement: JSON.stringify(badge.requirement, null, 2),
            points_required: badge.points_required,
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu rozeti silmek istediğinizden emin misiniz?")) return;

        try {
            const { error } = await supabase
                .from("badges")
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
            name: "",
            description: "",
            badge_type: "specialty",
            icon: "⭐",
            color: "#F59E0B",
            requirement: "",
            points_required: 0,
        });
    };

    const getBadgeTypeLabel = (type: string) => {
        const types = {
            specialty: "Uzmanlık",
            competition: "Yarışma",
            seasonal: "Mevsimsel",
            milestone: "Kilometre Taşı",
        };
        return types[type as keyof typeof types] || type;
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
                                <Label htmlFor="name">Rozet Adı</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Tatlı Uzmanı"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="badge_type">Rozet Tipi</Label>
                                <Select
                                    value={formData.badge_type}
                                    onValueChange={(value) => setFormData({ ...formData, badge_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="specialty">Uzmanlık</SelectItem>
                                        <SelectItem value="competition">Yarışma</SelectItem>
                                        <SelectItem value="seasonal">Mevsimsel</SelectItem>
                                        <SelectItem value="milestone">Kilometre Taşı</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Label htmlFor="points_required">Gereken Puan</Label>
                                <Input
                                    id="points_required"
                                    type="number"
                                    value={formData.points_required}
                                    onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) })}
                                    placeholder="1000"
                                    required
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

                        <div className="space-y-2">
                            <Label htmlFor="requirement">Gereksinimler (JSON)</Label>
                            <Textarea
                                id="requirement"
                                value={formData.requirement}
                                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                placeholder='{"category": "tatlilar", "min_recipes": 5}'
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
                                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                                        <Badge variant="outline" className="mt-1">
                                            {getBadgeTypeLabel(badge.badge_type)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Star className="h-4 w-4" />
                                {badge.points_required} puan gerekli
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                                {badge.user_badge_count || 0} kullanıcı kazandı
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
