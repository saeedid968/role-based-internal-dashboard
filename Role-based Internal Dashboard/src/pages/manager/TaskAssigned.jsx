import React, { useState, useEffect, useMemo } from 'react';
import { assignedTasks } from '../../services/MockData';
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';

const PaginationButton = ({ children, active, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font medium transition-all
      ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const EmployeeManagement = () => {

  const [users, setUsers] = useState(assignedTasks); // Changed this line
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [actionsTarget, setActionsTarget] = useState(null);
  const [actionsPos, setActionsPos] = useState({ top: 0, left: 0 });
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useUI();
  const [newTask, setNewTask] = useState({
    name: '',
    role: '',
    image: 'https://i.pravatar.cc/150?img=11',
    priority: '',
    priorityColor: '',
    deadline: '',
    status: '',
    statusColor: '',
    task: {
      title: '',
      department: ''
    }
  });


  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      try {
        setUsers(assignedTasks);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Extract unique roles from assignedTasks
  const roles = useMemo(() => {
    const setRoles = new Set(users.map(task => task.role));
    return ['All', ...Array.from(setRoles)];
  }, [users]);

  // Extract unique statuses from assignedTasks
  const statuses = useMemo(() => {
    const setS = new Set(users.map(task => task.status));
    return ['All', ...Array.from(setS)];
  }, [users]);


  // --- Filtering / Searching logic ---
  // Extract unique priorities from assignedTasks
  const priorities = useMemo(() => {
    const setP = new Set(users.map(task => task.priority));
    return ['All', ...Array.from(setP)];
  }, [users]);


  // Fixed filtering logic with priority filter
  const filteredEmployees = useMemo(() => {
    return users.filter(task => {
      const q = searchTerm.trim().toLowerCase();

      if (q) {
        const hits =
          task.name.toLowerCase().includes(q) ||
          task.role.toLowerCase().includes(q) ||
          task.task.title.toLowerCase().includes(q) ||
          task.task.department.toLowerCase().includes(q);
        if (!hits) return false;
      }

      if (statusFilter !== 'All' && task.status !== statusFilter) return false;
      if (roleFilter !== 'All' && task.role !== roleFilter) return false;
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;

      return true;
    });
  }, [users, searchTerm, statusFilter, roleFilter, priorityFilter]);

  const totalMembers = users.length;
  const activeTasks = users.filter(u => u.status === 'In Progress').length;
  const completedTasks = users.filter(u => u.status === 'Completed').length;

  // Pagination calculations
  const PAGE_WINDOW = 3;
  const ITEMS_PER_PAGE = 5;

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


  const editField = (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = () => {
    if (!editing || !editing.id) return;
    setUsers((prevUsers) =>
      prevUsers.map(u => (u.id === editing.id ? { ...u, ...editing } : u))
    );
    setEditing(null);
  };

  const closeEdit = () => setEditing(null);

  // --- NEW CREATE TASK LOGIC ---
  const handleAddTask = () => {
    // Validation
    if (!newTask.name || !newTask.role || !newTask.task?.title || !newTask.priority || !newTask.deadline || !newTask.status) {
      alert('Please fill in all required fields');
      return;
    }

    const taskToAdd = {
      id: Date.now(), // Use timestamp for unique ID
      name: newTask.name,
      role: newTask.role,
      image: newTask.image || 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
      priority: newTask.priority,
      priorityColor: newTask.priorityColor,
      deadline: newTask.deadline,
      status: newTask.status,
      statusColor: newTask.statusColor,
      task: {
        title: newTask.task.title,
        department: newTask.task.department
      }
    };

    // Update the users state
    setUsers(prev => [taskToAdd, ...prev]);

    // Close modal
    setIsCreateModalOpen(false);

    // Reset form
    setNewTask({
      name: '',
      role: '',
      image: '',
      priority: '',
      priorityColor: '',
      deadline: '',
      status: '',
      statusColor: '',
      task: {
        title: '',
        department: ''
      }
    });
  };


  // --- Actions modal (3-dots) ---
  const openActions = (user) => setActionsTarget(user);
  const closeActions = () => setActionsTarget(null);

  const onActionsUpdate = () => {
    setEditing({ ...actionsTarget });
    closeActions();
  };

  const onActionsDelete = () => {
    setConfirmDeleteTarget(actionsTarget);
    closeActions();
  };


  // --- Delete confirmation ---
  const confirmDelete = () => {
    if (!confirmDeleteTarget) return;
    setUsers(prev => prev.filter(u => u.id !== confirmDeleteTarget.id));
    setConfirmDeleteTarget(null);
    const newFilteredLength = filteredEmployees.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(newFilteredLength / ITEMS_PER_PAGE));
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    showToast({
      message: "Task deleted",
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
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6 mb-10">
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* Heading */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Team Tasks
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Balance assignments, monitor capacity, and optimize team productivity
            </p>
          </div>

          {/* Right: Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-primary/20 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add_task</span>
            <span>Assign New Task</span>
          </button>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-default">
          <OverviewStatCard
            title="Total Tasks"
            value={`${totalMembers} Tasks`}
            color="primary"
            icon="assignment"
          />

          <OverviewStatCard
            title="Active Tasks"
            value={`${activeTasks} In Progress`}
            color="blue"
            icon="trending_up"
          />

          <OverviewStatCard
            title="Completed"
            value={`${completedTasks} Done`}
            color="green"
            icon="task_alt"
          />        </div>


        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Search */}
          <div className="w-full sm:max-w-md">
            <div className="relative w-full">
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
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 
          bg-slate-50 dark:bg-slate-800/50 
          pl-10 pr-4 py-2 text-sm 
          focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Right: Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all 
             px-3 py-2 bg-white dark:bg-[#0b1220] text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Priority Filter (Optional) */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all 
              px-3 py-2 bg-white dark:bg-[#0b1220] text-sm text-slate-900 dark:text-white"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all 
             px-3 py-2 bg-white dark:bg-[#0b1220] text-sm text-slate-900 dark:text-white"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1a2130] rounded-xl border border-[#dbdfe6] dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[#f8f9fb] dark:bg-gray-800/50 border-bottom border-[#dbdfe6] dark:border-gray-800">
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold w-[30%]">Task Title</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold w-[25%]">Assignee</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold w-[12%]">Priority</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold w-[15%]">Deadline</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold w-[12%]">Status</th>
                  <th className="px-4 md:px-6 py-4 text-[#111318] dark:text-white text-sm font-semibold text-right w-[6%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-800">
                {currentItems.length > 0 ? (
                  currentItems.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-l font-medium text-[#111318] dark:text-white truncate">{employee.task.title}</span>
                          <span className="text-xs text-[#616f89] dark:text-gray-400 truncate">{employee.task.department}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 flex-shrink-0"
                            style={{ backgroundImage: `url('${employee.image}')` }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[#111318] dark:text-white truncate">{employee.name}</span>
                            <span className="text-xs text-[#616f89] dark:text-gray-400 truncate">{employee.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${employee.priorityColor}`}>
                          {employee.priority}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">

                          <span className="text-sm text-[#111318] dark:text-white">{employee.deadline}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${employee.statusColor}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActionsPos({
                                top: rect.bottom + window.scrollY + 6,
                                left: rect.right + window.scrollX - 180,
                              });
                              openActions(employee);
                            }}
                            className="w-8 h-8 cursor-pointer grid place-items-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[48px]">search_off</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">No tasks found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Footer / Pagination */}
          <div className="bg-[#f8f9fb] dark:bg-gray-800/50 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dbdfe6] dark:border-gray-800">
            <span className="text-xs text-[#616f89] dark:text-gray-400">
              Showing {filteredEmployees.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
              {filteredEmployees.length} tasks
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
              onClick={(e) => { e.stopPropagation(); onActionsUpdate(); }}
              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span> Edit User
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onActionsDelete(); }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
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

      {/* --- Edit Modal (Update Task) --- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeEdit} />
          <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-2xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-bold text-lg text-[#111318] dark:text-white mb-1">Update Task</h3>
            <p className="text-sm text-[#616f89] mb-6">Edit the task details</p>

            <div className="space-y-4">
              {/* Task Information */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Task Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Task Title</label>
                    <input
                      value={editing.task?.title || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        task: { ...editing.task, title: e.target.value }
                      })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Department</label>
                    <input
                      value={editing.task?.department || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        task: { ...editing.task, department: e.target.value }
                      })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Assignee Information */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Assignee Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Name</label>
                    <input
                      value={editing.name}
                      onChange={(e) => editField("name", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Role</label>
                    <input
                      value={editing.role}
                      onChange={(e) => editField("role", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Image URL</label>
                    <input
                      value={editing.image}
                      onChange={(e) => editField("image", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Task Details */}
              <div>
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Task Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Priority</label>
                    <select
                      value={editing.priority}
                      onChange={(e) => {
                        const p = e.target.value;
                        const priorityMap = {
                          High: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
                          Medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
                          Low: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400"
                        };
                        editField("priority", p);
                        editField("priorityColor", priorityMap[p]);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#0b1220] text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Deadline</label>
                    <input
                      type="text"
                      placeholder="MMM DD, YYYY"
                      value={editing.deadline}
                      onChange={(e) => editField("deadline", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Status</label>
                    <select
                      value={editing.status}
                      onChange={(e) => {
                        const s = e.target.value;
                        const statusMap = {
                          "In Progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
                          Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
                          Completed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        };
                        editField("status", s);
                        editField("statusColor", statusMap[s]);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#0b1220] text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={closeEdit} className="px-4 cursor-pointer py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 cursor-pointer py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW Assign New Task Modal --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-2xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-bold text-lg text-[#111318] dark:text-white mb-1">Assign New Task</h3>
            <p className="text-sm text-[#616f89] mb-6">Fill in the details to assign a task to a team member</p>

            <div className="space-y-4">
              {/* Task Information Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Task Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Task Title</label>
                    <input
                      placeholder="e.g., Design System Documentation"
                      value={newTask.task?.title || ''}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        task: { ...newTask.task, title: e.target.value }
                      })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Department</label>
                    <input
                      placeholder="e.g., Product Team"
                      value={newTask.task?.department || ''}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        task: { ...newTask.task, department: e.target.value }
                      })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Assignee Information Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Assignee Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Assignee Name</label>
                    <input
                      placeholder="Employee Name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Role</label>
                    <input
                      placeholder="Job Title"
                      value={newTask.role}
                      onChange={(e) => setNewTask({ ...newTask, role: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Profile Image URL (Optional)</label>
                    <input
                      placeholder="https://i.pravatar.cc/150?img=11"
                      onChange={(e) => setNewTask({ ...newTask, image: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-transparent text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Task Details Section */}
              <div>
                <h4 className="text-sm font-semibold text-[#111318] dark:text-white mb-3">Task Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => {
                        const p = e.target.value;
                        const priorityMap = {
                          High: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
                          Medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
                          Low: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400"
                        };
                        setNewTask({ ...newTask, priority: p, priorityColor: priorityMap[p] });
                      }}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#0b1220] text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Deadline</label>
                    <input
                      type="date"
                      onChange={(e) => {
                        if (e.target.value) {
                          // Convert date to "MMM DD, YYYY" format
                          const date = new Date(e.target.value);
                          const formatted = date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          });
                          setNewTask({ ...newTask, deadline: formatted });
                        }
                      }}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#0b1220] text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                    />
                    {newTask.deadline && (
                      <p className="text-xs text-[#616f89] mt-1">Selected: {newTask.deadline}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#616f89] mb-1">Status</label>
                    <select
                      value={newTask.status}
                      onChange={(e) => {
                        const s = e.target.value;
                        const statusMap = {
                          "In Progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
                          Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
                          Completed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        };
                        setNewTask({ ...newTask, status: s, statusColor: statusMap[s] });
                      }}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-[#0b1220] text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                Assign Task
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

export default EmployeeManagement;