import { appCommonTypes } from "../../../@types/app-common";
import MailTextConfig = appCommonTypes.MailTextConfig;

export default function create_customer_success_email(config: MailTextConfig) {
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
      On behalf of the entire team @ Jiffix - Welcome to
      the Family!!!
      <br /><br />
      @ Jiffix, our mission is your
      <strong>safe</strong>,
      <strong>reliable</strong> and
      <strong>unhindered</strong> mobility, and being
      part of the Jiffix family means that you can
      access ALL our services
      <strong>anywhere you are</strong>. <br /><br />
      We’re excited to have you on board, and hope you
      continue to enjoy our services as we reimagine and
      improve your vehicle management experience.
      <br /><br />
      To subscribe to a plan, add vehicles to your plan,
      schedule an appointment and
      <strong>much more</strong>, visit your dashboard!
      <br /><br />
      <b>Username</b>: ${config.username}
      <br />
      <b>Password</b>: ${config.password}
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
        >Login</a
      >
      <p
        style="
          margin-top: 10px;
          color: #000000;
          font-size: 16px;
          text-align: left;
          font-style: italic;
          font-family: Open Sans, Verdana, Geneva,
            sans-serif;
          line-height: 22px;
        "
      >
        If you’d like some help with anything, you can
        reach us
        <a href="${config.whatsappUrl}">here</a>.
      </p>
    </div>
`;
}
