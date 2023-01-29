"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function garage_partner_welcome_email(props) {
    const { partnerName, password, appUrl } = props;
    return `
<!DOCTYPE html>
<html lang="en">
${header()}

<body>
<center class="wrapper">
    <table class="main" width="100%">
        <tr>
            <td>
                <a href="#">
                    <img src="https://i.ibb.co/5M1Y7XT/banner.png" alt="" width="600" style="max-width: 100%;"
                         border="0"/>
                </a>
            </td>
        </tr>

        <tr>
            <td style="padding: 20px 5px 50px;">
                <table width="100%">

                    <tr>
                        <td>
                            <h4 style="font-size: 16px; font-weight:700; margin-left: 25px;">
                                ${partnerName} Account Has Been Created</h4>
                            <p
                                    style="font-size: 12px; font-weight:400; line-height: 19px; margin-left: 25px; max-width: 500px;">
                                It’s a pleasure to welcome you to the Jiffix family and network! We are passionate
                                about making partnerships work - and through AutoHyve, we want to create shared
                                prosperity.</p>

                            <p
                                    style="font-size: 12px; font-weight:400; line-height:19px; margin-left: 25px; max-width: 500px;">
                                After setting up your Hyve, you will be visible to our vast network of customers
                                currently in your city, and those moving into your city. The opportunities are
                                boundless!</p>

                            <p
                                    style="font-size: 12px; font-weight:400; line-height: 19px; margin-left: 25px; max-width: 500px;">
                                Your username is your email address. Sign in with your password below and complete
                                your onboarding</p>

                            <p class="password-btn">${password}</p>
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
                <h3 style="font-style: normal; font-weight: 700; font-size: 16px; text-align: center;">2 Steps to
                    Complete Onboarding</h3>
            </td>
        </tr>

        <tr>
            <td>
                <table width="100%">

                    <tr>
                        <td class="two-colums">
                            <table class="column">
                                <tr>
                                    <td class="padding">
                                        <table class="content">
                                            <tr>
                                                <td>
                                                    <h5 class="mailBoxHead">1. Complete your KYC & Profile</h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>

                                                    <a href="#" class="imageComtainer"><img
                                                            src="https://i.ibb.co/bvdr1jH/home.png" alt=""
                                                            width="30" height="24.22" style="margin-top: 0px;"
                                                            border="0"/></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="https://youtu.be/_tXCGBpqVHI" class="click-bnt firstBnt">Click to see how</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>


                            <table class="column">
                                <tr>
                                    <td class="padding">
                                        <table class="content">
                                        </table>
                                <tr>
                                    <td>
                                        <h5 class="mailBoxHead">2. Create Your Technicians Account</h5>
                                    </td>
                                </tr>

                                <td>
                                    <a href="#" class="imageComtainer"><img
                                            src="https://i.ibb.co/Pg42Qnj/mechanic.png" alt="mechanic" border="0"
                                            width="38.96" height="41.66" style="margin-top: -45px;"></a>
                                </td>
                                </tr>
                                <tr>
                                    <td><a href="https://youtu.be/_JCPypYhYQE" class="click-bnt secondBtn">Click to see how</a></td>
                                </tr>
                            </table>
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
                <p 
                style="
                    font-style: normal;
                    font-weight: 600;
                    font-size: 12px;
                    text-align: center; 
                    margin:30px 0px"
                >
                    2022 Jiffix Technologies, All Rightts Reserved
                </p>
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
            font-family: 'Inter', sans-serif;
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


        .two-colums {
            width: 100%;
            text-align: center;
            padding-bottom: 30px;

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
            width: 133px;
            line-height: 18px;
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .imageComtainer {
            text-align: center;
            margin: 0 auto;
            height: 45px;
            width: 100px;
            display: block;
        }

        @media (max-width: 600px) {
            .two-colums .column {
                width: 100%;
                max-width: 200px;
                vertical-align: top;
                height: 200px;
                display: inline-block;
                text-align: center;
                margin-left: 20%;
            }

            .firstBnt {
                margin-top: -25px;
            }

            .secondBtn {
                margin-top: 10px;
            }
        }
    </style>
    <script>
        async function copyTextToClipboard(text) {
            return await window.navigator.clipboard.writeText(text);
        }

        console.log("Hello")
    </script>
</head>
`;
exports.default = garage_partner_welcome_email;
