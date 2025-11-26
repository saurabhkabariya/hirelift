'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PointsLeaderboard } from '@/components/PointsComponents';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Crown } from 'lucide-react';

const Leaderboard = () => {
  const { token, user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/referrals/points?type=leaderboard', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard || []);
      } else {
        console.error('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-gray-600 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const getPointsTier = (points) => {
    if (points >= 5000) return { name: 'Platinum', color: 'text-purple-600' };
    if (points >= 1500) return { name: 'Gold', color: 'text-yellow-600' };
    if (points >= 500) return { name: 'Silver', color: 'text-gray-600' };
    return { name: 'Bronze', color: 'text-orange-600' };
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 xs:p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 xs:gap-0 mb-4 xs:mb-6">
        <div className="flex items-center space-x-2 xs:space-x-3">
          <Trophy className="h-6 w-6 xs:h-8 xs:w-8 text-yellow-500 flex-shrink-0" />
          <div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Referral Leaderboard</h2>
            <p className="text-sm xs:text-base text-gray-600">Top performing referral champions</p>
          </div>
        </div>

        <div className="flex items-center justify-end xs:justify-start">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full xs:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </div>

      {/* Authentication Banner for Unauthenticated Users */}
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Want to join the leaderboard? Start referring candidates and earn points!
                <button 
                  onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
                  className="ml-2 font-medium text-yellow-600 hover:text-yellow-800 underline"
                >
                  Sign Up Now
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="mb-6 xs:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-center gap-4 sm:gap-2 lg:gap-4 mb-4 xs:mb-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center order-2 sm:order-1">
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-lg p-4 xs:p-6 mb-3 w-full sm:w-[160px] lg:w-[200px] text-center relative">
                <div className="absolute -top-2 xs:-top-3 left-1/2 transform -translate-x-1/2">
                  <Medal className="h-6 w-6 xs:h-8 xs:w-8 text-gray-400" />
                </div>
                <div className="mt-3 xs:mt-4">
                  <h3 className="font-bold text-base xs:text-lg truncate">{leaderboardData[1]?.name}</h3>
                  <p className="text-gray-200 text-xs xs:text-sm">{leaderboardData[1]?.totalEarned} points</p>
                  <p className="text-gray-200 text-xs">{leaderboardData[1]?.successfulReferrals} referrals</p>
                </div>
              </div>
              <div className="bg-gray-400 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-medium">
                2nd Place
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center order-1 sm:order-2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-4 xs:p-6 mb-3 w-full sm:w-[180px] lg:w-[220px] text-center relative sm:transform sm:scale-110">
                <div className="absolute -top-3 xs:-top-4 left-1/2 transform -translate-x-1/2">
                  <Crown className="h-8 w-8 xs:h-10 xs:w-10 text-yellow-300" />
                </div>
                <div className="mt-4 xs:mt-6">
                  <h3 className="font-bold text-lg xs:text-xl truncate">{leaderboardData[0]?.name}</h3>
                  <p className="text-yellow-100 text-xs xs:text-sm">{leaderboardData[0]?.totalEarned} points</p>
                  <p className="text-yellow-100 text-xs">{leaderboardData[0]?.successfulReferrals} referrals</p>
                </div>
              </div>
              <div className="bg-yellow-500 text-white px-4 xs:px-6 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-bold">
                🏆 CHAMPION
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center order-3">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg p-4 xs:p-6 mb-3 w-full sm:w-[160px] lg:w-[200px] text-center relative">
                <div className="absolute -top-2 xs:-top-3 left-1/2 transform -translate-x-1/2">
                  <Award className="h-6 w-6 xs:h-8 xs:w-8 text-orange-300" />
                </div>
                <div className="mt-3 xs:mt-4">
                  <h3 className="font-bold text-base xs:text-lg truncate">{leaderboardData[2]?.name}</h3>
                  <p className="text-orange-100 text-xs xs:text-sm">{leaderboardData[2]?.totalEarned} points</p>
                  <p className="text-orange-100 text-xs">{leaderboardData[2]?.successfulReferrals} referrals</p>
                </div>
              </div>
              <div className="bg-orange-500 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-medium">
                3rd Place
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-base xs:text-lg font-semibold text-gray-900">Complete Rankings</h3>
        </div>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {leaderboardData.length === 0 ? (
            <div className="px-4 xs:px-6 py-6 xs:py-8 text-center">
              <Users className="h-10 w-10 xs:h-12 xs:w-12 text-gray-400 mx-auto mb-3 xs:mb-4" />
              <p className="text-gray-600 text-sm xs:text-base">No referral activity yet</p>
              <p className="text-xs xs:text-sm text-gray-500">Be the first to make a referral and claim the top spot!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((user, index) => {
                const tier = getPointsTier(user.totalEarned);
                return (
                  <div key={index} className={`p-4 xs:p-6 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <div className={`
                          flex-shrink-0 h-8 w-8 xs:h-10 xs:w-10 rounded-full flex items-center justify-center text-white font-medium text-xs xs:text-sm
                          ${getRankBadgeColor(user.rank)}
                        `}>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm xs:text-base font-medium text-gray-900 truncate">
                            {user.name}
                            {index < 3 && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Top
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tier.color} bg-opacity-10`}>
                              {tier.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 xs:gap-4 text-xs xs:text-sm">
                      <div>
                        <div className="text-gray-500">Current Points</div>
                        <div className="font-medium text-gray-900">{user.points.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Earned</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-green-500 mr-1" />
                          {user.totalEarned.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Referrals</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Users className="h-3 w-3 xs:h-4 xs:w-4 text-blue-500 mr-1" />
                          {user.successfulReferrals}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Rating</div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Star className="h-3 w-3 xs:h-4 xs:w-4 text-yellow-400 fill-current mr-1" />
                          {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Successful Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No referral activity yet</p>
                    <p className="text-sm text-gray-500">Be the first to make a referral and claim the top spot!</p>
                  </td>
                </tr>
              ) : (
                leaderboardData.map((user, index) => {
                  const tier = getPointsTier(user.totalEarned);
                  return (
                    <tr key={index} className={`${index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`
                            flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm
                            ${getRankBadgeColor(user.rank)}
                          `}>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                              {index < 3 && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Top Performer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.points.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {user.totalEarned.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-900">{user.successfulReferrals}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">
                            {user.averageRating > 0 ? user.averageRating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tier.color} bg-white bg-opacity-10`}>
                          {tier.name}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievement Badges */}
      {leaderboardData.length > 0 && (
        <div className="mt-6 xs:mt-8">
          <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-3 xs:mb-4">Achievement Badges</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 text-center">
              <Crown className="h-6 w-6 xs:h-8 xs:w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 text-sm xs:text-base">Top Earner</h4>
              <p className="text-xs text-gray-600">Most points earned</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 text-center">
              <Users className="h-6 w-6 xs:h-8 xs:w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 text-sm xs:text-base">Most Referrals</h4>
              <p className="text-xs text-gray-600">Highest referral count</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 text-center">
              <Star className="h-6 w-6 xs:h-8 xs:w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 text-sm xs:text-base">Highest Rated</h4>
              <p className="text-xs text-gray-600">Best average rating</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 text-center">
              <TrendingUp className="h-6 w-6 xs:h-8 xs:w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 text-sm xs:text-base">Rising Star</h4>
              <p className="text-xs text-gray-600">Fastest growth</p>
            </div>
          </div>
        </div>
      )}

      {/* Competition Info */}
      <div className="mt-6 xs:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 xs:p-6">
        <div className="flex flex-col xs:flex-row xs:items-start">
          <Trophy className="h-5 w-5 xs:h-6 xs:w-6 text-blue-600 mt-1 mr-0 xs:mr-3 mb-3 xs:mb-0 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2">Monthly Competition</h3>
            <p className="text-gray-700 mb-3 xs:mb-4 text-sm xs:text-base">
              Compete with other referrers to earn the top spot! Monthly winners receive special rewards and recognition.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 xs:p-4">
                <div className="flex items-center mb-2">
                  <Crown className="h-4 w-4 xs:h-5 xs:w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm xs:text-base">1st Place:</span>
                </div>
                <p className="text-gray-600 text-xs xs:text-sm">1000 bonus points + VIP status</p>
              </div>
              <div className="bg-white rounded-lg p-3 xs:p-4">
                <div className="flex items-center mb-2">
                  <Medal className="h-4 w-4 xs:h-5 xs:w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm xs:text-base">2nd Place:</span>
                </div>
                <p className="text-gray-600 text-xs xs:text-sm">500 bonus points + premium features</p>
              </div>
              <div className="bg-white rounded-lg p-3 xs:p-4">
                <div className="flex items-center mb-2">
                  <Award className="h-4 w-4 xs:h-5 xs:w-5 text-orange-500 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm xs:text-base">3rd Place:</span>
                </div>
                <p className="text-gray-600 text-xs xs:text-sm">250 bonus points + recognition badge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;