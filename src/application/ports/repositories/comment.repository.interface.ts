import { Comment } from "@domain/entities/Comment";

export interface ICommentRepository{
  create(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>;
  /* findByTicketId(ticketId: string): Promise<Comment>;
  findByClientId(clientId: string): Promise<Comment[]>;
  findBySupportId(supportId: string): Promise<Comment[]>; */
}