import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import sequelize from "../config/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const db: any = {};

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    (file.slice(-3) === ".js" || file.slice(-3) === ".ts") &&
    file.indexOf(".test.js") === -1 &&
    file.indexOf(".d.ts") === -1
  );
});

for (const file of files) {
  const initModel = (await import(path.join(__dirname, file))).default;
  const model = initModel(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
