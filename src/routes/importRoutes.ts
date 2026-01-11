import express from "express";
import { importJson } from "../controllers/importController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/import-json", authenticateToken, importJson);

export default router;
