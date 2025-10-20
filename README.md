# 🎫 Ticket System API

Sistema de gestión de tickets con arquitectura hexagonal, TypeScript, Express y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Paso a Paso](#instalación-paso-a-paso)
- [Configuración de Base de Datos con Docker](#configuración-de-base-de-datos-con-docker)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Testing](#testing)

---

## ✨ Características

- ✅ **Arquitectura Hexagonal** (Clean Architecture)
- ✅ **Programación Funcional** en casos de uso
- ✅ **Principios SOLID**
- ✅ **TypeScript** con tipado estricto
- ✅ **Autenticación JWT** (Access & Refresh Tokens)
- ✅ **Validación con Zod**
- ✅ **ORM Sequelize** con PostgreSQL
- ✅ **Envío de emails** con Resend/Nodemailer
- ✅ **Seguridad** con Helmet y CORS
- ✅ **Sin flujo de registro** - Usuarios creados por script

---

## 🚀 Tecnologías

- **Runtime:** Node.js v18+
- **Lenguaje:** TypeScript 5.3
- **Framework:** Express 4.18
- **Base de Datos:** PostgreSQL 16 (Docker)
- **ORM:** Sequelize 6.35
- **Autenticación:** JWT (jsonwebtoken)
- **Validación:** Zod 3.22
- **Email:** Nodemailer
- **Containerización:** Docker & Docker Compose

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

---

## � Instalación Paso a Paso

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/Jhoancanchila/ticket-system-api.git
cd ticket-system-api
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```bash
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticket_system
DB_USER=postgres
DB_PASSWORD=123456

# JWT Secrets (cambiar en producción)
JWT_SECRET=tu-super-secreto-jwt-cambiar-en-produccion-min-32-caracteres
JWT_REFRESH_SECRET=tu-super-secreto-refresh-cambiar-en-produccion-min-32-caracteres

# Email (opcional)
NODEMAILER_API_KEY=
FROM_EMAIL=noreply@tusistema.com
FROM_NAME=Sistema de Tickets

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🐳 Configuración de Base de Datos con Docker

### Paso 1: Iniciar PostgreSQL con Docker Compose

El proyecto incluye un archivo `docker-compose.yml` configurado con PostgreSQL.

```bash
docker-compose up -d
```

Esto creará y ejecutará:
- **Contenedor:** ticket_system-db
- **Imagen:** postgres:16-alpine
- **Puerto:** 5432
- **Usuario:** postgres
- **Contraseña:** 123456
- **Base de datos:** ticket_system
- **Volumen:** postgres_data (para persistencia)

### Paso 2: Verificar que el contenedor esté corriendo

```bash
docker ps
```

Deberías ver:
```
CONTAINER ID   IMAGE                STATUS          PORTS                    NAMES
xxxxx          postgres:16-alpine   Up 10 seconds   0.0.0.0:5432->5432/tcp   ticket_system-db
```

### Paso 3: Ver logs del contenedor (opcional)

```bash
docker logs ticket_system-db
```

### Comandos útiles de Docker:

```bash
# Detener la base de datos
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina todos los datos)
docker-compose down -v

# Reiniciar la base de datos
docker-compose restart

# Acceder a la consola de PostgreSQL
docker exec -it ticket_system-db psql -U postgres -d ticket_system
```

---

## 🚀 Ejecución del Proyecto

### Paso 1: Crear usuarios de prueba

El sistema **no tiene flujo de registro**. Los usuarios se crean con un script:

```bash
npm run seed
```

> ⚠️ **Nota:** Este comando elimina y recrea todas las tablas. No usar en producción.

### Paso 2: Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

Verás en consola:
```
✅ Conectado a la base de datos
🚀 Servidor corriendo en puerto 2020
📝 Ambiente: development
🔗 API: http://localhost:2020/api/v1
```

### Comandos disponibles:

```bash
npm run dev       # Modo desarrollo con hot-reload
npm run build     # Compilar a JavaScript
npm start         # Ejecutar en producción
npm run seed      # Crear usuarios de prueba
npm run lint      # Ejecutar linter
```

---

## 🔐 Usuarios de Prueba

Después de ejecutar `npm run seed`, tendrás estos usuarios:

| Email | Contraseña | Rol | Permisos |
|-------|-----------|-----|----------|
| admin@test.com | admin123 | ADMIN | Todos |
| soporte@test.com | soporte123 | SUPPORT | Gestión de tickets |
| pedro@test.com | pedro123 | CLIENT | Crear tickets propios |

---

## 📚 API Endpoints

### Base URL: `http://localhost:2020/api/v1`

### Autenticación

#### Login
```http
POST /api/v1/auth/login
#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Administrador",
      "email": "admin@test.com",
      "role": "admin"
    }
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "tu_refresh_token"
}
```

### Tickets

> Todas las rutas requieren autenticación: `Authorization: Bearer {token}`

#### Crear Ticket
```http
POST /api/v1/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Problema con el sistema",
  "description": "Descripción detallada del problema"
}
```

#### Listar Tickets
```http
GET /api/v1/tickets
Authorization: Bearer {token}

# Con filtros
GET /api/v1/tickets?status=pending&page=1&limit=10
```

#### Obtener Ticket por ID
```http
GET /api/v1/tickets/{id}
Authorization: Bearer {token}
```

#### Actualizar Ticket
```http
PUT /api/v1/tickets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nuevo título",
  "description": "Nueva descripción"
}
```

#### Cambiar Estado
```http
PATCH /api/v1/tickets/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in_progress",
  "comment": "Estamos trabajando en ello"
}
```

#### Eliminar Ticket (Solo Admin)
```http
DELETE /api/v1/tickets/{id}
Authorization: Bearer {token}
```

### Comentarios

#### Crear Comentario
```http
POST /api/v1/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "ticketId": "uuid-del-ticket",
  "content": "Contenido del comentario"
}
```

---

## 📁 Estructura del Proyecto

```
ticket-system-api/
├── src/
│   ├── domain/                    # Capa de Dominio
│   │   ├── entities/              # Entidades de negocio
│   │   ├── enums/                 # Enumeraciones
│   │   ├── errors/                # Errores personalizados
│   │   └── value-objects/         # Objetos de valor
│   │
│   ├── application/               # Capa de Aplicación
│   │   ├── dtos/                  # Data Transfer Objects
│   │   ├── ports/                 # Interfaces
│   │   └── use-cases/             # Casos de uso
│   │
│   ├── infrastructure/            # Capa de Infraestructura
│   │   ├── config/                # Configuración
│   │   ├── database/              # Base de datos
│   │   ├── http/                  # HTTP (Express)
│   │   └── services/              # Servicios
│   │
│   ├── scripts/                   # Scripts utilitarios
│   └── server.ts                  # Punto de entrada
│
├── docker-compose.yml             # Configuración Docker
├── .env.example                   # Ejemplo variables
└── README.md                      # Este archivo
```

---

## 🔒 Seguridad

- ✅ Helmet para headers seguros
- ✅ CORS configurado
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ JWT con expiración
- ✅ Validación con Zod
- ✅ Manejo centralizado de errores

---
