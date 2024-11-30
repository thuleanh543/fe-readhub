import React, { useState, useEffect, useRef } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Send,
  X,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { DialogConfirmation } from '../../../component/dialogs/DialogConfirmation';
import { Avatar } from '@mui/material';

const ForumCommentItem = ({ comment, stompClient, user, onCommentDeleted }) => {
  // States for reply functionality
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyFileInputRef = useRef(null);

  // States for like functionality
  const [isLiked, setIsLiked] = useState(comment.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  // States for replies
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);

  // States for editing comment
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editImage, setEditImage] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const editFileInputRef = useRef(null);

  // States for editing reply
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [editReplyImage, setEditReplyImage] = useState(null);
  const [isSubmittingReplyEdit, setIsSubmittingReplyEdit] = useState(false);

  // States for dropdowns
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [showReplyOptions, setShowReplyOptions] = useState(null);

  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);
  const [showDeleteReplyDialog, setShowDeleteReplyDialog] = useState(null);

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

      // Subscribe to reply delete
      const replyDeleteSub = stompClient.subscribe(
        `/topic/comment/${comment.id}/reply/delete`,
        message => {
          const { replyId } = JSON.parse(message.body);
          setReplies(prev => prev.filter(reply => reply.id !== replyId));
          toast.success('Reply deleted successfully');
        }
      );

      // Subscribe to reply update
      const replyUpdateSub = stompClient.subscribe(
        `/topic/reply/${comment.id}/update`,
        message => {
          const updatedReply = JSON.parse(message.body);
          setReplies(prev =>
            prev.map(reply =>
              reply.id === updatedReply.id ? updatedReply : reply
            )
          );
          setEditingReplyId(null);
        }
      );

      // Subscribe to comment delete
      const commentDeleteSub = stompClient.subscribe(
        `/topic/comment/${comment.id}/delete`,
        () => {
          onCommentDeleted && onCommentDeleted(comment.id);
          toast.success('Comment deleted successfully');
        }
      );

      // Subscribe to comment update
      const commentUpdateSub = stompClient.subscribe(
        `/topic/comment/${comment.id}/update`,
        message => {
          const updatedComment = JSON.parse(message.body);
          setEditContent(updatedComment.content);
          setIsEditing(false);
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
        replyDeleteSub.unsubscribe();
        replyUpdateSub.unsubscribe();
        commentDeleteSub.unsubscribe();
        commentUpdateSub.unsubscribe();
        errorSub.unsubscribe();
      };
    }
  }, [stompClient, comment.id, onCommentDeleted]);

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

  const handleDelete = () => {
    if (stompClient?.connected) {
      stompClient.send(
        '/app/comment/delete',
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        JSON.stringify({ commentId: comment.id })
      );
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim() && !editImage) return;
    if (isSubmittingEdit) return;

    try {
      setIsSubmittingEdit(true);
      let imageUrl = comment.imageUrl;

      if (editImage) {
        const formData = new FormData();
        formData.append('file', editImage);
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
          '/app/comment/update',
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          JSON.stringify({
            commentId: comment.id,
            content: editContent,
            imageUrl,
          })
        );
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleReplyDelete = (replyId) => {
    try {
      if (!stompClient?.connected) {
        toast.error('Connection lost. Please refresh the page.');
        return;
      }

      stompClient.send(
        '/app/comment/reply/delete',
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        JSON.stringify({ replyId: replyId })
      );

      setShowReplyOptions(null);
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply. Please try again.');
    }
  };

  const handleReplyEdit = async (replyId) => {
    if (!editReplyContent.trim() && !editReplyImage) return;
    if (isSubmittingReplyEdit) return;

    try {
      setIsSubmittingReplyEdit(true);
      let imageUrl = replies.find(r => r.id === replyId)?.imageUrl;

      if (editReplyImage) {
        const formData = new FormData();
        formData.append('file', editReplyImage);
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
          '/app/comment/reply/update',
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          JSON.stringify({
            replyId: replyId,
            content: editReplyContent,
            imageUrl,
          })
        );
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      toast.error('Failed to update reply');
    } finally {
      setIsSubmittingReplyEdit(false);
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

  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 33,
        height: 33,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  const canModifyComment = user && (user.userId === comment.user.userId || user.role === 'ROLE_ADMIN');
  const canModifyReply = (reply) => user && (user.userId === reply.user.userId || user.role === 'ROLE_ADMIN');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
        {comment.user.urlAvatar ? (
                  <Avatar
                  sx={{width: 25, height: 25}}
                  src={comment.user.urlAvatar}
                  alt={comment.user.fullName}
                />
                ) : (
                  <Avatar {...stringAvatar(comment.user?.fullName)} />
                )}
          <div>
            <h3 className="font-semibold text-lg">{comment.user.fullName}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {canModifyComment && (
          <div className="relative">
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowCommentOptions(!showCommentOptions)}
            >
              <MoreVertical className="w-6 h-6" />
            </button>
            {showCommentOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      setIsEditing(true);
                      setShowCommentOptions(false);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      setShowDeleteCommentDialog(true);
                      setShowCommentOptions(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="pl-16">
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <div className="flex justify-between items-center mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files[0])}
                ref={editFileInputRef}
                className="hidden"
                id={`edit-image-${comment.id}`}
              />
              <label
                htmlFor={`edit-image-${comment.id}`}
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Image className="w-4 h-4" />
                <span>Change Image</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmittingEdit}
                  className={`${
                    isSubmittingEdit
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
                >
                  {isSubmittingEdit ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
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
        {showReplyInput && user && (
          <div className="mt-4">
            <div className="flex gap-4">
            {user.urlAvatar ? (
                  <Avatar
                  sx={{width: 25, height: 25}}
                  src={user.urlAvatar}
                  alt={user.fullName}
                />
                ) : (
                  <Avatar {...stringAvatar(user?.fullName)} />
                )}
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows="2"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-4">
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
                  </div>
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmittingReply}
                    className={`${
                      isSubmittingReply
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
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
          <div className="mt-4">
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
                    {reply.user.urlAvatar ? (
                  <Avatar
                  sx={{width: 25, height: 25}}
                  src={reply.user.urlAvatar}
                  alt={reply.user.fullName}
                />
                ) : (
                  <Avatar {...stringAvatar(reply.user?.fullName)} />
                )}
                    <div className="flex-1">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{reply.user.fullName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {canModifyReply(reply) && (
                            <div className="relative">
                              <button
                                onClick={() => setShowReplyOptions(reply.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              {showReplyOptions === reply.id && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      onClick={() => {
                                        setEditingReplyId(reply.id);
                                        setEditReplyContent(reply.content);
                                        setShowReplyOptions(null);
                                      }}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Edit
                                    </button>
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                      onClick={() => {
                                        setShowDeleteReplyDialog(reply.id);
                                        setShowReplyOptions(null);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {editingReplyId === reply.id ? (
  <div className="mt-2">
    <textarea
      value={editReplyContent}
      onChange={(e) => setEditReplyContent(e.target.value)}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      rows="2"
    />
    <div className="flex justify-between items-center mt-2">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setEditReplyImage(e.target.files[0])}
          className="hidden"
          id={`edit-reply-image-${reply.id}`}
        />
        <label
          htmlFor={`edit-reply-image-${reply.id}`}
          className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <Image className="w-4 h-4" />
          <span>{reply.imageUrl ? 'Change Image' : 'Add Image'}</span>
        </label>
        {(editReplyImage || reply.imageUrl) && (
          <div className="flex items-center gap-2">
            {editReplyImage ? (
              <>
                <span className="text-sm text-gray-500">
                  {editReplyImage.name}
                </span>
                <button
                  onClick={() => {
                    setEditReplyImage(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500">Current image</span>
                <button
                  onClick={() => {
                    // Set imageUrl to null in backend
                    handleReplyEdit(reply.id, editReplyContent, null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setEditingReplyId(null);
            setEditReplyContent('');
            setEditReplyImage(null);
          }}
          className="px-3 py-1 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => handleReplyEdit(reply.id)}
          disabled={isSubmittingReplyEdit}
          className={`${
            isSubmittingReplyEdit
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-2`}
        >
          {isSubmittingReplyEdit ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
    {/* Preview current or new image */}
    {(editReplyImage || reply.imageUrl) && (
      <div className="mt-2">
        {editReplyImage ? (
          <img
            src={URL.createObjectURL(editReplyImage)}
            alt="Preview"
            className="max-w-full h-auto rounded-lg"
          />
        ) : (
          reply.imageUrl && (
            <img
              src={reply.imageUrl}
              alt="Current attachment"
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.style.display = 'none';
              }}
            />
          )
        )}
      </div>
    )}
  </div>
) : (
  <>
    <p className="mt-2 text-gray-800 whitespace-pre-wrap">
      {reply.content}
    </p>
    {reply.imageUrl && (
      <img
        src={reply.imageUrl}
        alt="Reply attachment"
        className="mt-2 max-w-full rounded-lg"
        onError={(e) => {
          console.error('Image load error:', e);
          e.target.style.display = 'none';
        }}
      />
    )}
  </>
)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <DialogConfirmation
        isOpen={showDeleteCommentDialog}
        onClose={() => setShowDeleteCommentDialog(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />

      <DialogConfirmation
        isOpen={showDeleteReplyDialog !== null}
        onClose={() => setShowDeleteReplyDialog(null)}
        onConfirm={() => handleReplyDelete(showDeleteReplyDialog)}
        title="Delete Reply"
        message="Are you sure you want to delete this reply? This action cannot be undone."
      />
    </div>
  );
};

export default ForumCommentItem;