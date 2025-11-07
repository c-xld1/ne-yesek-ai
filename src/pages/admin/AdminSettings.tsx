import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Globe, Tag, FolderTree } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Genel Ayarlar</h2>
        <p className="text-gray-600">Site genelindeki ayarları yönetin</p>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="tags">Etiketler</TabsTrigger>
              <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Site Genel Ayarları
                </h3>
                <p className="text-gray-600 mb-4">
                  Site adı, açıklaması, logo ve genel yapılandırma ayarları buradan yönetilecek.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklene Cek: Site başlığı, meta açıklama, iletişim bilgileri, sosyal medya linkleri
                </p>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <FolderTree className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Kategori Yönetimi
                </h3>
                <p className="text-gray-600 mb-4">
                  Tarif ve blog kategorilerini buradan ekleyip düzenleyebilirsiniz.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: Kategori ekleme, düzenleme, silme ve sıralama
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <Tag className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Etiket Yönetimi
                </h3>
                <p className="text-gray-600 mb-4">
                  İçerikleriniz için etiketleri buradan yönetebilirsiniz.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: Popüler etiketler, etiket birleştirme, toplu işlemler
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <Settings className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gelişmiş Ayarlar
                </h3>
                <p className="text-gray-600 mb-4">
                  API anahtarları, entegrasyonlar ve gelişmiş yapılandırma seçenekleri.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: API yönetimi, webhook ayarları, önbellek yönetimi
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
