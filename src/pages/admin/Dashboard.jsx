// src/pages/admin/Dashboard.jsx
import React from 'react';
import { Users, MessageSquare, Flag, BookOpen } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Forums',
      value: '56',
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Reports',
      value: '23',
      icon: <Flag className="w-6 h-6 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Total Books',
      value: '892',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          {/* Add reports table/list here */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">User Activity</h2>
          {/* Add activity chart here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;