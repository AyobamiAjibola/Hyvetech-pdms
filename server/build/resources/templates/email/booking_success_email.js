"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../config/constants");
function booking_success_email(config) {
    const getServiceMode = () => {
        let mode = 'Mobile';
        if (config.location === constants_1.MAIN_OFFICE)
            mode = 'Drive-in';
        return mode;
    };
    return `
    <p style="color: #000000;font-size: 16px;text-align: left;font-family: Open Sans, Verdana, Geneva,sans-serif;line-height: 22px;">
        You have successfully booked a
        ${getServiceMode()} inspection service for
        ${config.appointmentDate} at ${config.location}
    </p>

    <p style="color: #000000;font-size: 16px;text-align: left;font-family: Open Sans, Verdana, Geneva,sans-serif;line-height: 22px;">
        <b>Vehicle details:</b>
    <ul>
        <li>Model year - ${config.vehicleDetail?.year}</li>
        <li>Car make - ${config.vehicleDetail?.make}</li>
        <li>Car model - ${config.vehicleDetail?.model}</li>
    </ul>
    <br/>
    <b>Vehicle fault</b>: ${config.vehicleFault}
    </p>

    <p style="color: #000000;font-size: 16px;text-align: left;font-family: Open Sans, Verdana, Geneva,sans-serif;line-height: 22px;">
        You can update your appointment time, location or
        fault, from your dashboard.
        <a href="${config.loginUrl}">Click here to do so.</a>
    </p>
    <p style="color: #000000;font-size: 16px;text-align: left;font-family: Open Sans, Verdana, Geneva,sans-serif;line-height: 22px;">
        See you soon!
    </p>
    <p style="color: #000000;font-size: 16px;text-align: left;font-family: Open Sans, Verdana, Geneva,sans-serif;line-height: 22px;">
        **
        If you did not initiate this action, or would like to reschedule,
        <a href="${config.loginUrl}">Click here to do so.</a>
    </p>
`;
}
exports.default = booking_success_email;
