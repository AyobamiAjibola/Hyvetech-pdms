"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimatePdfTemplate = exports.formatNumberToIntl = void 0;
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
function formatNumberToIntl(amount) {
    return new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: 2,
    }).format(amount);
}
exports.formatNumberToIntl = formatNumberToIntl;
function base64_encode(file) {
    // read binary data
    const bitmap = fs_1.default.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
const estimatePdfTemplate = (estimate) => {
    // console.log((estimate.customer), "estimate")
    const logo = `${estimate.partner.logo}`;
    const partner = estimate.partner;
    const customer = estimate.customer;
    const vehicle = estimate.vehicle;
    // const mainUrl = `${process?.env?.SERVER_URL || "https://pdms.jiffixtech.com/"}${partner.logo}`;
    // convert image to base 64
    let mainUrl = '';
    try {
        mainUrl = 'data:image/png;base64,' + base64_encode(path_1.default.join(__dirname, "../../", partner.logo));
    }
    catch (e) {
        console.log(e);
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
        font-weight: 400;
        font-size: 14px;
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
        margin-bottom: 15px;
        align-items: center;
    }
    
    .how-top-pay-text span {
        font-size: 12.3px;
        padding-right: 20px;
        font-weight: 700;
    }
    
    .how-top-pay-text p {
        font-size: 12px;
    }
    
    .scan-img {
        width: 100px;
        height: 130.24px;
    }
    
    .parerntWrapper {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    body{
        padding: 30px;
    }
    </style>
    
    <body>
    
        <div class="page" size="A4">
            <div class="top-section">
                <div class="header-section">
                    <span class="estimate-name">Estimate</span>
                    <span class="estimate-num">#${estimate.code}</span>
                    <span class="estimate-date">Date: ${(new Date(estimate.updatedAt)).toDateString()}</span>
                </div>
    
                <div class="header-section">
                    <img src="${mainUrl}" alt="" class="image">
                    <br />
                </div>
    
                <div class="header-section">
                    <span class="addres-head">${partner.name}</span>
                    <span class="addres-location">${partner?.contact?.address || ""} ${partner?.contact?.city || ""} ${partner?.contact?.district || ""}<br /> ${partner.contact.state}</span>
                    <span class="addres-phone">${partner.phone}</span>
                    <span class="addres-website">${partner?.googleMap || ""}</span>
                </div>
    
            </div>
            
            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACGkAAAABCAYAAABn5mFIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB7cAxAQAACMCg2T+0pvCDqTYAAAAAAAAAAD7NAcSZAQJ8yV57AAAAAElFTkSuQmCC" alt="" class="lineImage"> -->

            <div class="lineImage" style="border-top: 0.61px solid rgba(0, 0, 0, 0.61); height: 1px;">&nbsp;</div>
    
            <div class="second-section">
                <div class="left-side">
                    <p class="bill-to">Bill To:</p>
                    <p class="bill-to-name">${customer?.companyName || `${customer.firstName} ${customer.lastName}`}</p>
                    <p class="bill-to-address">${customer.contacts[0].address}, ${customer.contacts[0]?.city || ""} ${customer.contacts[0].district}, ${customer.contacts[0].state}</p>
                    <p class="bill-to-address">${customer.phone}</p>
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
                
                ${estimate.parts.map((part, idx1) => {
        const amount = formatNumberToIntl(parseInt(part?.amount || 0));
        return (`
                            <div class="item-header-item">
                    <span class="count-num-item">${idx1 + 1}</span>
                    <span class="item-descrip-item">${part.name}</span>
                    <span class="item-warranty-item">${part.warranty.warranty} ${part.warranty.interval}</span>
                    <span class="item-cost-item">₦ ${formatNumberToIntl(part.price)} x ${part.quantity.quantity} ${part.quantity.unit}</span>
                    <span class="item-amount-item">₦ ${amount}</span>
                </div>
                            `);
    })}
                
                ${estimate.labours.map((labour, idx1) => {
        const amount = formatNumberToIntl(parseInt(labour?.cost || 0));
        return (`
                            <div class="item-header-item">
                    <span class="count-num-item">${(estimate.parts).length + 1 + idx1}</span>
                    <span class="item-descrip-item">${labour.title}</span>
                    <span class="item-warranty-item"> - </span>
                    <span class="item-cost-item">₦ ${amount} x 1 pcs</span>
                    <span class="item-amount-item">₦ ${amount}</span>
                </div>
                            `);
    })}
                
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
    formatNumberToIntl(parseFloat(estimate?.tax || 0) + parseFloat(estimate?.taxPart || 0))}</span>
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
                <p class="terms-header payment">How to Make Payment</p>
    
                <div class="parerntWrapper">
                    <div>
                        <div class="how-top-pay-text">
                            <span>Step 1:</span>
    
                            <p>Open the <a href="https://onelink.to/fh7uc5">AutoHyve mobile app</a> or visit/click <a
                                    href="http://app.myautohyve.com/">app.myautohyve.com</a> </p>
                        </div>
                        <div class="how-top-pay-text">
                            <span>Step 2:</span>
    
                            <p>Sign in with your Email address (username), and Phone number (as password)</p>
                        </div>
                        <div class="how-top-pay-text">
                            <span>Step 3:</span>
    
                            <p>Open <span>Estimate #${estimate.code}</span>, and click on <span>“Approve & Pay Deposit”</span></p>
                        </div>
                        <div class="how-top-pay-text">
                            <span>Step 4:</span>
    
                            <p>Make payment using Visa/Master/Verve Cards, Bank Transfer, or USSD</p>
                        </div>
                    </div>
    
                    <img src="data:image/png;base64,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zTd3j1deeaXRomfElgwKPuOaa64xSrv66qvTzjvvbJQeYZ3kQudATJgwgbbcckvfdGuuuaZ7POmkk9ywbH6su+667hHhzL7//nvf9DvssANhfdo//vEPo0XJ2267rRsL1DQv119/fTePTNMHjTMK9t57b+rTp49vuh49elA+IPzbl19+6Ztuk002cY+XXnop/fjjj77pt9lmGzek3NVXX20UmCGfel9pHHfccbTHHnv4phs4cKB7PPPMM43ivA4bNoyY4GDNRkHrqFCBTaNrhMXixYtd8QNLVgyCOVc0cJgI0GwCvqseZ9ME07zM9/oMo/jss8+M0tXU1FD37t2pkjD9nSBGrXqoC8IXX3xh9JCw2mqr5R1UvVpZeeWVixKnttPFGhVPrka257svWyXxwQcfOML5GH3fp556ygnKDTfcYHRt0RrMK9YowwDEGhVOwqiu3XTTTU6lMWnSJCPbRWvZyQfRaja6/sSJE52oUYxYozxGyDAMw0QadoQMwzBMpGFHyDAMw0QadoQMwzBMpGFHyDAMw0QadoQMwzBMpGFHyDAMw0QadoQMwzBMpGFHyDAMw0SaThli7e2336b333/fNx3CEdm2TdXM0qVL6dFHHzVKu9122wWOYfnRRx/Ra6+95psOcTT32msvWmEFfrZigoM9Bh955BFszOqbFrFp1157baokmpqa6JNPPvFN17t3bzd+b1CefvppWrBggW+6wYMH0xZbbEFRohgh1jqlIwzK/Pnz3Vh+fsBxbrrppvTOO+9QS0uLb3oErd5ggw0oKC+//DJ5bD7agaFDhwaOW7ho0SKaN2+eUVr8oH744Qejhwqw1VZbuQ6RYfLhxRdfNAp4PmTIEFprrbWolOB+gPuCH4iti6DhTPngWKNF4ogjjjD6rttvv72bfrfddjNKP378eCcfevToYXT9adOmOUGZPXu2cdmmUimONcqEQqXFGr3qqquMbOnVq5fDlBeONcowDMMwBcKOkGEYhok07AgZhmGYSMOOkGEYhok07AgZhmGYSMOOkGEYhok07AgZhmGYSMOOkGEYhok0XYnRScljjZRsunKSkseaLl26wJ4WKcAiRqHypSrKkirXxkqgXR1HNBfyLt9yUg31rRLwul+V/R7GIdYEiBG4ZMkSxDkctfHGGyeff/75WK9evRrxv4022sj91b3yyivxvn371q2z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" alt="" class="scan-img">
                </div>
            </div>
    </body>
    
    </html>
    `;
};
exports.estimatePdfTemplate = estimatePdfTemplate;
