import React, { useState, useEffect } from 'react';
import { Flag, Check, X, AlertCircle, MoreHorizontal, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportStatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const ForumReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/forum-reports', {
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

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/forum-reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Report ${newStatus.toLowerCase()} successfully`);
        fetchReports();
        setShowDetailsModal(false);
      }
    } catch (error) {
      toast.error('Failed to update report status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Forum Reports</h1>
        <p className="text-gray-600">Manage and review reported forum content</p>
      </div>

      <div className="bg-white rounded-lg shadow">
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
                      <div className="h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={report.reporter.urlAvatar || `/api/placeholder/40/40`}
                          alt=""
                        />
                      </div>
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
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === 'PENDING' && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                          className="text-green-600 hover:text-green-900">
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-900">
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Forum Information</h3>
                <div className="mt-2">
                  <h4 className="font-medium">{selectedReport.forum.forumTitle}</h4>
                  <p className="text-gray-600">{selectedReport.forum.forumDescription}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Report Reason</h3>
                <div className="mt-2">
                  <div className="font-medium">{selectedReport.reason}</div>
                  {selectedReport.additionalInfo && (
                    <p className="text-gray-600 mt-1">{selectedReport.additionalInfo}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Reporter</h3>
                <div className="mt-2 flex items-center">
                  <img
                    src={selectedReport.reporter.urlAvatar || `/api/placeholder/40/40`}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{selectedReport.reporter.username}</div>
                    <div className="text-gray-600">{selectedReport.reporter.email}</div>
                  </div>
                </div>
              </div>

              {selectedReport.status === 'PENDING' && (
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'REJECTED')}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                    Reject Report
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                    Resolve Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumReports;