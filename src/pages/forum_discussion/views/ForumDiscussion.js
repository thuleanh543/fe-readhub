import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, MessageCircle, Users, ThumbsUp, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from '../../../component/header/HeaderComponent'
import { Box } from '@mui/material';
import {colors} from '../../../constants'

const ForumDiscussion = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/v1/user/profile',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/v1/forums/${forumId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setForum(data.data);
        }

        const commentsResponse = await fetch(
          `http://localhost:8080/api/v1/forums/${forumId}/comments`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
          setComments(commentsData.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
    fetchForumData();
  }, [forumId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HeaderComponent
        centerContent=''
        showSearch={false}
      />
    <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 mt-12">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <img
                src={forum?.imageUrl || "/api/placeholder/300/450"}
                alt={forum?.forumTitle}
                className="w-full h-[450px] object-cover rounded-lg shadow-lg"
              />

              <div className="flex justify-between mt-4">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Forum Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{forum?.forumTitle}</h1>
              <p className="text-lg text-white/80 mb-6">{forum?.forumDescription}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h3 className="text-white/60 text-sm mb-1">Book Title</h3>
                  <p className="text-lg font-medium">{forum?.bookTitle}</p>
                </div>
                <div>
                  <h3 className="text-white/60 text-sm mb-1">Author</h3>
                  <p className="text-lg font-medium">{forum?.authors}</p>
                </div>
                <div>
                  <h3 className="text-white/60 text-sm mb-1">Created By</h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={forum?.creator?.urlAvatar || "/api/placeholder/32/32"}
                      alt={forum?.creator?.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-lg font-medium">{forum?.creator?.displayName}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{forum?.totalMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length} discussions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* New Comment Input */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex gap-4">
              <img
                src={user?.urlAvatar || "/api/placeholder/48/48"}
                alt="Your avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Comment Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <img
                      src={comment.user.urlAvatar || "/api/placeholder/48/48"}
                      alt={comment.user.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{comment.user.displayName}</h3>
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

                  {/* Comment Actions */}
                  <div className="flex items-center gap-6 text-gray-500">
                    <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Replies would go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div></Box>
  );
};

export default ForumDiscussion;