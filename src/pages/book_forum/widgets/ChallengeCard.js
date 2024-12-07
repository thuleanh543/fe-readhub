import { BookOpen, CalendarDays, Trophy, Users, ArrowRight, Clock, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ChallengeCard = ({ challenge}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();
  const isExpired = new Date() > new Date(challenge.endDate);

  const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await api.get(`/api/v1/challenges/${challenge.challengeId}/check-membership`);
        if (response.data.success) {
          setIsMember(response.data.data.isMember);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
      }
    };

    checkMembership();
  }, [challenge.challengeId]);

  const handleJoin = async () => {
    try {
      if (isMember) {
        navigate(`/challenge/${challenge.challengeId}/discussion`);
        return;
      }

      setIsJoining(true);
      const response = await api.post(`/api/v1/challenges/${challenge.challengeId}/join`);
      if (response.data.success) {
        setIsMember(true);
        toast.success("Successfully joined the challenge!");
        navigate(`/challenge/${challenge.challengeId}/discussion`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join challenge");
    } finally {
      setIsJoining(false);
    }
  };

  const daysLeft = Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, ((new Date() - new Date(challenge.startDate)) /
    (new Date(challenge.endDate) - new Date(challenge.startDate))) * 100));

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 relative">
      {challenge.isExpired ? (
        <span className="absolute top-3 right-3 px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-full font-medium">
          Completed
        </span>
      ) : daysLeft <= 7 ? (
        <span className="absolute top-3 right-3 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysLeft} days left
        </span>
      ) : null}

      <h3 className="text-xl font-semibold text-gray-800 mb-4">{challenge.title}</h3>
      <p className="text-gray-600 text-sm mb-6">{challenge.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-lg">
          <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium">{challenge.selectedPeriod}</span>
        </div>
        <div className="flex items-center text-gray-700 bg-purple-50 p-2 rounded-lg">
          <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
          <span className="text-sm font-medium">{challenge.targetBooks} Books</span>
        </div>
        <div className="flex items-center text-gray-700 bg-green-50 p-2 rounded-lg">
          <Users className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-sm font-medium">{challenge.memberCount} Readers</span>
        </div>
        <div className="flex items-center text-gray-700 bg-yellow-50 p-2 rounded-lg">
          <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
          <span className="text-sm font-medium">{challenge.reward}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-blue-600">Progress</span>
          <span className="text-pink-600">{daysLeft} days left</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all"
            style={{width: `${progress}%`}}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/challenge/${challenge.challengeId}`)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors border border-gray-200 flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
        {!isExpired && (
      <button
        onClick={handleJoin}
      disabled={isJoining}
        className={`flex-1 flex items-center justify-center gap-2 font-medium py-2 rounded-lg transition-all ${
          challenge.hasJoined
            ? 'bg-green-50 text-green-600 cursor-default'
            : isJoining
            ? 'bg-gray-100 text-gray-400 cursor-wait'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
          }`}
        >
        {isJoining ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Joining...
          </>
        ) : isMember ? (
          <>
            <Check className="w-4 h-4" />
            Enter Challenge
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            Join Challenge
          </>
        )}
      </button>
    )}
      </div>
    </div>
  );
};

export default ChallengeCard;