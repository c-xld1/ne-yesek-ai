
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const ImageWithFallback = ({ src, alt, className = "", fallbackClassName = "" }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', src, e);

    // İlk deneme başarısızsa, farklı bir Unsplash resmi dene
    if (retryCount === 0 && src.includes('unsplash')) {
      setRetryCount(1);
      setIsLoading(true);
      setHasError(false);
      return;
    }

    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', src);
    setIsLoading(false);
    setHasError(false);
  };

  // Retry için URL oluştur
  const getImageSrc = () => {
    if (retryCount > 0 && src.includes('unsplash')) {
      // Farklı bir random seed ile tekrar dene
      return src.replace(/&[\d.]+$/, '') + `&${Date.now()}`;
    }
    return src;
  };

  // URL doğrulama - daha esnek hale getir
  const isValidUrl = (url: string) => {
    if (!url) return false;

    // Herhangi bir URL formatını kabul et
    return true;
  };

  if (!isValidUrl(src)) {
    console.warn('Invalid image URL:', src);
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${fallbackClassName || className}`}>
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-xs text-gray-500 text-center px-2">Resim bulunamadı</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${fallbackClassName || className}`}>
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-xs text-gray-500 text-center px-2">Resim yüklenemedi</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${className} flex items-center justify-center z-10`}>
          <div className="text-gray-500 text-sm font-medium">Yükleniyor...</div>
        </div>
      )}
      <img
        src={getImageSrc()}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover object-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback;
