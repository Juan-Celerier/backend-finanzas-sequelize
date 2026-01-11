"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

const initVentas = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const { DATE, STRING, DECIMAL, INTEGER } = dataTypes;
  class Ventas extends Model {
    static associate(models: any): void {}
  }
  Ventas.init(
    {
      fecha: DATE,
      categoria: STRING,
      monto: DECIMAL,
      descripcion: STRING,
      user_id: INTEGER,
    },
    {
      sequelize,
      modelName: "ventas",
      paranoid: true,
    }
  );
  return Ventas;
};

export default initVentas;
