import React, { useState, useEffect } from 'react';
import { PlusCircle, BookOpen, Clock, Heart, Ban, Trophy, Target, Calendar } from 'lucide-react';
import {
  Box,
} from '@mui/material'
import axios from 'axios';
import { toast } from 'react-toastify';
import ForumItemCard from './widgets/ForumItemCard';
import HeaderComponent from '../../component/header/HeaderComponent';
import {colors} from '../../constants'
import { useNavigate } from 'react-router-dom';
import { SEARCH_MODE } from '../../constants/enums';
import { formatDistanceToNow } from 'date-fns';
import ChallengeCard from './widgets/ChallengeCard';

const BookForum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  const isBanned = (user?.forumInteractionBanned || user?.forumInteractionBanned ) &&
    (user.forumBanExpiresAt === null || new Date(user.forumBanExpiresAt) > new Date());

  const getBanMessage = () => {
    if (!user?.forumInteractionBanned) return '';
    if (!user.forumBanExpiresAt) {
      return `You are permanently banned: ${user.forumBanReason}`;
    }
    return `You are banned until ${new Date(user.forumBanExpiresAt).toLocaleString()}: ${user.forumBanReason}`;
  };

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

  const handleForumDeleted = (deletedId) => {
    setForums(prevForums => prevForums.filter(forum => forum.discussionId !== deletedId));
  };

  const getProgressColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;

    if (progress < 30) return 'bg-emerald-600';
    if (progress < 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getChallengeStatus = (challenge) => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Completed';
    return 'In Progress';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userResponse, forumsResponse, challengesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/v1/user/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          api.get('/api/v1/forums'),
          api.get('/api/v1/challenges')
        ]);

        const userData = await userResponse.json();

        if (userData) setUser(userData);
        if (forumsResponse.data.success) setForums(forumsResponse.data.data);
        if (challengesResponse.data.success) setChallenges(challengesResponse.data.data);
      } catch (err) {
        setError(err.response?.status === 403
          ? 'You need to login to access this content'
          : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateForum = () => {
    if (!user) {
      toast.error('Please login to create a forum');
      return;
    }

    if (isBanned) {
      toast.error(getBanMessage());
      return;
    }

    navigate('/search-result', {
      state: { mode: SEARCH_MODE.SELECT_BOOK }
    });
  };

  if (loading) return (
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
      <div className='flex justify-center items-center flex-1'>
        Loading...
      </div>
    </Box>
  );

  if (error) return (
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
      <div className='flex justify-center items-center flex-1'>
        Error: {error}
      </div>
    </Box>
  );

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
        <div className="flex gap-4">
        <button
            onClick={() => navigate('/create-forum-challenge')}
            className="flex items-center px-4 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700"
            >
          <Trophy className="w-5 h-5 mr-2" />
          <span>Create Challenge</span>
        </button>
        <button
            onClick={handleCreateForum}
            disabled={isBanned}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isBanned
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isBanned ? (
              <>
                <Ban className="w-5 h-5 mr-2" />
                <span>Restricted</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                <span>Create New Forum</span>
              </>
            )}
          </button>
          </div>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <ForumItemCard
          key={forum.discussionId}
          forum={forum}
          user={user}
          onForumDeleted={handleForumDeleted}
          />
        ))}
      </div>

      {/* Featured Reading Challenge - Hardcoded Section */}
      <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Reading Challenges</h2>
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
            Active
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-yellow-600/20 text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
            Mid-way
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-red-600/20 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
            Ending Soon
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.challengeId} challenge={challenge} />
        ))}
      </div>
    </div>
    </div>
    </Box>
  );
};

export default BookForum;