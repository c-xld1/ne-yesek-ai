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
    <div className="flex flex-col items-center justify-center space-y-5 py-12">
      <div className="relative">
        {/* Outer glow effect */}
        {isPremium && (
          <div className={`${sizeClasses[size]} absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse`}></div>
        )}

        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-muted ${isPremium
            ? 'border-t-primary border-r-orange-400'
            : 'border-t-primary border-r-primary/60'
          }`}></div>

        {/* Inner pulsing background */}
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-primary/5 animate-pulse`}></div>

        {/* Icon */}
        <div className={`${sizeClasses[size]} absolute inset-0 flex items-center justify-center`}>
          {isPremium ? (
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          ) : (
            <ChefHat className="w-5 h-5 text-primary animate-bounce" />
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className={`font-medium text-base ${isPremium ? 'text-gradient' : 'text-foreground'}`}>
          {text}
        </p>
        <div className="flex space-x-1.5 justify-center">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
