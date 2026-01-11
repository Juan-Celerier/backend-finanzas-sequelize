import { Request, Response } from "express";

import { Op } from "sequelize";
import { AuthRequest } from "../middlewares/authMiddleware";
import db from "../../models";
const { gastos: Gastos } = db;


const createGasto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fecha, categoria, monto, descripcion } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const gasto = await Gastos.create({
      fecha,
      categoria,
      monto,
      descripcion,
      user_id,
    });

    res.status(201).json(gasto);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const getGastos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period, start_date, end_date, categoria } = req.query as {
      period?: string;
      start_date?: string;
      end_date?: string;
      categoria?: string;
    };
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    let where: any = { user_id };

    if (categoria) {
      where.categoria = categoria;
    }

    if (period) {
      const now = new Date();
      let start, end;

      switch (period) {
        case "day":
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case "week":
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case "month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case "year":
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear() + 1, 0, 1);
          break;
        default:
          break;
      }

      if (start && end) {
        where.fecha = { [Op.between]: [start, end] };
      }
    } else if (start_date && end_date) {
      where.fecha = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const gastos = await Gastos.findAll({ where });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const updateGasto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fecha, categoria, monto, descripcion } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const gasto = await Gastos.findOne({ where: { id, user_id } });
    if (!gasto) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }

    await gasto.update({ fecha, categoria, monto, descripcion });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const deleteGasto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const gasto = await Gastos.findOne({ where: { id, user_id } });
    if (!gasto) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }

    await gasto.destroy();
    res.json({ message: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export { createGasto, getGastos, updateGasto, deleteGasto };
