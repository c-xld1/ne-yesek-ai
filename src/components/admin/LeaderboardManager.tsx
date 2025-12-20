import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string;
    points: number;
    badge_count: number;
    recipe_count: number;
}

// Demo data
const demoLeaders: LeaderboardEntry[] = [
    { rank: 1, user_id: "1", username: "zeynep_mutfak", avatar_url: "", points: 2500, badge_count: 8, recipe_count: 45 },
    { rank: 2, user_id: "2", username: "ayse_ana", avatar_url: "", points: 2100, badge_count: 6, recipe_count: 38 },
    { rank: 3, user_id: "3", username: "mehmet_usta", avatar_url: "", points: 1850, badge_count: 5, recipe_count: 32 },
    { rank: 4, user_id: "4", username: "fatma_chef", avatar_url: "", points: 1600, badge_count: 4, recipe_count: 28 },
    { rank: 5, user_id: "5", username: "ali_gurme", avatar_url: "", points: 1400, badge_count: 3, recipe_count: 25 },
];

const LeaderboardManager = () => {
    const [weeklyLeaders] = useState<LeaderboardEntry[]>(demoLeaders);
    const [monthlyLeaders] = useState<LeaderboardEntry[]>(demoLeaders);
    const [allTimeLeaders] = useState<LeaderboardEntry[]>(demoLeaders);
    const [loading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { toast } = useToast();

    const handleRefreshLeaderboards = async () => {
        setRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
            title: "Bilgi",
            description: "Liderlik tablosu demo modunda çalışmaktadır",
        });
        setRefreshing(false);
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
                    <div className="text-center py-8 text-muted-foreground">
                        Henüz veri yok
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaders.map((leader) => (
                            <div
                                key={leader.user_id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                                        leader.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                        leader.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                        leader.rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                                        "bg-gradient-to-br from-primary to-primary/80"
                                    }`}>
                                        {leader.rank}
                                    </div>
                                    {leader.avatar_url ? (
                                        <img
                                            src={leader.avatar_url}
                                            alt={leader.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                            <span className="text-secondary-foreground font-semibold">
                                                {leader.username[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-foreground">
                                            @{leader.username}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {leader.recipe_count} tarif • {leader.badge_count} rozet
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary font-bold">
                                        <Trophy className="h-4 w-4" />
                                        {leader.points.toLocaleString()} puan
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Info Alert */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Bilgi</AlertTitle>
                <AlertDescription>
                    Liderlik tablosu şu anda demo modunda çalışmaktadır. Tam işlevsellik için veritabanı tabloları oluşturulmalıdır.
                </AlertDescription>
            </Alert>

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
