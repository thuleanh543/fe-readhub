import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ActionMenu from '../../component/admin/ui/ActionMenu';
import ReportStatusBadge from '../../component/admin/ui/ReportStatusBadge';
import { format } from 'date-fns';
import { Avatar } from '@mui/material';

const ForumReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [socket, setSocket] = useState(null);

  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 33,
        height: 33,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
  }

  useEffect(() => {
    fetchReports();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/forum-reports', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Forum Reports</h1>
          <p className="text-gray-600">Manage and review reported forum content</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
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
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-16 h-12 object-cover rounded"
                        src={report.forum.imageUrl || "/api/placeholder/160/120"}
                        alt={report.forum.forumTitle}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.forum.forumTitle}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {report.forum.forumDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">

                      {report.reporter.urlAvatar ? (
                    <Avatar
                      sx={{width: 25, height: 25}}
                      src={report.reporter.urlAvatar}
                      alt={report.reporter.fullName}
                    />
                  ) : (
                    <Avatar {...stringAvatar(report.reporter?.fullName)} />
                  )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.reporter.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.reporter.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{report.reason}</div>
                    {report.additionalInfo && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {report.additionalInfo}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <ReportStatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.reportedAt), 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      {report.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowActionMenu(!showActionMenu);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Take Action
                        </button>
                      )}
                      {selectedReport?.id === report.id && showActionMenu && (
                        <ActionMenu
                          reportId={report.id}
                          forumId={report.forum.discussionId}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForumReports;