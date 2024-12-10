import React, { useState } from 'react';
import { Flag, Check, X, AlertCircle, Clock, Ban, Trash2, MoreVertical } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, FormGroup, Alert, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const ActionMenu = ({ reportId, forumId }) => {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banTypes, setBanTypes] = useState({
    noInteraction: false,
    noComment: false,
    noJoin: false,
    noForumCreation: false
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const actions = [
    { id: 'DISMISS', label: 'Dismiss Report', icon: <X className="w-4 h-4" /> },
    { id: 'WARN', label: 'Warn User', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'BAN_1H', label: 'Ban User (1h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_3H', label: 'Ban User (3h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_24H', label: 'Ban User (24h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_PERMANENT', label: 'Permanent Ban', icon: <Ban className="w-4 h-4" /> },
  ];

  const handleActionClick = (actionId) => {
    if (actionId === 'DISMISS') {
      handleAction(actionId);
    } else {
      setSelectedAction(actionId);
      setBanTypes({
        noInteraction: false,
        noComment: false,
        noJoin: false,
        noForumCreation: false
      });
      setShowBanDialog(true);
      setAnchorEl(null);
    }
  };

  const handleBanTypeChange = (event) => {
    setBanTypes({
      ...banTypes,
      [event.target.name]: event.target.checked
    });
  };

  const handleReasonSubmit = async () => {
    if (!banReason.trim() && selectedAction !== 'DISMISS') {
      toast.error('Please provide a reason');
      return;
    }

    if (selectedAction?.includes('BAN') && !Object.values(banTypes).some(value => value)) {
      toast.error('Please select at least one ban type');
      return;
    }

    setIsSubmitting(true);

    try {
      // Xử lý ban user trước
      const body = {
        action: selectedAction,
        reason: banReason || null,
        banTypes: selectedAction.startsWith('BAN_') ? {
          ...banTypes,
          deleteForum: false // Tạm thời set false vì sẽ xóa sau nếu user confirm
        } : null
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forums/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply action');
      }

      await response.json();
      toast.success('Action applied successfully');

      // Nếu là action ban, show dialog xác nhận xóa
      if (selectedAction?.includes('BAN')) {
        setShowBanDialog(false);
        setShowDeleteConfirmation(true);
        setIsSubmitting(false);
      } else {
        resetAndReload();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
      setIsSubmitting(false);
    }
};


const handleDeleteConfirmation = async (shouldDelete) => {
  if (shouldDelete) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forums/${forumId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete forum');
      }

      toast.success('Forum deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  }

  resetAndReload();
};


  const resetAndReload = () => {
    setShowDeleteConfirmation(false);
    setBanReason('');
    setBanTypes({
      noInteraction: false,
      noComment: false,
      noJoin: false,
      noForumCreation: false
    });
    setIsSubmitting(false);
    window.location.reload();
  };

  const handleAction = async (actionId, reason, deleteForum = false) => {
    try {
      const body = {
        action: actionId,
        reason: reason || null,
        banTypes: actionId.startsWith('BAN_') ? banTypes : null,
        deleteForum // Thêm flag delete forum vào request
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/forums/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply action');
      }

      await response.json();

    } catch (error) {
      console.error('Action error:', error);
      toast.error(error.message);
      throw error;
    }
};
  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVertical className="w-5 h-5" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className="flex items-center gap-2"
          >
            {action.icon}
            <span>{action.label}</span>
          </MenuItem>
        ))}
      </Menu>

      {/* Ban/Warning Dialog */}
      <Dialog
        open={showBanDialog}
        onClose={() => !isSubmitting && setShowBanDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedAction?.includes('BAN') ? 'Ban User' : 'Warning User'}
        </DialogTitle>
        <DialogContent>
          {selectedAction?.includes('BAN') && (
            <>
              <Alert severity="info" className="mb-4 mt-4">
                Please select at least one restriction type
              </Alert>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banTypes.noInteraction}
                      onChange={handleBanTypeChange}
                      name="noInteraction"
                      disabled={isSubmitting}
                    />
                  }
                  label="Ban user from forum interactions (like, save)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banTypes.noComment}
                      onChange={handleBanTypeChange}
                      name="noComment"
                      disabled={isSubmitting}
                    />
                  }
                  label="Ban user from commenting"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banTypes.noJoin}
                      onChange={handleBanTypeChange}
                      name="noJoin"
                      disabled={isSubmitting}
                    />
                  }
                  label="Ban user from joining forums"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banTypes.noForumCreation}
                      onChange={handleBanTypeChange}
                      name="noForumCreation"
                      disabled={isSubmitting}
                    />
                  }
                  label="Ban user from creating forums"
                />
              </FormGroup>
            </>
          )}
          <TextField
            margin="dense"
            label={selectedAction?.includes('BAN') ? "Reason for ban" : "Warning message"}
            fullWidth
            multiline
            rows={4}
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            variant="outlined"
            required
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowBanDialog(false)}
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReasonSubmit}
            disabled={!banReason.trim() || (selectedAction?.includes('BAN') && !Object.values(banTypes).some(value => value)) || isSubmitting}
            variant="contained"
            color="error"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Processing...' : selectedAction?.includes('BAN') ? 'Confirm Ban' : 'Send Warning'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => !isSubmitting && setShowDeleteConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Forum
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" className="mt-4">
            Would you like to delete this forum as well?
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => handleDeleteConfirmation(false)}
            color="inherit"
            disabled={isSubmitting}
          >
            No, Keep Forum
          </Button>
          <Button
            onClick={() => handleDeleteConfirmation(true)}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Trash2 className="w-4 h-4" />}
          >
            {isSubmitting ? 'Deleting...' : 'Yes, Delete Forum'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionMenu;