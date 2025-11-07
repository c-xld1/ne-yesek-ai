import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, FileText, Settings } from "lucide-react";

const SEOAdmin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SEO Yönetimi</h1>
          <p className="text-gray-600">
            Arama motoru optimizasyonu ayarlarını yönetin
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Genel SEO Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Site geneli meta açıklamalar, başlıklar ve anahtar kelimeler. 
                (Yakında eklenecek)
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Sayfa SEO Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Her sayfa için özel meta etiketleri ve yapılandırılmış veri.
                (Yakında eklenecek)
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Gelişmiş SEO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Robots.txt, sitemap.xml ve diğer gelişmiş SEO araçları.
                (Yakında eklenecek)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEOAdmin;
