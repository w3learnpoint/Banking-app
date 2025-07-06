import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        return successResponse(res, 200, 'Permissions fetched', permissions);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to fetch permissions', err.message);
    }
};

export const createPermission = async (req, res) => {
    try {
        const { name, method, route } = req.body;
        const existing = await Permission.findOne({ method, route });
        if (existing) return conflictResponse(res, "Permission already exists");

        const permission = await Permission.create({ name, method, route, status: true });
        return successResponse(res, 201, 'Permission created', permission);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to create permission', err.message);
    }
};

export const getPermissionsByRole = async (req, res) => {
    try {
        const { role } = req.params;

        const roleDoc = await Role.findOne({ roleType: role }).populate('permissions');
        if (!roleDoc) return notFoundResponse(res, 'Role not found');

        return successResponse(res, 200, 'Permissions for role fetched', roleDoc.permissions);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to get role permissions', err.message);
    }
};

export const getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);
        if (!permission) return notFoundResponse(res, 'Permission not found');

        return successResponse(res, 200, 'Permission fetched', permission);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to fetch permission', err.message);
    }
};

export const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, method, route, status } = req.body;

        const existing = await Permission.findById(id);
        if (!existing) return notFoundResponse(res, 'Permission not found');

        // Optional: Check for conflicts
        const duplicate = await Permission.findOne({ method, route, _id: { $ne: id } });
        if (duplicate) return conflictResponse(res, 'Another permission with same method and route already exists');

        existing.name = name || existing.name;
        existing.method = method || existing.method;
        existing.route = route || existing.route;
        if (typeof status === 'boolean') {
            existing.status = status;
        }

        await existing.save();

        return successResponse(res, 200, 'Permission updated successfully', existing);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to update permission', err.message);
    }
};