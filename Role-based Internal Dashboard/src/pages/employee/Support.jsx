import React, { useState, useEffect } from 'react';
import Footer from '../../components/common/footer';
import { useUI } from '../../context/UIContext';

const SupportCenter = () => {
    // --- States ---
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { showToast } = useUI();


    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // --- Simulated API Load ---
    useEffect(() => {
        const loadSupportData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                const mockTickets = [
                    { id: 1, ticketId: "#TK-8422", subject: "Keyboard replacement for workstation", category: "IT Support", status: "Pending", description: "Mechanical keyboard 'E' key is non-functional.", lastUpdate: "2 hours ago" },
                    { id: 2, ticketId: "#TK-8391", subject: "Adobe Creative Cloud Extension", category: "Software Access", status: "Resolved", description: "Need extension for the marketing project.", lastUpdate: "Yesterday" },
                    { id: 3, ticketId: "#TK-8345", subject: "Q3 Benefit Enrollment Question", category: "HR Requests", status: "In Progress", description: "Unable to see the dental plan options.", lastUpdate: "2 days ago" },
                    { id: 4, ticketId: "#TK-8350", subject: "VPN Connection Drops", category: "IT Support", status: "In Progress", description: "Connection drops every 10 minutes.", lastUpdate: "1 day ago" },
                ];
                setTickets(mockTickets);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadSupportData();
    }, []);

    // --- Helpers ---
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500";
            case 'Resolved': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500";
            case 'In Progress': return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    // --- CRUD Operations ---
    const handleCreateTicket = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTicket = {
            id: Date.now(),
            ticketId: `#TK-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: formData.get('subject'),
            category: formData.get('category'),
            description: formData.get('description'),
            status: 'Pending',
            lastUpdate: 'Just now'
        };
        setTickets([newTicket, ...tickets]);
        setIsCreateModalOpen(false);
    };

    const handleDeleteTicket = (id) => {

        setTickets(tickets.filter(t => t.id !== id));
        setSelectedTicket(null);
        showToast({
            message: "Ticket deleted",
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

    const updateTicketStatus = (id, newStatus) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus, lastUpdate: 'Just now' } : t));
        setSelectedTicket(null);
    };

    // --- Stats Calculation (Real Data) ---
    const stats = {
        it: tickets.filter(t => t.category === "IT Support").length,
        hr: tickets.filter(t => t.category === "HR Requests").length,
        software: tickets.filter(t => t.category === "Software Access").length,
        training: tickets.filter(t => t.category === "Training").length,
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketId.includes(searchTerm);
        const matchesCat = activeCategory === 'All' || t.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-500 animate-pulse">Loading users...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen text-red-500">
            <p>Failed to load user data. Please try again later.</p>
        </div>
    );

    return (
        <div className="min-h-screen mt-5 font-display">
            <div className="container mt-5 mx-auto max-w-7xl px-4 flex flex-col gap-6">

                {/* Hero Section */}
                <div className="text-center space-y-6 py-8 md:py-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">How can we help?</h2>
                    <div className="max-w-2xl mx-auto relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
                        <input
                            className="h-14 w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-12 pr-6 shadow-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            placeholder="Search tickets, IDs, or topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Redesigned Top Cards (Interactive Stats) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "IT Support", icon: "computer", count: stats.it, color: "blue" },
                        { title: "HR Requests", icon: "groups", count: stats.hr, color: "purple" },
                        { title: "Software Access", icon: "vpn_key", count: stats.software, color: "emerald" },
                        { title: "Training", icon: "school", count: stats.training, color: "orange" },
                    ].map((cat) => (
                        <button
                            key={cat.title}
                            onClick={() => setActiveCategory(activeCategory === cat.title ? 'All' : cat.title)}
                            className={`p-6 cursor-pointer rounded-2xl border transition-all text-left flex items-center justify-between group ${activeCategory === cat.title
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center ${activeCategory === cat.title ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-blue-600'}`}>
                                    <span className="material-symbols-outlined">{cat.icon}</span>
                                </div>
                                <div>
                                    <h3 className={`font-bold ${activeCategory === cat.title ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{cat.title}</h3>
                                    <p className={`text-xs ${activeCategory === cat.title ? 'text-blue-100' : 'text-slate-500'}`}>View Requests</p>
                                </div>
                            </div>
                            <span className="text-2xl font-black opacity-40">{cat.count}</span>
                        </button>
                    ))}
                </div>

                {/* Active Tickets Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">Active Tickets</h4>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">{filteredTickets.length}</span>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 cursor-pointer text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                        >
                            + New Ticket
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-400">{ticket.ticketId}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{ticket.subject}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Updated {ticket.lastUpdate}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 italic">{ticket.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyles(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined">open_in_new</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-slate-800">
                    <div className="absolute -right-12 -bottom-12 opacity-5 scale-150"><span className="material-symbols-outlined text-[10rem] text-white">support_agent</span></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Need Immediate Assistance?</h3>
                        <p className="text-slate-400 max-w-lg">Our dedicated team of engineers and specialists are standing by 24/7 to help resolve your issues.</p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button className="px-8 py-4 cursor-pointer bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl">Start Live Chat</button>
                    </div>
                </div>
            </div>

            {/* CREATE TICKET MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-black dark:text-white">Create Support Ticket</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Subject</label>
                                <input name="subject" required className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="What do you need help with?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Category</label>
                                    <select name="category" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white cursor-pointer">
                                        <option>IT Support</option>
                                        <option>HR Requests</option>
                                        <option>Software Access</option>
                                        <option>Training</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Urgency</label>
                                    <select className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white cursor-pointer">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Detailed Description</label>
                                <textarea name="description" rows="4" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="Describe the issue..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">Submit Support Request</button>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW/UPDATE TICKET MODAL */}
            {selectedTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="h-2 bg-blue-600 w-full"></div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{selectedTicket.ticketId}</p>
                                    <h3 className="text-xl font-bold dark:text-white leading-tight">{selectedTicket.subject}</h3>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusStyles(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8">
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedTicket.description}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {selectedTicket.status !== 'Resolved' && (
                                    <button
                                        onClick={() => updateTicketStatus(selectedTicket.id, 'Resolved')}
                                        className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 cursor-pointer transition-colors"
                                >
                                    Close & Delete Ticket
                                </button>
                                <button onClick={() => setSelectedTicket(null)} className="w-full py-3 text-slate-500 cursor-pointer font-bold">Close View</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default SupportCenter;