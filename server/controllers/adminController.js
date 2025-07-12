import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import {
    successResponse,
    errorResponse,
    badRequestResponse,
    notFoundResponse
} from "../utils/response.js";

// Validate required fields
const isEmpty = value => !value || value.trim() === "";

export const createPermission = async (req, res) => {
    try {
        const { name, method, route } = req.body;

        if (isEmpty(name) || isEmpty(method) || isEmpty(route)) {
            return badRequestResponse(res, 400, "All fields (name, method, route) are required");
        }

        const existing = await Permission.findOne({ method, route });
        if (existing) {
            return badRequestResponse(res, 400, "Permission already exists with same method and route");
        }

        const permission = await Permission.create({ name, method, route });
        return successResponse(res, 201, "Permission created successfully", permission);
    } catch (err) {
        return errorResponse(res, 500, "Failed to create permission", err.message);
    }
};

export const createRole = async (req, res) => {
    try {
        const { name, roleType = "custom", permissionIds = [] } = req.body;

        if (isEmpty(name)) {
            return badRequestResponse(res, 400, "Role name is required");
        }

        const allowedTypes = ["superadmin", "admin", "viewer", "custom"];
        if (!allowedTypes.includes(roleType)) {
            return badRequestResponse(res, 400, "Invalid role type");
        }

        const existing = await Role.findOne({ name });
        if (existing) {
            return badRequestResponse(res, 400, "Role with this name already exists");
        }

        const role = await Role.create({ name, roleType, permissions: permissionIds });
        return successResponse(res, 201, "Role created successfully", role);
    } catch (err) {
        return errorResponse(res, 500, "Failed to create role", err.message);
    }
};

export const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        if (isEmpty(userId) || isEmpty(roleId)) {
            return badRequestResponse(res, 400, "userId and roleId are required");
        }

        const roleExists = await Role.findById(roleId);
        if (!roleExists) {
            return notFoundResponse(res, 404, "Role not found");
        }

        const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true });
        if (!user) {
            return notFoundResponse(res, 404, "User not found");
        }

        return successResponse(res, 200, "Role assigned successfully", user);
    } catch (err) {
        return errorResponse(res, 500, "Failed to assign role", err.message);
    }
};
