export class ResetPasswordPayload {
  constructor({ userEmail, url, name }: ResetPasswordPayload) {
    this.userEmail = userEmail;
    this.url = url;
    this.name = name;
  }

  userEmail: string;
  url: string;
  name: string;
}
