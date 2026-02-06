export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

export const sidebarConfig = {
  [USER_ROLES.ADMIN]: [
    { label: "Dashboard", icon: "dashboard", path: "dashboard" },
    { label: "User Management", icon: "group", path: "users" },
    { label: "Roles & Permissions", icon: "verified_user", path: "roles" },
    { label: "Audit Logs", icon: "receipt_long", path: "audit-logs" },
    { label: "Settings", icon: "settings", path: "settings" },
  ],

  [USER_ROLES.MANAGER]: [
    { label: "Dashboard", icon: "dashboard", path: "dashboard" },
    { label: "Employee Management", icon: "group", path: "employees" },
    { label: "Task Assigned", icon: "task", path: "tasks" },
    { label: "Reports", icon: "bar_chart", path: "reports" },
    { label: "Settings", icon: "settings", path: "settings" },
  ],

  [USER_ROLES.EMPLOYEE]: [
    { label: "Dashboard", icon: "dashboard", path: "dashboard" },
    { label: "My Tasks", icon: "check_circle", path: "my-tasks" },
    { label: "Company Directory", icon: "apartment", path: "directory" },
    { label: "Support", icon: "support_agent", path: "support" },
    { label: "Settings", icon: "settings", path: "settings" },
  ],
};
