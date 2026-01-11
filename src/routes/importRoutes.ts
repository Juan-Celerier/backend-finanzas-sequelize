import express from "express";
import { importJson } from "../controllers/importController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/import-json", authenticateToken, importJson);

export default router;
