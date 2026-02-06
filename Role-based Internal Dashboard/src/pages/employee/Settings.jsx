import React, { useState, useEffect } from 'react';
import Footer from '../../components/common/footer';

const WorkspaceSettings = () => {
    // --- Global Screen States ---
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successModal, setSuccessModal] = useState({ open: false, title: "" });
    const [deactivateModal, setDeactivateModal] = useState(false);

    // --- Settings States ---
    const [activeTab, setActiveTab] = useState('Account');
    const [viewType, setViewType] = useState('List');
    const [language, setLanguage] = useState('English (US)');
    const [timezone, setTimezone] = useState('(GMT-08:00) Pacific Time');
    const [landingPage, setLandingPage] = useState('Dashboard');
    const [notifications, setNotifications] = useState({
        newTaskAssignment: true,
        projectDeadlineReminders: true,
        teamMentionAlerts: true,
        generalInAppAlerts: true,
        emailDigest: true
    });

    // --- Initial Load Simulation ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            // Simulating a random error for testing: if(Math.random() > 0.95) setError(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // --- Action Handlers ---
    const handleSave = (sectionTitle) => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSuccessModal({ open: true, title: sectionTitle });
        }, 800);
    };

    const toggleNotification = (id) => {
        setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Data Objects ---
    const tabs = [
        { id: 'Account', label: 'Account', icon: 'person' },
        { id: 'Notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'Privacy', label: 'Privacy', icon: 'lock' },
        { id: 'Security', label: 'Security', icon: 'shield' }
    ];

    const workspaceNotifications = [
        { id: 'newTaskAssignment', title: 'New Task Assignment', description: 'Alert me when a task is assigned to me.', icon: 'assignment_ind', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
        { id: 'projectDeadlineReminders', title: 'Project Deadline Reminders', description: 'Remind me of upcoming project milestones.', icon: 'event_busy', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
        { id: 'teamMentionAlerts', title: 'Team Mention Alerts', description: 'Notify me when I am tagged in comments.', icon: 'alternate_email', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' },
        { id: 'generalInAppAlerts', title: 'General In-App Alerts', description: 'Real-time status updates in dashboard.', icon: 'notifications_active', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' }
    ];

    // --- Required Loading & Error States ---
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
            {/* Global Saving Overlay */}
            {isSaving && (
                <div className="fixed inset-0 z-[110] bg-white/50 dark:bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span className="text-sm font-bold dark:text-white">Applying changes...</span>
                    </div>
                </div>
            )}

            <div className="container mt-5 mx-auto max-w-7xl px-4 flex flex-col gap-6">
                {/* Page Header */}
                <div className="mb-6 md:mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Settings</h2>
                        <p className="text-slate-500 dark:text-slate-400">Configure your personal workspace, project views, and notification alerts.</p>
                    </div>
                    <div className="hidden md:block">
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Pro Account</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-800 mb-6 md:mb-8 overflow-x-auto">
                    <nav className="flex gap-4 md:gap-8 min-w-max">
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
                    </nav>
                </div>

                {/* Settings Content - Conditional Rendering based on Tab */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                    {activeTab === 'Account' && (
                        <>
                            {/* Regional & Language Settings */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
                                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-600">language</span>
                                    <div>
                                        <h3 className="font-bold text-base leading-none">Regional & Language</h3>
                                        <p className="text-sm text-slate-500 mt-1">Update your localization preferences.</p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Preferred Language</label>
                                            <select
                                                className="w-full h-11 cursor-pointer rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                <option>English (US)</option><option>Spanish</option><option>French</option><option>German</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Timezone</label>
                                            <select
                                                className="w-full cursor-pointer h-11 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                            >
                                                <option>(GMT-08:00) Pacific Time</option><option>(GMT+00:00) UTC</option><option>(GMT+01:00) CET</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 md:px-8 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                                    <button
                                        onClick={() => handleSave('Regional Settings')}
                                        className="px-6 cursor-pointer py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm"
                                    >
                                        Update Settings
                                    </button>
                                </div>
                            </div>

                            {/* Project Preferences */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-600">account_tree</span>
                                    <div>
                                        <h3 className="font-bold text-base leading-none">Project Preferences</h3>
                                        <p className="text-sm text-slate-500 mt-1">Customize your workspace navigation.</p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Default Landing Page</label>
                                            <select
                                                className="w-full cursor-pointer h-11 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={landingPage}
                                                onChange={(e) => setLandingPage(e.target.value)}
                                            >
                                                <option>Dashboard</option><option>Tasks</option><option>Directory</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Default Project View</label>
                                            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-max">
                                                {[{ id: 'List', icon: 'view_list' }, { id: 'Kanban', icon: 'view_kanban' }].map((option) => (
                                                    <button
                                                        key={option.id}
                                                        className={`flex cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewType === option.id
                                                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-md'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                        onClick={() => setViewType(option.id)}
                                                    >
                                                        <span className="material-symbols-outlined text-lg">{option.icon}</span>
                                                        {option.id}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 md:px-8 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                                    <button
                                        onClick={() => handleSave('Project View')}
                                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-sm transition-all cursor-pointer"
                                    >
                                        Save Defaults
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-600">notifications_active</span>
                                <div>
                                    <h3 className="font-bold text-base leading-none">Notification Channels</h3>
                                    <p className="text-sm text-slate-500 mt-1">Configure how and when you want to be reached.</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b dark:border-slate-800">Workspace Activity</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        {workspaceNotifications.map((notification) => (
                                            <div key={notification.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${notification.color}`}>
                                                        <span className="material-symbols-outlined">{notification.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold dark:text-white">{notification.title}</p>
                                                        <p className="text-xs text-slate-500">{notification.description}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleNotification(notification.id)}
                                                    className={`relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[notification.id]
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[notification.id]
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-8 py-4 bg-blue-50/50 dark:bg-blue-900/10 flex justify-center">
                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 italic">Settings are saved automatically on change.</p>
                            </div>
                        </div>
                    )}

                    {/* Generic Security/Privacy Tab placeholder logic */}
                    {(activeTab === 'Security' || activeTab === 'Privacy') && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-20 text-center animate-in zoom-in-95">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">{activeTab === 'Security' ? 'shield' : 'lock'}</span>
                            <h3 className="text-xl font-bold dark:text-white">Enhanced {activeTab} coming soon</h3>
                            <p className="text-slate-500">This section is currently undergoing a security audit.</p>
                        </div>
                    )}

                    {/* Deactivate Account */}
                    <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl md:rounded-2xl border border-rose-200 dark:border-rose-900/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg hover:shadow-rose-100 dark:hover:shadow-none transition-all">
                        <div className="flex items-start gap-4 text-center md:text-left">
                            <span className="material-symbols-outlined text-rose-600 bg-rose-100 p-2 rounded-lg hidden md:block">report</span>
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-rose-900 dark:text-rose-400 mb-1">Deactivate Account</h3>
                                <p className="text-sm text-rose-700/70 dark:text-rose-400/70">Once you deactivate, your history will be permanently archived and access revoked.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDeactivateModal(true)}
                            className="px-8 py-3 bg-white dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-black rounded-2xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all text-sm shadow-sm cursor-pointer"
                        >
                            Deactivate Access
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL: Success Confirmation */}
            {successModal.open && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSuccessModal({ open: false })}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                        <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <span className="material-symbols-outlined text-3xl font-black">check</span>
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">Saved Successfully!</h3>
                        <p className="text-sm text-slate-500 mb-6">Your {successModal.title} have been applied across the workspace.</p>
                        <button
                            onClick={() => setSuccessModal({ open: false })}
                            className="w-full py-3 cursor-pointer bg-slate-900 dark:bg-blue-600 text-white font-black rounded-2xl hover:opacity-90 transition-opacity"
                        >
                            Great, Thanks!
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: Deactivation Confirmation */}
            {deactivateModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeactivateModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
                        <span className="material-symbols-outlined text-6xl text-rose-600 mb-4 animate-pulse">warning</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Are you absolutely sure?</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">This action cannot be undone. You will lose all assigned tasks, project progress, and workspace visibility immediately.</p>
                        <div className="flex flex-col gap-3">
                            <button className="w-full cursor-pointer py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all">Confirm Deactivation</button>
                            <button onClick={() => setDeactivateModal(false)} className="w-full cursor-pointer py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl">I changed my mind</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default WorkspaceSettings;