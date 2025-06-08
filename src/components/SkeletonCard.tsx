
import { Card, CardContent } from "@/components/ui/card";

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden rounded-xl border-0 shadow-md bg-white">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
      
      <CardContent className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>

        {/* Author and button skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
