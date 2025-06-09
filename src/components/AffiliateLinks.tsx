
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

interface AffiliateLinksProps {
  ingredients: string[];
}

const AffiliateLinks = ({ ingredients }: AffiliateLinksProps) => {
  const affiliateStores = [
    {
      name: "Trendyol",
      logo: "🛍️",
      color: "bg-orange-500",
      baseUrl: "https://trendyol.com/search?q="
    },
    {
      name: "Hepsiburada", 
      logo: "🛒",
      color: "bg-blue-500",
      baseUrl: "https://hepsiburada.com/search?q="
    },
    {
      name: "Amazon",
      logo: "📦",
      color: "bg-yellow-600",
      baseUrl: "https://amazon.com.tr/search?k="
    }
  ];

  const getAffiliateUrl = (ingredient: string, store: typeof affiliateStores[0]) => {
    const searchTerm = encodeURIComponent(ingredient);
    return `${store.baseUrl}${searchTerm}&ref=neyesek_affiliate`;
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-green-600" />
          🛒 Malzemeleri Hemen Sipariş Et
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          Bu tarifte kullanılan malzemeleri güvenilir mağazalardan kolayca sipariş edebilirsin:
        </p>

        <div className="space-y-4">
          {ingredients.slice(0, 3).map((ingredient, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">{ingredient}</h4>
              <div className="flex flex-wrap gap-2">
                {affiliateStores.map((store, storeIndex) => (
                  <Button
                    key={storeIndex}
                    variant="outline"
                    size="sm"
                    className={`text-white ${store.color} border-0 hover:opacity-90`}
                    onClick={() => window.open(getAffiliateUrl(ingredient, store), '_blank')}
                  >
                    <span className="mr-1">{store.logo}</span>
                    {store.name}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            💡 <strong>Bilgi:</strong> Bu linkler üzerinden yapılan alışverişlerden küçük bir komisyon alarak siteyi destekliyoruz. Size ekstra maliyet yansımaz.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateLinks;
