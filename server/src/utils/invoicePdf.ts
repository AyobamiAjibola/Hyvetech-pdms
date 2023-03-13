import Estimate from "../models/Estimate";
import path from 'path'
import "dotenv/config"
import fs from 'fs'
import Invoice from "../models/Invoice";

export function formatNumberToIntl(amount: number) {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
    }).format(amount);
  }

function base64_encode(file: string) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

export const invoicePdfTemplate = (invoice: Invoice) => {
    const estimate = invoice.estimate;
    // console.log((estimate.customer), "estimate")
    const logo = `${estimate.partner.logo}`;
    const partner = estimate.partner;
    const customer = estimate.customer;
    const vehicle = estimate.vehicle;
    // const mainUrl = `${process?.env?.SERVER_URL || "https://pdms.jiffixtech.com/"}${partner.logo}`;

    // convert image to base 64
    let mainUrl = '';
    
    try{
        mainUrl = 'data:image/png;base64,'+base64_encode(path.join(__dirname, "../../", partner.logo));
    }catch(e){
        console.log(e)
    }

    // console.log(mainUrl, "mainUrl");
    // @ts-ignore
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
        padding-top: 30px;
        /* background-color: red; */
    }
    
    .image {
        width: 120px;
        height: 110px;
        display: inline-block;
        margin-left: 45px;
        resize-mode: contain;
    }
    
    .header-section {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    
    .estimate-name {
        font-style: normal;
        font-weight: 700;
        font-size: 17px;
        color: #263238;
    }
    
    .estimate-num,
    .estimate-date {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: #263238;
    
    }
    
    .addres-head {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        color: #263238;
        text-align: right;
    }
    
    .addres-location {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #263238;
        text-align: right;
        margin-bottom: 15px;
        margin-top: 5px;
    }
    
    .addres-phone,
    .addres-website {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #263238;
        text-align: right;
    }
    
    .lineImage {
        display: block;
        margin-top: 20px;
    }
    
    .second-section {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    
    .left-side span {
        display: inline-block;
    }
    
    .info-container {
        display: flex;
    }
    
    .bill-to {
        font-weight: 700;
        font-size: 14px;
        color: #263238;
        margin-bottom: 7px;
    }
    
    .bill-to-address {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: #263238;
        text-align: left;
        width: 300px;
        margin-top: 5px;
    }
    
    .bill-to-name {
        font-weight: 700;
        font-size: 12px;
        color: #263238;
        margin-bottom: 7px;
        margin-top: 10px;
    }
    
    .vehicle-title {
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        color: #263238;
        width: 70px;
        margin-bottom: 5px;
    }
    
    .info {
        font-weight: 400;
        font-size: 12px;
        color: #263238;
    }
    
    .vehicle-inforTitle {
        font-weight: 700;
        font-size: 14px;
        color: #263238;
        display: inline-block;
        margin-bottom: 20px;
    
    }
    
    .item-container {
        margin-top: 20px;
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
    
    .item-header-item-total {
        display: flex;
        justify-content: space-between;
    }
    
    
    .count-num {
        font-weight: 600;
        font-size: 12px;
    }
    
    .item-descrip {
        /* margin-right: 60px; */
        font-weight: 600;
        font-size: 12px;
        margin-left: -80px;
    }
    
    .item-warranty {
        /* margin-right: 30px; */
        font-weight: 600;
        font-size: 12px;
    
        width: 100px;
        text-align: right;
    }
    
    .item-cost {
        /* margin-right: 60px; */
        font-weight: 600;
        font-size: 12px;
        position: relative;
        left: 20px;
        text-align: right;
    }
    
    .item-amount {
        font-weight: 600;
        font-size: 12px;
        /* margin-left: 100px; */
    }
    
    .count-num-item,
    .item-descrip-item,
    .item-warranty-item {
        font-size: 12px;
        font-weight: 400;
    }
    
    .item-descrip-item {
        margin-left: -35px;
        width: 200px;
    }
    
    .item-warranty-item {
        /* background-color: red; */
        /* width: 110px; */
        text-align: right;
        margin-right: 40px;
    }
    
    .item-cost-item-sub {
        font-size: 12px;
        font-weight: 500;
    
        width: 380px;
        text-align: right;
        /* margin-bottom: 20px; */
        padding: 10px 10px;
        /* flex: 1; */
    }
    
    .item-cost-item {
        font-size: 12px;
    }
    
    .item-amount-item {
        font-size: 13px;
    }
    
    .item-amount-item-amount {
        font-size: 12px;
        font-weight: 400;
        width: 120px;
        text-align: right;
        padding: 5px 10px;
    }
    
    .first {
        margin-top: 15px;
    }
    
    .total {
        font-weight: 700;
    }
    
    .bold-2 {
        font-weight: 700;
    }
    
    .total-flex {
        display: flex;
        justify-content: space-between;
        background: #E8E8E8;
        width: 330px;
        margin: 15px 0;
    
        /* padding-left: 80px; */
    }
    
    .item-cost-item-sub-total {
        font-size: 14px;
        font-weight: 700;
        padding: 10px 10px;
        padding-left: 125px;
        display: inline-block;
        /* margin-right: 50px; */
    }
    
    .terms-header {
        font-size: 12px;
        font-style: italic;
        text-align: center;
        margin-top: 50px;
        margin-bottom: 20px;
    }
    
    .payment {
        font-style: normal;
        font-weight: 700;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    
    .how-top-pay-text {
        display: flex;
        margin-bottom: 5px;
        align-items: center;
    }
    
    .how-top-pay-text span {
        font-size: 11.3px;
        padding-right: 20px;
        font-weight: 700;
    }
    
    .how-top-pay-text p {
        font-size: 11px;
    }
    
    .scan-img {
        width: 100px;
        height: 130.24px;
    }
    
    .parerntWrapper {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    body{
        padding: 30px;
    }

    .bold{
        font-weight: 800
    }
    </style>
    
    <body>
    
        <div class="page">
            <div class="top-section">
                <div class="header-section">
                    <span class="estimate-name">Invoice</span>
                    <span class="estimate-num">#${invoice.code}</span>
                    <span class="estimate-date">Date: ${(new Date(invoice.updatedAt)).toDateString()}</span>
                </div>
    
                <div class="header-section">
                    <img src="${mainUrl}" alt="" class="image">
                    <br />
                </div>
    
                <div class="header-section">
                    <span class="addres-head">${partner.name}</span>
                    <span class="addres-location">${partner?.contact?.address || ""} ${partner?.contact?.city || ""} ${partner?.contact?.district || ""}<br /> ${partner.contact.state}</span>
                    <span class="addres-phone">${partner.phone}</span>
                </div>
    
            </div>
            
            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAABCAYAAABn5mFIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB7cAxAQAACMCg2T+0pvCDqTYAAAAAAAAAAD7NAcSZAQJ8yV57AAAAAElFTkSuQmCC" alt="" class="lineImage"> -->

            <div class="lineImage" style="border-top: 0.61px solid rgba(0, 0, 0, 0.61); height: 1px;">&nbsp;</div>
    
            <div class="second-section">
                <div class="left-side">
                    <p class="bill-to">Bill To:</p>
                    <div class="bill-to-name">${customer?.companyName || `${customer.firstName} ${customer.lastName}`}</div>
                    <div class="bill-to-address">${customer?.contacts[0]?.address || ""}, ${customer.contacts[0]?.city || ""} ${customer?.contacts[0]?.district || ""}, ${customer?.contacts[0]?.state || ""}</div>
                    <div class="bill-to-address">${customer?.email || ""}</div>
                    <div class="bill-to-address">${customer?.phone || ""}</div>
                </div>
                <div>
                    <span class="vehicle-inforTitle">Vehicle Information:</span>
                    <div>
                        <div class="info-container">
                            <span class="vehicle-title">Vehicle:</span>
                            <span class="info">${vehicle.modelYear} ${vehicle.make} ${vehicle.model}</span>
                        </div>
    
                        <div class="info-container">
                            <span class="vehicle-title">VIN:</span>
                            <span class="info">${vehicle.vin}</span>
                        </div>
    
                        <div class="info-container">
                            <span class="vehicle-title">Mileage:</span>
                            <span class="info">${vehicle.mileageValue} ${vehicle.mileageUnit}</span>
                        </div>
    
                        <div class="info-container">
                            <span class="vehicle-title">Reg. No:</span>
                            <span class="info">${vehicle.plateNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="item-container">
                <div class="item-header">
                    <span class="count-num">#</span>
                    <span class="item-descrip">Item & Description</span>
                    <span class="item-warranty">Warranty</span>
                    <span class="item-cost">Unit Cost x Qty</span>
                    <span class="item-amount">Amount</span>
                </div>
                
                ${
                    (estimate.parts.map((part: any, idx1)=> {
                        const amount = formatNumberToIntl(parseInt(part?.amount || 0));
                        return (
                            `
                            <div class="item-header-item">
                    <span class="count-num-item">${idx1 + 1}</span>
                    <span class="item-descrip-item">${part.name}</span>
                    <span class="item-warranty-item">${part.warranty.warranty} ${part.warranty.interval}</span>
                    <span class="item-cost-item">₦ ${formatNumberToIntl(part.price)} x ${part.quantity.quantity} ${part.quantity.unit}</span>
                    <span class="item-amount-item">₦ ${amount}</span>
                </div>
                            `
                        )
                    })).join().replaceAll(' ,', '')
                }
                
                ${
                    (estimate.labours.map((labour: any, idx1)=> {
                        const amount = formatNumberToIntl(parseInt(labour?.cost || 0));
                        return (
                            `
                            <div class="item-header-item">
                    <span class="count-num-item">${(estimate.parts).length + 1 + idx1}</span>
                    <span class="item-descrip-item">${labour.title}</span>
                    <span class="item-warranty-item"> - </span>
                    <span class="item-cost-item">₦ ${amount} x 1 pcs</span>
                    <span class="item-amount-item">₦ ${amount}</span>
                </div>
                            `
                        )
                    })).join().replaceAll(' ,', '')
                }
                
                <div class="item-header-item-total first">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Subtotal:</span>
                    <span class="item-amount-item-amount">₦ ${formatNumberToIntl(estimate.partsTotal + estimate.laboursTotal)}</span>
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Discount:</span>
                    <span class="item-amount-item-amount">₦ 0.00</span>
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">VAT (7.5%):</span>
                    <span class="item-amount-item-amount">₦ ${
                        // @ts-ignore
                        formatNumberToIntl(parseFloat(estimate?.tax || 0) + parseFloat(estimate?.taxPart || 0))
                    }</span>
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <div class="total-flex" style="background: #E8E8E8;">
                        <span class="item-cost-item-sub-total">Total:</span>
                        <span class="item-amount-item-amount total">₦ ${formatNumberToIntl(estimate.grandTotal)}</span>
                    </div>
    
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Paid:</span>
                    <span class="item-amount-item-amount">₦ ${formatNumberToIntl(invoice.paidAmount)}</span>
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Balance Due:</span>
                    <span class="item-amount-item-amount">₦ ${formatNumberToIntl(invoice.dueAmount)}</span>
                </div>
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Job Duration:</span>
                    <span class="item-amount-item-amount">${estimate.jobDurationValue} ${estimate.jobDurationUnit}(s)</span>
                </div>

                <!--
                <div class="item-header-item-total">
                    <span class="count-num-item"></span>
                    <span class="item-descrip-item"></span>
                    <span class="item-warranty-item"></span>
                    <span class="item-cost-item-sub">Estimate Valid until:</span>
                    <span class="item-amount-item-amount">24/02/2023</span>
                </div> -->
    
                <p class="terms-header">${partner.name} Terms & Conditions Appy</p>
                <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAABCAYAAABn5mFIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB7cAxAQAACMCg2T+0pvCDqTYAAAAAAAAAAD7NAcSZAQJ8yV57AAAAAElFTkSuQmCC" alt=""> -->

                <div class="lineImage" style="border-top: 0.61px solid rgba(0, 0, 0, 0.61); height: 1px;">&nbsp;</div>

                <br />
                <br />
                <p class="terms-header payment">Payment Instructions:</p>
    
                <div class="parerntWrapper">
                    <div style="font-size: 12px; font-weight: 600; margin-top: 12px;">Method 1</div>

                    <div style="font-size: 11px; display: flex; flex: 1; margin-left: 10px; flex-direction: column;">
                        <p style="font-size: 12px;">Pay through traditional bank transfer</p>
                        
                        <div style="width: 300px">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Account Name</span>
                                <span class="bold">${partner?.accountName || ""}</span>
                            </div>

                            <div style="display: flex; justify-content: space-between;">
                                <span>Bank Name</span>
                                <span class="bold">${partner?.bankName || ""}</span>
                            </div>

                            <div style="display: flex; justify-content: space-between;">
                                <span>Account Number</span>
                                <span class="bold">${partner?.accountNumber || ""}</span>
                            </div>
                        </div>

                        <p style="font-size: 11px;">PS: Notify us after payment is successful</p>
                    </div>
                </div>

                <div class="parerntWrapper">
                    <div style="font-size: 12px; font-weight: 600; margin-top: 12px;">Method 2</div>

                    <div style="font-size: 11px; display: flex; flex: 1; margin-left: 10px; flex-direction: column;">
                        <p style="font-size: 12px;">A more secure & faster way to pay</p>
                        <ol>
                            <li>Open the <a href="https://onelink.to/fh7uc5">AutoHyve mobile app</a> or visit/click <a
                            href="http://app.myautohyve.com/">app.myautohyve.com</a> </li>

                            <li>Sign in with your Email address (username), and Phone number (as password)</li>
                            <li>Open <span>Estimate #${invoice.code}</span>, and click on <span>“Make Payment”</span></li>
                        </ol>
                        <p style="font-size: 12px;">PS: you can pay using your bank card, transfer, or USSD. once successful, your invoice and receipt is created automatically.</p>
                    </div>
                </div>

            </div>
    </body>
    
    </html>
    `;
}