import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Users, TrendingUp, Calendar, Settings } from "lucide-react";
import CompetitionsManager from "@/components/admin/CompetitionsManager";
import BadgesManager from "@/components/admin/BadgesManager";
import LeaderboardManager from "@/components/admin/LeaderboardManager";
import GamificationSettings from "@/components/admin/GamificationSettings";

const GamificationAdmin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("competitions");

    // Check if user is admin (you should implement proper role checking)
    // For now, we'll allow any authenticated user
    if (!user) {
        navigate("/giris-yap");
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Trophy className="h-10 w-10 text-orange-500" />
                        Gamification Yönetim Paneli
                    </h1>
                    <p className="text-gray-600">
                        Yarışmaları yönetin, rozetleri düzenleyin ve liderlik tablolarını kontrol edin
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Aktif Yarışmalar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">2</div>
                            <p className="text-xs text-gray-500 mt-1">+1 yaklaşan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Toplam Rozet
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">21</div>
                            <p className="text-xs text-gray-500 mt-1">8 kategori</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Aktif Kullanıcılar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">1,234</div>
                            <p className="text-xs text-gray-500 mt-1">Bu ay +15%</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Dağıtılan Puan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">45.2K</div>
                            <p className="text-xs text-gray-500 mt-1">Bu hafta</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="competitions" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Yarışmalar
                        </TabsTrigger>
                        <TabsTrigger value="badges" className="gap-2">
                            <Award className="h-4 w-4" />
                            Rozetler
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Liderlik Tablosu
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Ayarlar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="competitions" className="space-y-4">
                        <CompetitionsManager />
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-4">
                        <BadgesManager />
                    </TabsContent>

                    <TabsContent value="leaderboard" className="space-y-4">
                        <LeaderboardManager />
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <GamificationSettings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default GamificationAdmin;
