export default interface MailService {
  sendHtmlMail: (payload: IMailHTMLPayload) => Promise<any>;
}

export interface IMailHTMLPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}
