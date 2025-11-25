'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { PointsCard, PointsLeaderboard } from '@/components/PointsComponents';
import { 
  Gift, 
  TrendingUp, 
  History, 
  Award, 
  Star,
  Coins,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

// Helper function to get transaction icon
const getTransactionIcon = (type) => {
  const iconClass = type === 'earned' ? 'w-4 h-4 text-green-600' : 'w-4 h-4 text-red-600';
  return type === 'earned' ? 
    <Plus className={iconClass} /> : 
    <Minus className={iconClass} />;
};

// Helper function to get transaction color
const getTransactionColor = (type) => {
  return type === 'earned' ? 'text-green-600' : 'text-red-600';
};

const PointsRewards = () => {
  const { token } = useAuth();
  const { pointsData, loading: pointsLoading, refreshPoints } = usePoints();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Gift },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'rewards', label: 'Earn Rewards', icon: Star },
  ];

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTransactionHistory(),
        fetchUserStats(),
        refreshPoints()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/referrals/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          requestsSent: 0,
          requestsReceived: 0,
          successfulReferrals: 0,
          averageRating: 0,
          totalEarnings: 0,
          thisMonthEarnings: 0
        });
      } else {
        console.warn('Stats API not available, using default values');
        setStats({
          requestsSent: 0,
          requestsReceived: 0,
          successfulReferrals: 0,
          averageRating: 0,
          totalEarnings: 0,
          thisMonthEarnings: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        requestsSent: 0,
        requestsReceived: 0,
        successfulReferrals: 0,
        averageRating: 0,
        totalEarnings: 0,
        thisMonthEarnings: 0
      });
    }
  };

  const fetchTransactionHistory = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/referrals/points/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const transactionList = data.transactions || data.data || [];
        
        // Ensure transactions have proper structure
        const formattedTransactions = transactionList.map(transaction => ({
          id: transaction.id || transaction._id || Math.random().toString(36),
          type: transaction.type || (transaction.amount > 0 ? 'earned' : 'spent'),
          amount: transaction.amount || transaction.points || 0,
          description: transaction.description || transaction.reason || transaction.action || 'Points transaction',
          date: transaction.date || transaction.createdAt || transaction.timestamp || new Date().toISOString(),
          reference: transaction.reference || transaction.requestId || null,
          metadata: transaction.metadata || {}
        }));
        
        setTransactions(formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else if (response.status === 404) {
        // API endpoint might not exist yet
        console.warn('Transaction history API not available');
        setTransactions([]);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      // Set empty array instead of throwing to prevent app crash
      setTransactions([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      await fetchAllData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRewardClaim = async (action, metadata = {}) => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/referrals/points', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          metadata
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.pointsAwarded > 0) {
          alert(`Congratulations! You earned ${data.pointsAwarded} points for ${data.description}`);
          handleRefresh();
        } else {
          alert(data.message || 'Reward not available at this time');
        }
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward');
    } finally {
      setRefreshing(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'earned' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionColor = (type) => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  if (pointsLoading || loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 animate-ping mx-auto opacity-25"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading your points data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {refreshing ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 xs:p-4 sm:p-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0 mb-4 xs:mb-6">
        <div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Points & Rewards</h2>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-3 xs:px-4 py-2 rounded-md xs:rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 text-sm xs:text-base"
        >
          <RefreshCw className={`h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {pointsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 lg:gap-6 mb-6 xs:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 xs:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-blue-100 text-xs xs:text-sm">Available Points</p>
                <p className="text-2xl xs:text-3xl font-bold truncate">
                  {pointsData.current || pointsData.balance || 0}
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  {(pointsData.current || 0) > 0 ? 'Ready to use' : 'Start earning points!'}
                </p>
              </div>
              <Coins className="h-6 w-6 xs:h-8 xs:w-8 text-blue-200 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 xs:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-green-100 text-xs xs:text-sm">Total Earned</p>
                <p className="text-2xl xs:text-3xl font-bold truncate">
                  {pointsData.totalEarned || pointsData.earned || 0}
                </p>
                <p className="text-green-200 text-xs mt-1">
                  All-time earnings
                </p>
              </div>
              <TrendingUp className="h-6 w-6 xs:h-8 xs:w-8 text-green-200 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 xs:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-purple-100 text-xs xs:text-sm">This Month</p>
                <p className="text-2xl xs:text-3xl font-bold truncate">
                  {stats?.thisMonthEarnings || 0}
                </p>
                <p className="text-purple-200 text-xs mt-1">
                  Recent activity
                </p>
              </div>
              <Calendar className="h-6 w-6 xs:h-8 xs:w-8 text-purple-200 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 mb-4 xs:mb-6">
        <nav className="hidden sm:flex -mb-px space-x-6 lg:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <nav className="sm:hidden flex overflow-x-auto scrollbar-hide py-2 -mb-px">
          <div className="flex space-x-1 min-w-max px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center px-3 py-2 rounded-lg font-medium text-xs xs:text-sm flex-shrink-0
                    ${isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`
                    mr-1.5 h-3 w-3 xs:h-4 xs:w-4
                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  <span className="whitespace-nowrap">
                    {tab.id === 'overview' ? 'Overview' :
                     tab.id === 'history' ? 'History' :
                     tab.id === 'rewards' ? 'Rewards' : tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {activeTab === 'overview' && pointsData && (
        <div className="space-y-4 xs:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
            <PointsCard user={pointsData} className="col-span-1" />
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 xs:p-6">
              <div className="flex items-center justify-between mb-3 xs:mb-4">
                <h3 className="text-base xs:text-lg font-semibold">Referral Performance</h3>
                {stats && (
                  <span className="text-xs text-gray-500">
                    {stats.requestsSent + stats.requestsReceived > 0 ? 'Active' : 'Get started'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 xs:gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{stats?.requestsSent || 0}</div>
                  <div className="text-sm text-blue-700">Requests Sent</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <div className="text-2xl font-bold text-green-600">{stats?.requestsReceived || 0}</div>
                  <div className="text-sm text-green-700">Received</div>
                </div>
                
              </div>
              
              {stats && (stats.requestsSent + stats.requestsReceived) === 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    💡 Start by sending or receiving referral requests to build your statistics
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 xs:p-6">
            <h3 className="text-base xs:text-lg font-semibold mb-3 xs:mb-4 flex items-center">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              Points Earning System
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 lg:gap-6">
              <div className="flex items-start space-x-2 xs:space-x-3 p-3 xs:p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">50</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Interview Acknowledgment</h4>
                  <p className="text-xs xs:text-sm text-gray-600 mt-1">Earn 50 points when candidate acknowledges interview opportunity</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 xs:space-x-3 p-3 xs:p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">200</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Successful Hire</h4>
                  <p className="text-xs xs:text-sm text-gray-600 mt-1">Earn 100 points when candidate acknowledges hire completion</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 xs:space-x-3 p-3 xs:p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">+</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Profile Completion</h4>
                  <p className="text-xs xs:text-sm text-gray-600 mt-1">Bonus points for completing your candidate profile</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 xs:space-x-3 p-3 xs:p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm xs:text-base">Quality Rating</h4>
                  <p className="text-xs xs:text-sm text-gray-600 mt-1">Higher points for maintaining excellent referral ratings</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 text-sm mb-2">📋 Important Notes:</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Points are awarded only when candidates acknowledge the status change</li>
                <li>• Rejected requests don&apos;t affect your points balance</li>
                <li>• Higher points indicate better referral success rate</li>
                <li>• Points contribute to your visibility in candidate search results</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <span className="text-sm text-gray-500">
                {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-600">Your referral point transactions will appear here when candidates acknowledge your referrals.</p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>How to earn points:</strong><br/>
                    Send referral requests and earn points when candidates acknowledge interview invitations (+50 pts) or successful hires (+200 pts).
                  </p>
                </div>
              </div>
            ) : (
              transactions.slice(0, 50).map((transaction, idx) => (
                <div key={transaction.id || idx} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {transaction.reference && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Ref: {transaction.reference.slice(-8)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-right`}>
                      <div className={`font-semibold text-lg ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.type === 'earned' ? 'Earned' : 'Spent'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {transactions.length > 50 && (
              <div className="p-4 text-center bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing latest 50 transactions. Total: {transactions.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Reward Opportunities</h3>
          <p className="text-gray-600 mb-6">Points are automatically awarded when candidates confirm your referral milestones. No manual claiming required!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Automatic Rewards</h4>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-green-900">Interview Confirmed</h5>
                    <span className="text-green-600 font-bold">+50 pts</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Earned when candidate confirms interview</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-blue-900">Hire Confirmed</h5>
                    <span className="text-blue-600 font-bold">+200 pts</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Earned when candidate confirms hire</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Point Benefits</h4>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900">Search Visibility</h5>
                  <p className="text-sm text-gray-600 mt-1">Higher points = higher ranking in candidate search</p>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900">Credibility</h5>
                  <p className="text-sm text-gray-600 mt-1">Points showcase your successful referral history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsRewards;