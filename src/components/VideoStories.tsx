import { Play, Heart, Eye } from "lucide-react";
import { useState } from "react";
import VideoStoryModal from "./VideoStoryModal";
import { useFeaturedVideoStories, useIncrementStoryLikes } from "@/hooks/useVideoStoriesReal";

const VideoStories = () => {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const { data: stories, isLoading } = useFeaturedVideoStories();
  const incrementLikes = useIncrementStoryLikes();

  const handleStoryClick = (story: any) => {
    setSelectedStory(story);
  };

  const handleLike = (storyId: string) => {
    incrementLikes.mutate(storyId);
  };

  // Video stories yoksa hiçbir şey gösterme
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          📱 Tarif Hikâyeleri
        </h3>
        <p className="text-gray-600">Hızlı ve ilham verici tarif videoları</p>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {stories.map((story: any) => (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="flex-shrink-0 w-32 cursor-pointer group"
            >
              <div className="relative rounded-2xl overflow-hidden h-48 border-4 border-orange-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={story.thumbnail_url || story.recipe?.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-orange-500 fill-orange-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold line-clamp-2 mb-1">{story.title}</p>
                  <div className="flex items-center gap-2 text-xs text-white/90">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{story.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{story.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-center text-gray-700 font-medium truncate">
                {story.profile?.fullname || story.profile?.username || 'Chef AI'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedStory && (
        <VideoStoryModal
          isOpen={!!selectedStory}
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onLike={handleLike}
        />
      )}
    </section>
  );
};

export default VideoStories;
