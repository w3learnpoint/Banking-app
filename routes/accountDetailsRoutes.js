// routes/accountDetails.js
import express from "express";
import { upsertAccountDetails, getAccountDetails } from "../controllers/accountDetailsController.js";
import { authorize, autoRegisterPermission } from "../middleware/rbac.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.use(authenticateToken);

router.post("/", autoRegisterPermission, authorize(), upsertAccountDetails);
router.get("/:userId", autoRegisterPermission, authorize(), getAccountDetails);

export default router;
