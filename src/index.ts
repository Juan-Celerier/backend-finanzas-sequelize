import express from "express";
import cors from "cors";
import sequelize from "../config/database.js";
import "dotenv/config";
import ventasRoutes from "./routes/ventasRoutes.js";
import gastosRoutes from "./routes/gastosRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import importRoutes from "./routes/importRoutes.js";

const app = express();

const allowedOrigins = [process.env.CLIENT_ORIGIN || "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/ventas", ventasRoutes);
app.use("/gastos", gastosRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/", importRoutes);

const PORT = process.env.PORT || 3002;

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa.");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Modelos sincronizados.");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });
