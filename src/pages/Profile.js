import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../App.css'
import {images, colors} from '../constants'
import axios from 'axios'
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Tab,
  TextField,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from '@mui/material'
import {
  AccountCircle,
  ExitToApp,
  PhotoCamera,
  Settings,
} from '@mui/icons-material'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import Header from '../component/header/HeaderComponent'
import {Visibility, VisibilityOff} from '@mui/icons-material'

function Profile() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(null)
  const [value, setValue] = useState('1')
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isProfileChanged, setIsProfileChanged] = useState(false)
  const [fullName, setFullname] = useState('')
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [password, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/${user.userId}/reset-password`,
        {password, newPassword},
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}},
      )
      setResetPasswordDialogOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password reset successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to reset password')
    }
  }

  const handleAvatarChange = async event => {
    const file = event.target.files[0]
    setAvatarFile(file)

    // Đọc file ảnh và hiển thị preview
    const reader = new FileReader()
    reader.onload = e => {
      setAvatarUrl(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload ảnh lên server ngay khi chọn xong
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await axios.post(
        `http://localhost:8080/api/v1/user/${user.userId}/upload-avatar`,
        formData,
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}},
      )
      getUser() // Refresh user info
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload avatar')
    }
  }
  useEffect(() => {
    // Kiểm tra xem username hoặc fullName đã thay đổi so với giá trị ban đầu hay chưa
    if (username !== user?.username || fullName !== user?.fullName) {
      setIsProfileChanged(true)
    } else {
      setIsProfileChanged(false)
    }
  }, [username, fullName])

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/${user.userId}`,
        {username: username, fullName: fullName},
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}},
      )

      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)
        await axios.post(
          `http://localhost:8080/api/v1/user/${user.userId}/upload-avatar`,
          formData,
          {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}},
        )
      }

      getUser() // Refresh user info
      toast.success('Update profile successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/${user.userId}`, {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      })

      localStorage.removeItem('token')
      navigate('/login-account')
      toast.success('Account deleted successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete account')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
    toast.success('Logout successfully')
  }

  const getUser = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login-account')
      return
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/user/profile',
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}},
      )
      setUser(response.data)
      setUsername(response.data.username)
      setFullname(response.data.fullName)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    getUser()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className='App'
      style={{
        backgroundColor: colors.themeLight.primary,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      <Header
        windowSize={windowSize}
        centerContent={'MY PROFILE'}
        showSearch={false}
      />
      <div
        style={{
          backgroundColor: 'white',
          height: windowSize.height - windowSize.height * 0.002,
          paddingLeft: windowSize.width * 0.2,
          fontWeight: 'bold',
          paddingRight: windowSize.width * 0.2,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: windowSize.height * 0.11,
        }}>
        <div>
          <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <TabList
                onChange={(e, newValue) => setValue(newValue)}
                aria-label='lab API tabs example'>
                <Tab label='Information' value='1' />
                <Tab label='Account and Security' value='2' />
              </TabList>
            </Box>
            <TabPanel value='1'>
              {user && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '300px',
                    margin: 'auto',
                  }}>
                  <Typography variant='h5' gutterBottom>
                    User Profile
                  </Typography>
                  <input
                    accept='image/*'
                    style={{display: 'none'}}
                    id='avatar-upload'
                    type='file'
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor='avatar-upload'>
                    <IconButton
                      sx={{width: 100, height: 100, position: 'relative'}}
                      component='span'>
                      {avatarUrl ? (
                        <Avatar
                          src={avatarUrl}
                          sx={{width: 100, height: 100}}
                        />
                      ) : user.urlAvatar ? (
                        <Avatar
                          src={user.urlAvatar}
                          sx={{width: 100, height: 100}}
                        />
                      ) : (
                        <Avatar>
                          {user.username
                            ? user.username.toUpperCase().charAt(0)
                            : 'U'}
                        </Avatar>
                      )}
                      <PhotoCamera
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          color: 'white',
                          backgroundColor: 'blue',
                          borderRadius: '50%',
                          padding: 0.5,
                        }}
                      />
                    </IconButton>
                  </label>
                  <TextField
                    label='Username'
                    variant='outlined'
                    fullWidth
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    sx={{marginTop: 2}}
                  />
                  <TextField
                    label='Full name'
                    variant='outlined'
                    fullWidth
                    value={fullName}
                    onChange={e => setFullname(e.target.value)}
                    sx={{marginTop: 2}}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleUpdateProfile}
                    disabled={!isProfileChanged}
                    sx={{marginTop: 2, width: '100%'}}>
                    Update Profile
                  </Button>
                </Box>
              )}
            </TabPanel>
            <TabPanel value='2'>
              {user && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '400px',
                    margin: 'auto',
                  }}>
                  <Typography variant='h5' gutterBottom>
                    User Profile
                  </Typography>
                  <TextField
                    disabled
                    label='Email'
                    variant='outlined'
                    fullWidth
                    value={user.email}
                    sx={{marginTop: 2}}
                    InputProps={{readOnly: true}}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setResetPasswordDialogOpen(true)}
                    sx={{marginTop: 2, width: '100%'}}>
                    Reset Password
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{marginTop: 2, width: '100%'}}>
                    Delete Account
                  </Button>
                </Box>
              )}
            </TabPanel>
          </TabContext>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <FormControl variant='outlined' fullWidth sx={{marginTop: 2}}>
            <InputLabel htmlFor='current-password'>Current Password</InputLabel>
            <OutlinedInput
              id='current-password'
              type={showCurrentPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setCurrentPassword(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge='end'>
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Current Password'
            />
          </FormControl>
          <FormControl variant='outlined' fullWidth sx={{marginTop: 2}}>
            <InputLabel htmlFor='new-password'>New Password</InputLabel>
            <OutlinedInput
              id='new-password'
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge='end'>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='New Password'
            />
          </FormControl>
          <FormControl variant='outlined' fullWidth sx={{marginTop: 2}}>
            <InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
            <OutlinedInput
              id='confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge='end'>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Confirm Password'
            />
            {newPassword !== confirmPassword && (
              <FormHelperText error>Passwords do not match</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setResetPasswordDialogOpen(false)}
            color='primary'>
            Cancel
          </Button>
          <Button onClick={handleResetPassword} color='primary'>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Profile
