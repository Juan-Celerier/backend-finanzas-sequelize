import { Request, Response } from "express";

import { Op } from "sequelize";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import db from "../../models/index.js";
const { ventas: Ventas } = db;


const createVenta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fecha, categoria, monto, descripcion } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    
    if (!fecha || !categoria || !monto) {
      res
        .status(400)
        .json({ message: "Fecha, categoria y monto son requeridos" });
      return;
    }

    if (isNaN(Number(monto)) || Number(monto) <= 0) {
      res.status(400).json({ message: "Monto debe ser un número positivo" });
      return;
    }

    const venta = await Ventas.create({
      fecha: new Date(fecha),
      categoria,
      monto,
      descripcion,
      user_id,
    });

    res.status(201).json(venta);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const getVentas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period, start_date, end_date, categoria, limit, dashboard } = req.query as {
      period?: string;
      start_date?: string;
      end_date?: string;
      categoria?: string;
      limit?: string;
      dashboard?: string;
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

    // For dashboard, limit results and order by date descending for recent items
    const options: any = { where };
    if (dashboard === 'true') {
      options.limit = limit ? parseInt(limit) : 10;
      options.order = [['fecha', 'DESC']];
    }

    const ventas = await Ventas.findAll(options);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const updateVenta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fecha, categoria, monto, descripcion } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const venta = await Ventas.findOne({ where: { id, user_id } });
    if (!venta) {
      res.status(404).json({ message: "Venta no encontrada" });
      return;
    }

    await venta.update({ fecha, categoria, monto, descripcion });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const deleteVenta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const venta = await Ventas.findOne({ where: { id, user_id } });
    if (!venta) {
      res.status(404).json({ message: "Venta no encontrada" });
      return;
    }

    await venta.destroy();
    res.json({ message: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export { createVenta, getVentas, updateVenta, deleteVenta };
