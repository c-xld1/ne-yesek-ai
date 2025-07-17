# Hata Sayfaları Kullanım Kılavuzu

Bu proje için oluşturulmuş hata sayfaları ve kullanım örnekleri:

## 📁 Oluşturulan Dosyalar

### 🔧 Ana Component
- `src/pages/error/ErrorPage.tsx` - Tüm hata türleri için ana component

### 📄 Özel Hata Sayfaları  
- `src/pages/NotFound.tsx` - 404 hataları (3 saniye otomatik yönlendirme)
- `src/pages/error/Unauthorized.tsx` - 401 hataları (giriş gerekli)
- `src/pages/error/Forbidden.tsx` - 403 hataları (erişim yasak)
- `src/pages/error/ServerError.tsx` - 500 hataları (sunucu hatası)
- `src/pages/error/NetworkError.tsx` - Ağ bağlantı hataları
- `src/pages/error/Maintenance.tsx` - Bakım modu (özel tasarım)
- `src/pages/error/index.ts` - Export index dosyası

## 🎯 Kullanım Örnekleri

### Router'da Kullanım
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import { 
  Unauthorized, 
  Forbidden, 
  ServerError, 
  NetworkError, 
  Maintenance 
} from './pages/error';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Normal sayfalar */}
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        
        {/* Hata sayfaları */}
        <Route path="/401" element={<Unauthorized />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="/network-error" element={<NetworkError />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Programatik Yönlendirme
```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleError = (errorType: string) => {
    switch(errorType) {
      case 'unauthorized':
        navigate('/401');
        break;
      case 'forbidden':
        navigate('/403');
        break;
      case 'server_error':
        navigate('/500');
        break;
      case 'network_error':
        navigate('/network-error');
        break;
      default:
        navigate('/404');
    }
  };
}
```

### Özel ErrorPage Kullanımı
```tsx
import ErrorPage from '@/pages/error/ErrorPage';

// Özel başlık ve açıklama ile
function CustomError() {
  return (
    <ErrorPage 
      errorType="500"
      customTitle="Veri Tabanı Hatası"
      customDescription="Tarif verilerine ulaşılamıyor. Lütfen daha sonra tekrar deneyin."
    />
  );
}

// Navbar/Footer olmadan
function EmbeddedError() {
  return (
    <ErrorPage 
      errorType="403"
      showNavbar={false}
      showFooter={false}
    />
  );
}
```

### API Hata Yönetimi
```tsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function RecipePage() {
  const navigate = useNavigate();
  
  const { data, error } = useQuery({
    queryKey: ['recipe'],
    queryFn: fetchRecipe,
    onError: (error: any) => {
      if (error.status === 401) {
        navigate('/401');
      } else if (error.status === 403) {
        navigate('/403');
      } else if (error.status === 500) {
        navigate('/500');
      } else if (error.name === 'NetworkError') {
        navigate('/network-error');
      }
    }
  });
}
```

## 🎨 Hata Türleri ve Özellikleri

### 404 - Not Found
- ✅ 3 saniye otomatik yönlendirme
- 🍳 Yemek temalı emoji ve mesajlar
- 🔍 Tarif arama, favoriler, keşfet önerileri
- 📍 Aranan URL'yi gösterir

### 401 - Unauthorized  
- 🔐 Giriş yapma zorunluluğu
- 🔑 Giriş yap, kayıt ol, ana sayfa önerileri
- ❌ Otomatik yönlendirme yok

### 403 - Forbidden
- 🚫 Erişim yasağı mesajı
- 🏠 Ana sayfa, iletişim, genel tarifler önerileri
- ❌ Otomatik yönlendirme yok

### 500 - Server Error
- ⚠️ Sunucu hatası bilgisi
- 🔄 Sayfa yenile, ana sayfa, iletişim önerileri
- ❌ Otomatik yönlendirme yok

### Network Error
- 📡 İnternet bağlantısı uyarısı
- 🌐 Bağlantı kontrol, sayfa yenile önerileri
- ❌ Otomatik yönlendirme yok

### Maintenance Mode
- 🔧 Özel bakım sayfası tasarımı
- ⏰ Gerçek zamanlı geri sayım
- 📞 İletişim seçenekleri
- 🎨 Animasyonlu arka plan

## 🎯 Renk Teması

Her hata türü için özel renk paleti:
- **404**: Turuncu (orange-500/600)
- **401**: Kırmızı (red-500/600) 
- **403**: Kırmızı/Pembe (red-500/rose-100)
- **500**: Mor (purple-500/600)
- **Network**: Mavi (blue-500/600)
- **Maintenance**: Mavi/Mor geçişi

## 🚀 Özellikler

- ✨ Framer Motion animasyonları
- 📱 Tam responsive tasarım
- 🎨 Gradient arka planlar
- 🔄 Gerçek zamanlı geri sayım (404, Maintenance)
- 🎯 Akıllı öneri sistemi
- 🌟 Yemek temalı mesajlar
- ⚡ Hızlı yükleme
- 🎪 Etkileşimli elementler
