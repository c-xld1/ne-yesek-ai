import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  DollarSign,
  Zap,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google";
  version: string;
  is_active: boolean;
}

interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  usage_count: number;
}

interface TokenUsage {
  date: string;
  tokens: number;
  cost: number;
  requests: number;
}

const AdminAI = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [usage, setUsage] = useState<TokenUsage[]>([]);
  const [settings, setSettings] = useState({
    openai_key: "",
    anthropic_key: "",
    max_tokens: 2000,
    temperature: 0.7,
    cost_limit: 100,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data
    setModels([
      {
        id: "1",
        name: "GPT-4",
        provider: "openai",
        version: "gpt-4-turbo",
        is_active: true,
      },
      {
        id: "2",
        name: "Claude 3",
        provider: "anthropic",
        version: "claude-3-opus",
        is_active: false,
      },
    ]);

    setTemplates([
      {
        id: "1",
        name: "Tarif Önerisi",
        content: "Kullanıcı malzemeleri: {{ingredients}}. Bu malzemelerle yapılabilecek...",
        usage_count: 1234,
      },
      {
        id: "2",
        name: "Yemek Anlatımı",
        content: "Bu tarifi adım adım anlat: {{recipe_title}}...",
        usage_count: 892,
      },
    ]);

    setUsage([
      { date: "2025-11-08", tokens: 45000, cost: 1.35, requests: 234 },
      { date: "2025-11-07", tokens: 52000, cost: 1.56, requests: 289 },
      { date: "2025-11-06", tokens: 38000, cost: 1.14, requests: 198 },
    ]);
  };

  const handleSaveSettings = () => {
    toast({ title: "Başarılı", description: "AI ayarları kaydedildi" });
  };

  const stats = {
    totalTokens: usage.reduce((sum, u) => sum + u.tokens, 0),
    totalCost: usage.reduce((sum, u) => sum + u.cost, 0),
    totalRequests: usage.reduce((sum, u) => sum + u.requests, 0),
    activeModels: models.filter((m) => m.is_active).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Yönetimi</h2>
          <p className="text-gray-600">Yapay zeka modelleri ve kullanım istatistikleri</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Token</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.totalTokens / 1000).toFixed(0)}K
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Maliyet</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İstek</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalRequests}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Model</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeModels}</p>
              </div>
              <Bot className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList>
          <TabsTrigger value="models">AI Modelleri</TabsTrigger>
          <TabsTrigger value="templates">Prompt Şablonları</TabsTrigger>
          <TabsTrigger value="usage">Kullanım İstatistikleri</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Modelleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Adı</TableHead>
                    <TableHead>Sağlayıcı</TableHead>
                    <TableHead>Versiyon</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-semibold">{model.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{model.provider}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{model.version}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            model.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {model.is_active ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prompt Şablonları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="secondary">{template.usage_count} kullanım</Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                          {template.content}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Kullanım İstatistikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Token Kullanımı</TableHead>
                    <TableHead>Maliyet</TableHead>
                    <TableHead>İstek Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usage.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{item.tokens.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-2">tokens</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">
                          ${item.cost.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{item.requests.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell>TOPLAM</TableCell>
                    <TableCell>{stats.totalTokens.toLocaleString()} tokens</TableCell>
                    <TableCell className="text-green-600">
                      ${stats.totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell>{stats.totalRequests.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai_key">OpenAI API Key</Label>
                  <Input
                    id="openai_key"
                    type="password"
                    value={settings.openai_key}
                    onChange={(e) => setSettings({ ...settings, openai_key: e.target.value })}
                    placeholder="sk-..."
                  />
                </div>
                <div>
                  <Label htmlFor="anthropic_key">Anthropic API Key</Label>
                  <Input
                    id="anthropic_key"
                    type="password"
                    value={settings.anthropic_key}
                    onChange={(e) => setSettings({ ...settings, anthropic_key: e.target.value })}
                    placeholder="sk-ant-..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_tokens">Maksimum Token</Label>
                    <Input
                      id="max_tokens"
                      type="number"
                      value={settings.max_tokens}
                      onChange={(e) =>
                        setSettings({ ...settings, max_tokens: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature (0-1)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={settings.temperature}
                      onChange={(e) =>
                        setSettings({ ...settings, temperature: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cost_limit">Günlük Maliyet Limiti ($)</Label>
                  <Input
                    id="cost_limit"
                    type="number"
                    value={settings.cost_limit}
                    onChange={(e) =>
                      setSettings({ ...settings, cost_limit: Number(e.target.value) })
                    }
                  />
                </div>
                <Button onClick={handleSaveSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarları Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAI;
