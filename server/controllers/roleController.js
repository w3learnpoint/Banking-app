import Role from '../models/Role.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { format } from 'fast-csv';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate("permissions");
        return successResponse(res, 200, "Roles fetched", roles);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch roles", err.message);
    }
};

export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId).populate("permissions");
        if (!role) return notFoundResponse(res, 404, "Role not found");
        return successResponse(res, 200, "Role fetched", role);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch role", err.message);
    }
};

export const createRole = async (req, res) => {
    try {
        const { name, roleType, permissions, status } = req.body;
        const role = await Role.create({ name, roleType, permissions, status });
        return successResponse(res, 201, "Role created", role);
    } catch (err) {
        return errorResponse(res, 500, "Failed to create role", err.message);
    }
};

export const updateRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { name, roleType, permissions, status } = req.body;
        const role = await Role.findByIdAndUpdate(
            roleId,
            { name, roleType, permissions, status },
            { new: true }
        );
        if (!role) return notFoundResponse(res, 404, 'Role not found');
        return successResponse(res, 200, 'Role updated', role);
    } catch (err) {
        return errorResponse(res, 500, "Failed to update role", err.message);
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await Role.findByIdAndDelete(roleId);
        if (!role) return notFoundResponse(res, 404, 'Role not found');
        return successResponse(res, 200, 'Role deleted', role);
    } catch (err) {
        return errorResponse(res, 500, 'Failed to delete role', err.message);
    }
};

export const exportRolesCsv = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="roles.csv"');

        const cursor = Role.find({})
            .populate('permissions') // populate permission names
            .cursor();

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        for await (const role of cursor) {
            csvStream.write({
                Name: role.name,
                RoleType: role.roleType,
                Status: role.status ? 'Active' : 'Inactive',
                PermissionCount: role.permissions.length,
                // Uncomment below line to include permission names
                Permissions: role.permissions.map(p => p.name).join(', ')
            });
        }

        csvStream.end();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to export roles.' });
    }
};
