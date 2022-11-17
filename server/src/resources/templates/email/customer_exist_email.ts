import { appCommonTypes } from '../../../@types/app-common';
import MailTextConfig = appCommonTypes.MailTextConfig;

export default function customer_exist_email(config: MailTextConfig) {
  return `
    <p
      style="
        color: #000000;
        font-size: 16px;
        text-align: left;
        font-family: Open Sans, Verdana, Geneva,
          sans-serif;
        line-height: 22px;
      "
    >
    Mimschach, my name is Zee and I’m the Customer Success Manager of Jiffix Technologies.
    <br/><br/>
    I wanted to take a second to say Hello and Welcome you to the family. On behalf of myself and the entire Jiffix Team, I want you to know that we are truly excited and grateful that you decided to join us.
    <br/><br/>
    Being part of the Jiffix family means that you can access our services Anywhere you are.
    <br/><br/>
    Here at Jiffix, our mission is to enable your safe, reliable and unhindered mobility by providing you with quality servicing, repairs and maintenance services. We hope that you continue to use and enjoy our services as we aim to reimagine and recreate your experience.
    <br/><br/>
    Thank You
    <br/><br/>
    Zimchim Andrea
    Customer Success Manager
    <br/><br/>
    On this email, we have provided you with your Login details as follow
    </p>
    <p
      style="
        color: #000000;
        font-size: 16px;
        text-align: left;
        font-family: Open Sans, Verdana, Geneva,
          sans-serif;
        line-height: 22px;
      "
    >
      <b>Username</b>: ${config.username}
      <br />
      <b>Password</b>: ${config.password}
    </p>
    <p
    style="
    color: #000000;
    margin-top: 10px;
    font-size: 16px;
    text-align: left;
    font-style: italic;
    font-family: Open Sans, Verdana, Geneva,
      sans-serif;
    line-height: 22px;
    "
    >
    P.S click on this link to change your Password
    </p>
    
    <div style="margin-top: 10px !important">
      <a
        href="${config.loginUrl}"
        style="
          width: 250px;
          display: block;
          background-color: #2196f3 !important;
          padding: 20px !important;
          border-radius: 10px !important;
          text-decoration: none;
          border: 0;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          font-family: Arial, sans-serif;
          color: #ffffff;
        "
        class="button_link"
        >Change Password</a
      >
    </div>

`;
}
