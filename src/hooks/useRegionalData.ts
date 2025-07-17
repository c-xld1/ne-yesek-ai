import { useState, useEffect } from "react";
// Supabase eklentisini kullanacağız (örnek bir yapı)
// import { supabase } from "@/integrations/supabase";

interface Region {
    id: string;
    name: string;
    specialties: string[];
    count: number;
    color?: string;
    image?: string;
    position?: Record<string, string>;
}

interface Cuisine {
    id: string;
    name: string;
    count: number;
    flag: string;
    color?: string;
    specialties?: string[];
}

export const useRegionalData = () => {
    const [regions, setRegions] = useState<Record<string, Region>>({});
    const [ethnicCuisines, setEthnicCuisines] = useState<Cuisine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegionalData = async () => {
            setIsLoading(true);

            try {
                // Bu kısmı gerçek Supabase sorgunuzla değiştirebilirsiniz
                // const { data: regionData, error: regionError } = await supabase
                //   .from('regions')
                //   .select('*');

                // if (regionError) throw new Error(regionError.message);

                // Simüle edilmiş veri - gerçek Supabase entegrasyonunda kaldırın
                // 81 il için örnek veri kullanıyoruz
                const regionData = [
                    // Büyükşehirler
                    {
                        id: "istanbul",
                        name: "İstanbul",
                        specialties: ["Balık Ekmek", "İskender", "Döner"],
                        count: 45
                    },
                    {
                        id: "ankara",
                        name: "Ankara",
                        specialties: ["Ankara Tava", "Beypazarı Kurusu", "İçli Köfte"],
                        count: 28
                    },
                    {
                        id: "izmir",
                        name: "İzmir",
                        specialties: ["Boyoz", "Kumru", "Gevrek", "Şambali"],
                        count: 32
                    },
                    {
                        id: "antalya",
                        name: "Antalya",
                        specialties: ["Piyaz", "Hibeş", "Şiş Köfte", "Turunç Reçeli"],
                        count: 35
                    },
                    {
                        id: "gaziantep",
                        name: "Gaziantep",
                        specialties: ["Baklava", "Lahmacun", "Ali Nazik", "Beyran"],
                        count: 52
                    },
                    {
                        id: "trabzon",
                        name: "Trabzon",
                        specialties: ["Hamsi", "Mıhlama", "Vakfıkebir Ekmek"],
                        count: 29
                    },
                    {
                        id: "adana",
                        name: "Adana",
                        specialties: ["Adana Kebap", "Şalgam", "Şırdan", "Bici Bici"],
                        count: 38
                    },
                    {
                        id: "bursa",
                        name: "Bursa",
                        specialties: ["İskender", "Kemalpaşa Tatlısı", "Cantık", "Pideli Köfte"],
                        count: 34
                    },
                    {
                        id: "konya",
                        name: "Konya",
                        specialties: ["Etli Ekmek", "Mevlana Şekeri", "Bamya Çorbası"],
                        count: 26
                    },
                    // Diğer iller (örnek olarak bazıları)
                    {
                        id: "canakkale",
                        name: "Çanakkale",
                        specialties: ["Peynir Helvası", "Sardalya"],
                        count: 15
                    },
                    {
                        id: "aydin",
                        name: "Aydın",
                        specialties: ["İncir", "Pide", "Keşkek"],
                        count: 18
                    },
                    {
                        id: "kayseri",
                        name: "Kayseri",
                        specialties: ["Mantı", "Pastırma", "Sucuk"],
                        count: 25
                    },
                    {
                        id: "van",
                        name: "Van",
                        specialties: ["Van Kahvaltısı", "Otlu Peynir"],
                        count: 17
                    },
                    {
                        id: "edirne",
                        name: "Edirne",
                        specialties: ["Ciğer", "Tava", "Beyaz Peynir"],
                        count: 22
                    },
                    {
                        id: "samsun",
                        name: "Samsun",
                        specialties: ["Pide", "Nokul", "Kaz"],
                        count: 19
                    },
                    {
                        id: "hatay",
                        name: "Hatay",
                        specialties: ["Künefe", "Tepsi Kebabı", "Humus"],
                        count: 31
                    },
                    {
                        id: "erzurum",
                        name: "Erzurum",
                        specialties: ["Cağ Kebabı", "Kadayıf Dolması"],
                        count: 23
                    },
                    {
                        id: "diyarbakir",
                        name: "Diyarbakır",
                        specialties: ["Kaburga Dolması", "Meftune"],
                        count: 24
                    },
                    {
                        id: "sanliurfa",
                        name: "Şanlıurfa",
                        specialties: ["Urfa Kebap", "Çiğ Köfte", "Lahmacun"],
                        count: 30
                    },
                    // Diğer illere ait veriler de aynı şekilde eklenebilir
                ];

                // Bölgeleri formatla
                const formattedRegions = regionData.reduce<Record<string, Region>>(
                    (acc, region) => {
                        acc[region.id] = {
                            ...region,
                            color: "bg-orange-100 text-orange-800 border-orange-200"
                        };
                        return acc;
                    },
                    {}
                );

                setRegions(formattedRegions);

                // Dünya mutfakları verilerini al
                // const { data: cuisineData, error: cuisineError } = await supabase
                //   .from('ethnic_cuisines')
                //   .select('*');

                // if (cuisineError) throw new Error(cuisineError.message);

                // Örnek dünya mutfakları verisi
                const cuisineData = [
                    {
                        id: "italian",
                        name: "İtalyan",
                        count: 24,
                        flag: "🇮🇹",
                        color: "from-green-500 to-red-500",
                        specialties: ["Pizza", "Makarna", "Risotto"]
                    },
                    {
                        id: "mexican",
                        name: "Meksikalı",
                        count: 18,
                        flag: "🇲🇽",
                        color: "from-green-500 to-red-500",
                        specialties: ["Taco", "Burrito", "Guacamole"]
                    },
                    {
                        id: "japanese",
                        name: "Japon",
                        count: 15,
                        flag: "🇯🇵",
                        color: "from-red-500 to-white",
                        specialties: ["Sushi", "Ramen", "Tempura"]
                    },
                    {
                        id: "indian",
                        name: "Hint",
                        count: 21,
                        flag: "🇮🇳",
                        color: "from-orange-500 to-green-500",
                        specialties: ["Körili Tavuk", "Tandır", "Naan"]
                    },
                    {
                        id: "chinese",
                        name: "Çin",
                        count: 19,
                        flag: "🇨🇳",
                        color: "from-red-500 to-yellow-400",
                        specialties: ["Dim Sum", "Pekin Ördeği", "Chow Mein"]
                    },
                    {
                        id: "french",
                        name: "Fransız",
                        count: 16,
                        flag: "🇫🇷",
                        color: "from-blue-500 to-red-500",
                        specialties: ["Kruvasan", "Ratatouille", "Soufflé"]
                    }
                ];

                setEthnicCuisines(cuisineData);

            } catch (err) {
                console.error("Bölgesel veriler alınırken hata oluştu:", err);
                setError(err instanceof Error ? err.message : "Veriler alınamadı");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegionalData();
    }, []);

    return { regions, ethnicCuisines, isLoading, error };
};
