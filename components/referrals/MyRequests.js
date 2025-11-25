'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Send, 
  Inbox, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  Bell,
  RefreshCw
} from 'lucide-react';

const MyRequests = ({ initialSubTab }) => {
  const { token } = useAuth();
  const { refreshPoints, updatePointsLocally } = usePoints();
  const { notifications, refreshNotifications } = useNotifications();
  
  // Set initial tab based on prop or default to 'received'
  const [activeTab, setActiveTab] = useState(initialSubTab === 'sent' ? 'sent' : 'received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Update activeTab when initialSubTab prop changes
  useEffect(() => {
    if (initialSubTab === 'sent' && activeTab !== 'sent') {
      setActiveTab('sent');
    }
  }, [initialSubTab]);

  const tabs = [
    { id: 'received', label: 'Received', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send }
  ];

  useEffect(() => {
    fetchRequests();
  }, [activeTab, statusFilter, token]);

  const fetchRequests = async (page = 1, append = false) => {
    if (!token) return;
    
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('type', activeTab);
      searchParams.append('page', page.toString());
      searchParams.append('limit', '50'); // Increase limit for better UX
      if (statusFilter !== 'all') {
        searchParams.append('status', statusFilter);
      }

      const response = await fetch(`/api/referrals/requests?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      
      if (data.success) {
        const newRequests = data.requests || [];
        if (append) {
          setRequests(prevRequests => [...prevRequests, ...newRequests]);
        } else {
          setRequests(newRequests);
        }
        setPagination(data.pagination || { current: 1, pages: 1, total: newRequests.length });
      } else {
        console.error('Error in API response:', data.error);
        if (!append) {
          setRequests([]);
          setPagination({ current: 1, pages: 1, total: 0 });
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (!append) {
        setRequests([]);
        setPagination({ current: 1, pages: 1, total: 0 });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleStatusUpdate = async (requestId, status, message = '') => {
    setUpdatingStatus(requestId);
    try {
      const requestBody = {
        requestId,
        action: status,
        message
      };

      console.log('Updating request status:', { requestId, status, requestBody });

      // Use PUT method for updating request status
      const response = await fetch(`/api/referrals/requests?id=${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: status,
          message
        }),
      });

      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is ok
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = 'Failed to update request status';
        let errorData = {};
        
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              console.log('Parsed error data:', errorData);
            } catch (parseError) {
              console.log('Failed to parse JSON, using text response');
              errorData = { message: responseText };
            }
          }
          
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch (e) {
          console.log('Error reading response:', e);
          // If we can't parse JSON, use status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log('Parsed response data:', data);
        } catch (parseError) {
          console.log('Failed to parse response JSON:', parseError);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
      } else {
        console.log('Empty response received');
        throw new Error('Empty response from server');
      }
      
      if (data.success) {
        console.log('✅ Request updated successfully');
        // Update points if any were earned
        if (data.pointsEarned) {
          console.log('💰 Points earned:', data.pointsEarned);
          updatePointsLocally(data.pointsEarned);
        }
        
        // Update the local state immediately for better UX
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req._id === requestId 
              ? { ...req, status: status === 'accept' ? 'accepted' : 'declined' }
              : req
          )
        );
        
        setSelectedRequest(null);
        
        // Refresh notifications to update counts
        refreshNotifications();
        
        // Optionally refresh to sync with server
        setTimeout(() => fetchRequests(), 500);
      } else {
        console.log('❌ API returned success=false');
        throw new Error(data.message || data.error || 'Update failed - API returned success=false');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      // Show user-friendly error message
      alert(`Failed to update request: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAcceptAction = (request) => {
    setPendingAction({ request });
    setShowStatusModal(true);
  };

  const handlePointsReward = async (points, action, requestId) => {
    try {
      console.log('Triggering points reward for referrer:', { points, action, requestId });
      
      const response = await fetch('/api/referrals/points', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points,
          action,
          requestId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Referrer points awarded successfully:', data);
        // Don't call updatePointsLocally since points go to referrer, not current user (candidate)
        // The referrer's points will be updated on their end when they refresh or navigate
        return data;
      } else {
        console.error('❌ Referrer points award failed:', data);
        throw new Error(data.message || 'Failed to award points to referrer');
      }
    } catch (error) {
      console.error('Error awarding points to referrer:', error);
      // Don't show alert for points errors, as it's secondary to the main action
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchRequests(1, false),
      refreshNotifications(),
      refreshPoints()
    ]);
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'interviewed': return 'bg-blue-100 text-blue-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'interviewed': return <Calendar className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'dismissed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Apply proper filtering based on server response
  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/50">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-100 border-t-blue-600 mx-auto shadow-sm"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-transparent border-t-purple-500 animate-pulse mx-auto opacity-60"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 sm:h-16 sm:w-16 border-2 border-transparent border-t-indigo-400 animate-ping mx-auto opacity-30"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 text-lg sm:text-xl font-semibold">Loading your requests</p>
            <p className="text-gray-500 text-sm sm:text-base">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">My Requests</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Manage your referral requests and track their progress</p>
              </div>
              
              {/* Enhanced Notification Indicator */}
              {(notifications.requests.total > 0) && (
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-blue-900 hidden xs:inline">
                      {notifications.requests.total} update{notifications.requests.total !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {notifications.requests.newReceived > 0 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded-full border border-green-200/50 shadow-sm">
                        {notifications.requests.newReceived} new
                      </span>
                    )}
                    {notifications.requests.statusChanged > 0 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200/50 shadow-sm">
                        {notifications.requests.statusChanged} changed
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Actions */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              {/* Enhanced Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="group flex items-center justify-center xs:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed text-gray-700 hover:text-gray-800 rounded-xl text-sm font-medium transition-all duration-300 border border-gray-300/50 hover:border-gray-400/50 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] min-w-0"
              >
                <RefreshCw className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${refreshing ? 'animate-spin' : 'group-hover:rotate-45'}`} />
                <span className="truncate">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              {/* Enhanced Status Filter */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-2 xs:p-3 min-w-0 flex-1 xs:flex-initial border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <Filter className="h-4 w-4 text-gray-500 group-hover:text-gray-600 flex-shrink-0 transition-colors duration-200" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/90 backdrop-blur-sm border border-gray-300 hover:border-gray-400 rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 min-w-0 w-full xs:min-w-[140px] sm:min-w-[160px] shadow-sm cursor-pointer"
                >
                  <option value="all">All ({pagination.total})</option>
                  <option value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</option>
                  <option value="accepted">Accepted ({requests.filter(r => r.status === 'accepted').length})</option>
                  <option value="interviewed">Interviewed ({requests.filter(r => r.status === 'interviewed').length})</option>
                  <option value="hired">Hired ({requests.filter(r => r.status === 'hired').length})</option>
                  <option value="declined">Declined ({requests.filter(r => r.status === 'declined').length})</option>
                  <option value="dismissed">Dismissed ({requests.filter(r => r.status === 'dismissed').length})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 mb-6 sm:mb-8 overflow-hidden">
          <div className="border-b border-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
            <nav className="flex relative" aria-label="Tabs">
              {/* Background indicator */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-indigo-50/50"></div>
              
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const count = pagination.total;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative min-w-0 flex-1 overflow-hidden py-4 sm:py-5 px-4 sm:px-6 text-sm font-medium text-center transition-all duration-300 transform ${
                      isActive
                        ? 'text-blue-600 border-b-3 border-blue-500 bg-gradient-to-t from-blue-50/80 to-transparent scale-[1.02] shadow-lg'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-t hover:from-gray-50/50 hover:to-transparent hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                      <div className={`relative ${
                        isActive ? 'transform scale-110' : 'group-hover:scale-105'
                      } transition-transform duration-200`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                          isActive ? 'text-blue-600 drop-shadow-sm' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        {isActive && (
                          <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <span className="hidden sm:inline font-semibold">{tab.label}</span>
                      <span className="sm:hidden font-semibold text-xs">{tab.id === 'received' ? 'Inbox' : 'Sent'}</span>
                      {count > 0 && (
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold transition-all duration-200 shadow-sm ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 border border-blue-300/50 shadow-md transform scale-110' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 group-hover:from-gray-200 group-hover:to-gray-300 border border-gray-200'
                        }`}>
                          {count}
                        </span>
                      )}
                    </div>
                    
                    {/* Active indicator line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-full shadow-lg"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="p-6 sm:p-8">
              {/* Enhanced Empty State */}
              <div className="text-center py-12 sm:py-16">
                <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
                    <Inbox className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                  {/* Floating decorations */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-1/2 -left-2 w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">No requests found</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                    {statusFilter === 'all' 
                      ? `You don't have any ${activeTab} requests yet. ${activeTab === 'received' ? 'When someone sends you a referral request, it will appear here.' : 'Start by browsing candidates and sending referral requests.'}`
                      : `No requests with "${statusFilter}" status found. Try adjusting your filter or check back later.`
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              {/* Enhanced Requests Grid */}
              <div className="space-y-4 sm:space-y-6">
                {filteredRequests.map((request, index) => (
                  <div
                    key={request._id}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative transform hover:scale-[1.02] hover:-translate-y-1"
                    onClick={() => setSelectedRequest(request)}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-indigo-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-indigo-50/30 transition-all duration-500"></div>
                    
                    <div className="relative p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                                {request.jobTitle}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600 font-medium truncate">{request.company}</span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span className="capitalize">{request.status.replace('-', ' ')}</span>
                              </span>
                            </div>
                          </div>
                          
                          {/* Request Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            {request.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{request.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="font-medium text-green-600">{request.pointsOffered} points</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span>{new Date(request.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {activeTab === 'received' && request.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptAction(request);
                              }}
                              disabled={updatingStatus === request._id}
                              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              {updatingStatus === request._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span>{updatingStatus === request._id ? 'Processing...' : 'Accept'}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(request._id, 'decline');
                              }}
                              disabled={updatingStatus === request._id}
                              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              {updatingStatus === request._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <span>{updatingStatus === request._id ? 'Processing...' : 'Decline'}</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Action Buttons for Interviewed Requests */}
                        {activeTab === 'received' && request.status === 'interviewed' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleStatusUpdate(request._id, 'hired', 'Candidate has been hired');
                                await handlePointsReward(200, 'hired', request._id);
                              }}
                              disabled={updatingStatus === request._id}
                              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                              {updatingStatus === request._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span>{updatingStatus === request._id ? 'Processing...' : 'Hire'}</span>
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleStatusUpdate(request._id, 'dismissed', 'Request dismissed');
                              }}
                              disabled={updatingStatus === request._id}
                              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              {updatingStatus === request._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <span>{updatingStatus === request._id ? 'Processing...' : 'Dismiss'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced hover indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-lg"></div>
                      
                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-transparent border-t-[20px] border-t-blue-500/10 group-hover:border-t-blue-500/30 transition-colors duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
                  <div className="text-xs sm:text-sm text-gray-600 font-medium bg-white/50 rounded-full px-3 py-1 border border-gray-200">
                    Showing <span className="font-bold text-gray-800">{requests.length}</span> of <span className="font-bold text-gray-800">{pagination.total}</span> requests
                    {pagination.current < pagination.pages && (
                      <span className="ml-1 text-gray-500">(Page {pagination.current} of {pagination.pages})</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    {pagination.current < pagination.pages && (
                      <>
                        <button
                          onClick={loadMoreRequests}
                          disabled={loadingMore}
                          className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          {loadingMore ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <svg className="h-4 w-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                          <span>{loadingMore ? 'Loading...' : `Load More (${pagination.pages - pagination.current} left)`}</span>
                        </button>
                        
                        <button
                          onClick={loadAllRequests}
                          disabled={loadingMore}
                          className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 disabled:border-blue-400 disabled:text-blue-400 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                        >
                          <svg className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7a4 4 0 014-4h8a4 4 0 014 4M4 7h16" />
                          </svg>
                          <span>Load All</span>
                        </button>
                      </>
                    )}
                    
                    {pagination.current >= pagination.pages && pagination.total > 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 rounded-full px-4 py-2 border border-green-200 shadow-sm">
                        <svg className="h-4 w-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>All requests loaded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/200 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
              {/* Header with Dynamic Status */}
              <div className={`relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${
                selectedRequest.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                selectedRequest.status === 'accepted' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                selectedRequest.status === 'interviewed' ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                selectedRequest.status === 'hired' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                selectedRequest.status === 'dismissed' ? 'bg-gradient-to-r from-gray-500 to-slate-600' :
                selectedRequest.status === 'declined' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                <div className="relative flex sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div className="flex xs:flex-row xs:items-center gap-2 xs:gap-4 mb-2">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">Request Details</h3>
                      <span className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white bg-opacity-20 backdrop-blur-sm text-black border border-white border-opacity-30 w-fit`}>
                        {getStatusIcon(selectedRequest.status)}
                        <span className="capitalize">{selectedRequest.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <p className="text-white text-opacity-90 text-xs sm:text-sm leading-relaxed pr-2">
                      {selectedRequest.status === 'pending' ? 'Awaiting your response' :
                       selectedRequest.status === 'accepted' ? 'Request accepted - choose next step' :
                       selectedRequest.status === 'interviewed' ? 'Interview scheduled - ready for hiring decision' :
                       selectedRequest.status === 'hired' ? 'Candidate successfully hired!' :
                       selectedRequest.status === 'dismissed' ? 'Request has been dismissed' :
                       selectedRequest.status === 'declined' ? 'Request was declined' :
                       'Manage this referral request'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-white hover:text-black p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent flex-shrink-0 self-start sm:self-auto"
                  >
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    
                    {/* Left Column - Job Information */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Job Header */}
                      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
                          <div className="w-full">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight break-words">
                              {selectedRequest.jobTitle}
                            </h4>
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                                <Building className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                              </div>
                              <span className="text-base sm:text-lg text-gray-700 font-semibold truncate flex-1">
                                {selectedRequest.company}
                              </span>
                            </div>
                            {selectedRequest.jobType && (
                              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                                <span className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 capitalize shadow-sm">
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2"></span>
                                  {selectedRequest.jobType.replace('-', ' ')}
                                </span>
                                {selectedRequest.urgency && (
                                  <span className={`inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium capitalize shadow-sm border ${
                                    selectedRequest.urgency === 'high' 
                                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800' :
                                    selectedRequest.urgency === 'medium' 
                                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800' :
                                      'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800'
                                  }`}>
                                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                                    selectedRequest.urgency === 'high' ? 'bg-red-500' :
                                    selectedRequest.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></span>
                                  {selectedRequest.urgency} Priority
                                </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                          {selectedRequest.jobLocation && (
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 group col-span-1 sm:col-span-2 lg:col-span-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5 sm:mt-0">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-emerald-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-emerald-600 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">
                                  Location
                                </p>
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base break-words leading-tight">
                                  {selectedRequest.jobLocation}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {selectedRequest.salaryRange && (selectedRequest.salaryRange.min || selectedRequest.salaryRange.max) && (
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 group col-span-1 sm:col-span-2 lg:col-span-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5 sm:mt-0">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-green-600 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">
                                  Salary Range
                                </p>
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base leading-tight break-words">
                                  {selectedRequest.salaryRange.min && selectedRequest.salaryRange.max ? 
                                    `$${selectedRequest.salaryRange.min.toLocaleString()} - $${selectedRequest.salaryRange.max.toLocaleString()}` :
                                    selectedRequest.salaryRange.min ? 
                                    `$${selectedRequest.salaryRange.min.toLocaleString()}+` :
                                    `Up to $${selectedRequest.salaryRange.max.toLocaleString()}`
                                  }
                                  {selectedRequest.salaryRange.currency && selectedRequest.salaryRange.currency !== 'USD' && 
                                    <span className="text-xs text-gray-500 ml-1">{selectedRequest.salaryRange.currency}</span>
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Description */}
                      {selectedRequest.jobDescription && (
                        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                          <h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                            </div>
                            Job Description
                          </h5>
                          <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">{selectedRequest.jobDescription}</p>
                          </div>
                        </div>
                      )}

                      {/* Message from Requester */}
                      {selectedRequest.message && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                          <h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <span className="break-words">Message from {selectedRequest.requester?.firstName || 'Requester'}</span>
                          </h5>
                          <p className="text-gray-700 leading-relaxed italic text-sm sm:text-base break-words">"{selectedRequest.message}"</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Metadata & Actions */}
                    <div className="space-y-4 sm:space-y-6">
                      
                      {/* Points & Status Card */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-6">
                        <div className="text-center mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-green-800 mb-1">Referrer Rewards</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-900">{selectedRequest.pointsOffered || 0}</p>
                        </div>
                        
                        {/* Referrer Earnings Breakdown */}
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                          <p className="text-xs text-gray-500 mb-2 text-center">Points earned by referrer when you acknowledge:</p>
                          <div className="flex justify-between items-center py-1 sm:py-1">
                            <span className="text-gray-600 truncate pr-2">Base Referral:</span>
                            <span className="font-semibold text-gray-900 flex-shrink-0">{selectedRequest.pointsOffered || 0} pts</span>
                          </div>
                          {selectedRequest.status === 'interviewed' && (
                            <div className="flex justify-between items-center py-1 sm:py-1">
                              <span className="text-blue-600 truncate pr-2">Interview Ack:</span>
                              <span className="font-semibold text-blue-700 flex-shrink-0">+50 pts</span>
                            </div>
                          )}
                          {(selectedRequest.status === 'interviewed' || selectedRequest.status === 'hired') && (
                            <div className="flex justify-between items-center py-1 sm:py-1 border-t border-green-200 pt-1.5 sm:pt-2">
                              <span className="text-emerald-600 truncate pr-2">Hire Ack:</span>
                              <span className="font-bold text-emerald-700 flex-shrink-0">+200 pts</span>
                            </div>
                          )}
                          {selectedRequest.status === 'hired' && (
                            <div className="flex justify-between items-center py-2 bg-green-100 rounded-lg px-2 sm:px-3 mt-1.5 sm:mt-2">
                              <span className="font-semibold text-green-800 truncate pr-2">Referrer Earned:</span>
                              <span className="text-lg sm:text-xl font-bold text-green-900 flex-shrink-0">
                                {(selectedRequest.pointsOffered || 0) + 250} pts
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Request Timeline */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          Timeline
                        </h5>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Created</p>
                              <p className="text-xs text-gray-600">
                                {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {selectedRequest.viewedAt && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Viewed</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(selectedRequest.viewedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {selectedRequest.acceptedAt && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Accepted</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(selectedRequest.acceptedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {selectedRequest.interviewScheduledAt && (
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Interview Scheduled</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(selectedRequest.interviewScheduledAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {selectedRequest.hiredAt && (
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Hired</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(selectedRequest.hiredAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Requester Information */}
                      {selectedRequest.requester && (
                        <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 border border-indigo-200/50 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                          <h5 className="font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center shadow-sm">
                              <Building className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm sm:text-base">
                              Requester Details
                            </span>
                          </h5>
                          <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg sm:rounded-xl"></div>
                            
                            <div className="relative flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/50">
                              {/* Enhanced Avatar */}
                              <div className="relative flex-shrink-0 mx-auto xs:mx-0">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                  <span className="text-white font-bold text-sm sm:text-lg tracking-wide">
                                    {(selectedRequest.requester.firstName?.[0] || '') + (selectedRequest.requester.lastName?.[0] || '')}
                                  </span>
                                </div>
                                {/* Status indicator */}
                                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                              </div>
                              
                              {/* User Information */}
                              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 overflow-auto">
                                {/* Name and Verification Badge */}
                                <div className="flex flex-col gap-2 min-w-0 text-wrap">
                                  <div className="flex-1 min-w-0 text-wrap">
                                    <p className="font-bold text-gray-900 text-sm xs:text-base sm:text-lg leading-tight text-center xs:text-left overflow-wrap-anywhere">
                                      {selectedRequest.requester.firstName} {selectedRequest.requester.lastName}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-center xs:justify-start">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex-shrink-0">
                                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                      <span className="whitespace-nowrap">Verified</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Email */}
                                <div className="flex items-start xs:items-center justify-center xs:justify-start gap-2 text-gray-600 min-w-0 text-wrap">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mt-0.5 xs:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                  </svg>
                                  <span className="text-xs sm:text-sm font-medium text-center xs:text-left flex-1 min-w-0 overflow-wrap-anywhere">
                                    {selectedRequest.requester.email}
                                  </span>
                                </div>
                                
                                {/* Additional info row */}
                                <div className="flex flex-col xs:flex-row items-center justify-center xs:justify-start gap-2 xs:gap-3 sm:gap-4 text-xs text-gray-500 flex-wrap text-wrap">
                                  <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">Member since 2025</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">Verified Account</span>
                                  </div>
                                </div>
                              </div>
                              
                              
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              {/* Footer Section - Always Visible */}
              <div className="flex-shrink-0">
                {/* Enhanced Action Footer */}
                {activeTab === 'received' && selectedRequest.status === 'pending' && (
                  <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-200">
                    <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl mx-auto">
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest._id, 'decline')}
                        disabled={updatingStatus === selectedRequest._id}
                      className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-2 border-red-200 text-red-700 bg-white hover:bg-red-50 hover:border-red-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md w-full"
                    >
                      {updatingStatus === selectedRequest._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-2 border-gray-400 border-t-transparent" />
                      ) : (
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                      )}
                      <span className="text-sm sm:text-base lg:text-lg">{updatingStatus === selectedRequest._id ? 'Processing...' : 'Decline Request'}</span>
                    </button>
                    <button
                      onClick={() => handleAcceptAction(selectedRequest)}
                      disabled={updatingStatus === selectedRequest._id}
                      className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl w-full"
                    >
                      {updatingStatus === selectedRequest._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                      )}
                      <span className="text-sm sm:text-base lg:text-lg">{updatingStatus === selectedRequest._id ? 'Processing...' : 'Accept Request'}</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action Footer for Interviewed Status */}
              {activeTab === 'received' && selectedRequest.status === 'interviewed' && (
                <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-200">
                  <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl mx-auto">
                    <button
                      onClick={async () => {
                        await handleStatusUpdate(selectedRequest._id, 'dismissed', 'Request dismissed');
                        setSelectedRequest(null);
                      }}
                      disabled={updatingStatus === selectedRequest._id}
                      className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    >
                      {updatingStatus === selectedRequest._id ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                      <span className="text-lg">{updatingStatus === selectedRequest._id ? 'Processing...' : 'Dismiss Request'}</span>
                    </button>
                    <button
                      onClick={async () => {
                        await handleStatusUpdate(selectedRequest._id, 'hired', 'Candidate has been hired');
                        await handlePointsReward(200, 'hired', selectedRequest._id);
                        setSelectedRequest(null);
                      }}
                      disabled={updatingStatus === selectedRequest._id}
                      className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-emerald-400 disabled:to-green-400 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    >
                      {updatingStatus === selectedRequest._id ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <CheckCircle className="h-6 w-6" />
                          <div className="text-left">
                            <div className="text-lg">Acknowledge Hire</div>
                            <div className="text-sm opacity-90">+200 pts to referrer</div>
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Info Footer for Final States */}
              {(selectedRequest.status === 'hired' || selectedRequest.status === 'dismissed' || selectedRequest.status === 'declined') && (
                <div className={`px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-200 ${
                  selectedRequest.status === 'hired' ? 'bg-gradient-to-r from-emerald-50 to-green-50' :
                  selectedRequest.status === 'dismissed' ? 'bg-gradient-to-r from-gray-50 to-slate-50' :
                  'bg-gradient-to-r from-red-50 to-rose-50'
                }`}>
                  <div className="text-center max-w-2xl mx-auto">
                    <p className={`text-base sm:text-lg font-semibold leading-tight ${
                      selectedRequest.status === 'hired' ? 'text-emerald-800' :
                      selectedRequest.status === 'dismissed' ? 'text-gray-700' :
                      'text-red-700'
                    }`}>
                      {selectedRequest.status === 'hired' && (
                        <span className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2">
                          <span className="text-xl xs:text-2xl">🎉</span>
                          <span className="break-words">Congratulations! This referral was successful.</span>
                        </span>
                      )}
                      {selectedRequest.status === 'dismissed' && (
                        <span className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2">
                          <span className="text-xl xs:text-2xl">ℹ️</span>
                          <span className="break-words">This request has been dismissed.</span>
                        </span>
                      )}
                      {selectedRequest.status === 'declined' && (
                        <span className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2">
                          <span className="text-xl xs:text-2xl">❌</span>
                          <span className="break-words">This request was declined.</span>
                        </span>
                      )}
                    </p>
                    {selectedRequest.status === 'hired' && (
                      <p className="text-xs sm:text-sm text-emerald-600 mt-1 sm:mt-2 leading-relaxed break-words">
                        Thank you for acknowledging this successful referral! The referrer has earned {(selectedRequest.pointsOffered || 0) + 250} total points.
                      </p>
                    )}
                  </div>
              </div>
                )}
            </div>
              </div>

            </div>
          </div>
        )}

        {/* Enhanced Status Selection Modal */}
        {showStatusModal && pendingAction && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
            <div className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in slide-in-from-bottom-4 duration-300">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">Next Step</h3>
                      <p className="text-white/80 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1 leading-tight break-words">What's the status after accepting this request?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setPendingAction(null);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm flex-shrink-0"
                  >
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-b from-white to-gray-50 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={async () => {
                      await handleStatusUpdate(pendingAction.request._id, 'interview', 'Candidate will be interviewed');
                      await handlePointsReward(50, 'interview', pendingAction.request._id);
                      setShowStatusModal(false);
                      setPendingAction(null);
                    }}
                    disabled={updatingStatus === pendingAction.request._id}
                    className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg sm:rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">Schedule Interview</h4>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1 leading-tight break-words">Acknowledge interview scheduled (rewards referrer)</p>
                    </div>
                    <div className="text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                      +50 pts to referrer
                    </div>
                  </button>

                  <button
                    onClick={async () => {
                      await handleStatusUpdate(pendingAction.request._id, 'hired', 'Candidate has been hired');
                      await handlePointsReward(200, 'hired', pendingAction.request._id);
                      setShowStatusModal(false);
                      setPendingAction(null);
                    }}
                    disabled={updatingStatus === pendingAction.request._id}
                    className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg sm:rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">Direct Hire</h4>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1 leading-tight break-words">Acknowledge hire (rewards referrer)</p>
                    </div>
                    <div className="text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                      +200 pts to referrer
                    </div>
                  </button>

                  <button
                    onClick={async () => {
                      await handleStatusUpdate(pendingAction.request._id, 'dismiss', 'Request dismissed');
                      // No points for dismissal, but keeping consistent flow
                      setShowStatusModal(false);
                      setPendingAction(null);
                    }}
                    disabled={updatingStatus === pendingAction.request._id}
                    className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg sm:rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">Dismiss</h4>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1 leading-tight break-words">Not proceeding with this candidate</p>
                    </div>
                    <div className="text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                      +0 pts
                    </div>
                  </button>
                </div>

                {updatingStatus === pendingAction.request._id && (
                  <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 bg-white/50 rounded-lg p-2 sm:p-3">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
