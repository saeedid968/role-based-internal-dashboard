import React, { useState } from "react";
import { USER_ROLES } from "../utils/roles";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth_Context";
import { useEffect } from "react";
import { useUI } from "../context/UIContext";

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [activeRole, setActiveRole] = useState(USER_ROLES.MANAGER);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useUI();


    useEffect(() => {
        if (user) {

            if (user.role === USER_ROLES.ADMIN) {
                navigate("/admin/dashboard", { replace: true });
            } else if (user.role === USER_ROLES.MANAGER) {
                navigate("/manager/dashboard", { replace: true });
            } else {
                navigate("/employee/dashboard", { replace: true });
            }
        }

    }, [user, navigate]);

    const HARDCODED_CREDENTIALS = {
        [USER_ROLES.ADMIN]: {
            email: "admin@company.com",
            password: "123",
        },
        [USER_ROLES.MANAGER]: {
            email: "manager@company.com",
            password: "123",
        },
        [USER_ROLES.EMPLOYEE]: {
            email: "employee@company.com",
            password: "123",
        },
    };


    const emailPlaceholderByRole = {
        [USER_ROLES.ADMIN]: "admin@company.com",
        [USER_ROLES.MANAGER]: "manager@company.com",
        [USER_ROLES.EMPLOYEE]: "employee@company.com",
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const roleCredentials = HARDCODED_CREDENTIALS[activeRole];

        if (
            email === roleCredentials.email &&
            password === roleCredentials.password
        ) {
            await login({ role: activeRole, email });

            showToast({
                message: `Welcome back, ${activeRole}`,
                icon: "verified",
                duration: 4000,
            });
        } else {
            setError("Invalid email or password");
            setIsSubmitting(false);
        }
    };



    const togglePasswordVisibility = () =>
        setShowPassword((prev) => !prev);

    const RoleTab = ({ role, label, icon, active }) => (
        <button
            type="button"
            onClick={() => handleRoleChange(role)}
            className={`group flex flex-col items-center justify-center flex-1
      pt-1.5 pb-2 gap-1.5
      border-b-[2px] cursor-pointer transition-all
      ${active
                    ? "border-b-primary"
                    : "border-b-transparent hover:border-b-slate-300"
                }`}
        >
            <span
                className={`material-symbols-outlined text-xl transition-all
        ${active
                        ? "text-primary scale-105"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
            >
                {icon}
            </span>

            <p
                className={`text-[11px] uppercase tracking-wider transition-colors
        ${active
                        ? "text-primary font-semibold"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
            >
                {label}
            </p>
        </button>
    );


    // This function handles role switching + data reset
    // const handleRoleChange = (role) => {
    //     setActiveRole(role);
    //     setEmail("");
    //     setPassword("");
    //     setError(null);
    // };
    const handleRoleChange = (role) => {
        setActiveRole(role);

        const creds = HARDCODED_CREDENTIALS[role];
        setEmail(creds.email);
        setPassword(creds.password);

        setError(null);
    };


    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-display antialiased p-4">

            {/* --- Background Elements (Keep existing) --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.1),transparent_50%)]" />
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            </div>

            {/* --- Split Layout Login Card --- */}
            <div className="relative z-10 w-full max-w-[900px] min-h-[560px] flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in duration-700">

                {/* LEFT COLUMN: Visual/Branding (Only visible on Desktop) */}
                <div className="hidden md:flex w-[42%] bg-slate-900 relative flex-col justify-between p-12 text-white">
                    {/* Decorative Mesh */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#3b82f633,transparent_50%)]" />
                        <div className="absolute bottom-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                            <span className="material-symbols-outlined text-white text-[28px]">dashboard</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight leading-tight">
                            Modern <br /> Architecture.
                        </h2>
                        <p className="text-slate-400 mt-6 text-base leading-relaxed max-w-[280px]">
                            The central intelligence hub for your entire enterprise operation.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-400 text-sm">shield</span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium">Verified Enterprise Security <br /> <span className="text-slate-500">AES-256 Encrypted</span></p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Form Content */}
                <div className="flex-1 flex flex-col bg-white">

                    {/* Header Section */}
                    <div className="px-10 pt-10 pb-2">
                        <h3 className="text-slate-900 text-3xl font-bold tracking-tight">Welcome Back</h3>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Log in to your account dashboard</p>
                    </div>

                    {/* Role Tabs - Segmented Control style */}
                    <div className="px-10 mt-6">
                        <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                            <RoleTab role={USER_ROLES.ADMIN} label="Admin" icon="admin_panel_settings" active={activeRole === USER_ROLES.ADMIN} />
                            <RoleTab role={USER_ROLES.MANAGER} label="Manager" icon="work" active={activeRole === USER_ROLES.MANAGER} />
                            <RoleTab role={USER_ROLES.EMPLOYEE} label="Employee" icon="badge" active={activeRole === USER_ROLES.EMPLOYEE} />
                        </div>
                    </div>

                    {/* Main Form */}
                    <form onSubmit={handleLogin} className="px-10 py-8 flex flex-col gap-5">

                        {/* Input Group */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-slate-700 text-[13px] font-bold uppercase tracking-wider ml-1">Work Email</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        type="email"
                                        placeholder={emailPlaceholderByRole[activeRole]}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between  px-1">
                                    <label className="text-slate-700 text-[13px] font-bold uppercase tracking-wider">Security Key</label>
                                    <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        className={`w-full h-12 pl-12 pr-12 rounded-xl border bg-slate-50/50 text-sm focus:bg-white focus:ring-4 outline-none transition-all ${error && error.includes("password") ? "border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"}`}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
                                    </button>
                                </div>
                                {error && (
                                    <div className="mt-2 flex items-center gap-2 text-[12px]  text-red-600">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 py-1">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                            />
                            <span className="text-slate-600 text-sm font-medium ">Remember this session</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full h-13 bg-slate-900 hover:bg-black 
             text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-200 
             hover:shadow-xl hover:shadow-slate-300 transition-all 
             flex items-center justify-center gap-2 group overflow-hidden mt-2 cursor-pointer"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </>
                            )}
                        </button>

                    </form>

                    {/* Footer Section - Sticky at bottom of card */}
                    <div className="mt-auto px-10 py-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>© 2025 v.4.2.0</span>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
