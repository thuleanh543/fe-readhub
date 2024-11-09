import React, { useState, useEffect, useRef } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';

const ForumCommentItem = ({ comment, stompClient, user }) => {
  // States for reply functionality
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyFileInputRef = useRef(null);

  // States for like functionality
  const [isLiked, setIsLiked] = useState(comment.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  // State for replies
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (stompClient) {
      // Subscribe to like updates
      const likeSub = stompClient.subscribe(
        `/topic/comment/${comment.id}/like`,
        message => {
          const response = JSON.parse(message.body);
          setIsLiked(response.liked);
          setLikeCount(prev => response.liked ? prev + 1 : prev - 1);
        }
      );

      // Subscribe to reply updates
      const replySub = stompClient.subscribe(
        `/topic/comment/${comment.id}/reply`,
        message => {
          const newReply = JSON.parse(message.body);
          setReplies(prev => [newReply, ...prev]);
        }
      );

      // Subscribe to errors
      const errorSub = stompClient.subscribe(
        `/topic/errors/comment/${comment.id}`,
        message => {
          const error = JSON.parse(message.body);
          toast.error(`Error: ${error.message}`);
        }
      );

      return () => {
        likeSub.unsubscribe();
        replySub.unsubscribe();
        errorSub.unsubscribe();
      };
    }
  }, [stompClient, comment.id]);

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    if (stompClient?.connected) {
      stompClient.send(
        '/app/comment/like',
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        JSON.stringify({ commentId: comment.id })
      );
    }
  };

  const handleReplyImageSelect = event => {
    const file = event.target.files[0];
    if (file) {
      setReplyImage(file);
    }
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error('Please login to reply');
      return;
    }

    if (!replyContent.trim() && !replyImage) return;
    if (isSubmittingReply) return;

    try {
      setIsSubmittingReply(true);
      let imageUrl = null;

      if (replyImage) {
        const formData = new FormData();
        formData.append('file', replyImage);
        const response = await fetch('http://localhost:8080/api/v1/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          imageUrl = result.data.url;
        }
      }

      if (stompClient?.connected) {
        stompClient.send(
          '/app/comment/reply',
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          JSON.stringify({
            commentId: comment.id,
            content: replyContent,
            imageUrl,
          })
        );

        setReplyContent('');
        setReplyImage(null);
        if (replyFileInputRef.current) {
          replyFileInputRef.current.value = '';
        }
        setShowReplyInput(false);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Comment Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <img
            src={comment.user.urlAvatar || '/api/placeholder/48/48'}
            alt={comment.user.fullName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-lg">{comment.user.fullName}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Comment Content */}
      <div className="pl-16">
        <p className="text-gray-800 whitespace-pre-wrap mb-4">
          {comment.content}
        </p>
        {comment.imageUrl && (
          <div className="mb-4">
            <img
              src={comment.imageUrl}
              alt="Comment attachment"
              className="max-w-full rounded-lg"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-6 text-gray-500">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? 'text-blue-600' : 'hover:text-blue-600'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Reply{replies.length > 0 && ` (${replies.length})`}</span>
          </button>

          <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-4 pl-8">
            <div className="flex gap-4">
              <img
                src={user?.urlAvatar || '/api/placeholder/32/32'}
                alt="Your avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows="2"
                />
                <div className="flex justify-between items-center mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReplyImageSelect}
                    ref={replyFileInputRef}
                    className="hidden"
                    id={`reply-image-${comment.id}`}
                  />
                  <label
                    htmlFor={`reply-image-${comment.id}`}
                    className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    <span>Add Image</span>
                  </label>
                  {replyImage && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {replyImage.name}
                      </span>
                      <button
                        onClick={() => {
                          setReplyImage(null);
                          if (replyFileInputRef.current) {
                            replyFileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmittingReply}
                    className={`${
                      isSubmittingReply
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-1 rounded-lg transition-colors flex items-center gap-2`}
                  >
                    {isSubmittingReply ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replies List */}
        {replies.length > 0 && (
          <div className="mt-4 pl-8">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              {showReplies ? 'Hide' : 'Show'} {replies.length} replies
            </button>

            {showReplies && (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    <img
                      src={reply.user.urlAvatar || '/api/placeholder/32/32'}
                      alt={reply.user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{reply.user.fullName}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2">{reply.content}</p>
                      {reply.imageUrl && (
                        <img
                          src={reply.imageUrl}
                          alt="Reply attachment"
                          className="mt-2 max-w-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumCommentItem;