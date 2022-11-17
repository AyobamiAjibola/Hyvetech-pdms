import email_layout from './email_layout';
import { appCommonTypes } from '../../../@types/app-common';
import MailBody = appCommonTypes.MailBody;

const logo = `${process.env.WEBSITE_HOST_WWW}/api/v1/static/images/logo/Blue.png`;

export default function email_content(mailBody: MailBody) {
  return email_layout(
    `
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background-color: #fafafa"
  bgcolor="#fafafa;"
>
  <tbody>
    <tr>
      <td width="100%">
        <div class="webkit" style="max-width: 600px; margin: 0 auto">
          <!--[if (gte mso 9)|(IE)]>
                <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0">
                    <tr>
                        <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                <![endif]-->

          <!-- ======= start main body ======= -->
          <table
            class="outer"
            align="center"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border-spacing: 0;
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
            "
          >
            <tbody>
              <tr>
                <td
                  style="
                    padding-top: 0;
                    padding-bottom: 0;
                    padding-right: 0;
                    padding-left: 0;
                  "
                >
                  <!-- ======= start header ======= -->

                  <table
                    border="0"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            style="width: 100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td align="center">
                                  <center>
                                    <table
                                      border="0"
                                      align="center"
                                      width="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      style="margin: 0 auto"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            class="one-column"
                                            style="
                                              padding-top: 0;
                                              padding-bottom: 0;
                                              padding-right: 0;
                                              padding-left: 0;
                                            "
                                            bgcolor="#FFFFFF"
                                          >
                                            <!-- ======= start header ======= -->

                                            <table
                                              cellpadding="0"
                                              cellspacing="0"
                                              border="0"
                                              width="100%"
                                              bgcolor="#fafafa"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    class="two-column"
                                                    style="
                                                      padding-top: 0;
                                                      padding-bottom: 0;
                                                      padding-right: 0;
                                                      padding-left: 0;
                                                      text-align: left;
                                                      font-size: 0;
                                                    "
                                                  >
                                                    <!--[if (gte mso 9)|(IE)]>
                                                                                <table width="100%"
                                                                                       style="border-spacing:0">
                                                                                    <tr>
                                                                                        <td width="20%" valign="top"
                                                                                            style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:30px;">
                                                                                <![endif]-->

                                                    <div
                                                      class="column"
                                                      style="
                                                        width: 100%;
                                                        max-width: 160px;
                                                        display: inline-block;
                                                        vertical-align: top;
                                                      "
                                                    >
                                                      <table
                                                        class="contents"
                                                        style="
                                                          border-spacing: 0;
                                                          width: 100%;
                                                        "
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              style="
                                                                padding-top: 10px;
                                                                padding-bottom: 0;
                                                                padding-right: 0;
                                                                padding-left: 5px;
                                                              "
                                                              align="left"
                                                            >
                                                              <a
                                                                href="#"
                                                                target="_blank"
                                                                ><img
                                                                  src=${logo}
                                                                  alt=""
                                                                  width="241"
                                                                  height="47"
                                                                  style="
                                                                    border-width: 0;
                                                                    max-height: 160px;
                                                                    height: auto;
                                                                    display: block;
                                                                  "
                                                                  align="left"
                                                              /></a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>

                                                    <!--[if (gte mso 9)|(IE)]>
                                                                                </td>
                                                                                <td width="80%" valign="top"
                                                                                    style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                                                                                <![endif]-->

                                                    <div
                                                      class="column"
                                                      style="
                                                        width: 100%;
                                                        max-width: 430px;
                                                        display: inline-block;
                                                        vertical-align: top;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        style="
                                                          border-spacing: 0;
                                                        "
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        border="0"
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              class="inner"
                                                              style="
                                                                padding-top: 0px;
                                                                padding-bottom: 10px;
                                                                padding-right: 10px;
                                                                padding-left: 10px;
                                                              "
                                                            >
                                                              <table
                                                                class="contents"
                                                                style="
                                                                  border-spacing: 0;
                                                                  width: 100%;
                                                                "
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                border="0"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      align="left"
                                                                      valign="top"
                                                                    >
                                                                      &nbsp;
                                                                    </td>
                                                                  </tr>
                                                                  <tr>
                                                                    <td
                                                                      align="right"
                                                                      valign="top"
                                                                    >
                                                                      <font
                                                                        style="
                                                                          font-size: 11px;
                                                                          text-decoration: none;
                                                                          color: #474b53;
                                                                          font-family: Open
                                                                              Sans,
                                                                            Open
                                                                              Sans,
                                                                            Verdana,
                                                                            Geneva,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          line-height: 16px;
                                                                          padding-bottom: 30px;
                                                                        "
                                                                        ><a
                                                                          href="https://www.jiffixtech.com"
                                                                          target="_blank"
                                                                          style="
                                                                            color: #474b53;
                                                                            text-decoration: none;
                                                                          "
                                                                          >View
                                                                          as a
                                                                          web
                                                                          page</a
                                                                        ></font
                                                                      >
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>

                                                    <!--[if (gte mso 9)|(IE)]>
                                                                                </td>
                                                                                </tr>
                                                                                </table>
                                                                                <![endif]-->
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>&nbsp;</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </center>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    class="one-column"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="
                      border-spacing: 0;
                      border-left: 1px solid #e8e7e5;
                      border-right: 1px solid #e8e7e5;
                      border-bottom: 1px solid #e8e7e5;
                      border-top: 1px solid #e8e7e5;
                    "
                    bgcolor="#FFFFFF"
                  >
                    <tbody>
                      <tr>
                        <td align="left" style="padding: 50px 50px 50px 50px">
                          <p
                            style="
                              color: #262626;
                              font-size: 24px;
                              text-align: left;
                              font-family: Open Sans, Verdana, Geneva,
                                sans-serif;
                            "
                          >
                            <strong>Hello ${mailBody.firstName}</strong>,
                          </p>
                          <div
                            style="
                              font-size: 16px;
                              font-family: Open Sans, Verdana, Geneva,
                                sans-serif;
                            "
                          >
                                ${mailBody.text}
                          </div>
                          <p
                            style="
                              margin-top: 5px;
                              color: #000000;
                              font-size: 16px;
                              text-align: left;
                              font-family: Open Sans, Verdana, Geneva,
                                sans-serif;
                              line-height: 22px;
                            "
                          >
                            <strong>${mailBody.signature}</strong> <span style="font-style: italic">from Jiffix</span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td height="30">&nbsp;</td>
                      </tr>
                      <tr>
                        <td
                          class="two-column"
                          style="
                            padding-top: 0;
                            padding-bottom: 0;
                            padding-right: 0;
                            padding-left: 0;
                            text-align: center;
                            font-size: 0;
                          "
                        >
                          <!--[if (gte mso 9)|(IE)]>
                                        <table width="100%" style="border-spacing:0">
                                            <tr>
                                                <td width="60%" valign="top"
                                                    style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                                        <![endif]-->

                          <div
                            class="column"
                            style="
                              width: 100%;
                              max-width: 350px;
                              display: inline-block;
                              vertical-align: top;
                            "
                          >
                            <table
                              class="contents"
                              style="border-spacing: 0; width: 100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    width="39%"
                                    align="right"
                                    style="
                                      padding-top: 0;
                                      padding-bottom: 0;
                                      padding-right: 10px;
                                      padding-left: 0;
                                    "
                                  >
                                    <a href="#" target="_blank"
                                      ><img
                                        src=${logo}
                                        alt=""
                                        width="59"
                                        height="59"
                                        style="
                                          border-width: 0;
                                          max-width: 59px;
                                          height: auto;
                                          display: block;
                                          padding-right: 20px;
                                        "
                                    /></a>
                                  </td>
                                  <td
                                    width="61%"
                                    align="left"
                                    valign="middle"
                                    style="
                                      padding-top: 0;
                                      padding-bottom: 0;
                                      padding-right: 0;
                                      padding-left: 0;
                                    "
                                  >
                                    <p
                                      style="
                                        color: #787777;
                                        font-size: 13px;
                                        text-align: left;
                                        font-family: Open Sans, Open Sans,
                                          Verdana, Geneva, sans-serif;
                                      "
                                    >
                                      Copyright Jiffixtech @ ${new Date().getUTCFullYear()}<br />
                                      All rights reserved
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        <td width="40%" valign="top"
                                            style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                                        <![endif]-->

                          <div
                            class="column"
                            style="
                              width: 100%;
                              max-width: 248px;
                              display: inline-block;
                              vertical-align: top;
                            "
                          >
                            <table width="100%" style="border-spacing: 0">
                              <tbody>
                                <tr>
                                  <td
                                    class="inner"
                                    style="
                                      padding-top: 0px;
                                      padding-bottom: 10px;
                                      padding-right: 10px;
                                      padding-left: 10px;
                                    "
                                  >
                                    <table
                                      class="contents"
                                      style="border-spacing: 0; width: 100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            width="32%"
                                            align="center"
                                            valign="top"
                                            style="padding-top: 10px"
                                          >
                                            <table
                                              width="150"
                                              border="0"
                                              cellspacing="0"
                                              cellpadding="0"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td width="33" align="center">
                                                    <a href="https://web.facebook.com/JiffixTech" target="_blank"
                                                      ><img
                                                        src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/150px-Facebook_f_logo_%282021%29.svg.png"
                                                        alt="facebook"
                                                        width="36"
                                                        height="36"
                                                        border="0"
                                                        style="
                                                          border-width: 0;
                                                          max-width: 36px;
                                                          height: auto;
                                                          display: block;
                                                          max-height: 40px;
                                                        "
                                                    /></a>
                                                  </td>
                                                  <td width="34" align="center">
                                                    <a href="https://www.linkedin.com/in/jiffix-technologies-8b29b5240" target="_blank"
                                                      ><img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Linkedin.svg/220px-Linkedin.svg.png"
                                                        alt="linkedin"
                                                        width="36"
                                                        height="36"
                                                        border="0"
                                                        style="
                                                          border-width: 0;
                                                          max-width: 36px;
                                                          height: auto;
                                                          display: block;
                                                          max-height: 40px;
                                                        "
                                                    /></a>
                                                  </td>
                                                  <td width="33" align="center">
                                                    <a href="#" target="_blank"
                                                      ><img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/220px-Instagram-Icon.png"
                                                        alt="instagram"
                                                        width="36"
                                                        height="36"
                                                        border="0"
                                                        style="
                                                          border-width: 0;
                                                          max-width: 36px;
                                                          height: auto;
                                                          display: block;
                                                          max-height: 40px;
                                                        "
                                                    /></a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td height="30">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- ======= end footer ======= -->
                </td>
              </tr>
            </tbody>
          </table>
          <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
        </div>
      </td>
    </tr>
  </tbody>
</table>

      `,
  );
}
