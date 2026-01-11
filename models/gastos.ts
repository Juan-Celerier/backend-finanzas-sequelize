"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

const initGastos = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const { DATE, STRING, DECIMAL, INTEGER } = dataTypes;
  class Gastos extends Model {
    static associate(models: any): void {}
  }
  Gastos.init(
    {
      fecha: DATE,
      categoria: STRING,
      monto: DECIMAL,
      descripcion: STRING,
      user_id: INTEGER,
    },
    {
      sequelize,
      modelName: "gastos",
      paranoid: true,
    }
  );
  return Gastos;
};

export default initGastos;
