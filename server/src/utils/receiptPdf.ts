import capitalize from 'capitalize';
import fs from 'fs';
import path from 'path';

function base64_encode(file: string) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

export function formatNumberToIntl(amount: number) {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
    }).format(amount);
}

export const receiptPdfTemplate = (receipt: any, rName: any) => {

    let mainUrl = '';

    try {
        mainUrl = 'data:image/png;base64,' + base64_encode(path.join(__dirname, '../../', receipt?.invoice?.estimate?.partner?.logo));
    } catch (e) {
        console.log(e);
    }

    const partnerName = receipt?.invoice?.estimate?.partner?.name;
    return `
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
                rel="stylesheet">
            <title>AutoHyve</title>
            <link rel="stylesheet" href="./styles.css">
        </head>

        <style>
            * {
            margin: 0;
            padding: 0,
            }

            body {
                box-sizing: border-box;
                border-color: #ffff;
                font-family: 'Montserrat', sans-serif;
            }

            .page {
                display: block;
                margin: 0 auto;
                position: relative;
            }
            .page[size="A4"] {
                width: 21cm;
                height: 34.7cm;
                overflow: hidden;
            }
            .top-section {
                display: flex;
                justify-content: space-between;
                padding-top: 60px;
                /* background-color: red; */
            }
            .header-section {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .partner-name {
                font-style: normal;
                font-weight: 700;
                font-size: 30px;
                color: #263238;
                text-align: left;
            }
            .partner-address,
            .partner-phone,
            .partner-website {
                font-style: normal;
                font-size: 20px;
                color: #515B5F;
                text-align: left;
                line-height: 20px;
            }
            .address-wrap {
                display: flex;
                flex-direction: column;
                width: 70%;
                margin-top: 20px;
                margin-bottom: 15px;
            }
            .header-section-child {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            .image {
                width: 80%;
                height: 100%;
                display: inline-block;
                margin-left: 45px;
                resize-mode: contain;
            }
            .second-section {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .address-date {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
            }
            .amount-wrapper {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                background-color: #9DD8F6;
                width: 33%;
            }
            .billing {
                display: flex;
                flex-direction: column;
                width: 25%;
                margin-top: 50px;
            }
            .item-header {
                display: flex;
                background: #E8E8E8;
                padding: 20px 10px;
                justify-content: space-between;
            }
            .item-header-item {
                display: flex;
                justify-content: space-between;
                padding: 20px 10px;
                border-bottom: 0.71px solid rgba(0, 0, 0, 0.51);
            }
        </style>

        <body>
          <div class="page">

            <div class="top-section">
              <div class="header-section">
                <div class="header-section-child">
                  <img src="${mainUrl}" alt="workshop-logo" class="image">
                  <br />
                </div>
              </div>

              <div class="header-section">
                <span class="partner-name">${receipt?.invoice?.estimate?.partner?.name}</span>
                <div class="address-wrap">
                  <span class="partner-address">${receipt?.invoice?.estimate?.partner?.contact?.address}</span>
                  <span class="partner-phone" style="margin-bottom: 5px; margin-top: 20px">${receipt?.invoice?.estimate?.partner?.phone}</span>
                  <span class="partner-website">${receipt?.invoice?.estimate?.partner?.email}</span>
                </div>

              </div>

            </div>

            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAABCAYAAABn5mFIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB7cAxAQAACMCg2T+0pvCDqTYAAAAAAAAAAD7NAcSZAQJ8yV57AAAAAElFTkSuQmCC" alt="" class="lineImage"> -->
            <div class="lineImage" style="border-top: 0.61px solid rgba(0, 0, 0, 0.61); height: 1px; margin-top: 30px; margin-bottom: 20px">&nbsp;</div>

            <div class="second-section">
              <span style="font-size: 25px; text-align: center">Payment Receipt</span>
              <div class="address-date">
                <div style="display: flex; flex-direction: column">
                  <span style="font-size: 18px; color: #515B5F">Payment Date:</span>
                  <span style="font-size: 18px; color: #515B5F; margin-top: 10px; margin-bottom: 10px">Mode of Payment:</span>
                  <span style="font-size: 18px; color: #515B5F">Payment Reference #:</span>
                </div>

                <div style="display: flex; flex-direction: column">
                  <span style="font-size: 18px; color: #515B5F; font-weight: 600">${receipt?.updatedAt.toDateString() || ""}</span>
                  <span style="font-size: 18px; color: #515B5F; font-weight: 600; margin-top: 10px; margin-bottom: 10px">${receipt?.type || ""}</span>
                  <span style="font-size: 18px; color: #515B5F; font-weight: 600">
                    ${rName.split(".p")[0] || ""}
                  </span>
                </div>

                <div class="amount-wrapper">
                  <span style="font-size: 18px">Amount Received</span>
                  <span style="font-size: 22px">&#8358;${formatNumberToIntl(receipt?.amount)}</span>
                </div>
              </div>
            </div>

            <div class="billing">
              <span style="font-size: 20px; font-weight: 600">Received From</span>
              <span style="font-size: 20px; font-weight: 400; color: #087FBB; margin-top: 30px; font-weight: 500">${capitalize.words(receipt?.customer?.firstName) || ''} ${capitalize.words(receipt?.customer?.lastName) || ''}</span>
              <span style="font-size: 18px; font-weight: 400; margin-bottom: 7px; margin-top: 7px">${receipt?.customer?.contacts[0]?.district || ''}</span>
              <span style="font-size: 18px; font-weight: 400">${receipt?.customer?.contacts[0]?.state || ''}</span>
            </div>

            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAABCAYAAABn5mFIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB7cAxAQAACMCg2T+0pvCDqTYAAAAAAAAAAD7NAcSZAQJ8yV57AAAAAElFTkSuQmCC" alt="" class="lineImage"> -->
            <div class="lineImage" style="border-top: 0.61px solid rgba(0, 0, 0, 0.61); height: 1px; margin-top: 30px; margin-bottom: 20px">&nbsp;</div>

            <div style="margin-top: 20px;">
              <div class="item-header">
                <span style="font-weight: 600; font-size: 12px">Invoice #</span>
                <span style="font-weight: 600; font-size: 12px; padding-left: 80px">Invoice Date</span>
                <span style="font-weight: 600; font-size: 12px">Invoice Amount</span>
                <span style="font-weight: 600; font-size: 12px">Payment Amount</span>
              </div>

              <div class="item-header-item">
                <span style="font-weight: 400; font-size: 12px">${receipt?.invoice?.code.split("_")[0] || ''}</span>
                <span style="font-weight: 400; font-size: 12px">${receipt?.invoice?.updatedAt.toDateString() || ""}</span>
                <span style="font-weight: 400; font-size: 12px; margin-left: -50px">${formatNumberToIntl(receipt?.invoice?.grandTotal || "")}</span>
                <span style="font-weight: 400; font-size: 12px">${formatNumberToIntl(receipt?.amount || "")}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px">
            <p style="font-size: 8; color: #676F73">Thanks for you patronage</p>
          </div>
          </body>
    </html>
    `;
};