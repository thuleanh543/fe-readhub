import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, Users, Book, TrendingUp, Star, BookOpen, Clock, Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForumItemCard = ({ forum }) => {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkMembership();
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

  const handleForumAction = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để tham gia diễn đàn');
      return;
    }

    if (isMember) {
      navigate(`/forums/${forum.discussionId}/discussion`);
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
          toast.success('Tham gia diễn đàn thành công');
          setIsMember(true);
          navigate(`/forums/${forum.discussionId}/discussion`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Forum Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{forum.forumTitle}</h2>
          {forum.trending && (
            <span className="flex items-center px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </span>
          )}
        </div>
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-600 mb-4">{forum.forumDescription}</p>
          <button
            onClick={handleForumAction}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
              ${isMember
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-900 hover:bg-blue-400'
              }`}
          >
            {loading ? (
              <span>Loading...</span>
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
            <span className="text-sm">{forum.totalPosts}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(forum.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ForumItemCard;
