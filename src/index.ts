import express from "express";
import cors from "cors";
import sequelize from "../config/database";
import "dotenv/config";
import ventasRoutes from "./routes/ventasRoutes";
import gastosRoutes from "./routes/gastosRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import importRoutes from "./routes/importRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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
