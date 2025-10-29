import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users, MessageSquare, Heart, Eye, ChefHat, Utensils } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Helmet } from 'react-helmet';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#FFBB28', '#FF8042'];

export default function Stats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const [
        { count: recipesCount },
        { count: questionsCount },
        { count: answersCount },
        { count: usersCount },
        { data: recipes },
        { data: questions },
        { data: categories },
      ] = await Promise.all([
        supabase.from('recipes').select('*', { count: 'exact', head: true }),
        supabase.from('questions').select('*', { count: 'exact', head: true }),
        supabase.from('answers').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('recipes').select('title, views, likes, created_at').order('views', { ascending: false }).limit(10),
        supabase.from('questions').select('title, views, answer_count, created_at').order('views', { ascending: false }).limit(10),
        supabase.from('categories').select('id, name'),
      ]);

      // Category distribution
      const { data: recipesByCategory } = await supabase
        .from('recipes')
        .select('category_id, categories(name)')
        .not('category_id', 'is', null);

      const categoryStats = recipesByCategory?.reduce((acc: any, recipe: any) => {
        const categoryName = recipe.categories?.name || 'Diğer';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      const categoryData = Object.entries(categoryStats || {}).map(([name, value]) => ({
        name,
        value,
      }));

      // Weekly activity
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const weeklyData = await Promise.all(
        last7Days.map(async (date) => {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const [
            { count: recipesCreated },
            { count: questionsCreated },
            { count: answersCreated },
          ] = await Promise.all([
            supabase.from('recipes').select('*', { count: 'exact', head: true })
              .gte('created_at', date)
              .lt('created_at', nextDate.toISOString().split('T')[0]),
            supabase.from('questions').select('*', { count: 'exact', head: true })
              .gte('created_at', date)
              .lt('created_at', nextDate.toISOString().split('T')[0]),
            supabase.from('answers').select('*', { count: 'exact', head: true })
              .gte('created_at', date)
              .lt('created_at', nextDate.toISOString().split('T')[0]),
          ]);

          return {
            date: new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
            tarifler: recipesCreated || 0,
            sorular: questionsCreated || 0,
            cevaplar: answersCreated || 0,
          };
        })
      );

      return {
        recipesCount: recipesCount || 0,
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
        usersCount: usersCount || 0,
        topRecipes: recipes || [],
        topQuestions: questions || [],
        categoryData,
        weeklyData,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { title: 'Toplam Tarifler', value: stats?.recipesCount || 0, icon: Utensils, color: 'text-primary' },
    { title: 'Toplam Sorular', value: stats?.questionsCount || 0, icon: MessageSquare, color: 'text-secondary' },
    { title: 'Toplam Cevaplar', value: stats?.answersCount || 0, icon: TrendingUp, color: 'text-accent' },
    { title: 'Toplam Kullanıcılar', value: stats?.usersCount || 0, icon: Users, color: 'text-chart-1' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Platform İstatistikleri | Yemek Tarifi Sitesi</title>
        <meta name="description" content="Yemek tarifi platformumuzun güncel istatistikleri, en popüler tarifler ve kullanıcı aktiviteleri" />
        <meta name="keywords" content="yemek istatistikleri, popüler tarifler, kullanıcı sayısı, platform verileri" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Platform İstatistikleri</h1>
          <p className="text-muted-foreground">Platformun güncel verileri ve aktivite analizi</p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString('tr-TR')}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Son 7 Günlük Aktivite</CardTitle>
            <CardDescription>Günlük oluşturulan içerik sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="tarifler" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="sorular" stroke="hsl(var(--secondary))" strokeWidth={2} />
                <Line type="monotone" dataKey="cevaplar" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori Dağılımı</CardTitle>
              <CardDescription>Tariflerin kategorilere göre dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {stats?.categoryData?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Recipes */}
          <Card>
            <CardHeader>
              <CardTitle>En Popüler Tarifler</CardTitle>
              <CardDescription>En çok görüntülenen tarifler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topRecipes.slice(0, 5).map((recipe: any, index: number) => (
                  <div key={recipe.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{recipe.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {recipe.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {recipe.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle>En Popüler Sorular</CardTitle>
            <CardDescription>En çok görüntülenen sorular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topQuestions.slice(0, 5).map((question: any, index: number) => (
                <div key={question.title} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium truncate">{question.title}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {question.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {question.answer_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
