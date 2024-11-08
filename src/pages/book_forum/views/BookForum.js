import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, Users, Book, TrendingUp, Star, BookOpen, Clock, Heart } from 'lucide-react';
import axios from 'axios';

const BookForum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Assuming token is stored in localStorage
  };

  // Configure axios defaults
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add authentication interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Fetch forums data from API
  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await api.get('/api/v1/forums');
        if (response.data.success) {
          setForums(response.data.data);
        } else {
          setError('Failed to fetch forums');
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setError('You need to login to access this content');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  // Hardcoded challenge data (not available in API)
  const readingChallenges = [
    {
      id: 1,
      title: "Summer Reading Challenge",
      description: "Read 5 classics in 3 months and earn your badge",
      daysRemaining: 15,
      gradient: "from-blue-500 to-blue-600",
      icon: Book
    },
    {
      id: 2,
      title: "Author Spotlight",
      description: "This month featuring: Haruki Murakami",
      subtitle: "Join the reading marathon",
      gradient: "from-purple-500 to-purple-600",
      icon: Heart
    }
  ];

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Book Forums</h1>
          <p className="text-gray-600">Join thoughtful discussions about books with fellow readers</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Forum
        </button>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <div key={forum.discussionId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Forum Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{forum.forumTitle}</h2>
                {
                // forum.trending
                1==1
                && (
                  <span className="flex items-center px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Trending
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{forum.forumDescription}</p>
            </div>

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
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
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
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
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
        ))}
      </div>

      {/* Featured Reading Challenge - Hardcoded Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Reading Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readingChallenges.map((challenge) => (
            <div key={challenge.id} className={`bg-gradient-to-r ${challenge.gradient} text-white rounded-lg p-6`}>
              <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
              <p className="text-blue-100 mb-4">{challenge.description}</p>
              <div className="flex items-center mb-6">
                <challenge.icon className="w-6 h-6 mr-2" />
                <span>{challenge.subtitle || `${challenge.daysRemaining} days remaining`}</span>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
                  {challenge.id === 1 ? 'Join Challenge' : 'View Collection'}
                </button>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                  {challenge.id === 1 ? 'View Books' : 'Join Discussion'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookForum;