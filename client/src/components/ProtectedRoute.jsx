import React from "react";
import { Navigate } from "react-router-dom";
import { adminRoute } from "../utils/router";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        return <Navigate to={adminRoute("/login")} replace />;
    }

    // Optional: Check role
    if (allowedRoles && !allowedRoles.includes(user?.role?.toLowerCase())) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
