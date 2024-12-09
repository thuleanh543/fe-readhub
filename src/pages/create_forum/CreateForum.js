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
import HeaderComponent from '../../component/header/HeaderComponent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateForum() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId, bookTitle, authors, subjects, coverBook } = location.state || {};
  const [previewImage, setPreviewImage] = useState(coverBook);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
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

        if (subjects && subjects.length > 0) {
          subjects.forEach(subject => {
            formDataToSend.append('subjects', subject);
          });
        }

        // Chỉ gửi ảnh mới nếu người dùng đã upload, nếu không thì gửi coverBook
        if (formData.coverImage) {
          formDataToSend.append('forumImage', formData.coverImage);
        } else {
          // Nếu không có ảnh mới, gửi coverBook làm ảnh mặc định
          const response = await fetch(coverBook);
          const blob = await response.blob();
          formDataToSend.append('forumImage', blob, 'coverBook.jpg');
        }

        setIsSubmitting(true);

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forums`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create forum');
        }

        const result = await response.json();

        if (result.success) {
          toast.success(result.message);
          setTimeout(() => {
            navigate('/book-forum');
          }, 500);
        } else {
          toast.error(result.message || 'Failed to create forum');
        }
      } catch (error) {
        console.error('Error creating forum:', error);
        toast.error(error.message || 'An error occurred while creating the forum');
      } finally {
        setIsSubmitting(false);
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
                        options={subjects || []}
                        value={formData.selectedCategories}
                        onChange={(e, newValue) => setFormData(prev => ({
                          ...prev,
                          selectedCategories: newValue
                        }))}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Forum Subjects"
                            error={!!errors.categories}
                            helperText={errors.categories}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const tagProps = getTagProps({ index });
                            const { key, ...chipProps } = tagProps;
                            return (
                              <Chip
                                key={key}
                                {...chipProps}
                                variant="outlined"
                                label={option}
                                sx={{ bgcolor: 'primary.main', color: 'white' }}
                              />
                            );
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: '2px dashed',
                          borderColor: 'grey.500',
                          borderRadius: 1,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <input
                          accept="image/*"
                          type="file"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          id="forum-cover-upload"
                        />
                        <label htmlFor="forum-cover-upload">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ImageIcon size={40} color={errors.coverImage ? '#d32f2f' : undefined} />
                            <Typography color={errors.coverImage ? 'error' : 'inherit'}>
                              {formData.coverImage ? 'Change Cover Image' : 'Upload Forum Cover Image (Required)'}
                            </Typography>
                            {errors.coverImage && (
                              <Typography variant="caption" color="error">
                                {errors.coverImage}
                              </Typography>
                            )}
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
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Forum cover"
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        bgcolor: 'grey.200',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography color="text.secondary">
                        No image selected
                      </Typography>
                    </Box>
                  )}
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