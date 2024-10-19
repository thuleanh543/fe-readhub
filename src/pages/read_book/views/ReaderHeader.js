import React from 'react'
import {AppBar, Toolbar, Typography, Button} from '@mui/material'
import {ArrowBack, ColorLens, Settings} from '@mui/icons-material'

const ReaderHeader = ({
  title,
  onBack,
  onToggleNotes,
  onToggleSettings,
  user,
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
        <Button color='inherit' onClick={onToggleNotes}>
          <ColorLens />
          Notes
        </Button>
      )}
      <Button color='inherit' onClick={onToggleSettings}>
        <Settings />
        Settings
      </Button>
    </Toolbar>
  </AppBar>
)
export default ReaderHeader
