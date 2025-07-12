import express from "express";
import {
    deleteAccount,
    generateAccountNumberAPI,
    getAccount,
    getAllAccounts,
    importAccountsFromCSV,
    upsertAccount
} from "../controllers/accountController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "verifierSignature", maxCount: 1 }
]), upsertAccount);                     // Create or update
router.get("/generate-account-number", generateAccountNumberAPI); // Generate account number
router.post("/import", upload.single("file"), importAccountsFromCSV); // CSV import
router.get("/", getAllAccounts);                     // Get all accounts
router.get("/:accId", getAccount);                   // Read
router.delete("/:accId", deleteAccount);             // Delete


export default router;
