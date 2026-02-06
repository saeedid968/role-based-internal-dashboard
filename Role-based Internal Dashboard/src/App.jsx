import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { USER_ROLES } from "./utils/roles";
import UserManagement from "./pages/admin/UserManagement";
import RolesAndPermissions from "./pages/admin/RolePermissions";
import AuditLogs from "./pages/admin/AuditLogs";
import Settings from "./pages/admin/Settings";
import Profile from "./components/common/Profile";
import EmployeeManagement from "./pages/manager/EmployeeManagement";
import TasksDashboard from "./pages/manager/TaskAssigned";
import PerformanceReports from "./pages/manager/Reports";
import DepartmentSettings from "./pages/manager/Settings";
import MyTasksDashboard from "./pages/employee/MyTasks";
import CompanyDirectory from "./pages/employee/CompanyDirectory";
import SupportCenter from "./pages/employee/Support";
import WorkspaceSettings from "./pages/employee/Settings";
import PublicRoute from "./routes/PublicRoute";
import AppToast from "./components/ui/AppToast";


export default function App() {

  return (
    <BrowserRouter>
      <AppToast />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RolesAndPermissions />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* MANAGER */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.MANAGER]}>
              <DashboardLayout />
            </ProtectedRoute>}>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="tasks" element={<TasksDashboard />} />
          <Route path="reports" element={<PerformanceReports />} />
          <Route path="settings" element={<DepartmentSettings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
              <DashboardLayout />
            </ProtectedRoute>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="my-tasks" element={<MyTasksDashboard />} />
          <Route path="directory" element={<CompanyDirectory />} />
          <Route path="support" element={<SupportCenter />} />
          <Route path="settings" element={<WorkspaceSettings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
