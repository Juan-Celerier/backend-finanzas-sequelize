import express from "express";
import {
  createVenta,
  getVentas,
  updateVenta,
  deleteVenta,
} from "../controllers/ventasController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createVenta);
router.get("/", authenticateToken, getVentas);
router.put("/:id", authenticateToken, updateVenta);
router.delete("/:id", authenticateToken, deleteVenta);

export default router;
