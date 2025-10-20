import { ITicketRepository, TicketFilters, PaginationOptions, PaginatedResult } from '@application/ports/repositories/ticket.repository.interface';
import { Ticket } from '@domain/entities/Ticket';
import { TicketStatus } from '@domain/enums/TicketStatus';
import { TicketModel } from '../sequelize/models/ticket.model';
import { CommentModel } from '../sequelize/models/comment.model';
import { UserModel } from '../sequelize/models/user.model';
import { Op } from 'sequelize';
import { sequelize } from '../sequelize/config';

export class SequelizeTicketRepository implements ITicketRepository {
  async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    const ticketModel = await TicketModel.create(ticket as any);
    
    return Ticket.create({
      id: ticketModel.id,
      title: ticketModel.title,
      description: ticketModel.description,
      status: ticketModel.status,
      clientId: ticketModel.clientId,
      createdAt: ticketModel.createdAt,
      updatedAt: ticketModel.updatedAt,
      resolvedAt: ticketModel.resolvedAt
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticketModel = await TicketModel.findByPk(id, {
      include: [
        {
          model: CommentModel,
          as: 'comments',
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
    
    if (!ticketModel) return null;
    
    const ticketData: any = {
      id: ticketModel.id,
      title: ticketModel.title,
      description: ticketModel.description,
      status: ticketModel.status,
      clientId: ticketModel.clientId,
      createdAt: ticketModel.createdAt,
      updatedAt: ticketModel.updatedAt,
      resolvedAt: ticketModel.resolvedAt
    };

    // Agregar comentarios si existen
    if ((ticketModel as any).comments) {
      ticketData.comments = (ticketModel as any).comments.map((comment: any) => ({
        id: comment.id,
        ticketId: comment.ticketId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user ? {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email
        } : null
      }));
    }
    
    return Ticket.create(ticketData);
  }

  async findAll(
    filters?: TicketFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Ticket>> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.clientId) where.clientId = filters.clientId;
    
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
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: CommentModel,
          as: 'comments',
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    const tickets = rows.map(model => {
      const ticketData: any = {
        id: model.id,
        title: model.title,
        description: model.description,
        status: model.status,
        clientId: model.clientId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        resolvedAt: model.resolvedAt
      };

      // Agregar comentarios si existen
      if ((model as any).comments) {
        ticketData.comments = (model as any).comments.map((comment: any) => ({
          id: comment.id,
          ticketId: comment.ticketId,
          userId: comment.userId,
          content: comment.content,
          createdAt: comment.createdAt,
          user: comment.user ? {
            id: comment.user.id,
            name: comment.user.name,
            email: comment.user.email
          } : null
        }));
      }

      return Ticket.create(ticketData);
    });

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