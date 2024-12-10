import React, { useState } from 'react';
import { Flag, Check, X, AlertCircle, Clock, Ban, Trash2 } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, FormGroup, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const ActionMenu = ({ reportId, forumId }) => {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [banTypes, setBanTypes] = useState({
    noInteraction: false,
    noComment: false,
    noJoin: false,
    noForumCreation: false,
    deleteForum: false
  });

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
        noForumCreation: false,
        deleteForum: false
      });
      setShowBanDialog(true);
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

    try {
      await handleAction(selectedAction, banReason);

      setShowBanDialog(false);
      setBanReason('');
      setBanTypes({
        noInteraction: false,
        noComment: false,
        noJoin: false,
        deleteForum: false
      });

      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  const handleAction = async (actionId, reason = '') => {
    try {
        const body = {
            action: actionId,
            reason: reason || null,
            // Chỉ thêm banTypes nếu là action ban và có ít nhất 1 loại ban được chọn
            banTypes: actionId.startsWith('BAN_') ? banTypes : null
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

        // Đợi xử lý xong action trước khi xóa forum
        await response.json();

        // Thêm delay nhỏ trước khi xóa forum
        if (banTypes.deleteForum) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await handleDeleteForum();
        }

        toast.success('Action applied successfully');

        // Thêm delay trước khi reload trang
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('Action error:', error);
        toast.error(error.message);
        throw error;
    }
  };

  const handleDeleteForum = async () => {
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
    } catch (error) {
      throw new Error('Failed to delete forum: ' + error.message);
    }
  };

  return (
    <>
      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[1000]">
        <div className="py-1" role="menu">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={showBanDialog}
        onClose={() => setShowBanDialog(false)}
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
                    />
                  }
                  label="Ban user from creating forums"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={banTypes.deleteForum}
                      onChange={handleBanTypeChange}
                      name="deleteForum"
                    />
                  }
                  label="Delete this forum"
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
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowBanDialog(false);
              setBanReason('');
              setBanTypes({
                noInteraction: false,
                noComment: false,
                noJoin: false,
                noForumCreation: false,
                deleteForum: false
              });
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReasonSubmit}
            disabled={!banReason.trim() || (selectedAction?.includes('BAN') && !Object.values(banTypes).some(value => value))}
            variant="contained"
            color="error"
          >
            {selectedAction?.includes('BAN') ? 'Confirm Ban' : 'Send Warning'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionMenu;