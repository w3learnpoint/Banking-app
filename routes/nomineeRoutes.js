// routes/nominee.js
import express from "express";
import {
    createNominee,
    updateNominee,
    getNomineesByUser,
    deleteNominee
} from "../controllers/nomineeController.js";
import { authorize, autoRegisterPermission } from "../middleware/rbac.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", autoRegisterPermission, authorize(), createNominee);
router.put("/:id", autoRegisterPermission, authorize(), updateNominee);
router.get("/:userId", autoRegisterPermission, authorize(), getNomineesByUser);
router.delete("/:id", autoRegisterPermission, authorize(), deleteNominee);

export default router;
