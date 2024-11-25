import { BookOpen, CalendarDays, Trophy, Users } from "lucide-react";

const ChallengeCard = ({ challenge }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="absolute top-3 right-3">
        {challenge.isExpired && (
          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-full font-medium">
            Completed
          </span>
        )}
      </div>

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
          <span className="text-pink-600">6 days left</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
            style={{width: '75%'}}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors border border-gray-200">
          View Details
        </button>
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all">
          Join Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;