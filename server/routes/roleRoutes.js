import express from "express";
import {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    exportRolesCsv // ✅ Make sure this is imported
} from "../controllers/roleController.js";

import { authenticateToken } from "../middleware/auth.js";
import { authorize, autoRegisterPermission } from "../middleware/rbac.js";

const router = express.Router();

// 🔐 Secure all role routes
router.use(authenticateToken);

// ✅ CSV Export route should be first to avoid conflict with :roleId
router.get('/export', autoRegisterPermission, authorize(), exportRolesCsv);

// ✅ Read (Viewer/Admin/SuperAdmin)
router.get("/", autoRegisterPermission, authorize(), getAllRoles);
router.get("/:roleId", autoRegisterPermission, authorize(), getRoleById);

// ❌ Create, Update, Delete (Only Admin/SuperAdmin)
router.post("/", autoRegisterPermission, authorize(), createRole);
router.put("/:roleId", autoRegisterPermission, authorize(), updateRole);
router.delete("/:roleId", autoRegisterPermission, authorize(), deleteRole);

export default router;
