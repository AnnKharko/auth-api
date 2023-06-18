type TemplateName = 'reset-password' | 'confirm-email';

export interface IMail<T> {
  templateName: TemplateName;
  subject: string;
  context?: T & {
    text?: string;
    url?: string;
  };
}
