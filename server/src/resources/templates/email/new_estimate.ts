import { appCommonTypes } from '../../../@types/app-common';
import MailTextConfig = appCommonTypes.MailTextConfig;

export default function new_estimate_template(config: MailTextConfig) {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            overflow: auto;
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
            background-color: #F5F5F5;
            width: 80%;
            margin: 0px auto;
            margin-bottom: 70px;
            /* height: 100vh; */
            table-layout: fixed;
            padding-bottom: 60px;
            padding-top: 150px;
            margin-top: 108px;
        }

        /* .wrapper {
            background-color: #F5F5F5;
            width: 100%;
            table-layout: fixed;
            padding-bottom: 60px;
        } */

        .main {
            width: 100%;
            max-width: 666px;
            background-color: #fff;
            padding-bottom: 20px;

            font-family: 'Inter', sans-serif;
            /* text-align: center; */
        }

        .defaultPassword {
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            margin-top: -20px;
        }

        .passwordText {
            font-weight: 400;
            font-size: 12px;
            margin-bottom: 50px;
            font-family: 'Inter', sans-serif;
            line-height: 18px;
        }

        .pleaseChangeText {
            font-style: normal;
            font-weight: 300;
            font-size: 10px;
            margin-bottom: 10px;
            margin-top: 12px;
            font-family: 'Inter', sans-serif;
            line-height: 18px;
            text-align: center;

        }


        .bottomText {
            font-weight: 600;
            font-size: 12px;
            color: #000000;
            font-family: 'Inter', sans-serif;
            margin-top: 20px;
        }

        .contentBox {
            width: 100% !important;

        }

        .nameText {
            padding-top: 20px;
        }

        .topText {
            margin-left: 300px;
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
            padding-top: 41px;
            padding-bottom: 35px;
        }

        .textbottom {
            display: block;
            margin-bottom: -6px;
            margin-top: -1px;
        }

        .yellowBorder {
            background-color: #FBA91A;
            width: 100% !important;
        }

        .bottomBorder {
            border: 0.5px solid #000000;
            width: 60% !important;
            margin-top: 34px;
            margin-left: auto;
            margin-right: auto;

        }

        .utilsClass {
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            width: 436px;
            margin-bottom: 25px;
            margin-left: 110px;
        }

        .btn {
            outline: none;
            border: none;
            width: 197px;
            height: 25px;
            font-weight: 700;
            font-size: 10px;
            background: #FBA91A;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 15px;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-top: 35px;
            cursor: pointer;
        }

        .btnContainer {
            width: 100%;

        }

        .support {
            text-decoration: underline;
        }

        .noSignUp {
            font-weight: 700;
            line-height: 18px;
        }

        .priceBold {
            font-size: 10px;
            font-weight: 700;
            color: #000;
            display: block;
            width: 100px;
        }

        .price {
            font-style: normal;
            font-weight: 400;
            color: #3D3D3D;
            font-size: 12px;
            display: block;
            width: 150px;

            text-align: left;
        }

        .priceWrapper {
            display: flex;
            justify-content: space-between;
            width: 38%;
            margin-bottom: -5px;
        }

        .firstTime {
            color: #FBA91A;
            font-weight: 700;
            font-size: 12px;
            margin-top: 65px;
            font-style: italic;
        }

        .firstTimeText {
            font-style: italic;
            font-weight: 600;
            font-size: 12px;
        }

        .name {
            margin-top: 25px;
        }


        @media(max-width:700px) {

            .priceWrapper {
                display: flex !important;
                justify-content: space-between !important;
                width: 100% !important;
                margin-bottom: -5px !important;
            }

            .firstTimeText {
                width: 90%;
            }

            .topText {
                margin-left: 45px !important;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                font-family: 'Inter', sans-serif;
                padding-top: 20px !important;
                padding-bottom: 20px !important;
            }

            .nameText {
                padding-top: 0px !important;
            }

            .bottomText {
                font-weight: 400;
                font-size: 10px !important;
                color: #000000;
                font-family: 'Inter', sans-serif;
                margin-top: 70px;
            }

            .wrapper {
                width: 90% !important;
                padding-top: 50px !important;
            }

            .passwordText {
                font-weight: 400;
                font-size: 12px;
                margin-bottom: 50px;
                font-family: 'Inter', sans-serif;
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .pleaseChangeText {
                font-style: normal;
                font-weight: 300;
                font-size: 10px;
                margin-bottom: 0px;
                margin-top: 12px;
                font-family: 'Inter', sans-serif;
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .utilsClass {
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                width: 100% !important;
                margin-bottom: 25px;
                margin-left: 0px !important;
            }

            .contentBox {
                padding-left: 10px !important;
            }

            .main {
                width: 95% !important;
                max-width: 666px;
                background-color: #fff;
                font-family: 'Inter', sans-serif;
            }

            .textbottom {
                margin-top: -15px !important;
            }

        }
    </style>
</head>

<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <tr style="width: 100%;">
                <td class="yellowBorder" height="8""></td>
                        </tr>
            <!-- CONTENT SECTION -->
            <tr>
                <td>
                    <table width=" 100%">
            <tr>
                <td class="contentBox">
                    <p class="utilsClass name">Dear  ${config.firstName} ${config.lastName},</p>
                    <p class="utilsClass">Thank you for visiting <span class="noSignUp">${config?.partner?.name || 'us'}.</span>
                        Your ${config?.vehichleData || ''}estimate is ready. Click on the button
                        below to view estimate.
                    </p>

                </td>
            </tr>
        </table>

        <center>
            <p class="priceWrapper">
                <span class="priceBold">Estimate #:</span>
                <span class="price">${config.estimate?.code || ''}</span>
            </p>

            <p class="priceWrapper">
                <span class="priceBold">Grand Total #:</span>
                <span class="price">₦ ${new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format((config.estimate?.grandTotal || ''))}</span>
            </p>

            <p class="priceWrapper">
                <span class="priceBold">Date Created:</span>
                <span class="price">${(new Date(config.estimate?.updatedAt || '')).toDateString()}</span>
            </p>
        </center>
        <!-- <table width=" 50%" style="background-color: #FBA91A;">

           
           
           

        </table> -->
        <p class="btnContainer">
            <a href='https://onelink.to/fh7uc5'><button class="btn">View Estimate</button> </a>
        </p>

        <center>
            <p class="firstTime">Your first time using AutoHyve?</p>
            <p class="firstTimeText">No sign up is required. Log in with your email,and use your phone number as
                password.</p>
        </center>

        <p class="bottomBorder"></p>
        <p class="pleaseChangeText">
            If you did not request for this estimate, contact <span class="support">AutoHyve Support</span> now.</p>
        </td>
        </tr>

        </table>

        <center>
            <p class=" bottomText">2023 Jiffix Technologies, All Rightts Reserved</p>
        </center>
    </center>


</body>

</html>
    `;
}
