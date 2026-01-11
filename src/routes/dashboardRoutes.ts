import express from "express";
import { getLineChartData } from "../controllers/dashboardController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/line-chart", authenticateToken, getLineChartData);

export default router;
