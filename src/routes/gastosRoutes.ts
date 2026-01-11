import express from "express";
import {
  createGasto,
  getGastos,
  updateGasto,
  deleteGasto,
} from "../controllers/gastosController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createGasto);
router.get("/", authenticateToken, getGastos);
router.put("/:id", authenticateToken, updateGasto);
router.delete("/:id", authenticateToken, deleteGasto);

export default router;
