import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedForumRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isBanned = (user?.forumInteractionBanned) &&
    (user.forumBanExpiresAt === null || new Date(user.forumBanExpiresAt) > new Date());

  if (isBanned) {
    const banMessage = user.forumBanExpiresAt
      ? `You are banned until ${new Date(user.forumBanExpiresAt).toLocaleString()}: ${user.forumBanReason}`
      : `You are permanently banned: ${user.forumBanReason}`;

    toast.error(banMessage);
    return <Navigate to="/book-forum" replace />;
  }

  return children;
};

export default ProtectedForumRoute;