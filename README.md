# 💰 Backend Finanzas Sequelize - Microservicio de Gestión Financiera

Microservicio de ventas y gastos para el Dashboard de Finanzas, desarrollado con Node.js, Express, Sequelize ORM y PostgreSQL. Gestiona CRUD completo de transacciones financieras con métricas y reportes.

## 📋 Descripción

Servicio backend que proporciona:

- ✅ **CRUD completo** de ventas y gastos
- ✅ **Sistema de filtros avanzados** por período y categoría
- ✅ **Métricas y reportes** para dashboard
- ✅ **Importación masiva** de datos JSON
- ✅ **Soft deletes** con Sequelize paranoid
- ✅ **Autenticación JWT** para protección de rutas
- ✅ **Base de datos compartida** con el microservicio de auth
- ✅ **Migraciones de base de datos** automatizadas

## 🏗️ Stack Tecnológico

- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** + **Sequelize ORM**
- **JWT** para autenticación
- **Moment.js** para manejo de fechas
- **CORS** para comunicación segura
- **dotenv** para variables de entorno

## 📁 Estructura del Proyecto

```
backend-finanzas-sequelize/
├── 📁 src/
│   ├── 📁 controllers/          # Controladores de negocio
│   │   ├── ventasController.ts  # CRUD ventas
│   │   ├── gastosController.ts  # CRUD gastos
│   │   ├── dashboardController.ts # Métricas y reportes
│   │   └── importController.ts  # Importación JSON
│   ├── 📁 routes/               # Definición de rutas
│   │   ├── ventasRoutes.ts      # Rutas de ventas
│   │   ├── gastosRoutes.ts      # Rutas de gastos
│   │   ├── dashboardRoutes.ts   # Rutas de métricas
│   │   └── importRoutes.ts      # Rutas de importación
│   ├── 📁 middlewares/          # Middlewares
│   │   └── authMiddleware.ts    # Verificación JWT
│   └── index.ts                 # Servidor Express principal
├── 📁 models/                   # Modelos Sequelize
│   ├── ventas.ts                # Modelo Ventas
│   ├── gastos.ts                # Modelo Gastos
│   └── index.ts                 # Asociación de modelos
├── 📁 migrations/               # Migraciones de base de datos
│   ├── create-ventas.cjs        # Crear tabla ventas
│   ├── create-gastos.cjs        # Crear tabla gastos
│   ├── add-deleted-at-ventas.cjs # Soft delete ventas
│   └── add-deleted-at-gastos.cjs # Soft delete gastos
├── 📁 config/                   # Configuración
│   ├── database.ts              # Config DB Sequelize
│   └── config.json              # Config Sequelize CLI
├── 📄 postman_collection.json   # Colección Postman
├── 📄 package.json
├── 📄 tsconfig.json             # Configuración TypeScript
├── 📄 .env.example              # Variables de entorno ejemplo
└── 📄 README.md                 # Esta documentación
```

## 🚀 Guía de Instalación y Ejecución

### 📋 Prerrequisitos

- **Node.js** versión 18.0.0 o superior
- **PostgreSQL** versión 15.0 o superior
- **npm** o **yarn** como gestor de paquetes
- **Git** para control de versiones

### 🔧 Configuración para Desarrollo

#### Paso 1: Clonar e Instalar

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd backend-finanzas-sequelize

# Instalar dependencias
npm install
```

#### Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con credenciales locales
DATABASE_URL=postgres://usuario:password@localhost:5432/db_finanzas
JWT_SECRET=mi_clave_jwt_desarrollo_segura_2024
PORT=3002
```

#### Paso 3: Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb db_finanzas

# O usando Docker
docker run --name postgres-finanzas \
  -e POSTGRES_DB=db_finanzas \
  -e POSTGRES_USER=usuario \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15
```

#### Paso 4: Ejecutar Migraciones

```bash
# Crear tablas en la base de datos
npm run db:migrate
```

#### Paso 5: Ejecutar en Desarrollo

```bash
# Iniciar servidor con hot reload
npm run dev

# Servidor disponible en: http://localhost:3002
```

#### Paso 6: Verificar Instalación

```bash
# Probar endpoint público
curl http://localhost:3002/ventas

# Debería retornar error 401 (requiere token JWT)
```

### 🏭 Configuración para Producción - Deploy en Railway

#### Opción 1: Deploy Automático desde Git (Recomendado)

1. **Crear cuenta en Railway**

   - Ir a [railway.app](https://railway.app) y crear cuenta
   - Conectar con GitHub

2. **Crear Servicio**

   - Railway detectará automáticamente el proyecto Node.js
   - Seleccionar repositorio `backend-finanzas-sequelize`

3. **Configurar Base de Datos**

   - Railway incluye PostgreSQL automáticamente
   - La `DATABASE_URL` se configura automáticamente

4. **Configurar Variables de Entorno**

   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=tu_clave_jwt_produccion_muy_segura_2024
   PORT=3002
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway hará build y deploy automático
   - La URL será algo como: `https://backend-finanzas-railway.up.railway.app`

#### Opción 2: Deploy Manual

```bash
# 1. Build para producción (si aplica)
npm run build

# 2. El código está listo para deploy
# 3. Configurar en servidor con Node.js
npm start

# 4. Usar PM2 para producción
npm install -g pm2
pm2 start src/index.ts --name finanzas-service
```

### 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con tsx (hot reload)
npm run build        # Compilar TypeScript (si necesario)
npm start            # Servidor de producción

# Base de datos
npm run db:migrate           # Ejecutar migraciones
npm run db:migrate:undo      # Deshacer última migración
npm run db:migrate:undo:all  # Deshacer todas las migraciones
npm run db:seed              # Ejecutar seeders (si existen)

# Utilidades
npm run lint         # Ejecutar ESLint (si configurado)
npm run type-check   # Verificar tipos TypeScript
```

### 📡 API Endpoints

Todos los endpoints requieren autenticación JWT: `Authorization: Bearer <token>`

#### Ventas CRUD

**POST /ventas** - Crear nueva venta

```bash
curl -X POST http://localhost:3002/ventas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2024-01-15",
    "categoria": "Producto A",
    "monto": 150.50,
    "descripcion": "Venta de producto"
  }'
```

**GET /ventas** - Listar ventas con filtros

```bash
# Todas las ventas
GET /ventas

# Filtros disponibles:
GET /ventas?period=month
GET /ventas?categoria=Producto A
GET /ventas?start_date=2024-01-01&end_date=2024-01-31
```

**PUT /ventas/:id** - Actualizar venta

```bash
curl -X PUT http://localhost:3002/ventas/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"monto": 200.00}'
```

**DELETE /ventas/:id** - Eliminar venta (soft delete)

```bash
curl -X DELETE http://localhost:3002/ventas/1 \
  -H "Authorization: Bearer <token>"
```

#### Gastos CRUD

**POST /gastos** - Crear nuevo gasto
**GET /gastos** - Listar gastos con filtros
**PUT /gastos/:id** - Actualizar gasto
**DELETE /gastos/:id** - Eliminar gasto (soft delete)

_Endpoints idénticos a ventas, cambiando `/ventas` por `/gastos`_

#### Dashboard y Reportes

**GET /dashboard/line-chart** - Datos para gráficos

```bash
# Datos mensuales por defecto
GET /dashboard/line-chart

# Otros períodos
GET /dashboard/line-chart?period=week
GET /dashboard/line-chart?period=year
```

**GET /dashboard/summary** - Resumen de métricas

```bash
GET /dashboard/summary
# Retorna: total_ventas, total_gastos, balance, cantidad_transacciones
```

#### Importación Masiva

**POST /import-json** - Importar datos desde JSON

```bash
curl -X POST http://localhost:3002/import-json \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ventas": [
      {
        "fecha": "2024-01-15",
        "categoria": "Producto A",
        "monto": 100.50,
        "descripcion": "Venta importada"
      }
    ],
    "gastos": [
      {
        "fecha": "2024-01-15",
        "categoria": "Oficina",
        "monto": 50.00,
        "descripcion": "Gasto importado"
      }
    ]
  }'
```

### 🔍 Sistema de Filtros

Los endpoints GET soportan filtros avanzados:

| Parámetro    | Tipo   | Descripción               | Ejemplo                  |
| ------------ | ------ | ------------------------- | ------------------------ |
| `period`     | string | day, week, month, year    | `?period=month`          |
| `start_date` | string | Fecha inicio (YYYY-MM-DD) | `?start_date=2024-01-01` |
| `end_date`   | string | Fecha fin (YYYY-MM-DD)    | `?end_date=2024-01-31`   |
| `categoria`  | string | Filtrar por categoría     | `?categoria=Producto A`  |

**Ejemplos de uso:**

```bash
# Ventas del mes actual
GET /ventas?period=month

# Gastos de enero 2024
GET /gastos?start_date=2024-01-01&end_date=2024-01-31

# Ventas de categoría específica en el último año
GET /ventas?period=year&categoria=Producto A
```

### 🔒 Seguridad Implementada

- ✅ **JWT Authentication**: Todos los endpoints protegidos
- ✅ **Soft Deletes**: Registros no se eliminan físicamente
- ✅ **Input Validation**: Sanitización y validación de datos
- ✅ **SQL Injection Protection**: Sequelize previene inyección
- ✅ **CORS**: Configurado para orígenes específicos
- ✅ **Rate Limiting**: Protección contra abuso
- ✅ **Audit Trail**: Timestamps en todas las operaciones

### 📊 Modelo de Datos

#### Tabla Ventas

```sql
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  user_id INTEGER NOT NULL REFERENCES usuarios(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  deletedAt TIMESTAMP NULL
);

-- Índices para optimización
CREATE INDEX idx_ventas_user_id ON ventas(user_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_categoria ON ventas(categoria);
```

#### Tabla Gastos

```sql
CREATE TABLE gastos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  user_id INTEGER NOT NULL REFERENCES usuarios(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  deletedAt TIMESTAMP NULL
);

-- Índices para optimización
CREATE INDEX idx_gastos_user_id ON gastos(user_id);
CREATE INDEX idx_gastos_fecha ON gastos(fecha);
CREATE INDEX idx_gastos_categoria ON gastos(categoria);
```

### 🧪 Testing con Postman

#### Importar Colección

1. Abrir Postman
2. Importar `postman_collection.json`
3. Configurar variables:
   - `base_url`: `http://localhost:3002` (desarrollo) o URL de Railway (producción)
   - `auth_token`: Token JWT obtenido del backend de auth

#### Flujo de Testing

1. **Login** en backend-auth para obtener token
2. **POST /ventas** - Crear venta de prueba
3. **GET /ventas** - Listar ventas
4. **GET /dashboard/summary** - Ver métricas
5. **POST /import-json** - Importar datos de prueba

### 🤝 Integración con Otros Servicios

Este microservicio se integra con:

- **Backend Auth**: Comparte base de datos y usa JWT
- **Frontend**: Proporciona APIs para gestión financiera
- **Base de datos**: PostgreSQL compartida con auth

**Nota**: Los JWT_SECRET deben ser idénticos en ambos backends.

### 📞 Soporte y Troubleshooting

#### Problemas Comunes

**Error de conexión a DB:**

```bash
# Verificar credenciales
cat .env | grep DATABASE_URL

# Probar conexión
psql "DATABASE_URL" -c "SELECT COUNT(*) FROM ventas;"

# Para Railway: verificar DATABASE_URL en variables de entorno
```

**Migraciones fallidas:**

```bash
# Ver estado de migraciones
npm run db:migrate:status

# Deshacer y re-ejecutar
npm run db:migrate:undo:all
npm run db:migrate
```

**Errores de JWT:**

```bash
# Verificar token en headers
curl -H "Authorization: Bearer <token>" http://localhost:3002/ventas

# Validar token en jwt.io
```

**Problemas de CORS:**

- Verificar configuración en código fuente
- Para desarrollo: permitir `http://localhost:5173`
- Para producción: permitir URL de Netlify

#### Logs en Railway

- Acceder al panel de Railway
- Ver sección "Logs" del servicio
- Revisar errores de build y runtime

### 📋 Checklist de Deploy en Railway

- [ ] Repositorio conectado a Railway
- [ ] PostgreSQL database configurada automáticamente
- [ ] Variables de entorno establecidas
- [ ] JWT_SECRET idéntico al backend auth
- [ ] Build exitoso
- [ ] Servicio ejecutándose
- [ ] Endpoints accesibles
- [ ] Dominio personalizado (opcional)

### 🎉 Conclusión

Este microservicio proporciona una gestión financiera completa y robusta para el sistema Dashboard de Finanzas. Incluye todas las funcionalidades requeridas por la prueba técnica y está optimizado para deploy en Railway.

**¡Listo para desarrollo local y deploy automático en Railway!**

---

**Desarrollado con ❤️ como parte del sistema de microservicios Dashboard de Finanzas**
