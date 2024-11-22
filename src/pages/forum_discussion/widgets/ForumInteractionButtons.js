import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, Ban } from 'lucide-react';
import { toast } from 'react-toastify';

const ForumInteractionButtons = ({ forumId, user }) => {
  const [interactions, setInteractions] = useState({
    isLiked: false,
    isSaved: false,
    likeCount: 0,
    saveCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const isBanned = user?.forumInteractionBanned &&
    (user.forumBanExpiresAt === null || new Date(user.forumBanExpiresAt) > new Date());

  const getBanMessage = () => {
    if (!user?.forumInteractionBanned) return '';
    if (!user.forumBanExpiresAt) {
      return `You are permanently banned: ${user.forumBanReason}`;
    }
    return `You are banned until ${new Date(user.forumBanExpiresAt).toLocaleString()}: ${user.forumBanReason}`;
  };

  useEffect(() => {
    fetchInteractions();
  }, [forumId]);

  const fetchInteractions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forumId}/interactions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInteractions(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this forum');
      return;
    }

    if (isBanned) {
      toast.error(getBanMessage());
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forumId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInteractions(data.data);
          toast.success(interactions.isLiked ? 'Removed like' : 'Added like');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save this forum');
      return;
    }

    if (isBanned) {
      toast.error(getBanMessage());
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forumId}/save`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInteractions(data.data);
          toast.success(interactions.isSaved ? 'Removed from saved' : 'Added to saved');
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to update save');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyle = (isActive) => {
    if (isBanned) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed opacity-75";
    }
    if (isActive) {
      return isActive === 'like' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';
    }
    return 'bg-white/10 hover:bg-white/20 text-white';
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Forum link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing forum:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={handleLike}
        disabled={isLoading || isBanned}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          getButtonStyle(interactions.isLiked ? 'like' : false)
        }`}
      >
        {isBanned ? (
          <Ban className="w-5 h-5" />
        ) : (
          <Heart className={`w-5 h-5 ${interactions.isLiked ? 'fill-current' : ''}`} />
        )}
        <span>
          {isBanned ? 'Restricted' : interactions.isLiked ? 'Liked' : 'Like'}{' '}
          {interactions.likeCount > 0 && !isBanned && `(${interactions.likeCount})`}
        </span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-white"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>

      <button
        onClick={handleSave}
        disabled={isLoading || isBanned}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          getButtonStyle(interactions.isSaved ? 'save' : false)
        }`}
      >
        {isBanned ? (
          <Ban className="w-5 h-5" />
        ) : (
          <Bookmark className={`w-5 h-5 ${interactions.isSaved ? 'fill-current' : ''}`} />
        )}
        <span>
          {isBanned ? 'Restricted' : interactions.isSaved ? 'Saved' : 'Save'}
        </span>
      </button>
    </div>
  );
};

export default ForumInteractionButtons;