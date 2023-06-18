export class ConfirmEmailPayload {
  constructor({ userEmail, name, code }: ConfirmEmailPayload) {
    this.userEmail = userEmail;
    this.name = name;
    this.code = code;
  }

  userEmail: string;
  name: string;
  code: string;
}
