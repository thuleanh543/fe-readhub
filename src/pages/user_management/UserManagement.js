import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  Avatar,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Ban, Clock, AlertTriangle, UserX, ShieldOff } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Filter only banned users
        const bannedUsers = data.data.filter(user =>
          user.forumInteractionBanned ||
          user.forumCreationBanned ||
          user.forumCommentBanned ||
          user.forumJoinBanned
        );
        setUsers(bannedUsers);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getBanStatus = (user) => {
    const bans = [];
    if (user.forumInteractionBanned) bans.push('Forum Interaction');
    if (user.forumCreationBanned) bans.push('Forum Creation');
    if (user.forumCommentBanned) bans.push('Commenting');
    if (user.forumJoinBanned) bans.push('Forum Joining');
    return bans;
  };

  const getBanExpiry = (user) => {
    const dates = [];
    if (user.forumBanExpiresAt) dates.push(new Date(user.forumBanExpiresAt));
    if (user.forumCreationBanExpiresAt) dates.push(new Date(user.forumCreationBanExpiresAt));
    if (user.forumCommentBanExpiresAt) dates.push(new Date(user.forumCommentBanExpiresAt));
    if (user.forumJoinBanExpiresAt) dates.push(new Date(user.forumJoinBanExpiresAt));

    if (dates.length === 0) return 'Permanent';
    const latestDate = new Date(Math.max(...dates));
    return format(latestDate, 'PPp');
  };

  const handleUnban = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/${userId}/unban`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        toast.success('User unbanned successfully');
        await fetchUsers();
      } else {
        throw new Error('Failed to unban user');
      }
    } catch (error) {
      toast.error(`Error unbanning user: ${error.message}`);
    } finally {
      setShowUnbanDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserX className="h-8 w-8 text-red-500" />
          Banned Users Management
        </h1>
        <p className="text-gray-600 mt-2">Manage and review banned users</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.userId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                {user.urlAvatar ? (
                  <Avatar src={user.urlAvatar} sx={{ width: 56, height: 56 }} />
                ) : (
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {user.fullName?.charAt(0) || user.username?.charAt(0)}
                  </Avatar>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{user.fullName || user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Ban Types:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getBanStatus(user).map((ban) => (
                        <span key={ban} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {ban}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Expires:</p>
                    <p className="text-sm text-gray-600">{getBanExpiry(user)}</p>
                  </div>
                </div>

                {user.forumBanReason && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">Reason:</p>
                      <p className="text-sm text-gray-600">{user.forumBanReason}</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4"
                startIcon={<ShieldOff />}
                onClick={() => {
                  setSelectedUser(user);
                  setShowUnbanDialog(true);
                }}
              >
                Unban User
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showUnbanDialog} onClose={() => setShowUnbanDialog(false)}>
        <DialogTitle>Confirm Unban</DialogTitle>
        <DialogContent>
          Are you sure you want to unban {selectedUser?.fullName || selectedUser?.username}?
          This will remove all current ban restrictions.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnbanDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleUnban(selectedUser?.userId)}
            variant="contained"
            color="primary"
          >
            Confirm Unban
          </Button>
        </DialogActions>
      </Dialog>

      {users.length === 0 && (
        <div className="text-center py-12">
          <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Banned Users</h3>
          <p className="mt-1 text-gray-500">There are currently no banned users in the system.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;