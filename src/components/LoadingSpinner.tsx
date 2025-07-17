
import { ChefHat, Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "premium";
}

const LoadingSpinner = ({ size = "md", text = "Yükleniyor...", variant = "default" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const isPremium = variant === "premium";

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        {/* Outer glow effect for premium variant */}
        {isPremium && (
          <div className={`${sizeClasses[size]} absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-500 opacity-30 blur-xl rounded-full animate-pulse`}></div>
        )}

        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-transparent ${isPremium
            ? 'border-t-orange-500 border-r-red-400 border-b-orange-300 border-l-yellow-400'
            : 'border-t-orange-500 border-r-orange-400 border-b-orange-300'
          }`}></div>

        {/* Inner pulsing background */}
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-full ${isPremium
            ? 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-100'
            : 'bg-gradient-to-br from-orange-50 to-orange-100'
          } animate-pulse`}></div>

        {/* Icon */}
        <div className={`${sizeClasses[size]} absolute inset-0 flex items-center justify-center`}>
          {isPremium ? (
            <Sparkles className="w-6 h-6 text-orange-600 animate-pulse" />
          ) : (
            <ChefHat className="w-6 h-6 text-orange-600 animate-bounce" />
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className={`font-semibold text-lg ${isPremium ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-gray-700'}`}>
          {text}
        </p>
        <div className="flex space-x-2 justify-center">
          {isPremium ? (
            <>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
