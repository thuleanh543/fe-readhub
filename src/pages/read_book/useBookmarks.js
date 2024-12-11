// hooks/useBookmarks.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// hooks/useBookmarks.js
export const useBookmarks = (userId, bookId) => {
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
    if (!userId || !bookId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/bookmark/user/${userId}/book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data.success) {
        setBookmarks(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const addBookmark = async (location) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/bookmark`,
        {
          userId,
          bookId,
          location
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        await fetchBookmarks();
      }
    } catch (err) {
      console.error('Error adding bookmark:', err);
      throw err;
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/bookmark/${bookmarkId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        setBookmarks(bookmarks.filter(b => b.bookmarkId !== bookmarkId));
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId, bookId]);

  return { bookmarks, addBookmark, removeBookmark };
};
