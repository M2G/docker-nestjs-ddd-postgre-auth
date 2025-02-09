interface MailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
interface IMailProvider {
  sendMail: ({ to, from, subject, content }) => Promise<MailResponse>;
}

export type { MailResponse, IMailProvider };
