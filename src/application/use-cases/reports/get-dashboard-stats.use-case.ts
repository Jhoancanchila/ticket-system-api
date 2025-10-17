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