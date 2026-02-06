import React, { useState, useEffect } from 'react';
import { MockEmployees } from '../../services/MockData'
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';


// --- 1. COMPONENT: Pagination Button (Your provided UI) ---
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

const EmployeeManagement = () => {
  // --- State Management ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionsTarget, setActionsTarget] = useState(null);
  const [actionsPos, setActionsPos] = useState({ top: 0, left: 0 });
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const { showToast } = useUI();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Edit Modal State
  const [editing, setEditing] = useState(null);

  // View Modal State (ADDED)
  const [viewing, setViewing] = useState(null);

  // Create Modal State (NEW)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- Life Cycle: Simulate API Call ---
  useEffect(() => {
    setLoading(true);
    const fetchUsers = () => {
      setTimeout(() => {
        try {
          setUsers(MockEmployees);
          setLoading(false);
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      }, 800);
    };
    fetchUsers();
  }, []);

  // --- Handlers for Creating (NEW) ---
  const handleCreateEmployee = (newEmployee) => {
    const employee = {
      id: Date.now(), // Simple ID generation
      ...newEmployee,
      image: newEmployee.image || 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
    };

    // Add new employee at the beginning
    setUsers((prev) => [employee, ...prev]);
    setIsCreateModalOpen(false);
    setCurrentPage(1); // Go to first page to see new employee
  };

  // --- Handlers for Editing ---
  const editField = (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }));
  };

  const closeEdit = () => {
    setEditing(null);
  };

  const saveEdit = () => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === editing.id ? editing : u))
    );
    setEditing(null);
  };

  // --- Handler for Viewing ---
  const closeView = () => setViewing(null);

  // --- Computed Logic ---
  const filteredEmployees = users.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats Logic
  const totalMembers = users.length;
  const avgPerformance = users.length > 0
    ? (users.reduce((acc, curr) => acc + parseFloat(curr.performance || 0), 0) / users.length).toFixed(1)
    : 0;
  const highWorkloadCount = users.filter(u => u.workload > 80).length;

  const PAGE_WINDOW = 3;

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 👇 sliding window calculation
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

  // Close the actions menu
  const closeActions = () => setActionsTarget(null);

  // Open the edit form
  const onActionsUpdate = () => {
    if (!actionsTarget) return;
    setEditing(actionsTarget);
    closeActions();
  };

  // Open delete confirmation modal
  const onActionsDelete = () => {
    if (!actionsTarget) return;
    setConfirmDeleteTarget(actionsTarget); // pass full employee object
    closeActions();
  };

  // Cancel delete modal
  const cancelDelete = () => setConfirmDeleteTarget(null);

  // Confirm delete
  const confirmDelete = () => {
    if (!confirmDeleteTarget) return;

    handleDelete(confirmDeleteTarget); // call handler
    setConfirmDeleteTarget(null);
  };

  // Delete employee from state + show toast
  const handleDelete = (employee) => {
    setUsers(prev => prev.filter(u => u.id !== employee.id));
    showToast({
      message: `${employee.name} removed`,
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


  // const handleExport = () => {
  //   const headers = ["ID,Name,Role,Workload,Performance,Status"];
  //   const rows = filteredEmployees.map(u =>
  //     `${u.id},${u.name},${u.role},${u.workload},${u.performance},${u.status}`
  //   );
  //   const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "team_data.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // --- Conditional Rendering ---
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

  // --- Main Render ---
  return (
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6 mb-10">

      {/* Main Content */}
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Heading */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Department Team
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Reviewing current performance and workload for the{' '}
              <span className="text-primary font-semibold">Product Engineering</span> department.
            </p>
          </div>

          {/* Right: Button */}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OverviewStatCard
            title="Total Members"
            value={`${totalMembers} Employees`}
            color="primary"
            icon="groups"
          />

          <OverviewStatCard
            title="Avg. Performance"
            value={`${avgPerformance} / 5.0`}
            color="green"
            icon="trending_up"
          />

          <OverviewStatCard
            title="High Workload"
            value={`${highWorkloadCount} Alerts`}
            color="amber"
            icon="pending_actions"
          />
        </div>


        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>

            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* <button
            onClick={handleExport}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export Team Data</span>
          </button> */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Employee</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#1a2130] rounded-xl border border-[#dbdfe6] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fb] dark:bg-gray-800/50 border-bottom border-[#dbdfe6] dark:border-gray-800">
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold">Name & Role</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold">Work Load</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold">Performance</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold">Status</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-800">
                {currentItems.length > 0 ? (
                  currentItems.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-full bg-cover bg-center border border-gray-100"
                            style={{ backgroundImage: `url('${employee.image}')` }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#111318] dark:text-white">{employee.name}</span>
                            <span className="text-xs text-[#616f89] dark:text-gray-400">{employee.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3 max-w-[140px]">
                          <div className="flex-1 h-1.5 rounded-full bg-[#dbdfe6] dark:bg-gray-700 overflow-hidden">
                            <div
                              className={`h-full ${employee.workloadColor}`}
                              style={{ width: `${employee.workload}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#111318] dark:text-white">{employee.workload}%</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="inline-flex items-center justify-center bg-[#f0f2f4] dark:bg-gray-800 px-3 py-1 rounded-lg">
                          <span className="text-xs font-bold text-primary">
                            {typeof employee.performance === 'number'
                              ? employee.performance.toFixed(1)
                              : parseFloat(employee.performance).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.statusColor}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex justify-end items-center">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActionsPos({
                                top: rect.bottom + window.scrollY + 6,
                                left: rect.right + window.scrollX - 180,
                              });
                              setActionsTarget(employee);
                            }}
                            className="w-8 h-8 cursor-pointer grid place-items-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No employees found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* --- Actions Modal (3-dots): Edit / Delete --- */}
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
                    onActionsDelete(); // Use this handler
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
              <div className="fixed inset-0 bg-black/40" onClick={cancelDelete} />
              <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-md w-full p-6 relative z-10">
                <h3 className="text-xl font-bold text-[#111318] dark:text-white">Confirm Delete</h3>
                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
                  Are you sure you want to delete <span className="font-semibold">{confirmDeleteTarget.name}</span>? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={cancelDelete} className="px-4 py-2 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white">Delete</button>
                </div>
              </div>
            </div>
          )}



          {/* --- Create Employee Modal --- */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-[#0b1220] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Add New Employee
                  </h3>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <CreateEmployeeForm
                  onSubmit={handleCreateEmployee}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Table Footer / Pagination */}
          <div className="bg-[#f8f9fb] dark:bg-gray-800/50 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dbdfe6] dark:border-gray-800">
            <span className="text-xs text-[#616f89] dark:text-gray-400">
              Showing {filteredEmployees.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
              {filteredEmployees.length} employees
            </span>

            <div className="flex gap-2">
              {/* Prev */}
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </PaginationButton>

              {/* Page numbers (ONLY 3) */}
              {visiblePages.map((number) => (
                <PaginationButton
                  key={number}
                  active={currentPage === number}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </PaginationButton>
              ))}

              {/* Next */}
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </PaginationButton>
            </div>
          </div>

        </div>
      </div>

      {/* VIEW Modal (ADDED) */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeView} />
          <div className="bg-white dark:bg-[#071023] rounded-xl shadow-2xl max-w-2xl w-full p-6 relative z-10">
            <button
              onClick={closeView}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-xl bg-cover bg-center border border-gray-100"
                  style={{ backgroundImage: `url('${viewing.image}')` }}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#111318] dark:text-white">{viewing.name}</h3>
                <p className="text-sm text-[#616f89] dark:text-gray-400">{viewing.role}</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#616f89] dark:text-gray-400 uppercase font-bold">Status</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewing.statusColor}`}>
                        {viewing.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#616f89] dark:text-gray-400 uppercase font-bold">Performance</p>
                    <div className="mt-2 inline-flex items-center justify-center bg-[#f0f2f4] dark:bg-gray-800 px-3 py-1 rounded-lg">
                      <span className="text-sm font-bold text-primary">{viewing.performance} / 5</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#616f89] dark:text-gray-400 uppercase font-bold">Workload</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-3 rounded-full bg-[#dbdfe6] dark:bg-gray-700 overflow-hidden">
                        <div className={`h-full ${viewing.workloadColor}`} style={{ width: `${viewing.workload}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[#111318] dark:text-white">{viewing.workload}%</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#616f89] dark:text-gray-400 uppercase font-bold">Notes</p>
                    <p className="mt-2 text-sm text-[#334155] dark:text-gray-300">No additional notes available.</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 justify-end">
                  <button onClick={closeView} className="px-4 py-2 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Modal (Your Custom Implementation) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeEdit} />
          <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10">
            <button
              onClick={closeEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-bold text-lg text-[#111318] dark:text-white">Update Review</h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#616f89]">Name</label>
                <input
                  value={editing.name}
                  onChange={(e) => editField("name", e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs text-[#616f89]">Role</label>
                <input
                  value={editing.role}
                  onChange={(e) => editField("role", e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs text-[#616f89]">Workload (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editing.workload}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(100, Number(e.target.value || 0)));
                    editField("workload", v);
                    // optionally update color by threshold
                    const color = v >= 80 ? "bg-red-500" : v >= 50 ? "bg-primary" : "bg-green-500";
                    editField("workloadColor", color);
                  }}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs text-[#616f89]">Performance (0 - 5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editing.performance}
                  onChange={(e) => editField("performance", Number(e.target.value))}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs text-[#616f89]">Status</label>
                <select
                  value={editing.status}
                  onChange={(e) => {
                    const s = e.target.value;
                    // map to a friendly color scheme
                    const statusMap = {
                      Active: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
                      Remote: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
                      "On Leave": "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
                      Default: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-400"
                    };
                    editField("status", s);
                    editField("statusColor", statusMap[s] || statusMap.Default);
                  }}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                >
                  <option>Active</option>
                  <option>Remote</option>
                  <option>On Leave</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#616f89]">Image URL</label>
                <input
                  value={editing.image}
                  onChange={(e) => editField("image", e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeEdit} className="px-4 cursor-pointer py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 cursor-pointer py-2 rounded-lg bg-primary text-white">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
const OverviewStatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    primary: {
      border: "hover:border-primary/40",
      shadow: "hover:shadow-primary/10",
      text: "text-primary",
      bg: "bg-primary/10",
    },
    green: {
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    amber: {
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    blue: {
      border: "hover:border-blue-500/50",
      shadow: "hover:shadow-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`
        group relative bg-white dark:bg-slate-900 p-4 rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${style.shadow} ${style.border}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`
            size-12 rounded-full flex items-center justify-center
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
            ${style.bg} ${style.text}
          `}
        >
          <span className="material-symbols-outlined !text-2xl">
            {icon}
          </span>
        </div>

        {/* Text */}
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
            {title}
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};


// Create this as a separate component or inside your main component
const CreateEmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    workload: 50,
    performance: 3.5,
    status: 'Active',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate performance is between 0 and 5
    if (formData.performance < 0 || formData.performance > 5) {
      alert('Performance score must be between 0 and 5');
      return;
    }

    // Get workload color based on percentage
    const getWorkloadColor = (workload) => {
      if (workload >= 80) return 'bg-red-500';
      if (workload >= 60) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    // Get status color
    const getStatusColor = (status) => {
      if (status === 'Active') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      if (status === 'On Leave') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const newEmployee = {
      ...formData,
      workload: parseInt(formData.workload),
      performance: parseFloat(formData.performance), // ✅ Keep as number, DON'T use .toFixed() here
      workloadColor: getWorkloadColor(parseInt(formData.workload)),
      statusColor: getStatusColor(formData.status),
    };

    onSubmit(newEmployee);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Employee Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter employee name"
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Role Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Role *
        </label>
        <input
          type="text"
          required
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g., Senior Developer, Designer"
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Workload Slider */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Workload: {formData.workload}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.workload}
          onChange={(e) => handleChange('workload', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                   dark:bg-gray-700 accent-primary focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Performance Score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Performance Score
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.performance}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              if (value >= 0 && value <= 5) {
                handleChange('performance', value);
              }
            }}
            className="w-20 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
               bg-white dark:bg-gray-800 text-slate-900 dark:text-white
               focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center"
          />
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={formData.performance}
          onChange={(e) => handleChange('performance', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
             dark:bg-gray-700 accent-primary focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 ">
          <span>0.0</span>
          <span>2.5</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Status Dropdown */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-slate-900 dark:text-white cursor-pointer
                   focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                   text-slate-700 dark:text-slate-300 font-medium
                   hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-medium
                   hover:bg-blue-700 transition-colors shadow-md shadow-primary/20 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          Add Employee
        </button>
      </div>
    </form>
  );
};
export default EmployeeManagement;
