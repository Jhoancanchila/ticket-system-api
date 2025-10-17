/**
 * Entidad Comment - Representa un comentario o respuesta en un ticket
 */
export class Comment {
  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly isInternal: boolean,
    public readonly createdAt: Date
  ) {}

  isVisibleToClient(): boolean {
    return !this.isInternal;
  }

  static create(data: {
    id: string;
    ticketId: string;
    userId: string;
    content: string;
    isInternal: boolean;
    createdAt: Date;
  }): Comment {
    return new Comment(
      data.id,
      data.ticketId,
      data.userId,
      data.content,
      data.isInternal,
      data.createdAt
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      ticketId: this.ticketId,
      userId: this.userId,
      content: this.content,
      isInternal: this.isInternal,
      createdAt: this.createdAt
    };
  }
}
