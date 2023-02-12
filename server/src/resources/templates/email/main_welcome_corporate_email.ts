const main_welcome_corporate_email = (fullName: string) => `
<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
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
            padding-top: 0px;
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
            padding-bottom: 50px;
            font-family: 'Inter', sans-serif;
        }

        .text {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 18px;
            margin-top: 26px;
        }


        .bottomText {
            font-weight: 700;
            font-size: 12px;
            color: #000000;
            font-family: 'Inter', sans-serif;
            margin-top: 70px;
        }

        .contentBox {
            padding-left: 140px;
            padding-right: 37px;
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

        .fullname {
            font-size: 12px;
            color: #000000;
            font-weight: 400;
            margin-top: 55px;
            font-family: 'Inter', sans-serif;
        }

        .welcomeMessage {
            font-size: 12px;
            color: #000000;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
        }

        @media(max-width:700px) {
            .topText {
                margin-left: 45px !important;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                font-family: 'Inter', sans-serif;
                padding-top: 20px !important;
                padding-bottom: 20px !important;
            }

            .contentBox {
                padding-left: 10px !important;
                padding-right: 10px !important;
            }

            .nameText {
                padding-top: 0px !important;
            }

            .bottomText {
                font-weight: 700;
                font-size: 10px !important;
                color: #000000;
                font-family: 'Inter', sans-serif;
                margin-top: 70px;
            }

            .wrapper {
                width: 90% !important;
            }

            .main {
                width: 93% !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
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
    <center class='wrapper'>
        <center class='nameText'>
            <img src='https://res.cloudinary.com/blisify/image/upload/v1672701016/hyveLogo_trrh6u.png' alt=''
                style='height:100px; width:125.16px' title='autoHyve Logo'>
        </center>

        <center>
            <img src='https://res.cloudinary.com/blisify/image/upload/v1672701062/poweredLogo_ed0wv7.png' alt=''
                style='height:26px; width:110px' title='powered by jiffix'>
        </center>


        <table class='main' width='100%'>
            <!-- CONTENT SECTION -->
            <tr>
                <td>
                    <table width='100%'>
                        <tr>
                            <td class='contentBox'>
                                <h6 class='fullname'>Hello ${fullName}!</h6>
                                <h5 class='welcomeMessage'>Welcome to the new Hyve!
                                </h5>
                                <p class='text'>My name is David Nelson, Co-Founder & CEO of Jiffix. Thank you for
                                    signing up for AutoHyve.</p>

                                <p class='text'>We believe in creating amazing experiences for vehicle owners and fleets
                                    in Africa by leveraging the power of data and
                                    technology. AutoHyve was created to help individuals and businesses, like yours, be
                                    in control of your greatest assets
                                    by organizing and centralizing vehicle maintenance and repair activities in one
                                    place. If we can help you do this, then
                                    we can unlock amazing experiences for you, like cost savings, self-service
                                    analytics, AI-powered recommendations, and
                                    more.</p>

                                <p class='text'>Today, we are happy to be sharing this technology used by other
                                    businesses and over 500 vehicle owners, with you. The
                                    product is still in it’s BETA phase.</p>

                                <p class='text'>To get started with your account, please log into your Hyve, and you
                                    will be ready to receive estimates from
                                    AutoHyve-powered workshops, and get real-time analytics.</p>

                                <p class='text'>If your favorite workshop is not on AutoHyve, tell us their name on the
                                    “Workshops” tab on your app, and we will
                                    immediately swing into action to onboard them within 72 hours.</p>

                                <p class='text' style='margin-top: 15px;'>Once again, welcome to AutoHyve!</p>

                                <span class='text textbottom'>David Nelson</span>
                                <span class='text'> Co-founder & CEO, Jiffix</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <center>
            <p class='bottomText'>2023 Jiffix Technologies, All Rights Reserved</p>
        </center>
    </center>


</body>
</html>
`;

export default main_welcome_corporate_email;
