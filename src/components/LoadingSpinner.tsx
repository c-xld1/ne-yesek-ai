
import { ChefHat } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const LoadingSpinner = ({ size = "md", text = "Yükleniyor..." }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-food-200 border-t-food-600`}></div>
        <ChefHat className={`${sizeClasses[size]} absolute inset-0 text-food-600 animate-pulse`} />
      </div>
      <p className="text-gray-600 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
