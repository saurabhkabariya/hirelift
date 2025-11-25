'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PointsProvider, usePoints } from '@/contexts/PointsContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { Users, Search, FileText, Gift, Trophy, Bell, Plus, ChevronDown, UserPlus, Upload, BarChart3, Settings, MessageSquare, Home, Briefcase, Menu, X, ExternalLink } from 'lucide-react';
// Tab Components
import BrowseCandidates from '@/components/referrals/BrowseCandidates';
import MyProfile from '@/components/referrals/MyProfile';
import MyRequests from '@/components/referrals/MyRequests';
import PointsRewards from '@/components/referrals/PointsRewards';
import Leaderboard from '@/components/referrals/Leaderboard';

// Loading fallback component for Suspense
const ReferralsPageLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading referrals...</p>
      </div>
    </div>
  );
};

const ReferralsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { pointsData, loading: pointsLoading, refreshPoints } = usePoints();
  const { notifications, markAsViewed, hasNewRequests, hasDashboardNotifications } = useNotifications();
  
  // Get initial tab from URL parameter or default to 'browse'
  const initialTab = searchParams.get('tab') || 'browse';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Update tab when URL parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['browse', 'profile', 'requests', 'rewards', 'leaderboard'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  // Tab configuration
  const tabs = [
    {
      id: 'browse',
      label: 'Browse Candidates',
      icon: Search,
      description: 'Find skilled candidates for referrals'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: Users,
      description: 'Manage your candidate profile'
    },
    {
      id: 'requests',
      label: 'My Requests',
      icon: FileText,
      description: 'Track sent and received requests'
    },
    {
      id: 'rewards',
      label: 'Points & Rewards',
      icon: Gift,
      description: 'Earn and spend referral points'
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'Top referral performers'
    }
  ];
  // Quick Actions configuration
  const quickActions = [
    {
      id: 'create-request',
      label: 'Create Referral Request',
      description: 'Request a referral from network',
      icon: UserPlus,
      action: () => {
        setActiveTab('requests');
        setShowQuickActions(false);
        // Additional logic for creating request modal can be added
      }
    },
    {
      id: 'upload-resume',
      label: 'Add/Edit Profile',
      description: 'Update your profile information',
      icon: Upload,
      action: () => {
        setActiveTab('profile');
        setShowQuickActions(false);
        // Additional logic for file upload can be added
      }
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      description: 'Check your referral performance',
      icon: BarChart3,
      action: () => {
        setActiveTab('leaderboard');
        setShowQuickActions(false);
      }
    },
    {
      id: 'browse-candidates',
      label: 'Find Candidates',
      description: 'Browse available candidates',
      icon: Search,
      action: () => {
        setActiveTab('browse');
        setShowQuickActions(false);
      }
    },
    {
      id: 'check-rewards',
      label: 'Check Rewards',
      description: 'View points and rewards',
      icon: Gift,
      action: () => {
        setActiveTab('rewards');
        setShowQuickActions(false);
      }
    }
  ];
  // Navigation functions
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard', description: 'Main dashboard overview' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs', description: 'Browse job opportunities' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Update loading state when points data is available
  useEffect(() => {
    if (pointsData) {
      setLoading(false);
    }
  }, [pointsData]);
  
  // Handle tab change and mark notifications as viewed if needed
  const handleTabChange = (tabId) => {
    if (tabId === 'requests' && hasNewRequests) {
      markAsViewed('requests');
    }
    setActiveTab(tabId);
    
    // Update URL to reflect the current tab
    const newUrl = `/referrals?tab=${tabId}`;
    router.replace(newUrl);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the referrals hub.</p>
          <a 
            href="/auth" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  if (loading || pointsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-14">
              {/* Left - Brand & Breadcrumb */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <button 
                    onClick={() => navigateTo('/dashboard')}
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">Referrals</span>
                </div>
              </div>

              {/* Right - Navigation & User Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.path)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                        title={item.description}
                      >
                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Notifications Bell */}
                {hasDashboardNotifications && (
                  <button
                    onClick={() => navigateTo('/dashboard')}
                    className="relative p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="You have new notifications on dashboard"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full">
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping"></span>
                    </span>
                  </button>
                )}

                {/* Mobile Menu Button */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>

                  {/* Mobile Navigation Menu */}
                  {showMobileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
                        </div>
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigateTo(item.path);
                                setShowMobileMenu(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <Icon className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                              <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 sm:py-4 lg:py-6 gap-4 lg:gap-0">
            {/* Left Section - Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Users className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                    Referrals Hub
                  </h1>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
                    Connect, refer, and earn rewards through your professional network
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Stats (Large Desktop Only) */}
            <div className="hidden xl:flex items-center justify-center px-6 2xl:px-8">
              <div className="grid grid-cols-3 gap-3 2xl:gap-4">
                {pointsData && (
                  <>
                    <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2.5 2xl:px-4 2xl:py-3 rounded-xl shadow-sm">
                      <Gift className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2 2xl:mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs 2xl:text-xs font-medium opacity-90 truncate">Available</p>
                        <p className="text-sm 2xl:text-lg font-bold">{pointsData.current}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2.5 2xl:px-4 2xl:py-3 rounded-xl shadow-sm">
                      <Trophy className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2 2xl:mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs 2xl:text-xs font-medium opacity-90 truncate">Total</p>
                        <p className="text-sm 2xl:text-lg font-bold">{pointsData.totalEarned}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2.5 2xl:px-4 2xl:py-3 rounded-xl shadow-sm">
                      <Users className="h-4 w-4 2xl:h-5 2xl:w-5 mr-2 2xl:mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs 2xl:text-xs font-medium opacity-90 truncate">Success</p>
                        <p className="text-sm 2xl:text-lg font-bold">{pointsData.stats?.successfulReferrals || 0}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center justify-between lg:justify-end space-x-2 xs:space-x-3">
              {/* Mobile/Tablet Stats - Compact Version */}
              <div className="xl:hidden flex items-center">
                {pointsData && (
                  <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 xs:px-3 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm">
                    <Gift className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
                    <span className="font-semibold">{pointsData.current}</span>
                    <span className="hidden xs:inline ml-1 text-xs opacity-90">pts</span>
                  </div>
                )}
              </div>

              {/* Quick Actions Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center text-xs xs:text-sm font-medium group"
                >
                  <Plus className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="hidden xs:inline sm:hidden lg:inline">Quick Actions</span>
                  <span className="xs:hidden sm:inline lg:hidden">Actions</span>
                  <ChevronDown className={`h-3 w-3 xs:h-4 xs:w-4 ml-1 xs:ml-2 transition-transform duration-200 ${showQuickActions ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Dropdown Menu */}
                {showQuickActions && (
                  <div className="absolute right-0 mt-2 xs:mt-3 w-64 xs:w-72 bg-white rounded-lg xs:rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 xs:px-4 py-2 xs:py-3 border-b border-gray-100">
                      <h3 className="text-xs xs:text-sm font-semibold text-gray-900">Quick Actions</h3>
                      <p className="text-xs text-gray-600 mt-0.5 xs:mt-1 hidden xs:block">Streamline your referral workflow</p>
                    </div>
                    <div className="py-1 xs:py-2 max-h-64 xs:max-h-80 overflow-y-auto">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={action.action}
                            className="w-full px-3 xs:px-4 py-2 xs:py-3 text-left hover:bg-gray-50 flex items-center transition-all duration-200 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-md xs:rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Icon className="h-3 w-3 xs:h-4 xs:w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-2 xs:ml-3 flex-1 min-w-0">
                              <p className="text-xs xs:text-sm font-medium text-gray-900 group-hover:text-blue-900 truncate">{action.label}</p>
                              <p className="text-xs text-gray-500 group-hover:text-blue-700 line-clamp-1 xs:line-clamp-none">{action.description}</p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-3 xs:px-4 py-2 xs:py-3 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">
                        Need help? <button className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex -mb-px space-x-6 lg:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const showBadge = tab.id === 'requests' && notifications.requests.total > 0;
              const notificationCount = tab.id === 'requests' ? notifications.requests.total : 0;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm lg:text-base relative
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`
                    -ml-0.5 mr-2 h-4 w-4 lg:h-5 lg:w-5
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  <span className="truncate">{tab.label}</span>
                  
                  {/* Enhanced Notification badge */}
                  {showBadge && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                  
                  {/* Pulsing dot indicator */}
                  {showBadge && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full">
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          {/* Mobile Navigation - Horizontal Scroll */}
          <nav className="md:hidden -mb-px flex overflow-x-auto scrollbar-hide py-2" aria-label="Mobile Tabs">
            <div className="flex space-x-1 min-w-max px-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const showBadge = tab.id === 'requests' && notifications.requests.total > 0;
                const notificationCount = tab.id === 'requests' ? notifications.requests.total : 0;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      group inline-flex items-center px-3 py-2 rounded-lg font-medium text-xs xs:text-sm relative flex-shrink-0
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
                      {tab.id === 'browse' ? 'Browse' :
                       tab.id === 'profile' ? 'Profile' :
                       tab.id === 'requests' ? 'Requests' :
                       tab.id === 'rewards' ? 'Rewards' :
                       tab.id === 'leaderboard' ? 'Leaderboard' : tab.label}
                    </span>
                    
                    {/* Enhanced Notification badge for mobile */}
                    {showBadge && (
                      <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                    
                    {/* Pulsing dot indicator for mobile */}
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full">
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
      {/* Stats Overview */}
      {pointsData && (
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6 mb-6 xs:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 xs:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Gift className="h-6 w-6 xs:h-8 xs:w-8 text-blue-600" />
                </div>
                <div className="ml-3 xs:ml-4 lg:ml-5 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 truncate">Available Points</p>
                  <p className="text-lg xs:text-2xl lg:text-3xl font-bold text-gray-900">{pointsData.current}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 xs:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 xs:h-8 xs:w-8 text-green-600" />
                </div>
                <div className="ml-3 xs:ml-4 lg:ml-5 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 truncate">Total Earned</p>
                  <p className="text-lg xs:text-2xl lg:text-3xl font-bold text-gray-900">{pointsData.totalEarned}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 xs:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 xs:h-8 xs:w-8 text-purple-600" />
                </div>
                <div className="ml-3 xs:ml-4 lg:ml-5 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 truncate">Successful Referrals</p>
                  <p className="text-lg xs:text-2xl lg:text-3xl font-bold text-gray-900">
                    {pointsData.stats?.successfulReferrals || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 xs:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 xs:h-8 xs:w-8 text-orange-600" />
                </div>
                <div className="ml-3 xs:ml-4 lg:ml-5 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 truncate">Average Rating</p>
                  <p className="text-lg xs:text-2xl lg:text-3xl font-bold text-gray-900">
                    {pointsData.stats?.averageRating?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pb-8 xs:pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'browse' && <BrowseCandidates />}
          {activeTab === 'profile' && <MyProfile />}
          {activeTab === 'requests' && <MyRequests initialSubTab={searchParams.get('subtab')} />}
          {activeTab === 'rewards' && <PointsRewards />}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </div>
      </div>
    </div>
  );
};
const ReferralsPage = () => {
  return (
    <PointsProvider>
      <NotificationProvider>
        <Suspense fallback={<ReferralsPageLoading />}>
          <ReferralsPageContent />
        </Suspense>
      </NotificationProvider>
    </PointsProvider>
  );
};
export default ReferralsPage;
