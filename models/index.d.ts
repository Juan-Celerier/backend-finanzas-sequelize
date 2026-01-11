import { Sequelize, Model } from "sequelize";

export interface VentasAttributes {
  id?: number;
  fecha: Date;
  categoria: string;
  monto: number;
  descripcion: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface GastosAttributes {
  id?: number;
  fecha: Date;
  categoria: string;
  monto: number;
  descripcion: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export declare const ventas: typeof Ventas;
export declare const gastos: typeof Gastos;

export class Ventas
  extends Model<VentasAttributes>
  implements VentasAttributes
{
  public id!: number;
  public fecha!: Date;
  public categoria!: string;
  public monto!: number;
  public descripcion!: string;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate(models: any): void;
}

export class Gastos
  extends Model<GastosAttributes>
  implements GastosAttributes
{
  public id!: number;
  public fecha!: Date;
  public categoria!: string;
  public monto!: number;
  public descripcion!: string;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate(models: any): void;
}

export const sequelize: Sequelize;
export const Sequelize: typeof Sequelize;
