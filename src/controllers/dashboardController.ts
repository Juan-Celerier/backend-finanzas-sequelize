import { Request, Response } from "express";
import { Sequelize } from "sequelize";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import db from "../../models/index.js";
const { ventas: Ventas, gastos: Gastos } = db;

const getLineChartData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const { period = "month" } = req.query;

    let groupBy: any;
    switch (period) {
      case "day":
        groupBy = Sequelize.fn("DATE", Sequelize.col("fecha"));
        break;
      case "week":
        groupBy = Sequelize.fn("DATE_TRUNC", "week", Sequelize.col("fecha"));
        break;
      case "month":
        groupBy = Sequelize.fn("DATE", Sequelize.col("fecha"));
        break;
      case "year":
        groupBy = Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("fecha"));
        break;
      default:
        groupBy = Sequelize.fn("DATE", Sequelize.col("fecha"));
    }

    const ventasData: any[] = await Ventas.findAll({
      where: { user_id },
      attributes: [
        [groupBy, "period"],
        [Sequelize.fn("SUM", Sequelize.col("monto")), "total_ventas"],
      ],
      group: [groupBy],
      order: [[groupBy, "ASC"]],
      raw: true,
    });

    const gastosData: any[] = await Gastos.findAll({
      where: { user_id },
      attributes: [
        [groupBy, "period"],
        [Sequelize.fn("SUM", Sequelize.col("monto")), "total_gastos"],
      ],
      group: [groupBy],
      order: [[groupBy, "ASC"]],
      raw: true,
    });

    const combined: {
      [key: string]: { total_ventas: number; total_gastos: number };
    } = {};
    ventasData.forEach((item: any) => {
      const key = item.period;
      combined[key] = {
        ...combined[key],
        total_ventas: parseFloat(item.total_ventas),
        total_gastos: 0,
      };
    });
    gastosData.forEach((item: any) => {
      const key = item.period;
      combined[key] = {
        ...combined[key],
        total_gastos: parseFloat(item.total_gastos),
        total_ventas: combined[key]?.total_ventas || 0,
      };
    });

    const result = Object.keys(combined).map((key) => ({
      period: key,
      total_ventas: combined[key].total_ventas,
      total_gastos: combined[key].total_gastos,
      balance: combined[key].total_ventas - combined[key].total_gastos,
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getLineChartData };
