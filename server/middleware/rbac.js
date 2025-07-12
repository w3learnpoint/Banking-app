import { forbiddenResponse } from "../utils/response.js";
import Permission from "../models/Permission.js";

const normalizePath = (base, path) => {
    const full = `${base}${path}`;
    return full.replace(/\/+$/, ""); // remove trailing slash
};

export const authorize = (requiredPermissions = []) => {
    return (req, res, next) => {
        const role = req.user?.role;

        if (!role) {
            return forbiddenResponse(res, 403, "User role not found");
        }

        // ✅ SuperAdmin has unrestricted access
        if (role.roleType === "superadmin") return next();

        const userPermissions = role.permissions || [];

        // 🔍 Construct full method:path for permission check
        const requestMethod = req.method.toUpperCase();
        const basePath = req.baseUrl.replace("/api", ""); // strip /api prefix
        const routePath = req.route?.path || "";

        const normalizedPath = normalizePath(basePath, routePath); // e.g., /users/:userId
        const fullPermission = `${requestMethod}:${normalizedPath}`;

        const userPermStrings = userPermissions.map(p =>
            typeof p === "string" ? p : `${p.method}:${p.route}`
        );

        // 🔐 If no specific permissions required, fallback to route-based match
        if (!requiredPermissions.length) {
            if (!userPermStrings.includes(fullPermission)) {
                return forbiddenResponse(res, 403, "You do not have permission to access this resource");
            }
            return next();
        }

        const isAllowed = requiredPermissions.every(p => userPermStrings.includes(p));
        if (!isAllowed) {
            return forbiddenResponse(res, 403, "You do not have permission to perform this action");
        }

        next();
    };
};



/**
 * Middleware to auto-register route + method as a permission if not present in DB
 */
export const autoRegisterPermission = async (req, res, next) => {
    try {
        const method = req.method.toUpperCase();

        let route = req.baseUrl + (req.route?.path || '');

        // ✅ Normalize route:
        route = route.replace(/^\/api/, '');
        route = route.replace(/\/+$/, '');
        route = route.replace(/\/{2,}/g, '/');

        const exists = await Permission.findOne({ method, route });
        if (!exists) {
            await Permission.create({
                name: `${method}:${route}`,
                method,
                route
            });
            console.log(`✅ Permission auto-created: ${method}:${route}`);
        }

        next();
    } catch (err) {
        console.error('❌ Failed to auto-register permission:', err.message);
        next(); // Allow request to proceed
    }
};

