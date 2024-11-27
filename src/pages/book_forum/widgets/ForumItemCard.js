import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, MessageCircle, Users, Book, TrendingUp, Star, BookOpen, Clock, Heart, Ban } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import ReportDialog from '../../../component/dialogs/ReportDialog';

const ForumItemCard = ({ forum, user, onForumDeleted  }) => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState(0);
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const optionsRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBanned = (user?.forumInteractionBanned) &&
    (user.forumBanExpiresAt === null || new Date(user.forumBanExpiresAt) > new Date());

  const getBanMessage = () => {
    if (!user?.forumInteractionBanned) return '';
    if (!user.forumBanExpiresAt) {
      return `You are permanently banned: ${user.forumBanReason}`;
    }
    return `You are banned until ${new Date(user.forumBanExpiresAt).toLocaleString()}: ${user.forumBanReason}`;
  };

  const getButtonStyle = () => {
    if (isBanned) {
      return "bg-gray-200 text-gray-500 cursor-not-allowed opacity-75 flex items-center gap-2 border border-gray-300";
    }
    if (isMember) {
      return "bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2";
    }
    return "bg-blue-100 text-blue-900 hover:bg-blue-400 flex items-center gap-2";
  };


  const handleDeleteForum = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forum.discussionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success('Xóa diễn đàn thành công');
        // Refresh danh sách forum
        onForumDeleted(forum.discussionId);
      }
    } catch (err) {
      toast.error('Không thể xóa diễn đàn');
    }
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const handleReportForum = async (reportData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forum.discussionId}/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(reportData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success('Report forum success');
        setShowReportDialog(false);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Report forum failed');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    checkMembership();
    fetchCommentsCount();
  }, [forum.discussionId]);

  const checkMembership = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forum.discussionId}/membership`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setIsMember(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/forums/${forum.discussionId}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setCommentsCount(data.data.length);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleForumAction = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to join the forum');
      return;
    }

    if (isBanned) {
      toast.error(getBanMessage());
      return;
    }

    if (isMember) {
      navigate(`/forum-discussion/${forum.discussionId}`);
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/forums/${forum.discussionId}/join`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          toast.success('Successfully joined the forum');
          setIsMember(true);
          navigate(`/forum-discussion/${forum.discussionId}`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
      }
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{forum.forumTitle}</h2>
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                {(user?.role === 'ADMIN' || forum.creator?.userId === user?.userId) && (
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Forum
                  </button>
                )}
                {
                  user?.userId !== forum.creator?.userId &&  <button
                  onClick={() => setShowReportDialog(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report Forum
                </button>
                }

              </div>
            )}
          </div>
          {forum.trending && (
            <span className="flex items-center px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </span>
          )}
        </div>
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-600 mb-4">{forum.forumDescription}</p>
          <div className="flex flex-col items-end">
            <button
              onClick={handleForumAction}
              disabled={isBanned}
              className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyle()}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  <span>Loading...</span>
                </div>
              ) : isBanned ? (
                <>
                  <Ban className="w-4 h-4" />
                  <span>Access Restricted</span>
                </>
              ) : isMember ? (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Enter Discussion</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Join Forum</span>
                </>
              )}
            </button>
            {isBanned && (
              <div className="mt-2 text-xs text-red-600 italic max-w-[200px] text-right">
                {getBanMessage()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currently Reading Section */}
      <div className="px-6 py-4 border-t border-b border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Currently Reading</h3>
        <div className="flex gap-4">
          <img
            src={forum.imageUrl || "/api/placeholder/96/144"}
            alt={forum.bookTitle}
            className="w-24 h-36 object-cover rounded"
          />
          <div>
            <h4 className="font-bold">{forum.bookTitle}</h4>
            <p className="text-gray-600 text-sm mb-2">by {forum.authors}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {forum.categories?.map((category, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book Subjects */}
      {forum.subjects && forum.subjects.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {forum.subjects.map((subject, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Forum Stats */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center border-t border-gray-200">
        <div className="flex gap-4">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{forum.totalMembers}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">{commentsCount}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(forum.updatedAt).toLocaleDateString()}
        </div>
      </div>
      {showReportDialog && (
        <ReportDialog
        isOpen={showReportDialog} onClose={() => setShowReportDialog(false)} onSubmit={handleReportForum} />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Delete Forum</h3>
            <p className="mb-4">Are you sure you want to delete this forum? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button
            onClick={handleDeleteForum}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumItemCard;
