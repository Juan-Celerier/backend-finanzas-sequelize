import express from "express";
import { getLineChartData } from "../controllers/dashboardController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/line-chart", authenticateToken, getLineChartData);

export default router;
