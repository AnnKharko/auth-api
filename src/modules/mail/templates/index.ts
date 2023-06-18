import { IMail } from '../type/mail.type';

export interface MailType {
  RESET_PASSWORD: (context: {
    name: string;
    url: string;
  }) => IMail<{ name: string; url: string }>;
  CHANGE_EMAIL: (context: {
    name: string;
    code: string;
  }) => IMail<{ name: string; code: string }>;
}

const reset_pass_url = (key: string) =>
  `${process.env.FRONTEND_URL}/authorization/password-verification/${key}`;

export const emails: MailType = {
  RESET_PASSWORD: (context: { name: string; url: string }) => ({
    templateName: 'reset-password',
    subject: 'Reset your password',
    context: {
      ...context,
      url: reset_pass_url(context.url),
    },
  }),
  CHANGE_EMAIL: (context: { name: string; code: string }) => ({
    templateName: 'confirm-email',
    subject: 'Confirm email',
    context: {
      ...context,
    },
  }),
};
