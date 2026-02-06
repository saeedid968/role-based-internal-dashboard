import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/Auth_Context";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from '../../components/common/footer';
import { users, notifications, schedule, departmentStats } from '../../services/MockData';

const EmployeeDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    teamMembers: [],
    activeUsers: [],
    upcomingBirthdays: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Calculate stats from user data
        const totalTasks = users.reduce((sum, user) => sum + user.tasksDueToday, 0);
        const totalProjects = users.reduce((sum, user) => sum + user.activeProjects, 0);
        const avgHours = Math.round(users.reduce((sum, user) => sum + user.hoursLogged, 0) / users.length);
        const activeUsersCount = users.filter(user => user.status === 'active').length;

        // Get active users (last 24 hours simulation)
        const activeUsers = users
          .filter(user => user.status === 'active' || user.status === 'in_meeting')
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        // Simulate upcoming birthdays
        const upcomingBirthdays = users
          .slice(0, 3)
          .map(user => ({
            ...user,
            birthday: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));

        setDashboardData({
          stats: {
            tasksDueToday: totalTasks,
            activeProjects: totalProjects,
            hoursLogged: avgHours,
            activeUsers: activeUsersCount,
            totalEmployees: users.length,
            completionRate: 87
          },
          teamMembers: users,
          activeUsers,
          upcomingBirthdays
        });

        // Calculate unread notifications
        const unreadCount = notifications.filter(n => !n.read).length;
        setUnreadNotifications(unreadCount);

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const handleMarkAllAsRead = () => {
    setUnreadNotifications(0);
    // In real app, update notifications in backend
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const usersPerPage = 5;
  const PAGE_WINDOW = 3;

  const PaginationButton = ({ children, active, disabled, onClick }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font-medium transition-all ${active
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        }`}
    >
      {children}
    </button>
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = dashboardData.teamMembers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(
    dashboardData.teamMembers.length / usersPerPage
  );

  const getVisiblePages = () => {
    if (totalPages <= PAGE_WINDOW) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - Math.floor(PAGE_WINDOW / 2);
    let end = currentPage + Math.floor(PAGE_WINDOW / 2);

    if (start < 1) {
      start = 1;
      end = PAGE_WINDOW;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - PAGE_WINDOW + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();


  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30';
      case 'in_meeting': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30';
      case 'busy': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30';
      case 'offline': return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'in_meeting': return 'In Meeting';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'internal': return 'bg-primary/10 text-primary';
      case 'meeting': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600';
      case 'focus': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      case 'one-on-one': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600';
      case 'team': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  // Get notification icon color
  const getNotificationColor = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary';
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'amber': return 'bg-amber-100 text-amber-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      default: return 'bg-primary/10 text-primary';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          {/* Spinning Progress */}
          <div className="absolute h-20 w-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          {/* Center Icon */}
          <span className="material-symbols-outlined absolute text-blue-600 animate-pulse">monitoring</span>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Initializing Systems</h2>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-medium">Fetching Secure Data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }


  const renderAvatar = (user, size = 'md') => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };

    if (user.profilePicture) {
      return (
        <img
          src={user.profilePicture}
          alt={user.name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {user.avatar}
      </div>
    );
  };
  return (
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Alex!</h2>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} • You have <span className='font-semibold text-rose-500'>{dashboardData.stats.tasksDueToday}</span> tasks due today
        </p>
      </div>

      {/* Stats Summary Row - Updated with dynamic data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-default">
        {/* Card 1: Tasks (Orange) */}
        <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasks Due Today</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white tracking-tight">
                {dashboardData.stats.tasksDueToday}
              </h3>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="material-symbols-outlined !text-2xl">event_upcoming</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined !text-sm">trending_down</span>
              <span>20%</span>
            </div>
            <span className="text-xs font-medium text-slate-400">{dashboardData.stats.completionRate}% completion</span>
          </div>
        </div>

        {/* Card 2: Active Projects (Blue) */}
        <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Projects</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white tracking-tight">
                {dashboardData.stats.activeProjects}
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="material-symbols-outlined !text-2xl">folder_open</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined !text-sm">trending_up</span>
              <span>+2 new</span>
            </div>
            <span className="text-xs font-medium text-slate-400">{users.length} members</span>
          </div>
        </div>

        {/* Card 3: Avg Hours (Emerald) */}
        <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Hours Logged</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white tracking-tight">
                {dashboardData.stats.hoursLogged}h
              </h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="material-symbols-outlined !text-2xl">schedule</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined !text-sm">bolt</span>
              <span>80% target</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Team avg</span>
          </div>
        </div>

        {/* Card 4: Active Now (Purple) */}
        <div className="group relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Now</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white tracking-tight">
                {dashboardData.stats.activeUsers}<span className="text-slate-400 font-normal text-xl">/{dashboardData.stats.totalEmployees}</span>
              </h3>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="material-symbols-outlined !text-2xl">groups</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-500 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined !text-sm">sensors</span>
              <span>85% online</span>
            </div>
            <span className="text-xs font-medium text-slate-400">6 Depts</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upcoming Schedule & Team Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <div className="bg-white cursor-default dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 dark:text-white">My Upcoming Schedule</h4>
              <button className="text-xs cursor-pointer font-semibold text-primary hover:underline">View Calendar</button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedule.map((item) => (
                <div key={item.id} className="p-5 flex gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[50px]">
                    <span className="text-xs font-bold text-slate-400 uppercase">{item.time}</span>
                    <span className="text-xs text-slate-400">{item.period}</span>
                  </div>
                  <div className={`flex-1 ${item.borderColor ? 'border-l-4 pl-4' : ''} ${item.borderColor || ''}`}>
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h5>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
              <button className="text-sm font-medium cursor-pointer text-slate-600 dark:text-slate-400 hover:text-primary flex items-center justify-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-sm">expand_more</span>
                Load more events
              </button>
            </div>
          </div>

          {/* Team Overview Section */}
          <div className="bg-white cursor-default dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[24rem]">

            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white">Team Overview</h4>
              <p className="text-sm text-slate-500 mt-1">Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, dashboardData.teamMembers.length)} of {dashboardData.teamMembers.length} employees</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Department</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Tasks Due</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {user.avatar}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{user.role}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {user.department}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{user.tasksDueToday}</span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(user.tasksDueToday * 10, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <PaginationButton
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </PaginationButton>

                {/* Sliding page numbers */}
                {visiblePages.map((page) => (
                  <PaginationButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationButton>
                ))}

                {/* Next */}
                <PaginationButton
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </PaginationButton>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Notifications & Quick Contacts */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white cursor-default dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-fit">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 dark:text-white">Recent Notifications</h4>
              {unreadNotifications > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2.5 py-1 rounded-full">
                  {unreadNotifications} New
                </span>
              )}
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex gap-3 items-start transition-colors">
                  <div className={`mt-1 size-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.color)}`}>
                    <span className="material-symbols-outlined text-lg">{notification.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold leading-tight text-slate-900 dark:text-white">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                className="w-full cursor-pointer py-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          </div>
          {/* Active Now Widget */}
          <div className="bg-white cursor-default dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Active Now</h4>
            <div className="space-y-3">
              {dashboardData.activeUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.avatar}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{user.lastActive}</span>
                </div>
              ))}
            </div>
            <button className="w-full cursor-pointer mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
              View All Active Members
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Events & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Birthdays */}
        <div className="bg-white cursor-default dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Upcoming Birthdays</h4>
          <div className="space-y-3">
            {dashboardData.upcomingBirthdays.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 font-semibold">
                      {user.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.department}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-rose-600">{user.birthday}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary p-6 rounded-xl shadow-sm text-white overflow-hidden relative lg:col-span-2">
          <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
            <span className="material-symbols-outlined text-8xl">forum</span>
          </div>
          <div className="relative z-10">
            <h4 className="font-bold mb-2">Quick Support & Actions</h4>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Need immediate assistance or want to perform quick actions?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white text-primary font-semibold text-sm py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-base">chat</span>
                Start Chat
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm py-3 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-base">add</span>
                New Task
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm py-3 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-base">download</span>
                Export Report
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm py-3 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-base">help</span>
                Get Help
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployeeDashboard;