interface IProps {
  partnerName: string;
  password: string;
  appUrl: string;
}

function ride_share_partner_welcome_email(props: IProps) {
  const { partnerName, password, appUrl } = props;
  return `
<!DOCTYPE html>
<html lang="en">
${header()}
<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <!-- BANNER IMAGE SECTION -->
            <tr>
                <td>
                    <a href="#">
                        <img src="https://res.cloudinary.com/blisify/image/upload/v1666780414/welcome_egn8a9.png" alt=""
                            width="600" style="max-width: 100%;">
                    </a>
                </td>
            </tr>

            <!-- EMAIL CONTENT SECTION -->
            <tr>
                <td style="padding: 20px 5px 50px;">
                    <table width="100%">

                        <tr>
                            <td>
                                <h4
                                    style="font-size: 16px; font-weight:700; margin-left: 30px; font-family: 'Inter', sans-serif;">
                                   ${partnerName}’s Hyve has beencreated
                                </h4>
                                <p
                                    style="font-size: 12px; font-weight:400; line-height: 19px; margin-left: 30px; max-width: 500px; font-family: 'Inter', sans-serif;">
                                    It’s a pleasure to welcome you to the Jiffix family and partner network! We are
                                    passionate about making partnerships
                                    work - and through AutoHyve, we want to create shared prosperity by simplifying your
                                    drivers’ and their vehicles
                                    compliance.</p>

                                <p
                                    style="font-size: 12px; font-weight:400; line-height:19px; margin-left: 30px; max-width: 500px; font-family: 'Inter', sans-serif;">
                                    While we take care of all the operational processes required to keep your drivers
                                    longer on the road, you can sign in to
                                    your Hyve and monitor the status of your driver compliance at any point in time.</p>

                                <p
                                    style="font-size: 12px; font-weight:400; line-height: 19px; margin-left: 30px; max-width: 500px; font-family: 'Inter', sans-serif;">
                                    Your username is your email address. Sign in with your password below and complete
                                    your onboarding</p>

                                <p class="password-btn">[${password}]</p>
                                <a href="${appUrl}" class="sign-btn">Sign In</a>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>

            <tr>
                <td height="1" style=" background-color:#F2C94C"></td>
            </tr>

            <tr>
                <td>
                    <table width="100%">

                        <tr>
                            <td height="1" style=" background-color:#F2C94C"></td>
                        </tr>

                        <tr>
                            <td>
                                <p style="font-style: normal;
font-weight: 600;
font-size: 12px; text-align: center; margin:30px 0px; font-family: 'Inter', sans-serif;">2022 Jiffix Technologies, All
                                    Rightts Reserved</p>
                            </td>
                        </tr>



                    </table>
                </td>
            </tr>

            <tr>
                <td style="height: 49px; background: #263238;"></td>
            </tr>

        </table>
    </center>
</body>

</html>
    `;
}

const header = () => `
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome To AutoHyve</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
        }

        table {
            border-spacing: 0;
        }

        td {
            padding: 0;
        }

        img {
            border: 0;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
        }

        .main {
            width: 100%;
            max-width: 600px;
            background-color: #fff;
        }

        .password-btn {
            background: #D9D9D9;
            border-radius: 5px;
            font-weight: 700;
            font-size: 12px;
            text-align: center;
            display: block;
            text-decoration: none;
            color: #000;
            width: 20%;
            margin: 0 auto;
            margin-bottom: 13px;
            margin-top: 9px;
            padding: 7px 50px;

        }

        .sign-btn {
            background: #FBA91A;
            border-radius: 5px;
            color: #000000;
            font-weight: 700;
            font-size: 12px;
            text-align: center;
            display: block;
            text-decoration: none;
            width: 20%;
            margin: 0 auto;
            padding: 7px 50px;
        }

        .click-bnt {
            background: #D9D9D9;
            border-radius: 5px;
            font-weight: 400;
            font-size: 12px;
            text-align: center;
            text-decoration: none;
            display: block;
            padding: 11px;
            color: #000000;
        }

        .firstBnt {
            margin-top: 15px;
        }

        .secondBtn {
            margin-top: 8px;
        }

        .two-colums {
            width: 100%;
            text-align: center;
        }

        .two-colums .column {
            width: 100%;
            max-width: 200px;
            vertical-align: top;
            height: 200px;
            display: inline-block;
            text-align: center;
        }

        .two-colums .padding {
            padding: 10px;
        }

        .two-colums .content {
            font-size: 15px;
        }

        .mailBoxHead {
            text-align: center;
            width: 109px;
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
        }

        @media(max-width:600px) {
            .two-colums .column {
                width: 100%;
                max-width: 200px;
                vertical-align: top;
                height: 200px;
                display: inline-block;
                text-align: center;
                margin-left: 20%;
            }

            .sign-btn {
                background: #FBA91A;
                border-radius: 5px;
                color: #000000;
                font-weight: 700;
                font-size: 12px;
                text-align: center;
                display: block;
                text-decoration: none;
                width: 20%;
                margin: 0 auto;
                padding: 10px 50px !important;
                margin-top: 20px !important;
            }
        }
    </style>
</head>
`;

export default ride_share_partner_welcome_email;
