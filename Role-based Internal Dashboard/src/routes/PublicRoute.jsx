import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth_Context";
import { USER_ROLES } from "../utils/roles";

const roleRedirectMap = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.MANAGER]: "/manager/dashboard",
  [USER_ROLES.EMPLOYEE]: "/employee/dashboard",
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // If already logged in → NEVER allow login page
  if (user) {
    return <Navigate to={roleRedirectMap[user.role]} replace />;
  }

  return children;
};

export default PublicRoute;
