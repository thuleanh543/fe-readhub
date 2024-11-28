import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedCreateForumRoute = ({ children }) => {
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
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const isBanned = (user?.forumCreationBanned) &&
    (user?.forumCreationBanExpiresAt === null || new Date(user?.forumCreationBanExpiresAt) > new Date());

  if (isBanned) {
    const banMessage = user?.forumCreationBanExpiresAt
      ? `You are banned until ${new Date(user?.forumCreationBanExpiresAt).toLocaleString()}: ${user?.forumCreationBanReason}`
      : `You are permanently banned: ${user?.forumCreationBanReason}`;

    toast.error(banMessage);
    return <Navigate to="/book-forum" replace />;
  }

  return children;
};

export default ProtectedCreateForumRoute;