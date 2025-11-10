import { EventEmitter } from 'events';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from './send.email';
import { BadRequestException } from '@nestjs/common';

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  to: string;
  subject: string;
  html: string;
}

emailEvent.on('sendEmail', (emailStructure: IEmail) => {
  void (async () => {
    try {
      const { isEmailSended, info } = await sendEmail({
        to: emailStructure.to,
        subject: emailStructure.subject,
        html: emailStructure.html,
      });

      if (!isEmailSended) {
        throw new BadRequestException('Error while sending email');
      }
    } catch (err) {
      console.error('Email send error:', err);
    }
  })();
});
