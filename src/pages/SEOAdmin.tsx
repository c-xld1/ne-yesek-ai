import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, AlertCircle } from "lucide-react";

const SEOAdmin = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            SEO Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              SEO Ayarları Hazırlanıyor
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              SEO yönetim sistemi için önce Supabase migration dosyalarını çalıştırmanız gerekmektedir.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-mono text-gray-700">
                1. Supabase Dashboard → SQL Editor
              </p>
              <p className="text-sm font-mono text-gray-700">
                2. supabase/migrations/20251108000001_create_seo_settings.sql dosyasını çalıştırın
              </p>
              <p className="text-sm font-mono text-gray-700">
                3. Bu sayfayı yenileyin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOAdmin;
