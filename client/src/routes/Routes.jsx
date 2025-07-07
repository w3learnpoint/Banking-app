import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import { adminRoute } from "../utils/router";
import ResetPassword from "../pages/Password/ResetPassword";
import Profile from "../pages/Profile/Profile";
import UserList from "../pages/Users/UserList";
import RoleManagement from "../pages/Roles/Roles";
import PermissionManagement from "../pages/Permissions/PermissionManagement";
import Setting from "../pages/Settings/Settings";
import Pages from "../pages/Contents/Pages";
import EditPage from "../pages/Contents/EditPage";
import ViewPage from "../pages/Contents/ViewPage";
import EditUser from "../pages/Users/EditUser";
import CreateEditRole from "../pages/Roles/CreateEditRole";
import CreateEditPermission from "../pages/Permissions/CreateEditPermission";
import ViewPermissions from "../pages/Roles/ViewPermissions";
import ViewUser from "../pages/Users/ViewUser";
import ForgotPassword from "../pages/Password/ForgotPassword";
import NotFound from "../pages/NotFound";
import NotificationList from "../pages/Notifications/NotificationList";
import MessageList from "../pages/Messages/MessageList";
import Accounts from "../pages/Account/Accounts";
import EditAccount from "../pages/Account/EditAccount";
import ViewAccount from "../pages/Account/ViewAccount";
import ImportAccounts from "../pages/Account/ImportAccounts";

const AdminRoutes = () => {
    return (
        <Routes>
            {/* Redirect root path to dashboard */}
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Navigate to={adminRoute("/dashboard")} />} />
            <Route path={adminRoute("/login")} element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path={adminRoute("/reset-password")} element={<ResetPassword />} />
            <Route path={adminRoute("/forgot-password")} element={<ForgotPassword />} />
            {/* Protected Routes with Layout */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="*" element={<NotFound />} />

                <Route path="dashboard" element={<Dashboard />} />
                <Route path="user-profile" element={<Profile />} />

                <Route path="users" element={<UserList />} />
                <Route path="users/create" element={<EditUser />} />
                <Route path="users/edit/:id" element={<EditUser />} />
                <Route path="users/view/:id" element={<ViewUser />} />

                <Route path="roles" element={<RoleManagement />} />
                <Route path="roles/create" element={<CreateEditRole />} />
                <Route path="roles/edit/:id" element={<CreateEditRole />} />
                <Route path="roles/view/:id" element={<ViewPermissions />} />

                <Route path="permissions" element={<PermissionManagement />} />
                <Route path="permissions/create" element={<CreateEditPermission />} />

                <Route path="user-settings" element={<Setting />} />

                <Route path="pages" element={<Pages />} />
                <Route path="pages/create" element={<EditPage />} />
                <Route path="pages/edit/:slug" element={<EditPage />} />
                <Route path="pages/:slug" element={<ViewPage />} />
                <Route path="notifications" element={<NotificationList />} />
                <Route path="messages" element={<MessageList />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="account/create" element={<EditAccount />} />
                <Route path="account/edit/:id" element={<EditAccount />} />
                <Route path="account/view/:id" element={<ViewAccount />} />
                <Route path="account/import" element={<ImportAccounts />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
