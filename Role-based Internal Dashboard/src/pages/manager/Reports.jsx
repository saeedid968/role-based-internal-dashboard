import React, { useState, useEffect, useRef } from 'react';
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';

// --- Pagination Component (As Requested) ---

const PaginationButton = ({ children, active, disabled, onClick }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font-medium transition-all 
        ${active
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'} 
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
};


const PerformanceReports = () => {
  // --- States ---
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const { showToast } = useUI();
  // --- Actions modal (3-dots) ---
  const [actionsTarget, setActionsTarget] = useState(null);
  const [actionsPos, setActionsPos] = useState({ top: 0, left: 0 });

  // --- Delete confirmation ---
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpenId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const close = () => setMenuOpenId(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  // --- Form State for CRUD ---
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    type: 'Quarterly'
  });

  // --- Mock Data Initialization (Dynamic Data Integration) ---
  useEffect(() => {
    const fetchReports = () => {
      try {
        const mockData = [
          { id: 1, name: "Q3_Performance_Summary.pdf", icon: "picture_as_pdf", iconColor: "text-red-500", date: "Oct 28, 2023", author: "Sarah Jenkins", authorImage: "https://i.pravatar.cc/150?u=sarah", type: "Quarterly", typeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { id: 2, name: "Team_Contributor_Growth.csv", icon: "description", iconColor: "text-blue-600", date: "Oct 25, 2023", author: "Michael Chen", authorImage: "https://i.pravatar.cc/150?u=michael", type: "Growth", typeColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
          { id: 3, name: "Project_Alpha_Report.pdf", icon: "picture_as_pdf", iconColor: "text-red-500", date: "Oct 20, 2023", author: "Alex Rivera", authorImage: "https://i.pravatar.cc/150?u=alex", type: "Milestone", typeColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
          { id: 4, name: "Monthly_KPI_Table_Oct.xlsx", icon: "table_chart", iconColor: "text-emerald-500", date: "Oct 15, 2023", author: "Emily Blunt", authorImage: "https://i.pravatar.cc/150?u=emily", type: "Metric", typeColor: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400" },
          { id: 5, name: "Annual_Budget_Review.pdf", icon: "picture_as_pdf", iconColor: "text-red-500", date: "Oct 12, 2023", author: "David Ross", authorImage: "https://i.pravatar.cc/150?u=david", type: "Quarterly", typeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
          { id: 6, name: "Product_Roadmap_V2.pdf", icon: "picture_as_pdf", iconColor: "text-red-500", date: "Oct 10, 2023", author: "Sarah Jenkins", authorImage: "https://i.pravatar.cc/150?u=sarah", type: "Milestone", typeColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
          { id: 7, name: "User_Feedback_Analysis.csv", icon: "description", iconColor: "text-blue-600", date: "Oct 05, 2023", author: "Michael Chen", authorImage: "https://i.pravatar.cc/150?u=michael", type: "Growth", typeColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" },
          { id: 8, name: "Server_Uptime_Stats.xlsx", icon: "table_chart", iconColor: "text-emerald-500", date: "Oct 01, 2023", author: "Alex Rivera", authorImage: "https://i.pravatar.cc/150?u=alex", type: "Metric", typeColor: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400" },
        ];
        setTimeout(() => {
          setReports(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // --- CRUD Logic ---
  const handleAddOrUpdateReport = (e) => {
    e.preventDefault();
    if (editingReport) {
      setReports(reports.map(r => r.id === editingReport.id ? { ...r, ...formData } : r));
    } else {
      const newReport = {
        id: Date.now(),
        ...formData,
        icon: "picture_as_pdf",
        iconColor: "text-red-500",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        authorImage: "https://i.pravatar.cc/150?u=new",
        typeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      };
      setReports([newReport, ...reports]);
    }
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({ name: '', author: '', type: 'Quarterly' });
  };

  const deleteReportDirect = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };


  const openEditModal = (report) => {
    setEditingReport(report);
    setFormData({ name: report.name, author: report.author, type: report.type });
    setIsModalOpen(true);
  };

  // --- Pagination Logic ---
  const PAGE_WINDOW = 3;
  const itemsPerPage = 5;

  // Pagination Calculations
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);

  const getVisiblePages = () => {
    if (totalPages <= PAGE_WINDOW) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - 1;
    let end = start + PAGE_WINDOW - 1;

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


  // --- Analytics Calculations ---
  const weeklyData = [
    { week: "W1", actual: 75, target: 60 },
    { week: "W2", actual: 90, target: 65 },
    { week: "W3", actual: 60, target: 70 },
    { week: "W4", actual: 85, target: 60 },
    { week: "W5", actual: 55, target: 50 }
  ];

  const projectData = [
    { name: "Project Alpha", percentage: 45, color: "bg-indigo-600" },
    { name: "Project Beta", percentage: 25, color: "bg-sky-400" },
    { name: "Internal Ops", percentage: 30, color: "bg-slate-400" }
  ];


  // --- Actions modal (3-dots) ---
  const openActions = (report, e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setActionsPos({
      top: rect.bottom + 8,
      left: rect.right - 176, // menu width
    });

    setActionsTarget(report);
  };

  const closeActions = () => setActionsTarget(null);

  const onActionsUpdate = () => {
    openEditModal(actionsTarget);
    closeActions();
  };

  const onActionsDelete = () => {
    setConfirmDeleteTarget(actionsTarget);
    closeActions();
  };

  // --- Delete confirmation ---
  const confirmDelete = () => {
    if (!confirmDeleteTarget) return;
    deleteReportDirect(confirmDeleteTarget.id);
    setConfirmDeleteTarget(null);
    showToast({
      message: "Report deleted",
      icon: "delete",
      type: "error",
      duration: 3000,
      action: {
        label: "Undo",
        disabled: true,
        tooltip: "Undo — coming soon",
      },
    });
  };


  const cancelDelete = () => setConfirmDeleteTarget(null);



  // --- Loading/Error Views (As Requested) ---
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
    <div className="min-h-screen text-slate-900 mt-5 dark:text-slate-100 antialiased selection:bg-indigo-100">
      <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6">

        {/* Main Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Performance Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Found {reports.length} total reports for the current period.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setEditingReport(null); setIsModalOpen(true); }}
              className="flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-primary/20 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">add_chart</span>
              <span>New Report</span>
            </button>
          </div>
        </header>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Output Chart */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group/chart">
            {/* Header with Trend Indicator */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs tracking-wider">Monthly Output</h3>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    +12.4%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Efficiency tracking vs. projected milestones</p>
              </div>

              {/* Custom Legend */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-sm bg-gradient-to-t from-indigo-700 to-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Target</span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64 w-full">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((level) => (
                  <div key={level} className="w-full flex items-center gap-4">
                    <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 w-4">{level}%</span>
                    <div className="flex-1 border-t border-slate-100 dark:border-slate-800/50"></div>
                  </div>
                ))}
              </div>

              {/* Bars Container */}
              <div className="absolute inset-0 left-8 flex items-end justify-between gap-2 md:gap-4 px-2">
                {weeklyData.map((week, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end relative">

                    {/* Tooltip - appears on hover */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                      <div className="bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap mb-1 flex items-center gap-2 border border-slate-700">
                        <span className="text-indigo-400">{week.actual}%</span>
                        <span className="text-slate-500">/</span>
                        <span>{week.target}%</span>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700"></div>
                    </div>

                    {/* Bar Logic */}
                    <div className="w-full max-w-[32px] flex items-end justify-center h-full relative">
                      {/* Target Bar (Background) */}
                      <div
                        className="absolute w-full bg-slate-100 dark:bg-slate-800/50 rounded-t-sm transition-all duration-500 group-hover/bar:bg-slate-200 dark:group-hover/bar:bg-slate-700"
                        style={{ height: `${week.target}%` }}
                      ></div>

                      {/* Actual Bar (Foreground) */}
                      <div
                        className="relative w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all duration-700 delay-100 shadow-[0_0_15px_rgba(79,70,229,0.2)] group-hover/bar:shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover/bar:scale-x-105 origin-bottom"
                        style={{ height: `${week.actual}%` }}
                      >
                        {/* Animated Shine Effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-t-sm opacity-20">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover/bar:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] font-bold text-slate-400 group-hover/bar:text-indigo-500 transition-colors uppercase tracking-widest">
                      {week.week}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Project Distribution Chart */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Resource Allocation</h3>
                <p className="text-xs text-slate-500">Breakdown by project focus</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 py-4">
              <div className="relative size-44">
                <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3.5"></circle>
                  <circle className="stroke-indigo-600" cx="18" cy="18" fill="none" r="16" strokeDasharray="45, 100" strokeWidth="3.5" strokeLinecap="round"></circle>
                  <circle className="stroke-sky-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="25, 100" strokeDashoffset="-45" strokeWidth="3.5" strokeLinecap="round"></circle>
                  <circle className="stroke-slate-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="30, 100" strokeDashoffset="-70" strokeWidth="3.5" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{reports.length}</span>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Total</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full sm:w-auto">
                {projectData.map((project, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className={`size-2.5 rounded-full ${project.color}`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{project.name}</span>
                      <span className="text-xs text-slate-500">{project.percentage}% load</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Recently Generated Reports Table */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Recent Reports</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Report Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Author</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentReports.map((report) => (
                  <tr key={report.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                          <span className={`material-symbols-outlined ${report.iconColor} text-xl`}>{report.icon}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img src={report.authorImage} alt={report.author} className="size-7 rounded-full object-cover" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{report.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${report.typeColor}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => openActions(report, e)}
                        className="w-8 h-8 cursor-pointer grid place-items-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Actions Modal (3-dots): Update / Delete choices --- */}
          {actionsTarget && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={closeActions}
              />

              <div
                style={{
                  top: actionsPos.top,
                  left: actionsPos.left,
                }}
                className="absolute z-50 w-44 bg-white dark:bg-[#0b1220]
                 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionsUpdate();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">edit</span> Edit User
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionsDelete();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">delete</span> Delete
                </button>

              </div>
            </>
          )}


          {/* --- Delete Confirmation Modal --- */}
          {confirmDeleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/40"
                onClick={cancelDelete}
              />

              <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-md w-full p-6 relative z-10">
                <h3 className="text-xl font-bold text-[#111318] dark:text-white">
                  Confirm Delete
                </h3>

                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {confirmDeleteTarget.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          )}


          {/* Bottom Pagination (As Requested) */}
          <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-medium text-slate-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, reports.length)} of {reports.length}
            </span>
            <div className="flex gap-2">
              <PaginationButton onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
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


              <PaginationButton onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </PaginationButton>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4">{editingReport ? 'Edit Report' : 'Create New Report'}</h2>
            <form onSubmit={handleAddOrUpdateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">File Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="report_name.pdf" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Author Name</label>
                <input required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Sarah Jenkins" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cursor-pointer px-4 py-2 text-sm font-semibold text-slate-500">Cancel</button>
                <button type="submit" className="cursor-pointer bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
                  {editingReport ? 'Update Report' : 'Generate Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReports;