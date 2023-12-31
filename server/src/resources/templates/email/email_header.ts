export default function email_header() {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
  <style type="text/css">
    * {
      -webkit-font-smoothing: antialiased;
    }

    body {
      Margin: 0;
      padding: 0;
      min-width: 100%;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      mso-line-height-rule: exactly;
    }

    table {
      border-spacing: 0;
      color: #333333;
      font-family: Arial, sans-serif;
    }

    img {
      border: 0;
    }

    .wrapper {
      width: 100%;
      table-layout: fixed;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .webkit {
      max-width: 600px;
    }

    .outer {
      Margin: 0 auto;
      width: 100%;
      max-width: 600px;
    }

    .full-width-image img {
      width: 100%;
      max-width: 600px;
      height: auto;
    }

    .inner {
      padding: 10px;
    }

    p {
      Margin: 0;
      padding-bottom: 10px;
    }

    .title {
      font-size: 21px;
      font-weight: bold;
      Margin-top: 15px;
      Margin-bottom: 5px;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .h2 {
      font-size: 18px;
      font-weight: bold;
      Margin-top: 10px;
      Margin-bottom: 5px;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .one-column .contents {
      text-align: left;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .one-column p {
      font-size: 14px;
      Margin-bottom: 10px;
      font-family: Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .two-column {
      text-align: center;
      font-size: 0;
    }

    .two-column .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }

    .contents {
      width: 100%;
    }

    .two-column .contents {
      font-size: 14px;
      text-align: left;
    }

    .two-column img {
      width: 100%;
      max-width: 300px;
      height: auto;
    }

    .two-column .text {
      padding-top: 10px;
    }

    .three-column {
      text-align: center;
      font-size: 0;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .three-column .column {
      width: 100%;
      max-width: 200px;
      display: inline-block;
      vertical-align: top;
    }

    .three-column .contents {
      font-size: 14px;
      text-align: center;
    }

    .three-column img {
      width: 100%;
      max-width: 180px;
      height: auto;
    }

    .three-column .text {
      padding-top: 10px;
    }

    .img-align-vertical img {
      display: inline-block;
      vertical-align: middle;
    }

    @media only screen and (max-device-width: 480px) {
      table[class=hide],
      img[class=hide],
      td[class=hide] {
        display: none !important;
      }

      .contents1 {
        width: 100%;
      }

      .contents1 {
        width: 100%;
      }

      .contents1 {
        width: 100%;
      }

      .contents1 {
        width: 100%;
      }

      .contents1 {
        width: 100%;
      }

      .contents1 {
        width: 100%;
      }
    }
  </style>
  <!--[if (gte mso 9)|(IE)]>
<style type="text/css">
table {border-collapse: collapse !important;}
</style>
<![endif]-->
</head>

<body style="Margin:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;min-width:100%;background-color:#fafafa;">
    `;
}
