import nodemailer from 'nodemailer';
import { IEmailService, EmailOptions } from '@application/ports/services/email.service.interface';
import { config } from '../config/env';

export class ResendEmailService implements IEmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.nodemailer.fromEmail,
        pass: config.nodemailer.fromEmailPassword
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const result = await this.transporter.sendMail({
        from: `${config.nodemailer.fromName} <${config.nodemailer.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
      });
      
    } catch (error: any) {
      console.error('Error detallado al enviar email:', {
        message: error.message,
        statusCode: error.statusCode,
        name: error.name,
        error: error
      });
      throw new Error(`Failed to send email: ${error.message || error}`);
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