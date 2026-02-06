import React, { useEffect, useState, useMemo } from 'react';
import { USERS_DATA } from '../../services/MockData'
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useUI();



  // --- CRUD STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null = Add Mode, Object = Edit Mode
  const [activeMenuId, setActiveMenuId] = useState(null); // ID of the row with open menu

  const ITEMS_PER_PAGE = 5;

  // Simulate Fetching Mock Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating network delay
        setTimeout(() => {
          setUsers(USERS_DATA);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CRUD HANDLERS ---

  // 1. Add / Update User
  const handleSaveUser = (userData) => {
    if (currentUser) {
      // Edit Mode: Update existing user
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...userData } : u));
    } else {
      // Add Mode: Create new user with fake ID and default data
      const newUser = {
        id: Date.now(), // Fake ID
        lastLogin: 'Just now',
        img: '', // Default placeholder
        ...userData
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  // 2. Delete User
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
      setActiveMenuId(null); // Close menu
      showToast({
        message: "User deleted",
        icon: "delete",
        type: "error",
        duration: 3000,
        action: {
          label: "Undo",
          disabled: true,
          tooltip: "Undo — coming soon",
        },
      });
    }
  };

  // 3. Open Modal
  const openAddModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // Optimized Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm);

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Pagination Logic
  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Real Data Calculation for Stats Cards
  const stats = useMemo(() => ({
    total: users.length,
    activeAdmins: users.filter(u => u.role === 'Admin' && u.status === 'Active').length,
    totalManagers: users.filter(u => u.role === 'Manager').length,
    pendingApprovals: users.filter(u => u.status === 'Inactive').length // logic tweak for demo
  }), [users]);

  const getVisiblePages = () => {
    const MAX_VISIBLE_PAGES = 3;
    let start = Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), 1);
    let end = start + MAX_VISIBLE_PAGES - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - MAX_VISIBLE_PAGES + 1, 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 animate-pulse">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Failed to load user data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mt-8 mx-auto max-w-7xl px-4 flex flex-col gap-6 relative" onClick={() => setActiveMenuId(null)}>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage system users, assign roles, and monitor account status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined mr-2 text-lg">download</span>
            Export
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openAddModal(); }}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
            <span className="material-symbols-outlined mr-2 text-lg">add</span>
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 cursor-default">
        <StatsCard
          title="Total Users"
          value={stats.total}
          trend="+5.2%"
          color="blue"
          icon="group"
        />
        <StatsCard
          title="Active Admins"
          value={stats.activeAdmins}
          trend="0%"
          color="purple"
          icon="admin_panel_settings"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          trend="+12.5%"
          color="amber"
          icon="hourglass_top"
        />
        <StatsCard
          title="Total Managers"
          value={stats.totalManagers}
          trend="+1.2%"
          color="green"
          icon="supervisor_account"
        />
      </div>



      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Search by name, email, or role..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <FilterSelect
              value={roleFilter}
              onChange={(v) => {
                setTimeout(() => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }, 0);
              }}
              options={['All', 'Admin', 'Manager', 'Employee']}
            />

            <FilterSelect
              value={statusFilter}
              onChange={(v) => {
                setTimeout(() => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }, 0);
              }}

              options={['All', 'Active', 'Inactive']}
              labelPrefix="Status: "
            />

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full cursor-default divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserAvatar name={user.name} img={user.img} />
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.lastLogin}</td>

                  {/* ACTIONS COLUMN WITH DROPDOWN */}
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === user.id ? null : user.id);
                      }}
                      className="text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === user.id && (
                      <div className="absolute right-8 top-12 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                          className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">edit</span> Edit User
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">delete</span> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-medium">{totalResults === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalResults)}</span> of <span className="font-medium">{totalResults}</span> results
            </p>
          </div>

          <nav className="flex items-center gap-1">
            <PaginationButton disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </PaginationButton>

            {getVisiblePages().map(page => (
              <PaginationButton
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationButton>
            ))}

            <PaginationButton disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </PaginationButton>
          </nav>
        </div>
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={currentUser}
        />
      )}
      <Footer />
    </div>
  );
};

/* --- Sub-Components --- */

// NEW: Modal Component for Add/Edit
const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer">
              {user ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, trend, color, icon }) => {
  const colorMap = {
    blue: {
      border: "hover:border-blue-500/50",
      shadow: "hover:shadow-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      pill: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
    purple: {
      border: "hover:border-purple-500/50",
      shadow: "hover:shadow-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      pill: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    },
    amber: {
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    green: {
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`
        group relative bg-white dark:bg-slate-900 p-5 rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm flex flex-col justify-between
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${style.shadow} ${style.border}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon */}
        <div
          className={`
            p-2 rounded-lg transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
            ${style.bg} ${style.text}
          `}
        >
          <span className="material-symbols-outlined !text-2xl">
            {icon}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${style.pill}`}
        >
          {trend}
        </span>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
          Updated now
        </p>
      </div>
    </div>
  );
};



const UserAvatar = ({ name, img }) => (
  img ? (
    <img className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={img} alt={name} />
  ) : (
    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
  )
);

const RoleBadge = ({ role }) => {
  const styles = role === 'Admin'
    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles}`}>{role}</span>;
};

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-600' : 'bg-slate-400'}`}></span>
      {status}
    </span>
  );
};

const FilterSelect = ({ value, onChange, options, labelPrefix = "" }) => (
  <div className="relative w-full sm:w-40">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
    >
      {options.map(opt => <option key={opt} value={opt}>{labelPrefix}{opt}</option>)}
    </select>
    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-lg">expand_more</span>
  </div>
);

const PaginationButton = ({ children, active, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font-medium transition-all
      ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

export default UserManagement;