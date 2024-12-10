import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  Button,
  DialogActions
} from '@mui/material';
import { MoreVertical, Flag } from 'lucide-react';

const CommentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [shouldDeleteComment, setShouldDeleteComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function stringToColor(string) {
    if (!string) return '#000000';
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    if (!name) return {};
    const initials = name.split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('');

    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 33,
        height: 33,
      },
      children: initials,
    };
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/comment-reports/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch comment reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    setIsSubmitting(true); // Thêm state loading
    try {
      // Nếu là action ban, mở dialog xác nhận xóa comment
      if (action.includes('BAN')) {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/comment-reports/reports/${reportId}/action`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              action,
              banTypes: {
                noComment: true, // Luôn ban comment vì đây là report comment
                deleteComment: action !== 'DISMISS' && shouldDeleteComment // Thêm flag delete comment
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to apply action');
        }

        toast.success('Action applied successfully');
        await fetchReports();
      }
    } catch (error) {
      toast.error('Error applying action: ' + error.message);
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
    setAnchorEl(null);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      DISMISSED: 'bg-gray-100 text-gray-800',
      BANNED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.PENDING}`}>
        {status}
      </span>
    );
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Comment Reports</h1>
          <p className="text-gray-600">Review and manage reported comments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span className="font-medium">{reports.length} Pending Reports</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content & Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {report.commentAuthor?.urlAvatar ? (
                        <Avatar
                          sx={{ width: 33, height: 33 }}
                          src={report.commentAuthor.urlAvatar}
                          alt={report.commentAuthor.fullName}
                        />
                      ) : (
                        <Avatar {...stringAvatar(report.commentAuthor?.fullName || 'Unknown User')} />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.commentAuthor?.fullName || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.commentAuthor?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {report.reporter?.urlAvatar ? (
                        <Avatar
                          sx={{ width: 33, height: 33 }}
                          src={report.reporter.urlAvatar}
                          alt={report.reporter.fullName}
                        />
                      ) : (
                        <Avatar {...stringAvatar(report.reporter?.fullName || 'Unknown Reporter')} />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.reporter?.fullName || 'Unknown Reporter'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.reporter?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xl">
                      <div className="text-sm text-gray-900 mb-2 line-clamp-2">
                        {report.commentContent}
                      </div>
                      <div className="text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-1 inline-block">
                        {report.reason?.replace(/_/g, ' ') || 'Unknown Reason'}
                      </div>
                      {report.additionalInfo && (
                        <div className="text-sm text-gray-500 mt-1 italic">
                          "{report.additionalInfo}"
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.reportedAt), 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === 'PENDING' && (
                      <>
                        <IconButton
                          onClick={(event) => {
                            setSelectedReport(report);
                            setAnchorEl(event.currentTarget);
                          }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedReport?.id === report.id}
                          onClose={() => setAnchorEl(null)}
                        >
                          <MenuItem onClick={() =>
                            handleAction(report.id, 'DISMISS')}>
                            Dismiss Report
                          </MenuItem>
                          <MenuItem onClick={() => {
                            setSelectedAction('BAN_24H');
                            setShowDeleteDialog(true);
                          }}>
                            Ban 24 Hours
                          </MenuItem>
                          <MenuItem onClick={() => {
                            setSelectedAction('BAN_PERMANENT');
                            setShowDeleteDialog(true);
                          }}>
                            Ban Permanently
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Ban User Options</DialogTitle>
        <DialogContent>
        <FormControl fullWidth>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldDeleteComment}
              onChange={(e) => setShouldDeleteComment(e.target.checked)}
            />
        }
        label="Delete this comment"
      />
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDeleteDialog(false)}>
      Cancel
    </Button>
    <Button
      onClick={() => handleAction(selectedReport?.id, selectedAction)}
      variant="contained"
      color="error"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Processing...' : 'Confirm'}
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default CommentReports;