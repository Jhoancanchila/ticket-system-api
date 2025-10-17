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