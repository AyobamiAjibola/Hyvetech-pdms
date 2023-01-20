"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function one_time_sub_email(config) {
    const getLocationText = () => {
        let text = '';
        if (config.planCategory === 'Mobile')
            text = 'your location (no need to stress, tell us where and when, and we will come to you).';
        if (config.planCategory === 'Drive-in')
            text = 'any of our partner garages.';
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
      mode which allows you ${config.numOfInspections} of 
      ${config.planCategory} inspections at ${getLocationText()}
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
      <b>Username</b>: ${config.username}
      <br />
      <b>Password</b>: ${config.password}
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
exports.default = one_time_sub_email;
