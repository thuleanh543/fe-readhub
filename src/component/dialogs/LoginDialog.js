import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

const LoginDialog = ({open, onClose, onLogin}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Login is required to use this feature
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{padding: 2, gap: 1}}>
        <Button onClick={onClose} variant='outlined' sx={{minWidth: 100}}>
          Cancel
        </Button>
        <Button onClick={onLogin} variant='contained' sx={{minWidth: 100}}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog
