// Mock Profile Data for each role
export const MOCK_PROFILES = {
  admin: {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@company.com",
    jobTitle: "System Administrator",
    department: "IT Operations",
    avatar: "https://i.pravatar.cc/300?img=47",
    role: "admin"
  },
  manager: {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    jobTitle: "Engineering Manager",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/300?img=12",
    role: "manager"
  },
  employee: {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    jobTitle: "Senior Developer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/300?img=33",
    role: "employee"
  }
};




export const USERS_DATA = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@company.com", role: "Admin", status: "Active", lastLogin: "Just now", img: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Michael Chen", email: "m.chen@company.com", role: "Manager", status: "Active", lastLogin: "2 hours ago", img: "https://i.pravatar.cc/150?u=michael" },
  { id: 3, name: "David Smith", email: "david.smith@company.com", role: "Employee", status: "Inactive", lastLogin: "3 weeks ago", img: null }, // DS initial
  { id: 4, name: "Emily Davis", email: "emily.d@company.com", role: "Employee", status: "Active", lastLogin: "Yesterday", img: "https://i.pravatar.cc/150?u=emily" },
  { id: 5, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 6, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 7, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 8, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 9, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 10, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 11, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 12, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 13, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 14, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 15, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 16, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 17, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 18, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 19, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 20, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 21, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 22, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 23, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 24, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 25, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
  { id: 26, name: "James Wilson", email: "james.w@company.com", role: "Manager", status: "Active", lastLogin: "5 hours ago", img: "https://i.pravatar.cc/150?u=james" },
];


export const dashboardData = {
  systemEvents: [
    { id: 1, type: 'sync', title: 'Database Backup', desc: 'Automated weekly backup completed successfully.', time: '10 minutes ago', color: 'blue' },
    { id: 2, type: 'person_add', title: 'New Manager Onboarded', desc: "Michael Chen's account permissions updated.", time: '2 hours ago', color: 'purple' },
    { id: 3, type: 'security', title: 'Login Attempt Blocked', desc: 'Suspicious IP address blocked by firewall.', time: '5 hours ago', color: 'amber' },
    { id: 4, type: 'update', title: 'System Patch', desc: 'V1.2.4 deployed to production.', time: 'Yesterday', color: 'green' }
  ],
  servers: [
    { id: 'US-EAST-01', status: 'Healthy', cpu: 45, uptime: '124 Days', region: 'North Virginia' },
    { id: 'EU-CENT-02', status: 'Healthy', cpu: 28, uptime: '18 Days', region: 'Frankfurt' },
    { id: 'AP-SOUT-01', status: 'Warning', cpu: 89, uptime: '32 Days', region: 'Mumbai' },
    { id: 'US-WEST-04', status: 'Healthy', cpu: 12, uptime: '240 Days', region: 'Oregon' }
  ]
};

export const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access and management of all resources.',
    userCount: 5,
    permissions: ['Read', 'Write', 'Delete', 'Export', 'Manage Roles']
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Can view reports and manage department employees.',
    userCount: 12,
    permissions: ['Read', 'Write', 'Export']
  },
  {
    id: 3,
    name: 'Editor',
    description: 'Can create and edit content but cannot delete.',
    userCount: 8,
    permissions: ['Read', 'Write']
  }
];

export const availablePermissions = ['Read', 'Write', 'Delete', 'Export', 'Manage Roles', 'Audit Logs'];

export const AUDIT_LOGS = [
  {
    id: 'evt_0001',
    timestamp: '2023-10-24T14:23:45Z',
    user: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@company.com',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    action: {
      label: 'Permission Changed',
      type: 'PERMISSION_CHANGE',
      icon: 'security',
      color: 'purple'
    },
    ip: '192.168.1.104',
    status: 'Success',
    severity: 'Medium',
    details: 'Admin permissions updated: +roles.write'
  },

  {
    id: 'evt_0002',
    timestamp: '2023-10-24T13:10:02Z',
    user: {
      name: 'Michael Chen',
      email: 'm.chen@company.com',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    action: {
      label: 'User Created',
      type: 'USER_CREATED',
      icon: 'person_add',
      color: 'blue'
    },
    ip: '10.0.4.52',
    status: 'Success',
    severity: 'Low',
    details: 'Created user account: emily.d@company.com'
  },

  {
    id: 'evt_0003',
    timestamp: '2023-10-24T12:45:12Z',
    user: {
      name: 'Unknown',
      email: null,
      avatar: null
    },
    action: {
      label: 'Failed Login Attempt',
      type: 'LOGIN_FAILED',
      icon: 'login',
      color: 'red'
    },
    ip: '45.23.1.254',
    status: 'Failed',
    severity: 'High',
    details: 'Invalid credentials (5 attempts)'
  },

  {
    id: 'evt_0004',
    timestamp: '2023-10-23T09:12:33Z',
    user: {
      name: 'Emily Davis',
      email: 'emily.d@company.com',
      avatar: 'https://i.pravatar.cc/150?u=emily'
    },
    action: {
      label: 'Settings Updated',
      type: 'SETTINGS_UPDATED',
      icon: 'settings_applications',
      color: 'amber'
    },
    ip: '192.168.1.15',
    status: 'Success',
    severity: 'Medium',
    details: 'Updated global timezone setting'
  },

  {
    id: 'evt_0005',
    timestamp: '2023-10-23T08:05:11Z',
    user: {
      name: 'James Wilson',
      email: 'james.w@company.com',
      avatar: 'https://i.pravatar.cc/150?u=james'
    },
    action: {
      label: 'Account Terminated',
      type: 'ACCOUNT_DELETED',
      icon: 'delete_forever',
      color: 'red'
    },
    ip: '172.16.254.1',
    status: 'Warning',
    severity: 'Critical',
    details: 'User account terminated by admin'
  },
  {
    id: 'evt_0006',
    timestamp: '2023-10-23T08:05:11Z',
    user: {
      name: 'James Wilson',
      email: 'james.w@company.com',
      avatar: 'https://i.pravatar.cc/150?u=james'
    },
    action: {
      label: 'Account Terminated',
      type: 'ACCOUNT_DELETED',
      icon: 'delete_forever',
      color: 'red'
    },
    ip: '172.16.254.1',
    status: 'Warning',
    severity: 'Critical',
    details: 'User account terminated by admin'
  },
  {
    id: 'evt_0007',
    timestamp: '2023-10-23T08:05:11Z',
    user: {
      name: 'James Wilson',
      email: 'james.w@company.com',
      avatar: 'https://i.pravatar.cc/150?u=james'
    },
    action: {
      label: 'Account Terminated',
      type: 'ACCOUNT_DELETED',
      icon: 'delete_forever',
      color: 'red'
    },
    ip: '172.16.254.1',
    status: 'Warning',
    severity: 'Critical',
    details: 'User account terminated by admin'
  },
];


export const AUDIT_ACTION_TYPES = [
  'USER_CREATED',
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'PERMISSION_CHANGE',
  'SETTINGS_UPDATED',
  'ACCOUNT_DELETED'
];

export const AUDIT_STATUSES = ['Success', 'Failed', 'Warning'];
export const AUDIT_SEVERITY = ['Low', 'Medium', 'High', 'Critical'];


























// MANAGERS SCREEN DATA 

export const MockEmployees = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Senior Developer",
    workload: 85,
    workloadColor: "bg-red-500",
    performance: 4.8,
    status: "Active",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jordan Smith",
    role: "UI Designer",
    workload: 40,
    workloadColor: "bg-amber-500",
    performance: 4.2,
    status: "Remote",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Casey Chen",
    role: "Product Manager",
    workload: 95,
    workloadColor: "bg-red-500",
    performance: 4.9,
    status: "Active",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 6,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 7,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 8,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 9,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 10,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 11,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 12,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 13,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 14,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 15,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 16,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 17,
    name: "Taylor Morgan",
    role: "Junior Developer",
    workload: 60,
    workloadColor: "bg-primary",
    performance: 3.5,
    status: "On Leave",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    image: "https://i.pravatar.cc/150?img=4",
  },

];


export const assignedTasks = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Frontend Engineer",
    image: "https://i.pravatar.cc/150?img=11",
    priority: "High",
    priorityColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    deadline: "Oct 24, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "Design System Documentation",
      department: "Product Team"
    }
  },
  {
    id: 2,
    name: "Bilal Ahmed",
    role: "Backend Engineer",
    image: "https://i.pravatar.cc/150?img=12",
    priority: "High",
    priorityColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    deadline: "Nov 15, 2024",
    status: "Pending",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    task: {
      title: "API Performance Optimization",
      department: "Engineering"
    }
  },
  {
    id: 3,
    name: "Sara Ali",
    role: "Product Manager",
    image: "https://i.pravatar.cc/150?img=13",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Dec 01, 2024",
    status: "Completed",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    task: {
      title: "Customer Feedback Synthesis",
      department: "Support Ops"
    }
  },
  {
    id: 4,
    name: "Hamza Mir",
    role: "QA Engineer",
    image: "https://i.pravatar.cc/150?img=14",
    priority: "Low",
    priorityColor: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    deadline: "Jan 10, 2025",
    status: "Pending",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    task: {
      title: "Automated Testing Framework",
      department: "QA Department"
    }
  },
  {
    id: 5,
    name: "Fawad Iqbal",
    role: "DevOps Engineer",
    image: "https://i.pravatar.cc/150?img=15",
    priority: "High",
    priorityColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    deadline: "Oct 30, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "AWS Infrastructure Migration",
      department: "DevOps"
    }
  },
  {
    id: 6,
    name: "Nadia Rehman",
    role: "UI/UX Designer",
    image: "https://i.pravatar.cc/150?img=16",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Nov 20, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "Mobile App Redesign",
      department: "Design Team"
    }
  },
  {
    id: 7,
    name: "Usman Sheikh",
    role: "Fullstack Engineer",
    image: "https://i.pravatar.cc/150?img=17",
    priority: "High",
    priorityColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    deadline: "Nov 05, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "User Dashboard Revamp",
      department: "Engineering"
    }
  },
  {
    id: 8,
    name: "Maryam Nawaz",
    role: "Data Analyst",
    image: "https://i.pravatar.cc/150?img=18",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Dec 15, 2024",
    status: "Completed",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    task: {
      title: "Q4 Quarterly Financial Audit",
      department: "Finance Department"
    }
  },
  {
    id: 9,
    name: "Atif Raza",
    role: "Support Engineer",
    image: "https://i.pravatar.cc/150?img=19",
    priority: "Low",
    priorityColor: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    deadline: "Jan 20, 2025",
    status: "Pending",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    task: {
      title: "Support Ticket Automation",
      department: "Support Ops"
    }
  },
  {
    id: 10,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Low",
    priorityColor: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    deadline: "Dec 31, 2024",
    status: "Completed",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    task: {
      title: "API Documentation Update",
      department: "Documentation"
    }
  },
  {
    id: 11,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Nov 12, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "Developer Guide Creation",
      department: "Documentation"
    }
  },
  {
    id: 12,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Low",
    priorityColor: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    deadline: "Jan 05, 2025",
    status: "Pending",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    task: {
      title: "Knowledge Base Expansion",
      department: "Documentation"
    }
  },
  {
    id: 13,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Nov 28, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "User Manual Revision",
      department: "Documentation"
    }
  },
  {
    id: 14,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "High",
    priorityColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    deadline: "Nov 08, 2024",
    status: "In Progress",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    task: {
      title: "Training Material Development",
      department: "Documentation"
    }
  },
  {
    id: 15,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Low",
    priorityColor: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    deadline: "Dec 20, 2024",
    status: "Completed",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    task: {
      title: "Release Notes Writing",
      department: "Documentation"
    }
  },
  {
    id: 16,
    name: "Hira Qureshi",
    role: "Technical Writer",
    image: "https://i.pravatar.cc/150?img=20",
    priority: "Medium",
    priorityColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    deadline: "Jan 15, 2025",
    status: "Pending",
    statusColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    task: {
      title: "Internal Wiki Organization",
      department: "Documentation"
    }
  }
];





// EMPLOYEE DATA 

// src/data/MockData.js
export const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "Senior Frontend Developer",
    department: "Engineering",
    avatar: "AJ",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "active",
    lastActive: "2 minutes ago",
    tasksDueToday: 5,
    activeProjects: 8,
    hoursLogged: 32,
    joinDate: "2022-03-15",
    performanceScore: 92,
    location: "New York",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@company.com",
    role: "Product Manager",
    department: "Product",
    avatar: "SW",
    profilePicture: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "in_meeting",
    lastActive: "15 minutes ago",
    tasksDueToday: 3,
    activeProjects: 6,
    hoursLogged: 28,
    joinDate: "2021-08-10",
    performanceScore: 88,
    location: "Remote",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "UX Designer",
    department: "Design",
    avatar: "MC", // Avatar only
    status: "active",
    lastActive: "Just now",
    tasksDueToday: 7,
    activeProjects: 4,
    hoursLogged: 40,
    joinDate: "2023-01-20",
    performanceScore: 95,
    location: "San Francisco",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    role: "Backend Developer",
    department: "Engineering",
    avatar: "PS",
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "offline",
    lastActive: "1 hour ago",
    tasksDueToday: 2,
    activeProjects: 5,
    hoursLogged: 36,
    joinDate: "2022-11-05",
    performanceScore: 85,
    location: "Bangalore",
  },
  {
    id: 5,
    name: "David Miller",
    email: "david.m@company.com",
    role: "DevOps Engineer",
    department: "Engineering",
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "active",
    lastActive: "5 minutes ago",
    tasksDueToday: 4,
    activeProjects: 7,
    hoursLogged: 35,
    joinDate: "2021-05-30",
    performanceScore: 90,
    location: "London",
  },
  {
    id: 6,
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    role: "QA Engineer",
    department: "Engineering",
    avatar: "EW",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "active",
    lastActive: "10 minutes ago",
    tasksDueToday: 6,
    activeProjects: 3,
    hoursLogged: 38,
    joinDate: "2023-03-12",
    performanceScore: 87,
    location: "Chicago",
  },
  {
    id: 7,
    name: "Robert Garcia",
    email: "robert.g@company.com",
    role: "Team Lead",
    department: "Engineering",
    avatar: "RG",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "busy",
    lastActive: "In a call",
    tasksDueToday: 8,
    activeProjects: 9,
    hoursLogged: 42,
    joinDate: "2020-09-15",
    performanceScore: 94,
    location: "Miami",
  },
  {
    id: 8,
    name: "Lisa Tanaka",
    email: "lisa.tanaka@company.com",
    role: "Marketing Manager",
    department: "Marketing",
    avatar: "LT", // Avatar only
    status: "active",
    lastActive: "Just now",
    tasksDueToday: 5,
    activeProjects: 6,
    hoursLogged: 30,
    joinDate: "2022-06-22",
    performanceScore: 89,
    location: "Tokyo",
  },
  {
    id: 9,
    name: "James Wilson",
    email: "james.w@company.com",
    role: "Data Analyst",
    department: "Analytics",
    avatar: "JW",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "offline",
    lastActive: "3 hours ago",
    tasksDueToday: 3,
    activeProjects: 5,
    hoursLogged: 34,
    joinDate: "2023-02-10",
    performanceScore: 86,
    location: "Remote",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    email: "sophia.m@company.com",
    role: "HR Business Partner",
    department: "Human Resources",
    avatar: "SM",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "active",
    lastActive: "Just now",
    tasksDueToday: 4,
    activeProjects: 7,
    hoursLogged: 29,
    joinDate: "2021-11-30",
    performanceScore: 91,
    location: "Austin",
  },
  {
    id: 11,
    name: "Kevin O'Brien",
    email: "kevin.ob@company.com",
    role: "Sales Director",
    department: "Sales",
    avatar: "KO",
    profilePicture: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    status: "active",
    lastActive: "2 minutes ago",
    tasksDueToday: 9,
    activeProjects: 8,
    hoursLogged: 45,
    joinDate: "2019-07-18",
    performanceScore: 96,
    location: "Boston",
  },
  {
    id: 12,
    name: "Maria Rodriguez",
    email: "maria.r@company.com",
    role: "Finance Manager",
    department: "Finance",
    avatar: "MR", // Avatar only
    status: "in_meeting",
    lastActive: "25 minutes ago",
    tasksDueToday: 2,
    activeProjects: 4,
    hoursLogged: 31,
    joinDate: "2020-04-12",
    performanceScore: 93,
    location: "Madrid",
  },
];

export const notifications = [
  {
    id: 1,
    type: "comment",
    title: "Sarah commented on 'Project Helios'",
    description: '"Looks great, but can we check the accessibility contrast on the main header?"',
    time: "2 hours ago",
    read: false,
    icon: "description",
    color: "primary",
  },
  {
    id: 2,
    type: "approval",
    title: "Ticket #8421 Resolved",
    description: "Your request for local server access has been approved and completed.",
    time: "5 hours ago",
    read: false,
    icon: "check_circle",
    color: "emerald",
  },
  {
    id: 3,
    type: "alert",
    title: "Security Alert",
    description: "Mandatory password reset scheduled for this coming Saturday at 12:00 AM.",
    time: "Yesterday",
    read: true,
    icon: "warning",
    color: "amber",
  },
  {
    id: 4,
    type: "welcome",
    title: "New Member Joined!",
    description: "Please welcome Michael Scott to the Regional Sales team.",
    time: "2 days ago",
    read: true,
    icon: "celebration",
    color: "primary",
  },
  {
    id: 5,
    type: "update",
    title: "System Maintenance",
    description: "Scheduled maintenance this Friday from 10 PM to 2 AM.",
    time: "1 day ago",
    read: false,
    icon: "engineering",
    color: "blue",
  },
];

export const schedule = [
  {
    id: 1,
    time: "09:00",
    period: "AM",
    title: "Morning Sync: Design Team",
    description: "Reviewing final mockups for the new HR portal redesign.",
    type: "internal",
    borderColor: "",
  },
  {
    id: 2,
    time: "11:30",
    period: "AM",
    title: "Client Presentation: Global Logistics",
    description: "Presenting the initial research findings and user flow diagrams.",
    type: "meeting",
    borderColor: "border-emerald-500",
  },
  {
    id: 3,
    time: "02:00",
    period: "PM",
    title: "Deep Work: Component Library",
    description: "No interruptions. Working on the React component migration.",
    type: "focus",
    borderColor: "",
  },
  {
    id: 4,
    time: "04:30",
    period: "PM",
    title: "1-on-1 with Manager",
    description: "Weekly progress check and career development discussion.",
    type: "one-on-one",
    borderColor: "",
  },
  {
    id: 5,
    time: "06:00",
    period: "PM",
    title: "Team Retrospective",
    description: "Weekly sprint retrospective and planning for next week.",
    type: "team",
    borderColor: "border-purple-500",
  },
];

export const departmentStats = [
  { name: "Engineering", count: 45, color: "bg-blue-500" },
  { name: "Product", count: 12, color: "bg-emerald-500" },
  { name: "Design", count: 8, color: "bg-purple-500" },
  { name: "Marketing", count: 15, color: "bg-rose-500" },
  { name: "Sales", count: 22, color: "bg-amber-500" },
  { name: "HR", count: 7, color: "bg-cyan-500" },
];