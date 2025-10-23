import { TicketStatus } from '../enums/TicketStatus';

/**
 * Entidad Ticket - Representa una solicitud de soporte
 * Encapsula toda la lógica de negocio de los tickets
 */
export class Ticket {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TicketStatus,
    public readonly clientId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public resolvedAt: Date | null,
    public comments?: any[], // Array opcional de comentarios
    public createdBy?: any // Usuario que creó el ticket
  ) {}

  // Métodos de negocio

  isPending(): boolean {
    return this.status === TicketStatus.PENDING;
  }

  isInProgress(): boolean {
    return this.status === TicketStatus.IN_PROGRESS;
  }

  isResolved(): boolean {
    return this.status === TicketStatus.RESOLVED;
  }

  isClosed(): boolean {
    return this.status === TicketStatus.CLOSED;
  }

  changeStatus(newStatus: TicketStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
    
    if (newStatus === TicketStatus.RESOLVED && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
  }

  updateDetails(title?: string, description?: string): void {
    if (title) this.title = title;
    if (description) this.description = description;
    this.updatedAt = new Date();
  }

  canBeEditedBy(userId: string, userRole: string): boolean {
    // Admin y soporte pueden editar cualquier ticket
    if (userRole === 'admin' || userRole === 'support') {
      return true;
    }
    // Cliente solo puede editar sus tickets pendientes
    return this.clientId === userId && this.isPending();
  }

  canBeDeletedBy(userRole: string): boolean {
    // Solo admin puede eliminar tickets
    return userRole === 'admin';
  }

  // Factory method
  static create(data: {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date | null;
    comments?: any[];
    createdBy?: any;
  }): Ticket {
    return new Ticket(
      data.id,
      data.title,
      data.description,
      data.status,
      data.clientId,
      data.createdAt,
      data.updatedAt,
      data.resolvedAt,
      data.comments,
      data.createdBy
    );
  }

  // Convertir a objeto simple
  toPlainObject() {
    const obj: any = {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      clientId: this.clientId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt
    };

    if (this.createdBy) {
      obj.createdBy = this.createdBy;
    }

    if (this.comments && this.comments.length > 0) {
      obj.comments = this.comments;
    }

    return obj;
  }
}
