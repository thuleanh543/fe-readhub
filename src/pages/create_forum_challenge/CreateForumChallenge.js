import React, { useState } from 'react';
import {
  Box,
  Card,
} from '@mui/material';
import { Book, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../component/header/HeaderComponent';
import { colors } from '../../constants';

const CreateForumChallenge = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('READING_CHALLENGE');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'READING_CHALLENGE',
    seasonOrMonth: 'SEASON', // 'SEASON' or 'MONTH'
    selectedPeriod: '', // Summer/Spring/etc or Jan/Feb/etc
    startDate: '',
    endDate: '',
    targetBooks: '', // Số sách cần đọc
    maxMembers: '', // Cho Book Club
    reward: '',
  });

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const challengeTypes = [
    {
      type: 'READING_CHALLENGE',
      title: 'Reading Challenge',
      description: 'Create a seasonal or monthly reading challenge with book targets',
      icon: Book,
      color: 'bg-blue-500',
      placeholder: {
        title: 'Summer Reading Challenge 2024',
        description: 'Join our seasonal reading challenge and complete your reading goals!',
      }
    },
    {
      type: 'BOOK_CLUB',
      title: 'Book Club',
      description: 'Create a limited-time book discussion group with member limit',
      icon: Users,
      color: 'bg-green-500',
      placeholder: {
        title: 'Mystery Lovers Book Club',
        description: 'A dedicated space for mystery enthusiasts to discuss their favorite books',
      }
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/challenges', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        toast.success('Challenge created successfully!');
        navigate('/book-forum');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create challenge');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.themeLight.color060d13,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HeaderComponent centerContent="" showSearch={false} />

      <div className="container mx-auto px-4 py-8 mt-12">
        <h1 className="text-4xl font-bold mb-8 text-white">Create Forum Challenge</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {challengeTypes.map((type) => (
            <div
              key={type.type}
              onClick={() => {
                setActiveTab(type.type);
                setFormData(prev => ({
                  ...prev,
                  type: type.type,
                  title: '',
                  description: '',
                }));
              }}
              className={`cursor-pointer rounded-lg p-6 transition-all ${
                activeTab === type.type
                  ? `${type.color} text-white shadow-lg transform -translate-y-1`
                  : 'bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <type.icon className={`w-8 h-8 ${activeTab === type.type ? 'text-white' : type.color.replace('bg-', 'text-')}`} />
                <h3 className="text-xl font-semibold">{type.title}</h3>
              </div>
              <p className={activeTab === type.type ? 'text-white/90' : 'text-gray-600'}>
                {type.description}
              </p>
            </div>
          ))}
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  placeholder={challengeTypes.find(t => t.type === activeTab).placeholder.title}
                  className="w-full p-3 border rounded-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              {activeTab === 'READING_CHALLENGE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period Type
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.seasonOrMonth}
                    onChange={(e) => setFormData({...formData, seasonOrMonth: e.target.value})}
                    required
                  >
                    <option value="SEASON">Season</option>
                    <option value="MONTH">Month</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'READING_CHALLENGE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.seasonOrMonth === 'SEASON' ? 'Select Season' : 'Select Month'}
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={formData.selectedPeriod}
                      onChange={(e) => setFormData({...formData, selectedPeriod: e.target.value})}
                      required
                    >
                      <option value="">Select {formData.seasonOrMonth.toLowerCase()}</option>
                      {(formData.seasonOrMonth === 'SEASON' ? seasons : months).map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Books
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Number of books to read"
                      className="w-full p-3 border rounded-lg"
                      value={formData.targetBooks}
                      onChange={(e) => setFormData({...formData, targetBooks: e.target.value})}
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'BOOK_CLUB' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Members
                  </label>
                  <input
                    type="number"
                    min="2"
                    placeholder="Maximum number of members"
                    className="w-full p-3 border rounded-lg"
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder={challengeTypes.find(t => t.type === activeTab).placeholder.description}
                className="w-full p-3 border rounded-lg"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Reader Badge, Special Recognition"
                className="w-full p-3 border rounded-lg"
                value={formData.reward}
                onChange={(e) => setFormData({...formData, reward: e.target.value})}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/book-forum')}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Challenge
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Box>
  );
};

export default CreateForumChallenge;