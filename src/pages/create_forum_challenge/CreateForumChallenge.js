import React, { useEffect, useState } from 'react';
import { CalendarDays, BookOpen, Trophy, Clock, Bean } from 'lucide-react';
import HeaderComponent from '../../component/header/HeaderComponent';

const CreateReadingChallenge = () => {

  const REWARD_TYPES = {
    READING_COLOR: 'READING_COLOR',
    READING_MONTH: 'READING_MONTH'
  };

  const REWARD_LABELS = {
    [REWARD_TYPES.READING_COLOR]: 'Reading Color Badge',
    [REWARD_TYPES.READING_MONTH]: 'Monthly Reader Badge'
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    seasonOrMonth: 'SEASON',
    selectedPeriod: '',
    startDate: '',
    endDate: '',
    targetBooks: '',
    reward: ''
  });
  const [user, setUser] = useState(null)

  const getUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDate = getCurrentDateTime();

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        type: 'READING_CHALLENGE',
        seasonOrMonth: formData.seasonOrMonth,
        selectedPeriod: formData.selectedPeriod,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        targetBooks: parseInt(formData.targetBooks),
        reward: formData.reward
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/book-forum';
      } else {
        alert(data.message || 'Error creating challenge');
      }
    } catch (error) {
      console.error('Full error:', error);
      alert(error.message || 'Error creating challenge');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent centerContent="" showSearch={false} />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Reading Challenge</h1>
          <p className="text-lg text-gray-600">Set up a new reading challenge and inspire others to read more</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Summer Reading Challenge 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Period Type</label>
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seasonOrMonth}
                    onChange={(e) => setFormData({...formData, seasonOrMonth: e.target.value})}
                    required
                  >
                    <option value="SEASON">Season</option>
                    <option value="MONTH">Month</option>
                  </select>
                  <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {formData.seasonOrMonth === 'SEASON' ? 'Select Season' : 'Select Month'}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Target Books</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of books"
                    value={formData.targetBooks}
                    onChange={(e) => setFormData({...formData, targetBooks: e.target.value})}
                    required
                  />
                  <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe your reading challenge and its goals..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">Start Date</label>
      <div className="relative">
        <input
          type="datetime-local"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.startDate}
          min={minDate}
          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          required
        />
        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>

    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">End Date</label>
      <div className="relative">
        <input
          type="datetime-local"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.endDate}
          min={formData.startDate || minDate}
          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          required
        />
        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  </div>

  <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Reward</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(REWARD_TYPES).map(([key, value]) => (
                  <div
                    key={value}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.reward === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setFormData({...formData, reward: value})}
                  >
                    <Bean className={`h-6 w-6 mr-3 ${
                      formData.reward === value ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className="font-medium">
                        {REWARD_LABELS[value]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {value === REWARD_TYPES.READING_COLOR
                          ? 'Earn badges based on reading progress colors'
                          : 'Earn badges for completing monthly reading goals'}
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="reward"
                      value={value}
                      checked={formData.reward === value}
                      onChange={(e) => setFormData({...formData, reward: e.target.value})}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => window.location.href = '/book-forum'}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                Create Challenge
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReadingChallenge;