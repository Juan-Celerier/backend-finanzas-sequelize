import express from "express";
import {
  getLineChartData,
  getDashboardSummary,
} from "../controllers/dashboardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/line-chart", authenticateToken, getLineChartData);
router.get("/summary", authenticateToken, getDashboardSummary);

export default router;
