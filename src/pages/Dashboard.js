import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, Flag, TrendingUp,
  UserPlus, MessageSquare, Ban
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    newUsers: 0,
    totalForums: 0,
    reportedForums: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex items-start justify-between">
      <div>
        <p className="text-gray-500 mb-1 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm">+{trend}% so với tháng trước</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Xem tổng quan về hoạt động của hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Người Dùng Mới Tháng Này"
          value={stats.newUsers}
          icon={UserPlus}
          trend={12}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng Số Forum"
          value={stats.totalForums}
          icon={BookOpen}
          trend={8}
          color="bg-green-500"
        />
        <StatCard
          title="Forum Bị Báo Cáo"
          value={stats.reportedForums}
          icon={Flag}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ người dùng mới */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Người Dùng Đăng Ký</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'T1', users: 400 },
                  { name: 'T2', users: 300 },
                  { name: 'T3', users: 600 },
                  { name: 'T4', users: 800 },
                  { name: 'T5', users: 1000 },
                  { name: 'T6', users: 900 },
                  { name: 'T7', users: 1200 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ forum */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Forum Mới & Báo Cáo</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'T1', forums: 200, reports: 30 },
                  { name: 'T2', forums: 400, reports: 45 },
                  { name: 'T3', forums: 300, reports: 25 },
                  { name: 'T4', forums: 500, reports: 60 },
                  { name: 'T5', forums: 450, reports: 40 },
                  { name: 'T6', forums: 600, reports: 50 },
                  { name: 'T7', forums: 700, reports: 65 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="forums"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;