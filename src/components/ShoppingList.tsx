
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Download, Share2, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShoppingList = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Tavuk göğsü", amount: "500g", checked: false, category: "Et & Protein" },
    { id: 2, name: "Domates", amount: "3 adet", checked: false, category: "Sebze" },
    { id: 3, name: "Soğan", amount: "2 adet", checked: true, category: "Sebze" },
    { id: 4, name: "Zeytinyağı", amount: "1 şişe", checked: false, category: "Yağlar" },
    { id: 5, name: "Tuz", amount: "1 paket", checked: false, category: "Baharat" }
  ]);
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const { toast } = useToast();

  const categories = ["Et & Protein", "Sebze", "Meyve", "Tahıllar", "Süt Ürünleri", "Yağlar", "Baharat", "Diğer"];

  const addItem = () => {
    if (newItem.trim()) {
      const item = {
        id: Date.now(),
        name: newItem.trim(),
        amount: newAmount.trim() || "1 adet",
        checked: false,
        category: "Diğer"
      };
      setItems([...items, item]);
      setNewItem("");
      setNewAmount("");
      toast({
        title: "✅ Malzeme eklendi",
        description: `"${item.name}" alışveriş listenize eklendi`,
      });
    }
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "🗑️ Malzeme silindi",
      description: "Malzeme alışveriş listenizden çıkarıldı",
    });
  };

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked));
    toast({
      title: "🧹 Tamamlananlar temizlendi",
      description: "Satın alınan ürünler listeden çıkarıldı",
    });
  };

  const exportList = () => {
    const listText = items
      .filter(item => !item.checked)
      .map(item => `• ${item.name} - ${item.amount}`)
      .join('\n');
    
    navigator.clipboard.writeText(listText);
    toast({
      title: "📋 Liste kopyalandı",
      description: "Alışveriş listesi panoya kopyalandı",
    });
  };

  const shareWhatsApp = () => {
    const listText = items
      .filter(item => !item.checked)
      .map(item => `• ${item.name} - ${item.amount}`)
      .join('\n');
    
    const message = `🛒 Alışveriş Listem:\n\n${listText}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            🛒 Benim Market Listem
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportList}>
              <Download className="h-4 w-4 mr-1" />
              Kopyala
            </Button>
            <Button variant="outline" size="sm" onClick={shareWhatsApp}>
              <Share2 className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-800">
              {checkedCount}/{totalCount} tamamlandı
            </Badge>
            {checkedCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearChecked}>
                <Trash2 className="h-4 w-4 mr-1" />
                Tamamlananları Temizle
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Yeni Malzeme Ekleme */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Malzeme adı..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="flex-1"
            />
            <Input
              placeholder="Miktar"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="w-24"
            />
            <Button onClick={addItem} disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Liste İçeriği */}
        {totalCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Alışveriş listeniz boş</p>
            <p className="text-sm">Tarif sayfalarından malzeme ekleyin veya manuel olarak ekleyin</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-food-500 rounded-full"></div>
                  {category}
                </h4>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                        item.checked 
                          ? 'bg-green-50 border-green-200 opacity-60' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className="flex-1">
                        <span className={`font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}>
                          {item.name}
                        </span>
                        <span className={`text-sm ml-2 ${item.checked ? 'text-gray-400' : 'text-gray-600'}`}>
                          - {item.amount}
                        </span>
                      </div>
                      {item.checked && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tariflerden Ekleme İpucu */}
        {totalCount === 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 İpucu</h4>
            <p className="text-sm text-blue-700">
              Tarif sayfalarındaki malzemelere tıklayarak otomatik olarak alışveriş listenize ekleyebilirsiniz!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingList;
