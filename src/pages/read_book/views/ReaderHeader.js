import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ArrowBack,
  ColorLens,
  Settings,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material'

const ReaderHeader = ({
  title,
  onBack,
  onToggleNotes,
  onToggleSettings,
  user,
  onToggleBookmark,
  hasBookmark = false,
  currentLocation,
}) => (
  <AppBar position='static'>
    <Toolbar>
      <Button color='inherit' onClick={onBack}>
        <ArrowBack />
        Back
      </Button>
      <Typography variant='h6' style={{flexGrow: 1, textAlign: 'center'}}>
        {title || 'Epub Reader'}
      </Typography>
      {user && (
        <>
          <Tooltip title={hasBookmark ? 'Update bookmark' : 'Add bookmark'}>
            <IconButton
              color='inherit'
              onClick={() => onToggleBookmark(currentLocation)}
              sx={{mr: 1}}>
              {hasBookmark ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          <Button color='inherit' onClick={onToggleNotes}>
            <ColorLens />
            Notes
          </Button>
        </>
      )}
      <Button color='inherit' onClick={onToggleSettings}>
        <Settings />
        Settings
      </Button>
    </Toolbar>
  </AppBar>
)
export default ReaderHeader
