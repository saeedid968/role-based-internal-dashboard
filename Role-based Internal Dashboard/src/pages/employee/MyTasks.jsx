import React, { useState, useEffect, useRef } from 'react';
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';

// Pagination Button Component as requested
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

const MyTasksDashboard = () => {
  // --- States ---
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const { showToast } = useUI();


  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const dropdownRef = useRef(null);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API
        const initialTasks = [
          { id: 1, name: "Implement API Auth Module", code: "#TSK-4029", priority: "High", dueDate: "2023-10-24", project: "Mobile App 2.0", status: "In Progress" },
          { id: 2, name: "Review Database Schema", code: "#TSK-4032", priority: "Medium", dueDate: "2023-10-26", project: "Legacy System Migration", status: "To Do" },
          { id: 3, name: "Update Documentation", code: "#TSK-3988", priority: "Low", dueDate: "2023-10-22", project: "Mobile App 2.0", status: "Done" },
          { id: 4, name: "Fix Sidebar Overflow Bug", code: "#TSK-4055", priority: "High", dueDate: "2023-10-25", project: "Admin Dashboard UI", status: "In Progress" },
          { id: 5, name: "Unit Testing Core", code: "#TSK-4060", priority: "Medium", dueDate: "2023-10-28", project: "Mobile App 2.0", status: "To Do" },
          { id: 6, name: "Deploy to Staging", code: "#TSK-4099", priority: "High", dueDate: "2023-10-24", project: "Admin Dashboard UI", status: "To Do" },
        ];
        setTasks(initialTasks);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Helpers ---
  const getPriorityStyle = (level) => {
    if (level === "High") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (level === "Medium") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const getStatusStyle = (status) => {
    if (status === "Done") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    if (status === "In Progress") return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  };

  // --- CRUD Logic ---
  const handleSaveTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      name: formData.get('name'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate'),
      project: formData.get('project'),
      status: formData.get('status'),
    };

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        code: `#TSK-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setTasks([newTask, ...tasks]);
    }
    closeModal();
  };

  // Open delete confirmation modal
  const onActionsDelete = (task) => {
    setConfirmDeleteTarget(task); // store full task object
    setActiveDropdown(null);
  };

  // Cancel delete (close modal)
  const cancelDelete = () => {
    setConfirmDeleteTarget(null);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!confirmDeleteTarget) return;

    setTasks(prev => prev.filter(t => t.id !== confirmDeleteTarget.id));

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

    setConfirmDeleteTarget(null);
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // --- Stats Logic ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Done").length;
  const dueTodayCount = tasks.filter(t => t.dueDate === "2023-10-24").length; // Simulated "today"

  const PAGE_WINDOW = 3; // number of page buttons to show at once
  const itemsPerPage = 5; // you can keep your existing value

  // --- Filtering & Pagination Logic ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === 'All Priorities' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // --- Sliding Window Logic for Page Buttons ---
  const getVisiblePages = () => {
    if (totalPages <= PAGE_WINDOW) return Array.from({ length: totalPages }, (_, i) => i + 1);

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

  // --- Loading/Error Views ---
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
    <div className="min-h-screen mt-5 font-display relative">
      <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6">

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Tasks</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage and track your personal task assignments.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex cursor-pointer items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Create New Task</span>
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-default">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            status="Overview"
            icon="assignment"
            color="blue"
            trendIcon="" // no trend icon for this one
          />

          <StatCard
            title="Due Today"
            value={dueTodayCount}
            status="Urgent"
            icon="pending_actions"
            color="amber"
            trendIcon="" // optional, can leave empty
          />

          <StatCard
            title="Completed"
            value={completedTasks}
            status={`${Math.round((completedTasks / (totalTasks || 1)) * 100)}%`}
            icon="task_alt"
            color="green"
            trendIcon="" // optional
          />
        </div>


        {/* Table Container */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left cursor-default border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Task Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{task.name}</span>
                        <span className="text-xs text-gray-500">{task.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{task.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">{task.project}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusStyle(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === task.id ? null : task.id)}
                        className="text-gray-400  hover:text-gray-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {activeDropdown === task.id && (
                        <>
                          {/* OUTSIDE CLICK BACKDROP */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveDropdown(null)}
                          />

                          {/* DROPDOWN */}
                          <div
                            className="absolute right-6 top-12 w-32 bg-white dark:bg-slate-800
                 border border-slate-200 dark:border-slate-700
                 rounded-lg shadow-lg z-50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(task);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                              Edit User
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onActionsDelete(task);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                              Delete
                            </button>
                          </div>
                        </>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* --- Delete Confirmation Modal --- */}
          {confirmDeleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/40"
                onClick={cancelDelete}
              />
              <div
                className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-md w-full p-6 relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#111318] dark:text-white">
                  Confirm Delete
                </h3>

                <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {confirmDeleteTarget.title || confirmDeleteTarget.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Pagination UI - Limited width as requested */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold">{indexOfFirstItem + 1}</span>-
              <span className="font-semibold">{Math.min(indexOfLastItem, filteredTasks.length)}</span> of <span className="font-semibold">{filteredTasks.length}</span> tasks
            </p>

            <div className="flex gap-2 w-fit">
              {/* Prev */}
              <PaginationButton disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </PaginationButton>

              {/* Page Buttons (Sliding Window) */}
              {visiblePages.map((number) => (
                <PaginationButton
                  key={number}
                  active={currentPage === number}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </PaginationButton>
              ))}

              {/* Next */}
              <PaginationButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </PaginationButton>
            </div>
          </div>

        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">{editingTask ? 'Update Task' : 'Create New Task'}</h3>
              <button onClick={closeModal} className="material-symbols-outlined text-gray-400 hover:text-gray-600">close</button>
            </div>
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Name</label>
                <input required name="name" defaultValue={editingTask?.name} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select name="priority" defaultValue={editingTask?.priority || "Medium"} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" defaultValue={editingTask?.status || "To Do"} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input required type="date" name="dueDate" defaultValue={editingTask?.dueDate} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                <input required name="project" defaultValue={editingTask?.project} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-lg font-bold">{editingTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
const StatCard = ({ title, value, status, icon, color, trendIcon }) => {
  // Mapping logic to ensure Tailwind picks up classes and allows for brand-specific colors
  const colorMap = {
    green: {
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    blue: {
      border: "hover:border-blue-500/50",
      shadow: "hover:shadow-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      pill: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
    amber: {
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    red: {
      border: "hover:border-rose-500/50",
      shadow: "hover:shadow-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      pill: "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className={`
      group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 
      shadow-sm flex flex-col justify-between transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-lg ${style.shadow} ${style.border}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${style.bg} ${style.text}`}>
          <span className="material-symbols-outlined !text-2xl">{icon}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${style.pill}`}>
          {trendIcon && <span className="material-symbols-outlined !text-sm">{trendIcon}</span>}
          {status}
        </span>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
          Updated now
        </p>
      </div>
    </div>
  );
};
export default MyTasksDashboard;