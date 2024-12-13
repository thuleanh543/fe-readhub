import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, Flag, TrendingUp,
  UserPlus, MessageSquare, Ban
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    newUsers: 0,
    totalForums: 0,
    reportedForums: 0,
    trends: {
      newUsers: 0,
      totalForums: 0
    }
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
            <TrendingUp
              className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`}
            />
            <span className={`${trend >= 0 ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {trend >= 0 ? '+' : ''}{trend}% so với tháng trước
            </span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Người Dùng Mới Tháng Này"
          value={stats?.newUsers}
          icon={UserPlus}
          trend={stats?.trends?.newUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng Số Forum"
          value={stats?.totalForums}
          icon={BookOpen}
          trend={stats?.trends?.totalForums}
          color="bg-green-500"
        />
        <StatCard
          title="Forum Bị Báo Cáo"
          value={stats?.reportedForums}
          icon={Flag}
          color="bg-red-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;