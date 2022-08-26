import { appCommonTypes } from "../../../@types/app-common";
import {
  DRIVE_IN_CATEGORY,
  HYBRID_CATEGORY,
  MOBILE_CATEGORY,
} from "../../../config/constants";
import MailTextConfig = appCommonTypes.MailTextConfig;

export default function house_hold_sub_email(config: MailTextConfig) {
  const getLocationText = () => {
    let text = "";

    if (config.planCategory === MOBILE_CATEGORY)
      text =
        "your location (no need to stress, tell us where and when, and we will come to you).";

    if (config.planCategory === DRIVE_IN_CATEGORY)
      text = "any of our partner garages.";

    return text;
  };

  const getPlanText = () => {
    let text = `${config.numOfInspections} of 
    ${config.planCategory} inspections at ${getLocationText()}`;

    if (config.planCategory === HYBRID_CATEGORY) {
      text = `5 <b>Drive-in</b> inspections at any of
      our partner garages and 2 <b>Mobile</b> 
      inspections (no need to stress, tell us
      where and when, and we'll come to you).`;
    }

    return text;
  };

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
      Thank you for subscribing to the
      <b>${config.subName}</b> plan. This plan offers you access to
      <b>${config.numOfInspections}</b> inspections, for up to
      <b>${config.numOfVehicles}</b> cars.
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
      You have chosen our <b>${config.planCategory}</b> service
      mode which allows you ${getPlanText()}
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
      To add more vehicles to your plan and schedule an appointment, 
      visit your dashboard and get started!<br /><br />

    </p>
    <table
      border="0"
      align="left"
      cellpadding="0"
      cellspacing="0"
      style="margin: 0 auto"
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              style="margin: 0 auto"
            >
              <tbody>
                <tr>
                  <td
                    width="250"
                    height="60"
                    align="center"
                    bgcolor=""
                    style="
                    background-color: #2196f3;
                      -moz-border-radius: 30px;
                      -webkit-border-radius: 30px;
                      border-radius: 30px;
                    "
                  >
                    <a
                      href="${config.loginUrl}"
                      style="
                        width: 250px;
                        display: block;
                        text-decoration: none;
                        border: 0;
                        text-align: center;
                        font-weight: bold;
                        font-size: 18px;
                        font-family: Arial, sans-serif;
                        color: #ffffff;
                      "
                      class="button_link"
                      >
                      Login
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <p
      style="
        margin-top: 100px !important;
        color: #000000;
        font-size: 16px;
        text-align: left;
        font-family: Open Sans, Verdana, Geneva,
          sans-serif;
        line-height: 22px;
      "
    >
      Welcome to the Jiffix Family
    </p>
`;
}

/*
      <b>Username</b>: ${config.username}
      <br />
      <b>Password</b>: ${config.password}
 */
