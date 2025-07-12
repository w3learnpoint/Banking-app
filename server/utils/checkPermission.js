export const hasPermission = (user, req) => {
    if (!user?.role) return false;
    if (user.role.roleType === "superadmin") return true;

    const requiredPermission = `${req.method}:${req.route.path}`;
    const userPermissions = user.role.permissions?.map(p => p.toString()) || [];

    return userPermissions.includes(requiredPermission);
};
