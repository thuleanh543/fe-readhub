import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import {
  Save,
  Image as ImageIcon,
  Send as SendIcon,
} from 'lucide-react';
import HeaderComponent from '../../../component/header/HeaderComponent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateForum() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId, bookTitle, authors, defaultCoverImage ,  subjects } = location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedCategories: [],
    coverImage: null,
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Forum title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Forum description is required';
    }
    if (formData.selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Tạo FormData object để gửi file
        const formDataToSend = new FormData();
        formDataToSend.append('bookId', bookId);
        formDataToSend.append('bookTitle', bookTitle);
        formDataToSend.append('authors', authors);
        formDataToSend.append('forumTitle', formData.title);
        formDataToSend.append('forumDescription', formData.description);

        // Append categories/subjects
        formData.selectedCategories.forEach(category => {
          formDataToSend.append('categories', category);
        });
        subjects?.forEach(subject => {
          formDataToSend.append('subjects', subject);
        });

        // Xử lý ảnh
        if (formData.coverImage) {
          // Nếu coverImage là base64 string, cần chuyển về File
          const response = await fetch(formData.coverImage);
          const blob = await response.blob();
          const file = new File([blob], "forumImage.jpg", { type: 'image/jpeg' });
          formDataToSend.append('forumImage', file);
        }

        // Gọi API
        const response = await fetch('http://localhost:8080/api/v1/forums', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });

        const result = await response.json();

        if (result.success) {
          toast.success(result.message);
          setTimeout(() => {
            navigate('/book-forum');
          }, 1500);
        } else {
          toast.error(result.message || 'Failed to create forum');
        }
      } catch (error) {
        console.error('Error creating forum:', error);
        toast.error('An error occurred while creating the forum');
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: blueGrey[900],
      pb: 8
    }}>
      <HeaderComponent
        windowSize={windowSize}
        centerContent=""
        showSearch={false}
      />

      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Grid container spacing={4}>
          {/* Left Column - Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{
              bgcolor: 'background.paper',
              boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`,
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Create Discussion Forum
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Paper sx={{ p: 3, mb: 4, bgcolor: 'action.hover' }}>
                    <Typography variant="h6" gutterBottom>
                      Book Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Book Title"
                          value={bookTitle}
                          disabled
                          variant="filled"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Author"
                          value={authors}
                          disabled
                          variant="filled"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {subjects?.slice(0, 5).map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              size="small"
                              sx={{ bgcolor: 'primary.main', color: 'white' }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Forum Details Section */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Forum Details
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={
                          <Box component="span">
                            Forum Title
                          </Box>
                        }
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                        error={!!errors.title}
                        helperText={errors.title}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Forum Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        error={!!errors.description}
                        helperText={errors.description}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={subjects}
                        value={formData.selectedCategories}
                        onChange={(e, newValue) => setFormData(prev => ({
                          ...prev,
                          selectedCategories: newValue
                        }))}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Forum Categories"
                            error={!!errors.categories}
                            helperText={errors.categories}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                              sx={{ bgcolor: 'primary.main', color: 'white' }}
                            />
                          ))
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{
                        border: '2px dashed grey',
                        borderRadius: 1,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}>
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          id="forum-cover-upload"
                        />
                        <label htmlFor="forum-cover-upload">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ImageIcon size={40} />
                            <Typography>
                              {formData.coverImage ? 'Change Cover Image' : 'Upload Forum Cover Image (Optional)'}
                            </Typography>
                          </Box>
                        </label>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                  >
                  {isSubmitting ? 'Creating...' : 'Create Forum'}
                  </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Save />}
                      size="large"
                      onClick={() => setShowPreview(true)}
                    >
                      Preview
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Preview */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: 'background.paper',
              boxShadow: theme => `0 8px 24px ${theme.palette.common.black}20`,
              position: 'sticky',
              top: 100
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Forum Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <img
                    src={formData.coverImage || defaultCoverImage}
                    alt="Forum cover"
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                </Box>

                <Typography variant="h5" gutterBottom>
                  {formData.title || 'Forum Title'}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formData.description || 'Forum description will appear here...'}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.selectedCategories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      size="small"
                      sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                  ))}
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Book Information:
                  </Typography>
                  <Typography variant="body2">
                    {bookTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {authors}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}