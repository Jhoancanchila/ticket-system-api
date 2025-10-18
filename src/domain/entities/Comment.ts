/**
 * Entidad Comment - Representa un comentario o respuesta en un ticket
 */
export class Comment {
  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id: string;
    ticketId: string;
    userId: string;
    content: string;
    createdAt: Date;
  }): Comment {
    return new Comment(
      data.id,
      data.ticketId,
      data.userId,
      data.content,
      data.createdAt
    );
  }

  toPlainObject() {
    return {
      id: this.id,
      ticketId: this.ticketId,
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt
    };
  }
}
