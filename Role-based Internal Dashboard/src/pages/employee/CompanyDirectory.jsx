import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../components/common/footer';

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

const CompanyDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Simulated Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockData = [
                    { id: 1, name: "Sarah Jenkins", role: "Principal Product Designer", email: "sarah.j@company.com", phone: "+1 234 567 890", location: "San Francisco", department: { name: "Design", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" }, avatar: "https://i.pravatar.cc/150?u=1" },
                    { id: 2, name: "David Chen", role: "Senior Frontend Engineer", email: "david.c@company.com", phone: "+1 234 567 891", location: "Remote", department: { name: "Engineering", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" }, avatar: "https://i.pravatar.cc/150?u=2" },
                    { id: 3, name: "Emily Rodriguez", role: "Marketing Manager", email: "emily.r@company.com", phone: "+1 234 567 892", location: "New York", department: { name: "Marketing", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" }, avatar: "https://i.pravatar.cc/150?u=3" },
                    { id: 4, name: "Marcus Thorne", role: "Account Executive", email: "marcus.t@company.com", phone: "+1 234 567 893", location: "London", department: { name: "Sales", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" }, avatar: "https://i.pravatar.cc/150?u=4" },
                    { id: 5, name: "Lisa Wong", role: "HR Coordinator", email: "lisa.w@company.com", phone: "+1 234 567 894", location: "San Francisco", department: { name: "HR", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" }, avatar: "https://i.pravatar.cc/150?u=5" },
                    { id: 6, name: "James Wilson", role: "DevOps Engineer", email: "james.w@company.com", phone: "+1 234 567 895", location: "Remote", department: { name: "Engineering", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" }, avatar: "https://i.pravatar.cc/150?u=6" },
                    { id: 7, name: "Sophie Turner", role: "Content Strategist", email: "sophie.t@company.com", phone: "+1 234 567 896", location: "New York", department: { name: "Marketing", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" }, avatar: "https://i.pravatar.cc/150?u=7" },
                    { id: 8, name: "Michael Scott", role: "Regional Manager", email: "michael.s@company.com", phone: "+1 234 567 897", location: "Scranton", department: { name: "Sales", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" }, avatar: "https://i.pravatar.cc/150?u=8" },
                    { id: 9, name: "Kevin Malone", role: "Accountant", email: "kevin.m@company.com", phone: "+1 234 567 898", location: "Scranton", department: { name: "Sales", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" }, avatar: "https://i.pravatar.cc/150?u=9" },
                ];
                setEmployees(mockData);
                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const ITEMS_PER_PAGE = 6; // or your existing value
    const PAGE_WINDOW = 3;    // number of page buttons to show

    // --- Filtering Employees (useMemo) ---
    const filteredEmployees = useMemo(() => {
        return employees.filter(employee => {
            const matchesSearch =
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment =
                departmentFilter === 'All Departments' || employee.department.name === departmentFilter;
            return matchesSearch && matchesDepartment;
        });
    }, [employees, searchTerm, departmentFilter]);

    // --- Pagination Calculations ---
    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const paginatedEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

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


    // Active Demo Buttons Actions
    const handleChat = (e, name) => {
        e.stopPropagation(); // Don't open modal
        alert(`Opening secure chat with ${name}...`);
    };

    const handleMail = (e, email) => {
        e.stopPropagation(); // Don't open modal
        window.location.href = `mailto:${email}`;
    };

    const openModal = (emp) => {
        setSelectedEmployee(emp);
        setIsModalOpen(true);
    };

    const departmentOptions = ["All Departments", "Engineering", "Marketing", "Sales", "Design", "HR"];

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

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Directory</h2>
                        <p className="text-slate-500 text-sm">Find and connect with your colleagues across the organization.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
                            <input
                                className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Search by name, role, or team..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <select
                            className="h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                            value={departmentFilter}
                            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                        >
                            {departmentOptions.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>
                </div>

                {/* Employee Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {paginatedEmployees.map((employee) => (
                        <div
                            key={employee.id}
                            onClick={() => openModal(employee)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-500/40 transition-all cursor-pointer flex flex-col items-center text-center group"
                        >
                            <div
                                className="size-20 rounded-full bg-cover bg-center border-2 border-slate-100 dark:border-slate-800 mb-4 group-hover:scale-105 transition-transform"
                                style={{ backgroundImage: `url('${employee.avatar}')` }}
                            ></div>

                            <h3 className="font-bold text-slate-900 dark:text-white">{employee.name}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-3">{employee.role}</p>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase mb-5 ${employee.department.color}`}>
                                {employee.department.name}
                            </span>

                            <div className="flex items-center gap-3 w-full mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={(e) => handleMail(e, employee.email)}
                                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                </button>
                                <button
                                    onClick={(e) => handleChat(e, employee.name)}
                                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">forum</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredEmployees.length === 0 && (
                    <div className="py-20 text-center text-slate-500">No colleagues found matching your search.</div>
                )}

                {/* Bottom Pagination - Limited to 3 page buttons as requested */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mb-10">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-semibold">{Math.min(filteredEmployees.length, indexOfFirstItem + 1)}</span> to{' '}
                        <span className="font-semibold">{Math.min(indexOfLastItem, filteredEmployees.length)}</span> of {filteredEmployees.length} colleagues
                    </p>

                    <div className="flex gap-2 w-fit">
                        {/* Prev */}
                        <PaginationButton
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
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
                        <PaginationButton
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </PaginationButton>
                    </div>
                </div>

            </div>

            {/* Employee Detail Modal */}
            {isModalOpen && selectedEmployee && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setIsModalOpen(false)} // Close on backdrop click
                >
                    {/* Backdrop with stronger blur */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"></div>

                    {/* Modal Container */}
                    <div
                        className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Header / Banner Area */}
                        <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                            {/* Decorative Pattern Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                            {/* Close Button - Integrated & Blurred */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-4 top-4 z-10 size-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="px-8 pb-8">
                            {/* Profile Header */}
                            <div className="relative -mt-16 mb-6 flex flex-col items-center">
                                <div className="size-32 rounded-3xl border-[6px] border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src={selectedEmployee.avatar}
                                        alt={selectedEmployee.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="mt-4 text-center">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {selectedEmployee.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {selectedEmployee.role}
                                        </span>
                                        <span className="size-1 bg-slate-300 rounded-full"></span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {selectedEmployee.department.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Cards - Modern Minimalist Style */}
                            <div className="space-y-3">
                                {/* Location & Status */}
                                <div className="flex gap-3">
                                    <div className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-blue-500 text-sm">location_on</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Location</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-5">{selectedEmployee.location}</p>
                                    </div>
                                    <div className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-emerald-500 text-sm">verified_user</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Availability</p>
                                        </div>
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-5">Active Now</p>
                                    </div>
                                </div>

                                {/* Email Block with Copy functionality */}
                                <div className="group relative p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-sm">mail</span>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Direct Email</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedEmployee.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="relative opacity-0 group-hover:opacity-100 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                                            onClick={() => {
                                                const btn = document.activeElement;
                                                const icon = btn.querySelector(".copy-icon");
                                                const check = btn.querySelector(".check-icon");

                                                navigator.clipboard.writeText("Text to copy").then(() => {
                                                    check.classList.add("opacity-100", "scale-110");
                                                    icon.classList.add("opacity-0", "scale-75");

                                                    setTimeout(() => {
                                                        check.classList.remove("opacity-100", "scale-110");
                                                        icon.classList.remove("opacity-0", "scale-75");
                                                    }, 1500);
                                                });
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-lg copy-icon transition-all duration-300">
                                                content_copy
                                            </span>
                                            <span className="material-symbols-outlined text-lg check-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-50 text-green-500 transition-all duration-300">
                                                check
                                            </span>
                                        </button>

                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 grid grid-cols-5 gap-3">
                                <button
                                    onClick={(e) => { handleChat(e, selectedEmployee.name); setIsModalOpen(false); }}
                                    className="col-span-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-none cursor-pointer "
                                >
                                    <span>Start Conversation</span>
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </button>
                                <button
                                    onClick={() => alert("Scheduled for follow-up")}
                                    className="cursor-pointer col-span-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">event</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default CompanyDirectory;