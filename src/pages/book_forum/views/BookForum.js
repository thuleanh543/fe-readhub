// BookForum.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ForumPost from './widgets/ForumPost';
import CreateForumBook from './widgets/CreateForumBook';

const BookForum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', bookId: null });
  const [loading, setLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/v1/forum/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/forum/posts',
        newPost,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '', bookId: null });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/forum/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPosts(); // Refresh posts to show updated likes
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Discussion Forum
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={showCreatePost ? <CancelIcon /> : <AddIcon />}
          onClick={() => setShowCreatePost(!showCreatePost)}
          sx={{
            bgcolor: '#51bd8e',
            '&:hover': {
              bgcolor: '#3da97a'
            }
          }}
        >
          {showCreatePost ? 'Cancel' : 'Create New Post'}
        </Button>
      </div>

      {showCreatePost && (
        <CreateForumBook />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading posts...</Typography>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <ForumPost
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={() => {/* Handle comment */}}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default BookForum;