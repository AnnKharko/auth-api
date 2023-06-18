import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMail } from './type/mail.type';
import { emails } from './templates';
import { ResetPasswordPayload } from './payload/reset-password.payload';
import { ConfirmEmailPayload } from './payload/confirm-email.payload';
import { OnEvent } from '@nestjs/event-emitter';
import { GraphQLError } from 'graphql';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(to: string, email: IMail<any>): Promise<void> {
    const filename = 'logo.png';

    console.dir({
      action: 'sendEmail',
      args: {
        to,
        email,
        context: email.context,
      },
    });

    await this.mailerService
      .sendMail({
        to,
        subject: email.subject,
        template: email.templateName,
        context: email.context,
        attachments: [
          {
            filename,
            path: __dirname + '/../../static/' + filename,
            cid: 'logo',
          },
        ],
      })
      .catch((e: Error) => {
        throw new GraphQLError(e.message);
      });
  }

  @OnEvent('user.reset-password')
  startPasswordReset({ userEmail, ...context }: ResetPasswordPayload) {
    this.sendEmail(userEmail, emails.RESET_PASSWORD({ ...context }));
  }

  @OnEvent('user.confirm-email')
  changeUserEmail({ userEmail, ...context }: ConfirmEmailPayload) {
    this.sendEmail(userEmail, emails.CHANGE_EMAIL({ ...context }));
  }
}
