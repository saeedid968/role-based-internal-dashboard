import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../components/common/footer";
import { useUI } from "../../context/UIContext";


const STORAGE_KEY = "app_roles_v1";
const AUDIT_KEY = "app_roles_audit_v1";

/* Simple mock users — replace with getUsers() integration if available */
const mockUsers = [
  { id: 1, name: "Alice Johnson", role: "Admin" },
  { id: 2, name: "Bob Smith", role: "Manager" },
  { id: 3, name: "Cathy Li", role: "Editor" },
  { id: 4, name: "Dave Patel", role: "Viewer" },
  { id: 5, name: "Eva Gomez", role: "Editor" },
  { id: 6, name: "Frank Wood", role: "Manager" },
  { id: 7, name: "Grace Kim", role: "Viewer" },
  { id: 8, name: "Hiro Tanaka", role: "Viewer" },
  { id: 9, name: "Ivy Chen", role: "Editor" },
  { id: 10, name: "Jack Lee", role: "Viewer" },
  // ... add more if you want realistic counts
];

/* Initial roles + permissions */
const initialRoles = [
  {
    id: "role_admin",
    name: "Admin",
    description: "Full system access including user management and global configuration.",
    permissions: [
      "users.read",
      "users.write",
      "roles.read",
      "roles.write",
      "settings.manage",
      "reports.view",
    ],
  },
  {
    id: "role_manager",
    name: "Manager",
    description: "Can manage team members, view reports, and approve workflows.",
    permissions: ["users.read", "reports.view", "team.manage", "workflows.approve"],
  },
  {
    id: "role_editor",
    name: "Editor",
    description: "Can create and edit content, but cannot publish or delete significant assets.",
    permissions: ["content.create", "content.edit", "content.preview"],
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Read-only access across the dashboard. No permission to edit or create data.",
    permissions: ["content.read", "reports.view"],
  },
];

const ALL_PERMISSIONS = [
  "users.read",
  "users.write",
  "roles.read",
  "roles.write",
  "settings.manage",
  "reports.view",
  "team.manage",
  "workflows.approve",
  "content.create",
  "content.edit",
  "content.preview",
  "content.read",
];

const formatDateTime = (d = new Date()) => {
  return d.toLocaleString();
};

const RolesAndPermissions = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [audit, setAudit] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [editingRole, setEditingRole] = useState(null);
  const { showToast } = useUI();


  // --- Load from localStorage or seed ---
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedAudit = localStorage.getItem(AUDIT_KEY);
      if (stored) {
        try {
          setRoles(JSON.parse(stored));
        } catch {
          setRoles(initialRoles);
        }
      } else {
        setRoles(initialRoles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRoles));
      }
      if (storedAudit) {
        try {
          setAudit(JSON.parse(storedAudit));
        } catch {
          setAudit([]);
        }
      }
      setLoading(false);
    }, 800); // simulate network
    return () => clearTimeout(t);
  }, []);

  // Persist roles & audit
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
    }
  }, [roles, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(AUDIT_KEY, JSON.stringify(audit));
    }
  }, [audit, loading]);

  // --- Derived data ---
  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [roles, search]);

  const totalRoles = roles.length;

  const usersPerRole = useMemo(() => {
    const map = {};
    for (const u of mockUsers) {
      map[u.role] = (map[u.role] || 0) + 1;
    }
    // ensure every role has an entry
    for (const r of roles) {
      map[r.name] = map[r.name] || 0;
    }
    return map;
  }, [roles]);

  const distinctPermissions = useMemo(() => {
    const set = new Set();
    roles.forEach((r) => (r.permissions || []).forEach((p) => set.add(p)));
    return Array.from(set);
  }, [roles]);

  // Role Inheritance stat (simple heuristic): how many permissions each role inherits from Viewer
  const roleInheritanceStat = useMemo(() => {
    const viewer = roles.find((r) => r.name === "Viewer");
    if (!viewer) return { inheritedPercent: 0 };
    const viewerPerms = new Set(viewer.permissions || []);
    let total = 0;
    let inherited = 0;
    roles.forEach((r) => {
      const perms = r.permissions || [];
      total += perms.length;
      perms.forEach((p) => {
        if (viewerPerms.has(p)) inherited++;
      });
    });
    // avoid division by zero
    const percent = total === 0 ? 0 : Math.round((inherited / total) * 100);
    return { inheritedPercent: percent };
  }, [roles]);

  // --- Actions: Add / Edit / Delete / Save permissions ---
  const openAddModal = () => {
    setModalMode("add");
    setEditingRole({
      id: `role_${Date.now()}`,
      name: "",
      description: "",
      permissions: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setModalMode("edit");
    // deep copy to avoid accidental mutation
    setEditingRole(JSON.parse(JSON.stringify(role)));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
  };

  const saveRole = (roleToSave) => {
    if (!roleToSave.name || roleToSave.name.trim() === "") {
      alert("Role name is required");
      return;
    }

    if (modalMode === "add") {
      // ensure unique name
      if (roles.some((r) => r.name.toLowerCase() === roleToSave.name.toLowerCase())) {
        alert("A role with this name already exists.");
        return;
      }
      setRoles((prev) => {
        const next = [...prev, roleToSave];
        setAudit((a) => [
          { type: "create", role: roleToSave.name, at: formatDateTime() },
          ...a,
        ]);
        return next;
      });
    } else if (modalMode === "edit") {
      setRoles((prev) => {
        const next = prev.map((r) => (r.id === roleToSave.id ? roleToSave : r));
        setAudit((a) => [
          { type: "update", role: roleToSave.name, at: formatDateTime() },
          ...a,
        ]);
        return next;
      });
    }
    closeModal();
  };

  const deleteRole = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;
    if (
      !confirm(
        `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`
      )
    )
      return;
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setAudit((a) => [
      { type: "delete", role: role.name, at: formatDateTime() },
      ...a,
    ]);
    setModalOpen(false);
    showToast({
      message: "User role deleted",
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

  const togglePermissionInEditing = (perm) => {
    setEditingRole((prev) => {
      if (!prev) return prev;
      const has = prev.permissions.includes(perm);
      const nextPermissions = has
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: nextPermissions };
    });
  };

  // --- Loading UI (user provided) ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 animate-pulse">Loading users...</p>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2  flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Roles & Permissions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Define system access levels and configure granular permission sets for each role.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => {
              // Simple audit action
              const at = formatDateTime();
              setAudit((a) => [{ type: "audit", role: "Audit run", at }, ...a]);
              alert("Audit triggered (logged).");
            }}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">security</span>
            Audit
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            Add Role
          </button>
        </div>
      </div>

      {/* Info Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
        <InfoCard
          title="Active Permissions"
          description={`Total of ${distinctPermissions.length} distinct granular permissions mapped.`}
          color="green"
          icon="verified"
          onClick={() =>
            alert("Permissions:\n" + distinctPermissions.join("\n"))
          }
        />

        <InfoCard
          title="Recent Changes"
          description={
            audit.length === 0
              ? "No recent changes."
              : `${audit.length} recent change(s).`
          }
          color="amber"
          icon="history_edu"
          onClick={() => {
            if (audit.length === 0) return alert("No recent changes.");
            alert(
              audit
                .slice(0, 10)
                .map((a) => `${a.at} — ${a.type.toUpperCase()}: ${a.role}`)
                .join("\n")
            );
          }}
        />

        <InfoCard
          title="Role Inheritance"
          description={`Editors inherit ${roleInheritanceStat.inheritedPercent}% of Viewer permissions.`}
          color="blue"
          icon="info"
          onClick={() =>
            alert(`Inheritance: ${roleInheritanceStat.inheritedPercent}%`)
          }
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a202c]">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white py-2.5"
              placeholder="Search roles..."
              type="text"
            />
          </div>
        </div>

        {/* Table wrapper */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <table className="w-full cursor-default border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${role.name === "Admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {role.name === "Admin" ? "admin_panel_settings" : role.name === "Manager" ? "manage_accounts" : role.name === "Editor" ? "edit_note" : "visibility"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] md:max-w-xs xl:max-w-md truncate">
                      {role.description}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white font-medium">
                      {usersPerRole[role.name] || 0} <span className="text-slate-400 font-normal">users</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="inline-flex gap-2 items-center">
                      <button
                        onClick={() => openEditModal(role)}
                        className="text-primary cursor-pointer hover:text-blue-700 inline-flex items-center"
                      >
                        Manage <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
            Total: {totalRoles} Roles
          </p>
        </div>
      </div>

      {/* Modal: Add/Edit Role */}
      {modalOpen && editingRole && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black/40"
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f1724] rounded-xl shadow-lg p-6 z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {modalMode === "add" ? "Add Role" : `Edit Role: ${editingRole.name || ""}`}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {modalMode === "add" ? "Create a new role and assign permissions." : "Modify role properties and permissions."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Role name</label>
                <input
                  value={editingRole.name}
                  onChange={(e) => setEditingRole((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 pl-3 text-sm py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">Users count</label>
                <div className="mt-1 text-sm text-slate-700 dark:text-white font-medium">{usersPerRole[editingRole.name] || 0} users</div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-slate-500">Description</label>
                <textarea
                  value={editingRole.description}
                  onChange={(e) => setEditingRole((p) => ({ ...p, description: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 pl-3 text-sm py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Permissions</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-44 overflow-auto pr-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const checked = (editingRole.permissions || []).includes(perm);
                  return (
                    <label key={perm} className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermissionInEditing(perm)}
                        className="h-4 w-4 cursor-pointer "
                      />
                      <span className="truncate">{perm}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {modalMode === "edit" && (
                <button
                  onClick={() => deleteRole(editingRole.id)}
                  className="px-3 py-2 cursor-pointer rounded border text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 cursor-pointer rounded border bg-white dark:bg-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => saveRole(editingRole)}
                className="px-4 py-2 cursor-pointer rounded bg-primary text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

const InfoCard = ({ title, description, icon, color, onClick }) => {
  const colorMap = {
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
    purple: {
      border: "hover:border-purple-500/50",
      shadow: "hover:shadow-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`
        group relative bg-white dark:bg-slate-900 p-6 rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${style.shadow} ${style.border}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`
            p-2 rounded-lg transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
            ${style.bg} ${style.text}
          `}
        >
          <span className="material-symbols-outlined !text-xl">
            {icon}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {description}
      </p>

      {/* Action */}
      <button
        onClick={onClick}
        className="text-sm font-semibold cursor-pointer text-primary hover:text-blue-700 transition-colors"
      >
        View details →
      </button>
    </div>
  );
};


export default RolesAndPermissions;
