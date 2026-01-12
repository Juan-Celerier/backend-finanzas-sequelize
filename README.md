# Backend Finanzas Sequelize

Microservicio de gestión financiera con Sequelize ORM para CRUD de ventas/gastos.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL + Sequelize ORM
- JWT para autenticación
- Soft deletes
- Puerto: 3002

## Endpoints

### Ventas

- `GET /ventas` - Listar con filtros (period, categoria, fechas)
- `POST /ventas` - Crear venta
- `PUT /ventas/:id` - Actualizar venta
- `DELETE /ventas/:id` - Eliminar venta (soft delete)

### Gastos

- `GET /gastos` - Listar con filtros
- `POST /gastos` - Crear gasto
- `PUT /gastos/:id` - Actualizar gasto
- `DELETE /gastos/:id` - Eliminar gasto (soft delete)

### Dashboard

- `GET /dashboard/line-chart` - Datos para gráficos
- `GET /dashboard/summary` - Métricas agregadas

### Importación

- `POST /import-json` - Cargar datos masivos JSON

## Instalación Desarrollo

1. **Instalar**: `npm install`
2. **Configurar .env**:
   ```env
   DATABASE_URL=postgres://user:pass@localhost:5432/db_finanzas
   JWT_SECRET=tu_clave_segura
   PORT=3002
   ```
3. **Migraciones**: `npm run db:migrate`
4. **Ejecutar**: `npm run dev`

## Producción - Render

**URL Deploy**: https://backend-finanzas-sequelize-wfdm.onrender.com/

```bash
# Crear Web Service en Render
# Build: npm install
# Start: npm start
# Variables configuradas: DATABASE_URL, JWT_SECRET, PORT
```

## Pruebas

Primero obtén un token JWT del backend de auth, luego prueba:

```bash
# 1. Crear venta
curl -X POST http://localhost:3002/ventas \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha": "2024-01-15",
    "categoria": "Producto A",
    "monto": 150.50,
    "descripcion": "Venta de prueba"
  }'

# 2. Listar ventas
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  http://localhost:3002/ventas

# 3. Ver métricas
curl -H "Authorization: Bearer TU_TOKEN_JWT" \
  http://localhost:3002/dashboard/summary

# 4. Importar datos JSON
curl -X POST http://localhost:3002/import-json \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "ventas": [{"fecha": "2024-01-15", "categoria": "Test", "monto": 100}],
    "gastos": [{"fecha": "2024-01-15", "categoria": "Test", "monto": 50}]
  }'
```

## Características

- CRUD completo de ventas y gastos
- Filtros avanzados por período/categoría/fechas
- Métricas y gráficos para dashboard
- Importación masiva de datos JSON
- Soft deletes con Sequelize
- Autenticación JWT requerida
- Base de datos compartida con auth
