import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");

    let user = {};

    try {
        user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        user = {};
    }

    // Check whether user is logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check whether user has the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/user/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;