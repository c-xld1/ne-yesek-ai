# Error Pages

Bu klasör, uygulamanın tüm hata sayfalarını içerir.

## 📁 Klasör Yapısı

```
src/pages/error/
├── index.ts           # Export index dosyası
├── ErrorPage.tsx      # Ana hata component'i (tüm hata tipleri için)
├── Maintenance.tsx    # Bakım modu sayfası (özel tasarım)
├── Unauthorized.tsx   # 401 - Giriş gerekli
├── Forbidden.tsx      # 403 - Erişim yasak  
├── ServerError.tsx    # 500 - Sunucu hatası
└── NetworkError.tsx   # Ağ bağlantı hatası
```

## 🚀 Kullanım

### Direkt Import
```tsx
import ErrorPage from '@/pages/error/ErrorPage';
import Maintenance from '@/pages/error/Maintenance';
import { Unauthorized, Forbidden } from '@/pages/error';
```

### NotFound (404) kullanımı
```tsx
// NotFound.tsx zaten ErrorPage'i kullanıyor
import NotFound from '@/pages/NotFound';
```

### Router'da kullanım
```tsx
import { 
  Unauthorized, 
  Forbidden, 
  ServerError, 
  NetworkError, 
  Maintenance 
} from '@/pages/error';

<Routes>
  <Route path="/401" element={<Unauthorized />} />
  <Route path="/403" element={<Forbidden />} />
  <Route path="/500" element={<ServerError />} />
  <Route path="/network-error" element={<NetworkError />} />
  <Route path="/maintenance" element={<Maintenance />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## 🎨 Özellikler

- **Tek Component**: ErrorPage tüm hata tiplerini yönetir
- **Özel Tasarımlar**: Her hata tipi kendine özel renk ve mesajlara sahip
- **Responsive**: Mobil ve masaüstü uyumlu
- **Animasyonlar**: Framer Motion ile smooth geçişler
- **Akıllı Öneriler**: Hata tipine göre çözüm önerileri

## 🔧 Yeni Hata Tipi Ekleme

ErrorPage.tsx içindeki `errorConfigs` objesine yeni konfigürasyon ekleyin:

```tsx
"429": {
  code: "429",
  title: "Çok Fazla İstek",
  description: "Çok fazla istek gönderdiniz. Lütfen bekleyin.",
  emoji: "⏰",
  icon: Clock,
  color: {
    primary: "yellow-500",
    secondary: "yellow-600",
    gradient: "from-yellow-500 to-yellow-600",
    background: "from-yellow-100 to-amber-100"
  },
  // ... diğer ayarlar
}
```
