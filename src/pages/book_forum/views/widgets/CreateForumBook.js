import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, TextField, Select, MenuItem, Alert, Box } from '@mui/material';
import { Book, BookOpen, User2, Tags, MessageCircle, Calendar } from 'lucide-react';

const CreateForumBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    bookTitle: '',
    author: '',
    genre: '',
    publishYear: '',
    description: '',
    discussionTopics: '',
    category: ''
  });

  const [error, setError] = useState('');

  const categories = [
    "Book Review",
    "Character Discussion",
    "Plot Analysis",
    "Writing Style",
    "Book Recommendations",
    "Author Spotlight",
    "Genre Discussion",
    "Reading Experience",
    "Book vs. Movie/TV",
    "Book Club Selection"
  ];

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Historical Fiction",
    "Biography",
    "Self-Help",
    "Poetry"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.bookTitle || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <Card variant="outlined" className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <div>
              <Typography variant="h5" component="div" className="font-bold text-gray-800">Create New Book Discussion</Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">Share your thoughts and start a meaningful discussion about books</Typography>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert severity="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Discussion Title */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />
                Discussion Title *
              </label>
              <TextField
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                variant="outlined"
                placeholder="Enter a captivating title for your discussion"
              />
            </div>

            {/* Book Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Book className="h-4 w-4 mr-2 text-emerald-600" />
                  Book Title *
                </label>
                <TextField
                  fullWidth
                  value={formData.bookTitle}
                  onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                  variant="outlined"
                  placeholder="Enter book title"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User2 className="h-4 w-4 mr-2 text-emerald-600" />
                  Author
                </label>
                <TextField
                  fullWidth
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  variant="outlined"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Genre and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Tags className="h-4 w-4 mr-2 text-emerald-600" />
                  Genre
                </label>
                <Select
                  fullWidth
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  variant="outlined"
                >
                  <MenuItem value="">Select Genre</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                  Publication Year
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                  variant="outlined"
                  placeholder="YYYY"
                  inputProps={{ min: 1000, max: new Date().getFullYear() }}
                />
              </div>
            </div>

            {/* Discussion Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Tags className="h-4 w-4 mr-2 text-emerald-600" />
                Discussion Category *
              </label>
              <Select
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />
                Discussion Description *
              </label>
              <TextField
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
                placeholder="Share your thoughts, questions, or topics you'd like to discuss..."
                multiline
                rows={6}
              />
            </div>

            {/* Discussion Topics */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />
                Discussion Topics
              </label>
              <TextField
                fullWidth
                value={formData.discussionTopics}
                onChange={(e) => setFormData({ ...formData, discussionTopics: e.target.value })}
                variant="outlined"
                placeholder="List specific topics or questions you'd like to discuss (optional)"
                multiline
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setFormData({
                  title: '',
                  bookTitle: '',
                  author: '',
                  genre: '',
                  publishYear: '',
                  description: '',
                  discussionTopics: '',
                  category: ''
                })}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
              >
                Create Discussion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateForumBook;
