# Copilot Instructions for ne-yesek-ai

## Proje Mimarisi ve Bileşenler
- Uygulama, React + TypeScript ile yazılmıştır ve dosya yapısı `src/` altında modüler olarak organize edilmiştir.
- Ana sayfa ve temel sayfalar `src/pages/` altında, her sayfa kendi bileşenlerini ve mantığını içerir.
- Ortak UI bileşenleri ve fonksiyonel parçalar `src/components/` ve `src/components/ui/` dizinlerinde bulunur.
- Supabase ile entegrasyon `src/integrations/supabase/` (client, types) ve `src/lib/supabaseOperations.ts` dosyasında yönetilir.
- React Query ile veri çekme ve önbellekleme için özel hook'lar `src/hooks/` altında bulunur (örn. `useRecipes`, `useCategories`).
- Hata sayfaları ve yönlendirmeler `src/pages/error/` klasöründe merkezi olarak yönetilir.

## Supabase ve Veritabanı
- Migration dosyaları ve test verileri `supabase/migrations/` altında SQL dosyaları olarak tutulur.
- Kategoriler, tarifler, kullanıcılar gibi ana tablolar için migration dosyaları ve örnek veri ekleme scriptleri mevcuttur.
- Kategorilerde `slug` alanı benzersizdir, ekleme işlemlerinde `ON CONFLICT (slug) DO NOTHING` kullanılır.
- UUID gerektiren alanlarda veri eklerken `gen_random_uuid()` fonksiyonu kullanılır.
- Supabase bağlantı bilgileri `.env` dosyasından alınır ve `src/integrations/supabase/client.ts` üzerinden client oluşturulur.

## Geliştirici Akışları
- Geliştirme sunucusu için: `npm run dev` (Vite)
- Supabase veritabanını sıfırlamak ve test verisi yüklemek için: `supabase db reset`
- Tüm ana veri çekme işlemleri React Query ile hook'lar üzerinden yapılır, doğrudan fetch yerine hook kullanımı tercih edilir.
- Demo modunda (env değişkenleri yoksa) mock veriler otomatik olarak döner (`src/lib/supabaseOperations.ts`).

## Proje Konvansiyonları ve Örnekler
- Bileşenler ve hook'lar mutlak import ile (`@/components/...`, `@/hooks/...`) çağrılır.
- Hata sayfaları merkezi olarak `src/pages/error/` altında ve router'da doğrudan kullanılabilir.
- Kategoriler, tarifler ve kullanıcılar için tipler Supabase şemasından otomatik türetilir (`src/integrations/supabase/types.ts`).
- Yeni bir veri modeli eklerken önce migration dosyası oluştur, ardından ilgili hook ve tipleri güncelle.

## Entegrasyon ve Bağımlılıklar
- Supabase dışındaki entegrasyonlar (örn. harici API'ler) için `src/integrations/` veya `src/lib/` altında modül oluştur.
- UI için Tailwind CSS ve Lucide ikonları kullanılır.
- React Router ile sayfa yönlendirmeleri yapılır.

## Önemli Dosya ve Dizinler
- `src/pages/` — Sayfa bileşenleri
- `src/components/` — Ortak ve özel UI bileşenleri
- `src/hooks/` — React Query tabanlı veri çekme mantığı
- `src/integrations/supabase/` — Supabase client ve tipler
- `src/lib/supabaseOperations.ts` — Supabase ile ilgili yardımcı fonksiyonlar
- `supabase/migrations/` — Migration ve test veri SQL dosyaları

---

Herhangi bir özel iş akışı, veri modeli veya entegrasyon için ilgili dosya ve dizinlerdeki örnekleri inceleyin. Sorularınızda bu yapıya ve konvansiyonlara uygun öneriler sunun.
