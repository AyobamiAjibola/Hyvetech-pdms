import settings from '../config/settings';
import MailService, { IMailHTMLPayload } from './MailService';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(settings.sendGrid.apiKey);

class SendGridMailService implements MailService {
  sendHtmlMail(payload: IMailHTMLPayload) {
    const msg = {
      to: payload.to,
      from: payload.from, // Use the email address or domain you verified above
      subject: payload.subject,
      html: payload.html,
    };

    return sgMail.send(msg);
  }
}

export default SendGridMailService;
