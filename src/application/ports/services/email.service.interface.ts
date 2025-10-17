export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Puerto (Interface) para el servicio de email
 */
export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<void>;
  sendTicketCreatedEmail(to: string, ticketId: string, title: string): Promise<void>;
  sendTicketStatusChangedEmail(to: string, ticketId: string, newStatus: string): Promise<void>;
  sendTicketResponseEmail(to: string, ticketId: string, response: string): Promise<void>;
}
