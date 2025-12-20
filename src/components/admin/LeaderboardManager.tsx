import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string;
    points: number;
    badge_count: number;
    recipe_count: number;
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

const LeaderboardManager = () => {
    const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardEntry[]>([]);
    const [monthlyLeaders, setMonthlyLeaders] = useState<LeaderboardEntry[]>([]);
    const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    const fetchLeaderboards = async () => {
        try {
            setLoading(true);

            // Fetch weekly leaderboard
            const { data: weekly, error: weeklyError } = await supabase
                .from("leaderboards")
                .select(`
                    *,
                    profiles:user_id (username, avatar_url)
                `)
                .eq("period", "weekly")
                .order("rank", { ascending: true })
                .limit(10);

            if (weeklyError) throw weeklyError;

            // Fetch monthly leaderboard
            const { data: monthly, error: monthlyError } = await supabase
                .from("leaderboards")
                .select(`
                    *,
                    profiles:user_id (username, avatar_url)
                `)
                .eq("period", "monthly")
                .order("rank", { ascending: true })
                .limit(10);

            if (monthlyError) throw monthlyError;

            // Fetch all-time leaderboard
            const { data: allTime, error: allTimeError } = await supabase
                .from("leaderboards")
                .select(`
                    *,
                    profiles:user_id (username, avatar_url)
                `)
                .eq("period", "all_time")
                .order("rank", { ascending: true })
                .limit(10);

            if (allTimeError) throw allTimeError;

            setWeeklyLeaders(weekly || []);
            setMonthlyLeaders(monthly || []);
            setAllTimeLeaders(allTime || []);
        } catch (error) {
            console.error("Error fetching leaderboards:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Liderlik tablosu yüklenemedi",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshLeaderboards = async () => {
        try {
            setRefreshing(true);

            const { error } = await supabase.rpc("update_leaderboards");

            if (error) throw error;

            toast({
                title: "Başarılı",
                description: "Liderlik tabloları güncellendi",
            });

            await fetchLeaderboards();
        } catch (error) {
            console.error("Error refreshing leaderboards:", error);
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Liderlik tablosu güncellenemedi",
            });
        } finally {
            setRefreshing(false);
        }
    };

    const renderLeaderboard = (leaders: LeaderboardEntry[], title: string) => (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>Top 10 kullanıcı</CardDescription>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRefreshLeaderboards}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Yenile
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">Yükleniyor...</div>
                ) : leaders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Henüz veri yok
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaders.map((leader, index) => {
                            const profile = Array.isArray(leader.profiles) 
                                ? leader.profiles[0] 
                                : leader.profiles;

                            return (
                                <div
                                    key={leader.user_id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                                            {leader.rank}
                                        </div>
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt={profile.username || "User"}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600 font-semibold">
                                                    {(profile?.username || "?")[0].toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold">
                                                {profile?.username || "Kullanıcı"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Seviye {leader.level} • {leader.recipes_count} tarif
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-orange-600 font-bold">
                                            <Trophy className="h-4 w-4" />
                                            {leader.points.toLocaleString()} puan
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Liderlik Tablosu Yönetimi</CardTitle>
                    <CardDescription>
                        Haftalık, aylık ve tüm zamanların liderlik tablolarını görüntüleyin ve yönetin
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="weekly" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">
                        <Calendar className="h-4 w-4 mr-2" />
                        Haftalık
                    </TabsTrigger>
                    <TabsTrigger value="monthly">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Aylık
                    </TabsTrigger>
                    <TabsTrigger value="all-time">
                        <Trophy className="h-4 w-4 mr-2" />
                        Tüm Zamanlar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                    {renderLeaderboard(weeklyLeaders, "Haftalık Liderler")}
                </TabsContent>

                <TabsContent value="monthly">
                    {renderLeaderboard(monthlyLeaders, "Aylık Liderler")}
                </TabsContent>

                <TabsContent value="all-time">
                    {renderLeaderboard(allTimeLeaders, "Tüm Zamanların Liderleri")}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LeaderboardManager;
