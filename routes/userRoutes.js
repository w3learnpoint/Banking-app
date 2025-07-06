import express from "express";
import {
    getProfile,
    getAllUsers,
    getUserByEmail,
    deleteUser,
    createUser,
    updateUser,
    toggleUserStatus,
    getUserById,
    changePasswordUnified,
    exportUsersCsv
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/auth.js";
import { authorize, autoRegisterPermission } from "../middleware/rbac.js";

const router = express.Router();

// 🔐 Auth middleware for all routes
router.use(authenticateToken);

// ✅ Specific routes FIRST
router.get("/profile", autoRegisterPermission, authorize(), getProfile);
router.get("/id/:userId", autoRegisterPermission, authorize(), getUserById);
router.get("/export", autoRegisterPermission, authorize(), exportUsersCsv); // ✅ moved above :email
router.get("/email/:email", autoRegisterPermission, authorize(), getUserByEmail); // ✅ more explicit

// ✅ General user list
router.get("/", autoRegisterPermission, authorize(), getAllUsers);

// ❌ Mutating routes
router.post("/", autoRegisterPermission, authorize(), createUser);
router.put("/:userId", autoRegisterPermission, authorize(), updateUser);
router.delete("/:userId", autoRegisterPermission, authorize(), deleteUser);
router.patch("/:userId/status", autoRegisterPermission, authorize(), toggleUserStatus);

// Password management
router.patch("/change-password", autoRegisterPermission, authorize(), changePasswordUnified);
router.post("/:userId/change-password", autoRegisterPermission, authorize(), changePasswordUnified);

export default router;

