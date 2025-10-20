
import { SequelizeTicketRepository } from "@infrastructure/database/repositories/sequelize-ticket.repository";
import { SequelizeUserRepository } from "@infrastructure/database/repositories/sequelize-user.repository";
import { Request, Response, NextFunction } from "express";
import { createChangeTicketStatusUseCase } from "@application/use-cases/tickets/change-ticket-status.use-case";
import { createDeleteTicketUseCase } from "@application/use-cases/tickets/delete-ticket.use-case";
import { createUpdateTicketUseCase } from "@application/use-cases/tickets/update-ticket.use-case";
import { createTicketUseCase } from "@application/use-cases/tickets/create-ticket.use-case";
import { createGetTicketsUseCase } from "@application/use-cases/tickets/get-tickets.use-case";
import { createGetTicketByIdUseCase } from "@application/use-cases/tickets/get-ticket-by-id.use-case";

import { SendEmailService } from "@infrastructure/services/send-email.service";

const ticketRepository = new SequelizeTicketRepository();
const userRepository = new SequelizeUserRepository();

const sendEmailService = new SendEmailService();

export class TicketController{
  static async createTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketData = req.body;
      const clientId = (req as any).user.id;

      const createTicket = createTicketUseCase(ticketRepository, userRepository, sendEmailService);
      const ticket = await createTicket(clientId, ticketData);
      
      res.status(201).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.id;
      const ticketData = req.body;
      const user = (req as any).user;
      
      const updateTicket = createUpdateTicketUseCase(ticketRepository);
      const ticket = await updateTicket(ticketId, user, ticketData);
      
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.id;
      const user = (req as any).user;
      
      const deleteTicket = createDeleteTicketUseCase(ticketRepository);
      await deleteTicket(ticketId, user);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      
      // Obtener filtros de query params
      const filters: any = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.clientId) filters.clientId = req.query.clientId;
      
      // Paginación
      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };
      
      const getTickets = createGetTicketsUseCase(ticketRepository);
      const tickets = await getTickets(user, filters, pagination);
      
      res.status(200).json({
        success: true,
        data: tickets
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTicketById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.id;
      const user = (req as any).user;
      
      const getTicketById = createGetTicketByIdUseCase(ticketRepository);
      const ticket = await getTicketById(ticketId, user);
      
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeTicketStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.id;
      const ticketData = req.body;
      const user = (req as any).user;
      
      const changeTicketStatus = createChangeTicketStatusUseCase(ticketRepository, userRepository, sendEmailService);
      const ticket = await changeTicketStatus(ticketId, user, ticketData);
      
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
}