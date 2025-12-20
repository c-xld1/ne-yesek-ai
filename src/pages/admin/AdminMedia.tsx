import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as ImageIcon,
  FolderOpen,
  Upload,
  Trash2,
  Search,
  HardDrive,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  type: "image" | "video" | "document";
  size: number;
  folder: string;
  uploaded_at: string;
  used_in: number;
}

const AdminMedia = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    // Mock data
    setMedia([
      {
        id: "1",
        filename: "hero-banner.jpg",
        url: "https://placehold.co/400x300",
        type: "image",
        size: 245678,
        folder: "banners",
        uploaded_at: new Date().toISOString(),
        used_in: 3,
      },
      {
        id: "2",
        filename: "recipe-photo.jpg",
        url: "https://placehold.co/400x300",
        type: "image",
        size: 189234,
        folder: "recipes",
        uploaded_at: new Date().toISOString(),
        used_in: 1,
      },
      {
        id: "3",
        filename: "unused-img.png",
        url: "https://placehold.co/400x300",
        type: "image",
        size: 98765,
        folder: "temp",
        uploaded_at: new Date().toISOString(),
        used_in: 0,
      },
    ]);
  };

  const handleUpload = () => {
    toast({ title: "Yükleme Başlatıldı", description: "Dosyalar yükleniyor..." });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) return;
    toast({ title: "Başarılı", description: "Dosya silindi" });
    fetchMedia();
  };

  const filteredMedia = media.filter((m) => {
    const matchesSearch = m.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || m.type === filterType;
    const matchesFolder = filterFolder === "all" || m.folder === filterFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const stats = {
    total: media.length,
    images: media.filter((m) => m.type === "image").length,
    totalSize: media.reduce((sum, m) => sum + m.size, 0),
    unused: media.filter((m) => m.used_in === 0).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Medya Kütüphanesi</h2>
          <p className="text-gray-600">Görseller ve dosyalar</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Dosya Yükle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Dosya</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Boyut</p>
                <p className="text-2xl font-bold text-green-600">
                  {(stats.totalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Görsel</p>
                <p className="text-2xl font-bold text-purple-600">{stats.images}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kullanılmayan</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unused}</p>
              </div>
              <Trash2 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Dosya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="image">Görsel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Döküman</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFolder} onValueChange={setFilterFolder}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Klasör" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="banners">Banners</SelectItem>
                <SelectItem value="recipes">Recipes</SelectItem>
                <SelectItem value="temp">Temp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((file) => (
              <div key={file.id} className="border rounded-lg p-2 hover:border-purple-300 transition-colors">
                <div className="relative">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  {file.used_in === 0 && (
                    <Badge className="absolute top-1 right-1 bg-red-500">Kullanılmıyor</Badge>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{file.filename}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;
