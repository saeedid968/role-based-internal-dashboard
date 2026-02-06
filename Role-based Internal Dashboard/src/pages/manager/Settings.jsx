import React, { useState, useEffect } from 'react';
import Footer from '../../components/common/footer';

// --- Pagination Component (As Requested) ---
const PaginationButton = ({ children, active, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font-medium transition-all ${active
      ? 'bg-blue-600 border-blue-600 text-white'
      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const DepartmentSettings = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [settings, setSettings] = useState({
    deptName: 'Product Engineering',
    budgetLimit: '5000',
    defaultUrgency: 'Medium (Recommended)',
    automatedEscalation: true,
    dailySummaryReports: false,
    managerOverrideNotifications: true,
    reviewCycle: 'Quarterly',
    visibility: 'Internal Only'
  });

  const [workflows, setWorkflows] = useState([
    { id: 1, title: 'Time-Off Requests', description: '2-Step Approval: Manager > HR Business Partner', icon: 'calendar_today' },
    { id: 2, title: 'Expense Reimbursements', description: 'Direct Approval: Manager only (Up to $500)', icon: 'payments' }
  ]);

  const [teamMembers, setTeamMembers] = useState([]);

  // --- Mock Data Fetching ---
  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          const mockUsers = Array.from({ length: 26 }).map((_, i) => ({
            id: i + 1,
            name: `Employee ${i + 1}`,
            role: i % 2 === 0 ? 'Developer' : 'Designer',
            access: 'Standard',
            email: `user${i + 1}@company.com`
          }));
          setTeamMembers(mockUsers);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // --- Handlers ---
  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const addWorkflow = () => {
    const newWf = {
      id: Date.now(),
      title: 'New Workflow',
      description: 'Pending configuration...',
      icon: 'settings_suggest'
    };
    setWorkflows([...workflows, newWf]);
  };

  // --- Pagination Logic ---
  const usersPerPage = 5;
  const PAGE_WINDOW = 3;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = teamMembers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(teamMembers.length / usersPerPage);

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



  // --- Loading & Error UI (As Requested) ---
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

  const tabs = [
    { id: 'general', label: 'General', icon: 'tune' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'workflow', label: 'Workflow', icon: 'account_tree' },
    { id: 'team', label: 'Team Access', icon: 'badge' }
  ];


  const handleSubmit = () => {
    if (isSaving) return;

    setIsSaving(true);
    setIsSaved(false);

    // fake save
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      // reset back to normal button
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 2000);
  };




  return (
    <div className="min-h-screen mt-5 font-display dark:bg-slate-950">
      <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6">

        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {settings.deptName} Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Department Management & Governance Control
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="cursor-pointer 
    px-4 py-2 h-10 min-w-[110px]
    text-sm font-medium text-gray-700 dark:text-gray-300
    bg-gray-100 dark:bg-gray-800
    rounded-lg
    transition-all duration-150
    hover:bg-gray-200 dark:hover:bg-gray-700
    active:bg-gray-300 dark:active:bg-gray-600
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
    shadow-sm active:shadow-inner
    whitespace-nowrap
  "
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className={`cursor-pointer 
    px-4 py-2 min-w-[150px] h-10
    bg-blue-600 text-white text-sm font-bold rounded-lg
    flex items-center justify-center gap-2
    transition-all duration-200
    active:scale-95
    ${isSaving ? 'opacity-80 cursor-not-allowed' : 'hover:bg-blue-700'}
  `}
            >
              {/* Spinner */}
              {isSaving && (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="leading-none">Saving...</span>
                </>
              )}

              {/* Success */}
              {isSaved && !isSaving && (
                <>
                  <span className="material-symbols-outlined text-white text-base">
                    check_circle
                  </span>
                  <span className="leading-none">Saved</span>
                </>
              )}

              {/* Default */}
              {!isSaving && !isSaved && (
                <span className="leading-none">Save Changes</span>
              )}
            </button>



          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 md:mb-8 overflow-x-auto">
          <div className="flex gap-4 md:gap-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`pb-4 cursor-pointer text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">

          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Department Identity</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                    <input name="deptName" value={settings.deptName} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Approval Threshold ($)</label>
                    <input name="budgetLimit" type="number" value={settings.budgetLimit} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm p-3 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Review Governance</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance Review Cycle</label>
                    <select name="reviewCycle" value={settings.reviewCycle} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all rounded-lg text-sm p-3 dark:text-white">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Bi-Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Automated Escalation</label>
                    <div className="flex items-center gap-3 h-10">
                      <button onClick={() => handleToggle('automatedEscalation')} className={`relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.automatedEscalation ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.automatedEscalation ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Escalate overdue reviews after 7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alert Configurations</h3>
              </div>
              <div className="p-4 md:p-6 space-y-6">
                {[
                  { key: 'dailySummaryReports', label: 'Daily Summary Reports', desc: 'Send automated email to team at 9:00 AM' },
                  { key: 'managerOverrideNotifications', label: 'Override Alerts', desc: 'Notify users if their priority is manually changed' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button onClick={() => handleToggle(item.key)} className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Pipelines</h3>
                <button onClick={addWorkflow} className="text-blue-600 text-sm font-bold flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined">add_circle</span> Add Pipeline
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                {workflows.map((wf) => (
                  <div key={wf.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between border border-gray-100 dark:border-gray-700 transition-all hover:border-blue-300 dark:hover:border-blue-900">
                    <div className="flex items-center gap-4">
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-blue-600">{wf.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{wf.title}</p>
                        <p className="text-xs text-gray-500">{wf.description}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><span className="material-symbols-outlined">edit</span></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Managed Staff Access</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800/50">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Member</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm dark:text-gray-400">{user.role}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-md">
                            {user.access}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer (As Requested) */}
              <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-500">
                  Showing {teamMembers.length === 0 ? 0 : indexOfFirstUser + 1} to{" "}
                  {Math.min(indexOfLastUser, teamMembers.length)} of{" "}
                  {teamMembers.length} users
                </p>

                <div className="flex gap-2">
                  {/* Prev */}
                  <PaginationButton
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </PaginationButton>

                  {/* Sliding page numbers (ONLY 3) */}
                  {visiblePages.map((page) => (
                    <PaginationButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationButton>
                  ))}

                  {/* Next */}
                  <PaginationButton
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </PaginationButton>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Info Badge */}
        <div className="mt-4 p-4 md:p-6 bg-blue-600/5 dark:bg-blue-400/5 rounded-xl border border-blue-600/10 dark:border-blue-400/10 flex items-start gap-4">
          <span className="material-symbols-outlined text-blue-600">verified_user</span>
          <div>
            <h4 className="text-sm font-bold text-blue-600">Manager Security Protocol</h4>
            <p className="text-xs text-blue-600/80 leading-relaxed mt-1">
              Changes to budget thresholds or performance review cycles will trigger a notification to the HR Business Partner.
              The current department head ({settings.deptName}) is responsible for maintaining the accuracy of the team access list above.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentSettings;