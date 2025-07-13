import express from 'express';
import { applyMonthlyInterest } from '../controllers/interestController.js';

const router = express.Router();

// Admin-only or scheduled
router.post('/apply-monthly-interest', applyMonthlyInterest);

export default router;