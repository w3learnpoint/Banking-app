import express from "express";
import { createPermission, createRole, assignRole } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const isAdminOrSuperAdmin = (req, res, next) => {
    const type = req.user?.role?.roleType;
    if (type === "admin" || type === "superadmin") return next();
    return res.status(403).json({ error: "Admin access required" });
};

router.post("/permissions", authenticateToken, isAdminOrSuperAdmin, createPermission);
router.post("/roles", authenticateToken, isAdminOrSuperAdmin, createRole);
router.post("/assign-role", authenticateToken, isAdminOrSuperAdmin, assignRole);

export default router;
