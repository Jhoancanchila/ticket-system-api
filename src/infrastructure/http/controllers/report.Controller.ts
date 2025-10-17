import { NextFunction, Request, Response } from "express";
import { createGetDashboardStatsUseCase } from "@application/use-cases/reports/get-dashboard-stats.use-case";
import { SequelizeTicketRepository } from "@infrastructure/database/repositories/sequelize-ticket.repository";
import { SequelizeUserRepository } from "@infrastructure/database/repositories/sequelize-user.repository";

const ticketRepository = new SequelizeTicketRepository();
const userRepository = new SequelizeUserRepository();

export class ReportController{
  static async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reportData = req.body;
      const generateReport = createGetDashboardStatsUseCase(ticketRepository, userRepository);
      const report = await generateReport(reportData.user);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }
}