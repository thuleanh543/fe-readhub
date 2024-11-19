import React, { useState, useEffect } from 'react';
import { Flag, Check, X, AlertCircle, MoreHorizontal, ExternalLink, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import NotificationBadge from '../../../component/admin/ui/NotificationBadge';
import ActionMenu from '../../../component/admin/ui/ActionMenu';
import ReportStatusBadge from '../../../component/admin/ui/ReportStatusBadge';
import { format } from 'date-fns';

const ForumReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState(null);

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
        setNotificationCount(data.data.filter(report => report.status === 'PENDING').length);
      }
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/forum-reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        toast.success('Action applied successfully');
        fetchReports();
        setShowActionMenu(false);
      }
    } catch (error) {
      toast.error('Failed to apply action');
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
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forum
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={report.reporter.urlAvatar || `/api/placeholder/40/40`}
                        alt=""
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.reporter.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.reporter.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{report.forum.forumTitle}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {report.forum.forumDescription}
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
                          onSelect={(action) => handleAction(report.id, action)}
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