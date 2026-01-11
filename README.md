# Backend Finanzas Sequelize

Microservicio de ventas y gastos para el Dashboard de Finanzas, utilizando Sequelize ORM con PostgreSQL y TypeScript.

## Stack Tecnológico

- Node.js + Express
- PostgreSQL + Sequelize ORM
- TypeScript
- JWT para autenticación
- Soft deletes con paranoid

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd backend-finanzas-sequelize
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con:

   ```
   DATABASE_URL=postgres://tu_usuario:tu_password@localhost:5432/db_finanzas
   JWT_SECRET=tu_clave_secreta_aqui
   PORT=3002
   ```

4. Configura la base de datos PostgreSQL:

   - Crea una base de datos llamada `db_finanzas`
   - Asegúrate de que PostgreSQL esté corriendo en localhost:5432

5. Ejecuta las migraciones para crear las tablas:
   ```bash
   npm run db:migrate
   ```

## Ejecución

Para desarrollo:

```bash
npm run dev
```

El servidor se iniciará en http://localhost:3002

## Endpoints

Todos los endpoints requieren autenticación JWT en el header: `Authorization: Bearer <token>`

### Ventas

- **POST /ventas** - Crear venta
- **GET /ventas** - Listar ventas con filtros (query params: period=day/week/month/year, start_date, end_date, categoria)
- **PUT /ventas/:id** - Actualizar venta
- **DELETE /ventas/:id** - Eliminar venta (soft delete)

### Gastos

- **POST /gastos** - Crear gasto
- **GET /gastos** - Listar gastos con filtros
- **PUT /gastos/:id** - Actualizar gasto
- **DELETE /gastos/:id** - Eliminar gasto (soft delete)

### Dashboard

- **GET /dashboard/line-chart** - Datos agregados para gráficos de línea (query param: period=day/week/month/year)

### Importación

- **POST /import-json** - Cargar datos desde JSON

## Filtros

Los endpoints GET de ventas y gastos soportan filtros vía query parameters:

- `period`: day, week, month, year
- `start_date` y `end_date`: rango de fechas personalizado (formato YYYY-MM-DD)
- `categoria`: filtrar por categoría específica

Ejemplo: `GET /ventas?period=month&categoria=Producto A`

## Importación JSON

Envía un POST a `/import-json` con un body JSON:

```json
{
  "ventas": [
    {
      "fecha": "2023-10-01",
      "categoria": "Producto A",
      "monto": 100.5,
      "descripcion": "Venta importada"
    }
  ],
  "gastos": [
    {
      "fecha": "2023-10-01",
      "categoria": "Oficina",
      "monto": 50.0,
      "descripcion": "Gasto importado"
    }
  ]
}
```

## Modelo de Datos

### Tabla Ventas

- id: serial (primary key)
- fecha: date (not null)
- categoria: string (not null)
- monto: decimal (not null)
- descripcion: string
- user_id: integer (foreign key, not null)
- createdAt, updatedAt, deletedAt (timestamps, paranoid)

### Tabla Gastos

- id: serial (primary key)
- fecha: date (not null)
- categoria: string (not null)
- monto: decimal (not null)
- descripcion: string
- user_id: integer (foreign key, not null)
- createdAt, updatedAt, deletedAt (timestamps, paranoid)

## Colección de Postman

Importa el archivo `postman_collection.json` en Postman para probar los endpoints. Incluye variables para la URL base y el token de autenticación.

## Notas

- Todos los registros están asociados al usuario autenticado (user_id).
- Se utilizan soft deletes (paranoid), por lo que los registros eliminados permanecen en la DB.
- El microservicio comparte la base de datos con el microservicio de autenticación, pero no depende directamente de él (comunicación vía JWT).
