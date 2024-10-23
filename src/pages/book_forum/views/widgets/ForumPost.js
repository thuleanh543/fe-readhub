import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  FormHelperText,
  Alert,
  Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const ForumPost = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    bookId: null,
    showInNewsfeed: true
  });

  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    "General Discussion",
    "Book Reviews",
    "Reading Challenges",
    "Author Discussions",
    "Book Recommendations",
    "Reading Groups",
    "Writing",
    "Poetry"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a title for your discussion');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter some content for your discussion');
      return;
    }

    onSubmit({
      ...formData,
      bookInfo: selectedBook
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        maxWidth: '900px',
        mx: 'auto',
        mt: 2,
        p: 4
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Start a New Discussion
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category Selection */}
          <FormControl fullWidth>
            <InputLabel id="category-label">Select Category *</InputLabel>
            <Select
              labelId="category-label"
              value={formData.category}
              label="Select Category *"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Choose the most relevant category for your discussion
            </FormHelperText>
          </FormControl>

          {/* Title */}
          <TextField
            label="Discussion Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            helperText="Make your title specific and descriptive"
          />

          {/* Book Search */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Add a Book (Optional)
            </Typography>
            <Autocomplete
              options={[]} // Would be populated with book search results
              getOptionLabel={(option) => option.title}
              onChange={(_, newValue) => setSelectedBook(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for a book"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    )
                  }}
                />
              )}
            />
          </Box>

          {/* Content */}
          <TextField
            label="Discussion Content *"
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            fullWidth
            helperText="Share your thoughts, questions, or ideas"
          />

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                bgcolor: '#51bd8e',
                '&:hover': {
                  bgcolor: '#3da97a'
                }
              }}
            >
              Create Discussion
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ForumPost;