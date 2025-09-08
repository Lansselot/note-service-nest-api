import { Injectable } from '@nestjs/common';
import nodemailer, { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailerService {
  private mailTransporter: nodemailer.Transporter;

  constructor() {
    this.mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<SentMessageInfo> {
    return this.mailTransporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject,
      text,
    });
  }
}
