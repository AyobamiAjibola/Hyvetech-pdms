import { appCommonTypes } from "../../../@types/app-common";
import MailTextConfig = appCommonTypes.MailTextConfig;

export default function skip_booking_followup_email(config: MailTextConfig) {
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
      We noticed you haven’t booked an appointment since
      you subscribed to our “Name of plan” yesterday. I
      hope you haven’t forgotten though?
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
      This is to let you know that we are thrilled to
      have you on board with us and we look forward to
      your first Jiffix experience!
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
      Whenever you are ready, you can log into your
      dashboard and schedule an inspection, or simply
      use the button below:
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
        >Schedule Next Appointment</a
      >
    </div>
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
      Cheers!
    </p>

`;
}
