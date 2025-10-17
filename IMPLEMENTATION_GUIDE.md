# 🚀 GUÍA DE IMPLEMENTACIÓN - BACKEND TICKET SYSTEM

## 📚 Arquitectura Hexagonal con TypeScript

Esta guía te ayudará a completar la implementación del backend con todas las especificaciones solicitadas.

---

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 1. **Estructura del Proyecto** ✓
- Arquitectura hexagonal completa
- Separación de capas (Domain, Application, Infrastructure)
- Configuración de TypeScript

### 2. **Capa de Dominio** ✓
- ✅ Enums (UserRole, TicketStatus, TicketPriority)
- ✅ Value Objects (Email, Password)
- ✅ Entidades (User, Ticket, Comment)
- ✅ Errores personalizados (DomainError, NotFoundError, UnauthorizedError, etc.)

### 3. **Capa de Aplicación** ✓
- ✅ Puertos (Interfaces para repositorios y servicios)
- ✅ DTOs
- ✅ Casos de Uso principales con programación funcional:
  - Login
  - Refresh Token
  - Create Ticket
  - Get Tickets
  - Change Ticket Status

---

## 📦 PASO 1: INSTALAR DEPENDENCIAS

```bash
npm install
```

Si hay errores, instala manualmente:

```bash
npm install express cors helmet morgan dotenv
npm install sequelize pg pg-hstore
npm install jsonwebtoken bcryptjs zod resend

npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/morgan
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D ts-node-dev
```

---

## 🔧 PASO 2: COMPLETAR CASOS DE USO FALTANTES

### A. Get Ticket By ID

**`src/application/use-cases/tickets/get-ticket-by-id.use-case.ts`:**

```typescript
import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const createGetTicketByIdUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User): Promise<Ticket> => {
    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (!user.canAccessTicket(ticket.clientId)) {
      throw new ForbiddenError('No tienes acceso a este ticket');
    }

    return ticket;
  };
};

export type GetTicketByIdUseCase = ReturnType<typeof createGetTicketByIdUseCase>;
```

### B. Update Ticket

**`src/application/use-cases/tickets/update-ticket.use-case.ts`:**

```typescript
import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';
import { TicketPriority } from '@domain/enums/TicketPriority';

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  priority?: TicketPriority;
}

export const createUpdateTicketUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User, data: UpdateTicketDTO): Promise<Ticket> => {
    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (!ticket.canBeEditedBy(user.id, user.role)) {
      throw new ForbiddenError('No tienes permiso para editar este ticket');
    }

    return await ticketRepository.update(ticketId, data);
  };
};

export type UpdateTicketUseCase = ReturnType<typeof createUpdateTicketUseCase>;
```

### C. Delete Ticket

**`src/application/use-cases/tickets/delete-ticket.use-case.ts`:**

```typescript
import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { User } from '@domain/entities/User';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const createDeleteTicketUseCase = (ticketRepository: ITicketRepository) => {
  return async (ticketId: string, user: User): Promise<void> => {
    if (!user.isAdmin()) {
      throw new ForbiddenError('Solo administradores pueden eliminar tickets');
    }

    const ticket = await ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    await ticketRepository.delete(ticketId);
  };
};

export type DeleteTicketUseCase = ReturnType<typeof createDeleteTicketUseCase>;
```

### D. Dashboard Stats

**`src/application/use-cases/reports/get-dashboard-stats.use-case.ts`:**

```typescript
import { ITicketRepository } from '@application/ports/repositories/ticket.repository.interface';
import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { User } from '@domain/entities/User';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

interface DashboardStats {
  totalTickets: number;
  totalUsers: number;
  ticketsByStatus: Record<string, number>;
}

export const createGetDashboardStatsUseCase = (
  ticketRepository: ITicketRepository,
  userRepository: IUserRepository
) => {
  return async (user: User): Promise<DashboardStats> => {
    if (!user.canViewReports()) {
      throw new ForbiddenError('No tienes acceso a las estadísticas');
    }

    const [ticketsByStatus, totalUsers] = await Promise.all([
      ticketRepository.countByStatus(),
      userRepository.count()
    ]);

    const totalTickets = Object.values(ticketsByStatus).reduce(
      (sum, count) => sum + count, 
      0
    );

    return {
      totalTickets,
      totalUsers,
      ticketsByStatus
    };
  };
};

export type GetDashboardStatsUseCase = ReturnType<typeof createGetDashboardStatsUseCase>;
```

---

## 🗄️ PASO 3: IMPLEMENTAR MODELOS SEQUELIZE

### A. User Model

**`src/infrastructure/database/sequelize/models/user.model.ts`:**

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { UserRole } from '@domain/enums/UserRole';

export class UserModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.CLIENT
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);
```

### B. Ticket Model

**`src/infrastructure/database/sequelize/models/ticket.model.ts`:**

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { TicketStatus } from '@domain/enums/TicketStatus';
import { TicketPriority } from '@domain/enums/TicketPriority';
import { UserModel } from './user.model';

export class TicketModel extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: TicketStatus;
  public priority!: TicketPriority;
  public clientId!: string;
  public assignedToId!: string | null;
  public resolvedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TicketModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TicketStatus)),
      allowNull: false,
      defaultValue: TicketStatus.PENDING
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TicketPriority)),
      allowNull: false,
      defaultValue: TicketPriority.MEDIUM
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'tickets',
    timestamps: true
  }
);

// Relaciones
TicketModel.belongsTo(UserModel, { foreignKey: 'clientId', as: 'client' });
TicketModel.belongsTo(UserModel, { foreignKey: 'assignedToId', as: 'assignedTo' });
```

### C. Comment Model

**`src/infrastructure/database/sequelize/models/comment.model.ts`:**

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { UserModel } from './user.model';
import { TicketModel } from './ticket.model';

export class CommentModel extends Model {
  public id!: string;
  public ticketId!: string;
  public userId!: string;
  public content!: string;
  public isInternal!: boolean;
  public readonly createdAt!: Date;
}

CommentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TicketModel,
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    updatedAt: false
  }
);

// Relaciones
CommentModel.belongsTo(TicketModel, { foreignKey: 'ticketId' });
CommentModel.belongsTo(UserModel, { foreignKey: 'userId' });
```

### D. Index de Modelos

**`src/infrastructure/database/sequelize/models/index.ts`:**

```typescript
import { UserModel } from './user.model';
import { TicketModel } from './ticket.model';
import { CommentModel } from './comment.model';

export { UserModel, TicketModel, CommentModel };

// Inicializar todas las relaciones aquí si es necesario
export const initModels = () => {
  // Las relaciones ya están definidas en cada modelo
};
```

---

## 🔌 PASO 4: IMPLEMENTAR REPOSITORIOS

### A. User Repository

**`src/infrastructure/database/repositories/sequelize-user.repository.ts`:**

```typescript
import { IUserRepository } from '@application/ports/repositories/user.repository.interface';
import { User } from '@domain/entities/User';
import { UserRole } from '@domain/enums/UserRole';
import { UserModel } from '../sequelize/models/user.model';

export class SequelizeUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findByPk(id);
    
    if (!userModel) return null;
    
    return User.create({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ where: { email } });
    
    if (!userModel) return null;
    
    return User.create({
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }

  async findAll(filters?: { role?: UserRole }): Promise<User[]> {
    const where: any = {};
    
    if (filters?.role) {
      where.role = filters.role;
    }

    const userModels = await UserModel.findAll({ where });
    
    return userModels.map(userModel =>
      User.create({
        id: userModel.id,
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
        role: userModel.role,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt
      })
    );
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await UserModel.update(data as any, { where: { id } });
    const updated = await this.findById(id);
    
    if (!updated) {
      throw new Error('User not found after update');
    }
    
    return updated;
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async count(): Promise<number> {
    return await UserModel.count();
  }
}
```

### B. Ticket Repository

**`src/infrastructure/database/repositories/sequelize-ticket.repository.ts`:**

```typescript
import { ITicketRepository, TicketFilters, PaginationOptions, PaginatedResult } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { TicketStatus } from '@domain/enums/TicketStatus';
import { TicketModel } from '../sequelize/models/ticket.model';
import { Op } from 'sequelize';

export class SequelizeTicketRepository implements ITicketRepository {
  async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    const ticketModel = await TicketModel.create(ticket as any);
    
    return Ticket.create({
      id: ticketModel.id,
      title: ticketModel.title,
      description: ticketModel.description,
      status: ticketModel.status,
      priority: ticketModel.priority,
      clientId: ticketModel.clientId,
      assignedToId: ticketModel.assignedToId,
      createdAt: ticketModel.createdAt,
      updatedAt: ticketModel.updatedAt,
      resolvedAt: ticketModel.resolvedAt
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticketModel = await TicketModel.findByPk(id);
    
    if (!ticketModel) return null;
    
    return Ticket.create({
      id: ticketModel.id,
      title: ticketModel.title,
      description: ticketModel.description,
      status: ticketModel.status,
      priority: ticketModel.priority,
      clientId: ticketModel.clientId,
      assignedToId: ticketModel.assignedToId,
      createdAt: ticketModel.createdAt,
      updatedAt: ticketModel.updatedAt,
      resolvedAt: ticketModel.resolvedAt
    });
  }

  async findAll(
    filters?: TicketFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Ticket>> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
    
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt[Op.gte] = filters.dateFrom;
      if (filters.dateTo) where.createdAt[Op.lte] = filters.dateTo;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await TicketModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const tickets = rows.map(model =>
      Ticket.create({
        id: model.id,
        title: model.title,
        description: model.description,
        status: model.status,
        priority: model.priority,
        clientId: model.clientId,
        assignedToId: model.assignedToId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        resolvedAt: model.resolvedAt
      })
    );

    return {
      data: tickets,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async update(id: string, data: Partial<Omit<Ticket, 'id' | 'clientId' | 'createdAt'>>): Promise<Ticket> {
    await TicketModel.update(data as any, { where: { id } });
    const updated = await this.findById(id);
    
    if (!updated) {
      throw new Error('Ticket not found after update');
    }
    
    return updated;
  }

  async delete(id: string): Promise<void> {
    await TicketModel.destroy({ where: { id } });
  }

  async countByStatus(): Promise<Record<TicketStatus, number>> {
    const counts = await TicketModel.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }) as any[];

    const result: any = {};
    
    Object.values(TicketStatus).forEach(status => {
      result[status] = 0;
    });

    counts.forEach((item: any) => {
      result[item.status] = parseInt(item.count, 10);
    });

    return result;
  }

  async countByClient(clientId: string): Promise<number> {
    return await TicketModel.count({ where: { clientId } });
  }
}
```

---

## ⚙️ PASO 5: IMPLEMENTAR SERVICIOS

### A. JWT Token Service

**`src/infrastructure/services/jwt-token.service.ts`:**

```typescript
import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@application/ports/services/token.service.interface';
import { config } from '../config/env';

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  }
}
```

### B. Bcrypt Password Service

**`src/infrastructure/services/bcrypt-password.service.ts`:**

```typescript
import bcrypt from 'bcryptjs';
import { IPasswordService } from '@application/ports/services/password.service.interface';

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
```

### C. Resend Email Service

**`src/infrastructure/services/resend-email.service.ts`:**

```typescript
import { Resend } from 'resend';
import { IEmailService, EmailOptions } from '@application/ports/services/email.service.interface';
import { config } from '../config/env';

export class ResendEmailService implements IEmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.resend.apiKey);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `${config.resend.fromName} <${config.resend.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  async sendTicketCreatedEmail(to: string, ticketId: string, title: string): Promise<void> {
    const html = `
      <h2>Ticket Creado Exitosamente</h2>
      <p>Tu ticket ha sido creado correctamente.</p>
      <p><strong>ID:</strong> ${ticketId}</p>
      <p><strong>Título:</strong> ${title}</p>
      <p>Te notificaremos cuando haya cambios en el estado.</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Ticket Creado - Sistema de Soporte',
      html
    });
  }

  async sendTicketStatusChangedEmail(to: string, ticketId: string, newStatus: string): Promise<void> {
    const html = `
      <h2>Cambio de Estado de Ticket</h2>
      <p>El estado de tu ticket ha cambiado.</p>
      <p><strong>ID:</strong> ${ticketId}</p>
      <p><strong>Nuevo Estado:</strong> ${newStatus}</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Actualización de Ticket - Sistema de Soporte',
      html
    });
  }

  async sendTicketResponseEmail(to: string, ticketId: string, response: string): Promise<void> {
    const html = `
      <h2>Nueva Respuesta en tu Ticket</h2>
      <p>Has recibido una nueva respuesta.</p>
      <p><strong>ID:</strong> ${ticketId}</p>
      <p><strong>Respuesta:</strong></p>
      <p>${response}</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Nueva Respuesta - Sistema de Soporte',
      html
    });
  }
}
```

---

## 🎯 PASO 6: VALIDADORES ZOD

**`src/infrastructure/http/validators/auth.validator.ts`:**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido')
});
```

**`src/infrastructure/http/validators/ticket.validator.ts`:**

```typescript
import { z } from 'zod';
import { TicketPriority } from '@domain/enums/TicketPriority';
import { TicketStatus } from '@domain/enums/TicketStatus';

export const createTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.nativeEnum(TicketPriority)
});

export const updateTicketSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  priority: z.nativeEnum(TicketPriority).optional()
});

export const changeStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  comment: z.string().optional()
});
```

---

## 🛡️ PASO 7: MIDDLEWARES

### A. Auth Middleware

**`src/infrastructure/http/middlewares/auth.middleware.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../services/jwt-token.service';
import { SequelizeUserRepository } from '../../database/repositories/sequelize-user.repository';
import { UnauthorizedError } from '@domain/errors/UnauthorizedError';

const tokenService = new JwtTokenService();
const userRepository = new SequelizeUserRepository();

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7);
    const payload = tokenService.verifyAccessToken(token);

    // Obtener usuario completo
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

### B. Role Middleware

**`src/infrastructure/http/middlewares/role.middleware.ts`:**

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRole } from '@domain/enums/UserRole';
import { ForbiddenError } from '@domain/errors/ForbiddenError';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Usuario no autenticado');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('No tienes permiso para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

### C. Validation Middleware

**`src/infrastructure/http/middlewares/validation.middleware.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '@domain/errors/ValidationError';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validación fallida';
      next(new ValidationError(message));
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => e.message).join(', ') || 'Validación fallida';
      next(new ValidationError(message));
    }
  };
};
```

### D. Error Handler Middleware

**`src/infrastructure/http/middlewares/error-handler.middleware.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof DomainError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
    return;
  }

  // Error desconocido
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
};
```

### E. Not Found Middleware

**`src/infrastructure/http/middlewares/not-found.middleware.ts`:**

```typescript
import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
};
```

---

## 🎮 PASO 8: CONTROLLERS

Te voy a dar un ejemplo de controller. Sigue este patrón para los demás:

**`src/infrastructure/http/controllers/auth.controller.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { createLoginUseCase } from '@application/use-cases/auth/login.use-case';
import { createRefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { SequelizeUserRepository } from '../../database/repositories/sequelize-user.repository';
import { JwtTokenService } from '../../services/jwt-token.service';
import { BcryptPasswordService } from '../../services/bcrypt-password.service';

const userRepository = new SequelizeUserRepository();
const tokenService = new JwtTokenService();
const passwordService = new BcryptPasswordService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginUseCase = createLoginUseCase(
        userRepository,
        tokenService,
        passwordService
      );

      const result = await loginUseCase(req.body);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshTokenUseCase = createRefreshTokenUseCase(
        tokenService,
        userRepository
      );

      const result = await refreshTokenUseCase(req.body.refreshToken);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 🛣️ PASO 9: ROUTES

**`src/infrastructure/http/routes/auth.routes.ts`:**

```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshTokenSchema), AuthController.refreshToken);

export default router;
```

**`src/infrastructure/http/routes/ticket.routes.ts`:**

```typescript
import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { createTicketSchema, updateTicketSchema, changeStatusSchema } from '../validators/ticket.validator';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.post('/', validateBody(createTicketSchema), TicketController.create);
router.put('/:id', validateBody(updateTicketSchema), TicketController.update);
router.patch('/:id/status', validateBody(changeStatusSchema), TicketController.changeStatus);
router.delete('/:id', TicketController.delete);

export default router;
```

**`src/infrastructure/http/routes/index.ts`:**

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';
import userRoutes from './user.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

export default router;
```

---

## 🚀 PASO 10: SERVER

**`src/server.ts`:**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './infrastructure/config/env';
import { connectDatabase } from './infrastructure/database/sequelize/config';
import routes from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares/error-handler.middleware';
import { notFoundHandler } from './infrastructure/http/middlewares/not-found.middleware';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use(`/api/${config.server.apiVersion}`, routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.server.port, () => {
      console.log(`🚀 Servidor corriendo en puerto ${config.server.port}`);
      console.log(`📝 Ambiente: ${config.server.env}`);
      console.log(`🔗 API: http://localhost:${config.server.port}/api/${config.server.apiVersion}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
```

---

## 📝 PASO 11: SCRIPT PARA SEED DE USUARIOS

**`scripts/seed-users.ts`:**

```typescript
import { sequelize } from '../src/infrastructure/database/sequelize/config';
import { UserModel } from '../src/infrastructure/database/sequelize/models/user.model';
import { BcryptPasswordService } from '../src/infrastructure/services/bcrypt-password.service';
import { UserRole } from '../src/domain/enums/UserRole';

const passwordService = new BcryptPasswordService();

const users = [
  {
    name: 'Administrador',
    email: 'admin@test.com',
    password: 'admin123',
    role: UserRole.ADMIN
  },
  {
    name: 'Soporte Técnico',
    email: 'soporte@test.com',
    password: 'soporte123',
    role: UserRole.SUPPORT
  },
  {
    name: 'Cliente Demo',
    email: 'cliente@test.com',
    password: 'cliente123',
    role: UserRole.CLIENT
  }
];

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    await sequelize.sync({ force: true });
    console.log('✅ Modelos sincronizados');

    for (const user of users) {
      const hashedPassword = await passwordService.hash(user.password);
      
      await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });

      console.log(`✅ Usuario creado: ${user.email}`);
    }

    console.log('\n🎉 Seed completado exitosamente\n');
    console.log('Usuarios de prueba:');
    users.forEach(u => {
      console.log(`  - ${u.email} / ${u.password} (${u.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedUsers();
```

---

## ✅ PASO 12: EJECUTAR EL PROYECTO

### 1. Configurar base de datos

```bash
# Crear base de datos PostgreSQL
createdb ticket_system

# O desde psql:
# CREATE DATABASE ticket_system;
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear usuarios de prueba

```bash
npm run seed
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

### 6. Probar la API

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

---

## 📚 RESUMEN DE PRINCIPIOS APLICADOS

### ✅ Arquitectura Hexagonal
- **Domain**: Entidades, Value Objects, lógica de negocio
- **Application**: Casos de uso, puertos (interfaces)
- **Infrastructure**: Adaptadores (Sequelize, Resend, JWT)

### ✅ Programación Funcional
- Casos de uso como funciones puras
- Higher-order functions
- Composición de funciones
- Inmutabilidad en entidades

### ✅ Principios SOLID
- **S**: Cada clase/función tiene una responsabilidad única
- **O**: Abierto/cerrado mediante interfaces
- **L**: Sustitución de Liskov con interfaces
- **I**: Interfaces segregadas (IUserRepository, ITokenService, etc.)
- **D**: Inversión de dependencias (todo depende de abstracciones)

### ✅ Otros Patrones
- Repository Pattern
- Dependency Injection
- Strategy Pattern (servicios intercambiables)
- Factory Pattern (métodos create en entidades)

---

## 🎯 PRÓXIMOS PASOS

1. **Implementar controllers faltantes** (User, Report, Ticket completo)
2. **Crear tests unitarios** para casos de uso
3. **Agregar documentación Swagger/OpenAPI**
4. **Implementar rate limiting**
5. **Agregar logs estructurados**
6. **Deploy en Railway/Render**

---

¡Tienes una base sólida con arquitectura hexagonal, TypeScript, principios SOLID y programación funcional! 🚀
