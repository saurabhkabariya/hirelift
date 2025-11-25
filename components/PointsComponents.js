import React from 'react';
import { usePoints } from '@/contexts/PointsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, TrendingUp, Star, Award, RefreshCw, Users, Calendar } from 'lucide-react';

const PointsDisplay = ({ points, totalEarned, className = '', showTotal = false, size = 'default' }) => {
  const { pointsData, loading } = usePoints();
  
  // Use dynamic data if available, otherwise fall back to props
  const currentPoints = pointsData?.current ?? points ?? 0;
  const earnedTotal = pointsData?.totalEarned ?? totalEarned ?? 0;
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm',
    default: 'px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base',
    large: 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg'
  };
  
  if (loading) {
    return (
      <div className={`points-display ${className}`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 animate-pulse rounded-full text-sm">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span className="bg-gray-300 h-4 w-16 rounded"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={`points-display ${className}`}>
      {/* Current Points Badge */}
      <div className={`inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow ${sizeClasses[size]}`}>
        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="whitespace-nowrap">{currentPoints.toLocaleString()} Points</span>
      </div>
      
      {/* Total Earned Display */}
      {(showTotal && earnedTotal > 0) && (
        <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span className="truncate">Total earned: {earnedTotal.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

const PointsCard = ({ user = {}, className = '', showRefreshButton = true }) => {
  const { pointsData, loading, refreshPoints } = usePoints();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Use dynamic data from context or fallback to user prop
  const referralPoints = pointsData?.current ?? user.referralPoints ?? 0;
  const totalPointsEarned = pointsData?.totalEarned ?? user.totalPointsEarned ?? 0;
  const totalPointsSpent = pointsData?.totalSpent ?? user.totalPointsSpent ?? 0;
  const referralStats = pointsData?.stats ?? user.referralStats ?? {};
  const { successfulReferrals = 0, averageRating = 0 } = referralStats;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshPoints();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className={`points-card bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`points-card bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">Referral Rewards</h3>
        </div>
        <div className="flex items-center gap-2 xs:gap-3">
          <PointsDisplay points={referralPoints} size="default" />
          {showRefreshButton && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {/* Total Earned */}
        <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-150 transition-colors">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{totalPointsEarned.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-green-700">Total Earned</div>
        </div>

        {/* Successful Referrals */}
        <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-colors">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{successfulReferrals}</div>
          <div className="text-xs sm:text-sm text-blue-700">Successful</div>
        </div>

        {/* Available Points */}
        <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:from-yellow-100 hover:to-yellow-150 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center mb-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{referralPoints.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-yellow-700">Available</div>
        </div>
      </div>

      {/* Additional Stats Row */}
      {(totalPointsSpent > 0 || averageRating > 0) && (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {totalPointsSpent > 0 && (
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="text-lg sm:text-xl font-bold text-red-600">{totalPointsSpent.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-red-700">Points Spent</div>
            </div>
          )}
          {averageRating > 0 && (
            <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 fill-current" />
                <div className="text-lg sm:text-xl font-bold text-purple-600">{averageRating.toFixed(1)}</div>
              </div>
              <div className="text-xs sm:text-sm text-purple-700">Avg Rating</div>
            </div>
          )}
        </div>
      )}

      {/* Reward Info */}
      <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">Earning Opportunities</span>
        </h4>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-100 gap-2">
            <span className="text-gray-700 truncate">Interview Acknowledgment</span>
            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs whitespace-nowrap">+50 points</span>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-100 gap-2">
            <span className="text-gray-700 truncate">Successful Hire</span>
            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs whitespace-nowrap">+200 points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatePointsBadge = ({ points, className = '', showPoints = true, size = 'default' }) => {
  // Use the specific candidate's points from props, not the current user's context
  // This ensures the badge shows the correct points for each individual candidate
  const currentPoints = points ?? 0;
  
  const getPointsLevel = (points) => {
    if (points >= 1000) return { 
      level: 'Legend', 
      color: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500', 
      icon: '👑', 
      textColor: 'text-white',
      description: 'Top 1% performer'
    };
    if (points >= 500) return { 
      level: 'Elite', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500', 
      icon: '💎', 
      textColor: 'text-white',
      description: 'Elite referrer'
    };
    if (points >= 300) return { 
      level: 'Expert', 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500', 
      icon: '🌟', 
      textColor: 'text-white',
      description: 'Expert level'
    };
    if (points >= 150) return { 
      level: 'Pro', 
      color: 'bg-gradient-to-r from-green-500 to-teal-500', 
      icon: '🚀', 
      textColor: 'text-white',
      description: 'Professional'
    };
    if (points >= 50) return { 
      level: 'Rising', 
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500', 
      icon: '⭐', 
      textColor: 'text-white',
      description: 'Rising star'
    };
    return { 
      level: 'New', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-500', 
      icon: '🌱', 
      textColor: 'text-white',
      description: 'Getting started'
    };
  };
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs gap-1 sm:px-3 sm:py-1 sm:text-sm sm:gap-2',
    default: 'px-3 py-1 text-sm gap-1 sm:px-4 sm:py-2 sm:text-base sm:gap-2',
    large: 'px-4 py-2 text-base gap-2 sm:px-6 sm:py-3 sm:text-lg sm:gap-3'
  };

  const pointsInfo = getPointsLevel(currentPoints);

  return (
    <div className={`candidate-points-badge ${className}`}>
      <div 
        className={`inline-flex items-center ${pointsInfo.color} rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${sizeClasses[size]}`}
        title={`${pointsInfo.description} - ${currentPoints} points`}
      >
        <span className="text-sm sm:text-base">{pointsInfo.icon}</span>
        <span className={`${pointsInfo.textColor} truncate`}>{pointsInfo.level}</span>
        {showPoints && (
          <span className="bg-white bg-opacity-20 backdrop-blur-sm px-1 sm:px-2 py-0.5 rounded-full text-xs font-bold text-black whitespace-nowrap">
            {currentPoints.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

const PointsLeaderboard = ({ candidates = [], className = '', maxItems = 5 }) => {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    if (candidates.length === 0 && token) {
      fetchLeaderboard();
    } else {
      // Use provided candidates
      const topCandidates = candidates
        .filter(candidate => candidate.referralPoints > 0)
        .sort((a, b) => b.referralPoints - a.referralPoints)
        .slice(0, maxItems);
      setLeaderboard(topCandidates);
    }
  }, [candidates, token, maxItems]);
  
  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/referrals/points?type=leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      } else {
        setError('Unable to load leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };
  
  const getRankBadge = (index) => {
    const baseClasses = 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg flex-shrink-0';
    
    if (index === 0) return `${baseClasses} bg-gradient-to-br from-yellow-400 to-yellow-600`;
    if (index === 1) return `${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600`;
    if (index === 2) return `${baseClasses} bg-gradient-to-br from-orange-400 to-orange-600`;
    return `${baseClasses} bg-gradient-to-br from-blue-400 to-blue-600`;
  };
  
  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  if (loading) {
    return (
      <div className={`points-leaderboard bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16 flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`points-leaderboard bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 ${className}`}>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2 text-2xl">⚠️</div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className={`points-leaderboard bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 ${className}`}>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 flex-shrink-0" />
          <span className="truncate">Top Performers</span>
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-gray-600 text-sm sm:text-base">No leaderboard data available yet</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Start referring to see the top performers!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`points-leaderboard bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow ${className}`}>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 flex-shrink-0" />
        <span className="truncate">Top Referral Performers</span>
      </h3>
      
      <div className="space-y-2 sm:space-y-3">
        {leaderboard.map((candidate, index) => (
          <div key={candidate._id || candidate.id || index} 
               className={`flex items-center justify-between p-3 sm:p-4 lg:p-5 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                 index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md' :
                 index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                 index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' :
                 'bg-gray-50 border-gray-200'
               }`}>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Rank Badge */}
              <div className={getRankBadge(index)}>
                {typeof getRankIcon(index) === 'string' && getRankIcon(index).includes('🥇') ? 
                  <span className="text-sm sm:text-base">{getRankIcon(index)}</span> : 
                  <span className="text-sm sm:text-base">{getRankIcon(index)}</span>
                }
              </div>
              
              {/* Candidate Info */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-800 text-sm sm:text-lg lg:text-xl truncate">
                  {candidate.fullName || candidate.name || `User ${index + 1}`}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 truncate">
                  {candidate.currentPosition || candidate.position || 'Professional'}
                </div>
                {candidate.successfulReferrals > 0 && (
                  <div className="text-xs text-green-600 font-medium mt-1 hidden sm:block">
                    {candidate.successfulReferrals} successful referrals
                  </div>
                )}
              </div>
            </div>
            
            {/* Points and Stats */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 justify-end">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                <div className="font-bold text-lg sm:text-xl lg:text-2xl text-green-600">
                  {(candidate.referralPoints || candidate.points || 0).toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-gray-500">points</div>
              {candidate.averageRating > 0 && (
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{candidate.averageRating.toFixed(1)}</span>
                </div>
              )}
              {/* Mobile: Show successful referrals */}
              {candidate.successfulReferrals > 0 && (
                <div className="text-xs text-green-600 font-medium mt-1 sm:hidden">
                  {candidate.successfulReferrals} referrals
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {leaderboard.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Showing top {leaderboard.length} performers this month
          </p>
        </div>
      )}
    </div>
  );
};

export { PointsDisplay, PointsCard, CandidatePointsBadge, PointsLeaderboard };