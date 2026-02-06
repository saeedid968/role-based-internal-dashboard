import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sidebarConfig } from "../../utils/roles";
import { useAuth } from "../../context/Auth_Context";
import { useProfile } from "../../context/ProfileContext";

const Sidebar = ({ collapsed, setCollapsed }) => {

    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const { profileData } = useProfile();

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const profilePath = user ? `/${user.role}/profile` : "/login";


    if (!user) return null;

    const menuItems = sidebarConfig[user.role] || [];

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/login", { replace: true });
        setShowLogoutModal(false);
    };

    return (
        <aside
            className={`shrink-0 flex flex-col bg-white dark:bg-[#1a202c]
             border-r border-slate-200 dark:border-slate-800
             h-full transition-[width] duration-300 ease-in-out z-40
             ${collapsed ? "w-16" : "w-64"}`}
        >

            {/* HEADER */}
            <div className="relative flex items-center h-16 border-b border-slate-100   dark:border-slate-800">
                <div className={`flex items-center w-full transition-all duration-300 ${collapsed ? "justify-center" : "px-4"}`}>

                    {/* BRAND ICON */}
                    <div className="shrink-0 size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[24px]">
                            admin_panel_settings
                        </span>
                    </div>

                    {/* BRAND TEXT AREA */}
                    <div
                        className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300
    ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}
                    >
                        <h1 className="text-slate-900 dark:text-white text-sm font-bold leading-none">
                            Internal Portal
                        </h1>
                        {/* Dynamic Color based on role */}
                        <span className={`text-[10px] mt-1 font-bold px-1.5 py-0.5 rounded w-fit
        ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {user.role.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* IMPROVED CHEVRON - Always visible on the border */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Expand" : "Collapse"}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 
                              z-50 size-6 flex items-center justify-center 
                              bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700
                              rounded-full shadow-sm text-slate-500 
                              hover:text-primary hover:border-primary transition-all duration-200 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {collapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>
            </div>


            {/* NAV (DYNAMIC) */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col gap-1 px-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        title={collapsed ? item.label : ""} // Native tooltip fallback
                        className={({ isActive }) =>
                            `group relative flex items-center rounded-lg transition-all duration-300 ease-in-out
                            h-11 ${collapsed ? "justify-center w-full" : "px-3 w-full"}
                            ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary"
                            }`
                        }
                    >
                        {/* ICON */}
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            {item.icon}
                        </span>

                        {/* LABEL - Margin handles the spacing transition */}
                        <span
                            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                            ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}
                        >
                            <span className="text-sm font-medium">{item.label}</span>
                        </span>

                        {/* CUSTOM TOOLTIP (When Collapsed) */}
                        {collapsed && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
                                invisible opacity-0 -translate-x-2 
                                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                                transition-all duration-200 ease-out">
                                <div className="bg-slate-900 text-white text-xs py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap relative">
                                    {item.label}
                                    {/* Tiny arrow pointing left */}
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                                </div>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* FOOTER */}
            <div className={`mt-auto border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ${collapsed ? "p-2" : "p-4"}`}>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className={`group relative flex items-center w-full rounded-lg text-rose-500 cursor-pointer 
                    transition-all duration-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-11
                    ${collapsed ? "justify-center" : "px-3"}`}
                >
                    <span className="material-symbols-outlined text-[22px] shrink-0 ">logout</span>

                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300
                        ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}>
                        <span className="text-sm font-medium">Logout</span>
                    </span>

                    {/* Logout Tooltip for collapsed state */}
                    {collapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
                            invisible opacity-0 -translate-x-2 
                            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                            transition-all duration-200">
                            <div className="bg-rose-600 text-white text-xs py-1.5 px-2.5 rounded shadow-lg whitespace-nowrap">
                                Logout
                            </div>
                        </div>
                    )}
                </button>

                {/* USER PROFILE */}
                <NavLink
                    to={profilePath}
                    className={({ isActive }) =>
                        `group relative flex items-center rounded-lg transition-all duration-300 ease-in-out mt-2
        ${collapsed ? "justify-center h-11 w-full" : "px-3 h-14 w-full"}
        ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary"
                        }`
                    }
                >
                    <div
                        className="size-9 shrink-0 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
                        style={{
                            backgroundImage: `url('${profileData?.avatar || 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png'}')`,
                        }}
                    />

                    <div
                        className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300
        ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"}`}
                    >
                        <span className="text-sm font-semibold truncate">
                            {profileData?.name || "User"}
                        </span>
                        <span className={`text-xs truncate opacity-80`}>
                            {profileData?.jobTitle || user?.role}
                        </span>
                    </div>
                </NavLink>

            </div>

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div
                        className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mb-4">
                                <span className="material-symbols-outlined text-3xl">logout</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Confirm Logout
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                Are you sure you want to end your session? You will need to log in again to access the admin console.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition-all active:scale-95 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;