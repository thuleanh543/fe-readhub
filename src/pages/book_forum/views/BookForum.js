import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, Users, Book, TrendingUp, Star, BookOpen, Clock, Heart } from 'lucide-react';
import {
  Box,
} from '@mui/material'
import axios from 'axios';
import { toast } from 'react-toastify';
import ForumItemCard from './widgets/ForumItemCard';
import HeaderComponent from '../../../component/header/HeaderComponent';
import {colors} from '../../../constants'

const BookForum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
    getUser()
  }, [])

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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HeaderComponent
        centerContent=""
        showSearch={false}
      />
    <div className="container mx-auto px-4 py-8 mt-12">
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
          <ForumItemCard key={forum.discussionId}
          forum={forum}
          user={user}
          />
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
    </Box>
  );
};

export default BookForum;