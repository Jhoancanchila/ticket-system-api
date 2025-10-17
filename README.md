# Sistema de Gestión de Tickets - API Backend

API REST con arquitectura hexagonal para gestión de tickets de soporte.

## 🏗️ Arquitectura

- **Arquitectura Hexagonal (Ports & Adapters)**
- **TypeScript** para type safety
- **Express.js** como framework web
- **Sequelize** como ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **Zod** para validación de datos
- **Resend** para envío de emails

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# Crear base de datos PostgreSQL

# Ejecutar en modo desarrollo
npm run dev

# Crear usuarios de prueba
npm run seed
```

## 🔐 Usuarios de Prueba

Después de ejecutar `npm run seed`:

- **Admin**: admin@test.com / admin123
- **Soporte**: soporte@test.com / soporte123
- **Cliente**: cliente@test.com / cliente123

## 📚 Endpoints API

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Refrescar token

### Tickets
- `GET /api/v1/tickets` - Listar tickets
- `GET /api/v1/tickets/:id` - Obtener ticket
- `POST /api/v1/tickets` - Crear ticket
- `PUT /api/v1/tickets/:id` - Actualizar ticket
- `PATCH /api/v1/tickets/:id/status` - Cambiar estado
- `DELETE /api/v1/tickets/:id` - Eliminar ticket (admin)

### Usuarios
- `GET /api/v1/users` - Listar usuarios
- `GET /api/v1/users/:id` - Obtener usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (admin)

### Reportes
- `GET /api/v1/reports/dashboard` - Estadísticas generales

## 🔑 Roles y Permisos

### Cliente
- Crear tickets propios
- Ver solo sus tickets
- Actualizar sus tickets (solo pendientes)

### Soporte
- Ver todos los tickets
- Cambiar estado de tickets
- Responder tickets
- Ver reportes

### Administrador
- Acceso total
- Gestionar usuarios
- Eliminar tickets
- Ver reportes completos

## 🏛️ Estructura del Proyecto

```
src/
├── domain/              # Entidades y lógica de negocio
├── application/         # Casos de uso
├── infrastructure/      # Implementaciones técnicas
└── shared/             # Utilidades compartidas
```

## 🚀 Scripts

```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar TypeScript
npm start            # Producción
npm run seed         # Crear usuarios de prueba
npm run lint         # Linter
npm run format       # Formatear código
npm test             # Tests
```

## 📝 Licencia

MIT
