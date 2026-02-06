import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth_Context";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, authLoading } = useAuth();

    // 🔄 Wait for auth to resolve
    if (authLoading) {
        return null; // or global loader
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
