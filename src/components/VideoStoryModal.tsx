import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface VideoStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    id: string;
    title: string;
    description?: string | null;
    video_url: string;
    thumbnail_url?: string | null;
    views?: number;
    likes?: number;
    profile?: {
      username?: string;
      fullname?: string;
      avatar_url?: string;
    };
    duration?: number | null;
  };
  onLike: (storyId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const VideoStoryModal = ({
  isOpen,
  onClose,
  story,
  onLike,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: VideoStoryModalProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description || "",
        url: window.location.href,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg mx-4 h-[85vh] max-h-[800px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Video Container */}
            <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl">
              {/* Video */}
              <video
                src={story.video_url}
                poster={story.thumbnail_url || undefined}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Top Section - User Info */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                    <AvatarImage src={story.profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-orange-600 text-white">
                      {story.profile?.fullname?.[0] || story.profile?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {story.profile?.fullname || story.profile?.username || "Chef AI"}
                    </h3>
                  </div>
                </div>

                {/* Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </motion.div>

              {/* Bottom Section - Title & Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                {/* Title & Description */}
                <div className="mb-6">
                  <h2 className="text-white font-bold text-xl mb-2">{story.title}</h2>
                  {story.description && (
                    <p className="text-white/80 text-sm line-clamp-2">{story.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onLike(story.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300">
                        <Heart className="h-6 w-6 text-white group-hover:text-red-500" />
                      </div>
                      <span className="text-white text-xs font-semibold">
                        {story.likes?.toLocaleString() || 0}
                      </span>
                    </motion.button>

                    {/* Comment Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowComments(!showComments)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300">
                        <MessageCircle className="h-6 w-6 text-white group-hover:text-blue-400" />
                      </div>
                      <span className="text-white text-xs font-semibold">Yorum</span>
                    </motion.button>

                    {/* Share Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300">
                        <Share2 className="h-6 w-6 text-white group-hover:text-green-400" />
                      </div>
                      <span className="text-white text-xs font-semibold">Paylaş</span>
                    </motion.button>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-white/80 text-xs">
                      {story.views?.toLocaleString() || 0} görüntülenme
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Arrows */}
              {hasPrev && (
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Comments Panel */}
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[50%] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Yorumlar</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setShowComments(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Textarea
                          placeholder="Yorumunuzu yazın..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="resize-none rounded-xl border-gray-200"
                        />
                      </div>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary">
                        Gönder
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoStoryModal;
