import express from "express";
import multer from "multer";
import {
    upsertLedger,
    getLedger,
    getAllLedgers,
    deleteLedger,
    importLedgerFromCSV,
} from "../controllers/ledgerController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upsertLedger);
router.get("/:ledgerId", getLedger);
router.get("/", getAllLedgers);
router.delete("/:ledgerId", deleteLedger);
router.post("/import", upload.single("file"), importLedgerFromCSV); // Optional CSV import

export default router;
