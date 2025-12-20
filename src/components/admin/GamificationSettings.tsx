import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GamificationSettings = () => {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Ayarlar Kaydedildi",
            description: "Gamification ayarları başarıyla güncellendi",
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Puan Sistemi Ayarları</CardTitle>
                    <CardDescription>
                        Kullanıcıların aktivitelerden kazandığı puanları yapılandırın
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tarif Ekle</Label>
                            <Input type="number" defaultValue="50" />
                            <p className="text-xs text-gray-500">Yeni tarif paylaşımı</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Yorum Yap</Label>
                            <Input type="number" defaultValue="10" />
                            <p className="text-xs text-gray-500">Tarife yorum yapma</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Video Ekle</Label>
                            <Input type="number" defaultValue="100" />
                            <p className="text-xs text-gray-500">Tarife video ekleme</p>
                        </div>

                        <div className="space-y-2">
                            <Label>5 Yıldız Al</Label>
                            <Input type="number" defaultValue="20" />
                            <p className="text-xs text-gray-500">5 yıldızlı değerlendirme</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Tarif Favorileme</Label>
                            <Input type="number" defaultValue="5" />
                            <p className="text-xs text-gray-500">Kullanıcı tarifini favoriledi</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Takip Et</Label>
                            <Input type="number" defaultValue="15" />
                            <p className="text-xs text-gray-500">Yeni takipçi kazanma</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Seviye Sistemi</CardTitle>
                    <CardDescription>
                        Kullanıcıların seviye atlama kriterlerini ayarlayın
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Seviye Başına Puan</Label>
                        <Input type="number" defaultValue="1000" />
                        <p className="text-xs text-gray-500">
                            Her seviye için gereken puan miktarı
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Maksimum Seviye</Label>
                        <Input type="number" defaultValue="100" />
                        <p className="text-xs text-gray-500">
                            Kullanıcıların ulaşabileceği maksimum seviye
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Yarışma Ayarları</CardTitle>
                    <CardDescription>
                        Yarışma sisteminin genel ayarları
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Minimum Katılımcı</Label>
                        <Input type="number" defaultValue="3" />
                        <p className="text-xs text-gray-500">
                            Yarışmanın geçerli olması için minimum katılımcı sayısı
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Kullanıcı Başına Oy</Label>
                        <Input type="number" defaultValue="3" />
                        <p className="text-xs text-gray-500">
                            Her kullanıcının verebileceği maksimum oy sayısı
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Yarışma Süresi (Gün)</Label>
                        <Input type="number" defaultValue="30" />
                        <p className="text-xs text-gray-500">
                            Yeni yarışmalar için varsayılan süre
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bildirim Ayarları</CardTitle>
                    <CardDescription>
                        Gamification olayları için bildirim tercihleri
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Rozet Kazanma</Label>
                            <p className="text-xs text-gray-500">
                                Kullanıcılar rozet kazandığında bildirim gönder
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Seviye Atlama</Label>
                            <p className="text-xs text-gray-500">
                                Kullanıcılar seviye atladığında bildirim gönder
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Liderlik Tablosu</Label>
                            <p className="text-xs text-gray-500">
                                Haftalık lider değişikliklerinde bildirim gönder
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Yarışma Başlangıcı</Label>
                            <p className="text-xs text-gray-500">
                                Yeni yarışma başladığında bildirim gönder
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} size="lg">
                    <Save className="h-5 w-5 mr-2" />
                    Ayarları Kaydet
                </Button>
            </div>
        </div>
    );
};

export default GamificationSettings;
