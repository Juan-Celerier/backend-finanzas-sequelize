import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import db from "../../models/index.js";
const { gastos: Gastos, ventas: Ventas, sequelize } = db;

const importJson = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { ventas, gastos } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      await transaction.rollback();
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    let importedVentas = 0;
    let importedGastos = 0;

    if (ventas && Array.isArray(ventas)) {
      for (const venta of ventas) {
        if (!venta.fecha || !venta.categoria || !venta.monto) {
          throw new Error("Cada venta debe tener fecha, categoria y monto");
        }
        if (isNaN(Number(venta.monto)) || Number(venta.monto) <= 0) {
          throw new Error("Monto de venta debe ser un número positivo");
        }
      }
      const ventasWithUserId = ventas.map((venta) => ({
        ...venta,
        fecha: new Date(venta.fecha),
        user_id,
      }));
      await Ventas.bulkCreate(ventasWithUserId, {
        validate: true,
        transaction,
      });
      importedVentas = ventas.length;
    }

    if (gastos && Array.isArray(gastos)) {
      for (const gasto of gastos) {
        if (!gasto.fecha || !gasto.categoria || !gasto.monto) {
          throw new Error("Cada gasto debe tener fecha, categoria y monto");
        }
        if (isNaN(Number(gasto.monto)) || Number(gasto.monto) <= 0) {
          throw new Error("Monto de gasto debe ser un número positivo");
        }
      }
      const gastosWithUserId = gastos.map((gasto) => ({
        ...gasto,
        fecha: new Date(gasto.fecha),
        user_id,
      }));
      await Gastos.bulkCreate(gastosWithUserId, {
        validate: true,
        transaction,
      });
      importedGastos = gastos.length;
    }

    await transaction.commit();
    res.status(201).json({
      message: "Datos importados exitosamente",
      importedVentas,
      importedGastos,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: (error as Error).message });
  }
};

export { importJson };
