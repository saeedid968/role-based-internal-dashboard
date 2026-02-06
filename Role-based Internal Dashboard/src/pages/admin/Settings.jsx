import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../components/common/footer";
import { useUI } from "../../context/UIContext";
const STORAGE_KEY = "app_settings_v1";

const defaultSettings = {
  siteName: "Internal Admin Tool",
  supportEmail: "support@company.com",
  timezone: "pst",
  maintenanceMode: false,
  security: {
    passwordMinLength: 8,
    require2FA: false,
  },
  notifications: {
    emailOnLogin: true,
    emailOnAlerts: true,
  },
  apiKeys: [
    // example key format
    // { id: 'k_1', name: 'Default key', key: 'sk_xxx', createdAt: '...' }
  ],
};

const generatePseudoKey = () =>
  // a short pseudo-key for mock usage
  "sk_" + Math.random().toString(36).slice(2, 12);

const isValidEmail = (email) =>
  // simple regex for UI validation
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Settings = () => {
  const { showToast } = useUI();
  const [loading, setLoading] = useState(true);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [working, setWorking] = useState(null); // current editing copy
  const [activeTab, setActiveTab] = useState("General");
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);


  // Load settings from localStorage (simulate network)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSavedSettings((s) => ({ ...s, ...parsed }));
          setWorking((s) => ({ ...s, ...parsed }));
        } else {
          setSavedSettings(defaultSettings);
          setWorking(defaultSettings);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        }
      } catch (e) {
        setSavedSettings(defaultSettings);
        setWorking(defaultSettings);
      } finally {
        setLoading(false);
      }
    }, 800); // tiny simulated delay
    return () => clearTimeout(t);
  }, []);

  // Derived: is the form dirty compared to saved
  const isDirty = useMemo(() => {
    return JSON.stringify(working) !== JSON.stringify(savedSettings);
  }, [working, savedSettings]);

  const showFeedback = (type, message, options = {}) => {
    showToast({
      message,
      icon: type === "success" ? "check_circle" : type === "error" ? "error" : "info",
      type,
      duration: options.duration || 3000,
      action: options.action,
    });
  };

  // Save handler
  const handleSave = () => {
    if (!working) return;
    // basic validations
    if (!working.siteName || working.siteName.trim() === "") {
      showFeedback("error", "Site name is required.");
      return;
    }
    // if (!isValidEmail(working.supportEmail)) {
    //   showFeedback("error", "Support email is invalid.");
    //   return;
    // }
    setSaving(true);
    // simulate network save
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(working));
        setSavedSettings(working);
        showFeedback("success", "Settings saved.");
      } catch (e) {
        showFeedback("error", "Failed to save settings.");
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  // Discard handler - revert working copy to savedSettings
  const handleDiscard = () => {
    setWorking(JSON.parse(JSON.stringify(savedSettings)));
    showFeedback("success", "Changes discarded.", { duration: 1200 });
  };

  // maintenance toggle
  const toggleMaintenance = () => {
    setWorking((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  // API Keys management
  const addApiKey = (name = "New key") => {
    const newKey = {
      id: "k_" + Date.now(),
      name,
      key: generatePseudoKey(),
      createdAt: new Date().toISOString(),
    };
    setWorking((prev) => ({ ...prev, apiKeys: [newKey, ...(prev.apiKeys || [])] }));
    showFeedback("success", "API key generated.");
  };

  const revokeApiKey = (id) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    setWorking((prev) => ({ ...prev, apiKeys: (prev.apiKeys || []).filter((k) => k.id !== id) }));
    showFeedback("success", "API key revoked.");
  };

  // Security toggles
  const updatePasswordMinLength = (n) => {
    setWorking((prev) => ({ ...prev, security: { ...prev.security, passwordMinLength: n } }));
  };

  const toggleRequire2FA = () => {
    setWorking((prev) => ({ ...prev, security: { ...prev.security, require2FA: !prev.security.require2FA } }));
  };

  // Notifications toggles
  const toggleNotification = (key) => {
    setWorking((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));
  };

  // Loading UI (user-specified)
  if (loading || !working) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 animate-pulse">Loading users...</p>
      </div>
    );
  }

  const handleResetToDefault = () => {
    setShowResetModal(true);
  };

  const handleResetDefaults = () => {
    setWorking(JSON.parse(JSON.stringify(defaultSettings)));
    showFeedback("success", "Settings reset to defaults.");
  };

  // compute toggle classes for the maintenance switch
  const maintenanceOn = Boolean(working.maintenanceMode);
  const toggleBgClass = maintenanceOn ? "bg-primary" : "bg-slate-200 dark:bg-slate-700";
  const knobTranslate = maintenanceOn ? "translate-x-5" : "translate-x-0";

  // Tab link class helper
  const tabClass = (tab) =>
    tab === activeTab
      ? "border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm flex items-center gap-2"
      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2";

  return (
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2  flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage global configurations, security policies, and API integrations.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("General"); }} className={tabClass("General")}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
            General
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("Security"); }} className={tabClass("Security")}>
            <span className="material-symbols-outlined text-[20px]">security</span>
            Security
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("Notifications"); }} className={tabClass("Notifications")}>
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            Notifications
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("API Keys"); }} className={tabClass("API Keys")}>
            <span className="material-symbols-outlined text-[20px]">key</span>
            API Keys
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* General Information Form */}
        {activeTab === "General" && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Basic identification and localization settings for the internal tool.</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); }}>
                {/* Site Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="site-name">
                      Site Name
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      The name used across the platform and email headers.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary sm:text-sm py-2.5 pl-3 pr-10"
                      id="site-name"
                      name="site-name"
                      type="text"
                      value={working.siteName}
                      onChange={(e) => setWorking((w) => ({ ...w, siteName: e.target.value }))}
                    />
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Support Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="support-email">
                      Support Email
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Email address where users can send inquiries.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary sm:text-sm py-2.5 pl-3 pr-10"
                      id="support-email"
                      name="support-email"
                      type="email"
                      value={working.supportEmail}
                      onChange={(e) => setWorking((w) => ({ ...w, supportEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Timezone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="timezone">
                      Timezone
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Default timezone for displaying logs and timestamps.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="relative">
                      <select
                        className="appearance-none block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary sm:text-sm py-2.5 pl-3 pr-10"
                        id="timezone"
                        name="timezone"
                        value={working.timezone}
                        onChange={(e) => setWorking((w) => ({ ...w, timezone: e.target.value }))}
                      >
                        <option value="utc">UTC (Coordinated Universal Time)</option>
                        <option value="pst">PST (Pacific Standard Time)</option>
                        <option value="est">EST (Eastern Standard Time)</option>
                        <option value="cet">CET (Central European Time)</option>
                        <option value="ist">IST (India Standard Time)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Form Actions removed (global actions below) */}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "Security" && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure password policy and 2FA requirements.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password minimum length</label>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Minimum allowed characters for new passwords.</p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  min={6}
                  value={working.security.passwordMinLength}
                  onChange={(e) => updatePasswordMinLength(Math.max(6, Number(e.target.value || 6)))}
                  className="w-32 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary sm:text-sm py-2.5 pl-3 pr-10"
                />
              </div>
            </div>

            <hr className="my-4 border-slate-100 dark:border-slate-800" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Require 2FA for admins</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Require two-factor authentication for admin accounts.</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={toggleRequire2FA}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${working.security.require2FA ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                  role="switch"
                  aria-checked={working.security.require2FA}
                >
                  <span className={`translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${working.security.require2FA ? "translate-x-5" : "translate-x-0"}`}></span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "Notifications" && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Control system notification preferences.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Email on login</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Notify admins when a new login occurs.</p>
                </div>
                <div>
                  <button
                    onClick={() => toggleNotification("emailOnLogin")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${working.notifications.emailOnLogin ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                    role="switch"
                    aria-checked={working.notifications.emailOnLogin}
                  >
                    <span className={`translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${working.notifications.emailOnLogin ? "translate-x-5" : "translate-x-0"}`}></span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Email on alerts</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Send notification emails for critical alerts.</p>
                </div>
                <div>
                  <button
                    onClick={() => toggleNotification("emailOnAlerts")}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${working.notifications.emailOnAlerts ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                    role="switch"
                    aria-checked={working.notifications.emailOnAlerts}
                  >
                    <span className={`translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${working.notifications.emailOnAlerts ? "translate-x-5" : "translate-x-0"}`}></span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === "API Keys" && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Keys</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage API keys used by integrations and scripts.</p>
              </div>
              <div>
                <button
                  onClick={() => addApiKey(`Key ${((working.apiKeys || []).length + 1)}`)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
                  Generate Key
                </button>
              </div>
            </div>

            <div className="mt-4">
              {(working.apiKeys || []).length === 0 ? (
                <div className="text-sm text-slate-500">No API keys found.</div>
              ) : (
                <div className="space-y-3">
                  {working.apiKeys.map((k) => (
                    <div key={k.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{k.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{k.key}</div>
                        <div className="text-xs text-slate-400">{new Date(k.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { navigator.clipboard?.writeText(k.key); showFeedback("success", "Key copied to clipboard."); }} className="px-3 py-1 rounded border text-sm">Copy</button>
                        <button onClick={() => revokeApiKey(k.id)} className="px-3 py-1 rounded border text-sm text-red-600">Revoke</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Actions */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="text-sm font-semibold text-rose-500 dark:text-rose-500 hover:text-rose-700 dark:hover:text-red-300 transition-colors cursor-pointer"
          >
            Reset to Default
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 cursor-pointer py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${(!isDirty || saving) ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark cursor-pointer"}`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>


        {/* RESET CONFIRMATION MODAL */}
        {showResetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div
              className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mb-4">
                  <span className="material-symbols-outlined text-3xl">warning</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reset Settings?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  This will restore all settings to their default values. You can still cancel now.
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleResetDefaults();
                    setShowResetModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition-all active:scale-95 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Mode Card (appears below tabs area as in original) */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Maintenance Mode</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Put the system into maintenance mode to prevent non-admin access.
              </p>
            </div>
            <div className="flex items-center">
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={toggleMaintenance}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${toggleBgClass}`}
                role="switch"
                aria-checked={maintenanceOn}
              >
                <span className={`sr-only`}>Toggle maintenance mode</span>
                <span
                  aria-hidden="true"
                  className={`${knobTranslate} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                ></span>
              </button>
            </div>
          </div>
        </div>


      </div>
      <Footer />
    </div>
  );
};

export default Settings;
