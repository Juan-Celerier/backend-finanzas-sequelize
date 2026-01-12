import { Request, Response } from "express";
import { Sequelize, Op } from "sequelize";
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

const getDashboardSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user!.id;
    const { period = "month" } = req.query;

    let start, end;
    const now = new Date();

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
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // Get total ventas for the period
    const totalVentasResult: any = await Ventas.findAll({
      where: {
        user_id,
        fecha: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("monto")), "total_ventas"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count_ventas"],
      ],
      raw: true,
    });

    // Get total gastos for the period
    const totalGastosResult: any = await Gastos.findAll({
      where: {
        user_id,
        fecha: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("monto")), "total_gastos"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count_gastos"],
      ],
      raw: true,
    });

    const totalVentas = parseFloat(totalVentasResult[0]?.total_ventas || 0);
    const countVentas = parseInt(totalVentasResult[0]?.count_ventas || 0);
    const totalGastos = parseFloat(totalGastosResult[0]?.total_gastos || 0);
    const countGastos = parseInt(totalGastosResult[0]?.count_gastos || 0);
    const balance = totalVentas - totalGastos;

    res.json({
      total_ventas: totalVentas,
      total_gastos: totalGastos,
      balance,
      count_ventas: countVentas,
      count_gastos: countGastos,
      period,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getLineChartData, getDashboardSummary };
