import React, { useState } from 'react';
import { Flag, Check, X, AlertCircle, Clock, Ban, Bell } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ActionMenu = ({ reportId }) => {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [banReason, setBanReason] = useState('');

  const actions = [
    { id: 'DISMISS', label: 'Dismiss Report', icon: <X className="w-4 h-4" /> },
    { id: 'WARN', label: 'Warn User', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'BAN_1H', label: 'Ban Forum Creation (1h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_3H', label: 'Ban Forum Creation (3h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_24H', label: 'Ban Forum Creation (24h)', icon: <Clock className="w-4 h-4" /> },
    { id: 'BAN_PERMANENT', label: 'Permanent Ban', icon: <Ban className="w-4 h-4" /> },
  ];

  const handleActionClick = (actionId) => {
    if (actionId.startsWith('BAN_')) {
      setSelectedAction(actionId);
      setShowBanDialog(true);
    } else if (actionId === 'WARN') {
      setSelectedAction(actionId);
      setShowBanDialog(true);
    } else {
      handleAction(actionId);
    }
  };

  const handleAction = async (actionId, reason = '') => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/forums/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: actionId,
          reason: reason || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to apply action');
      }

      toast.success('Action applied successfully');
    } catch (error) {
      console.error('Action error:', error);
      toast.error(error.message);
    }
  };

  const handleReasonSubmit = () => {
    if (!banReason.trim() && selectedAction !== 'DISMISS') {
      toast.error('Please provide a reason');
      return;
    }
    handleAction(selectedAction, banReason);
    setShowBanDialog(false);
    setBanReason('');
  };

  // Avoid aria-hidden issues with Dialog
  const dialogProps = {
    slotProps: {
      backdrop: {
        'aria-hidden': 'false'
      }
    },
    keepMounted: true,
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
        {...dialogProps}
      >
        <DialogTitle>
          {selectedAction?.includes('BAN') ? 'Ban User' : 'Warning User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={selectedAction?.includes('BAN') ? "Reason for ban" : "Warning message"}
            fullWidth
            multiline
            rows={4}
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            variant="outlined"
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowBanDialog(false);
              setBanReason('');
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReasonSubmit}
            disabled={!banReason.trim()}
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