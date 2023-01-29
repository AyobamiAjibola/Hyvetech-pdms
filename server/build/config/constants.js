"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESCHEDULE_CONSTRAINT = exports.MAIN_OFFICE = exports.QUEUE_EVENTS = exports.MESSAGES = exports.PAYMENT_TERMS = exports.PLANS = exports.PAYMENT_PLANS = exports.CATEGORIES = exports.SUBSCRIPTIONS = exports.SERVICES = exports.FAF_SUBSCRIPTION = exports.HOUSE_HOLD_SUBSCRIPTION = exports.ONE_TIME_SUBSCRIPTION = exports.MAINTENANCE_SERVICE = exports.INSPECTIONS_SERVICE = exports.HYBRID_FAF_PAYMENT_PLAN = exports.DRIVE_IN_FAF_PAYMENT_PLAN = exports.MOBILE_FAF_PAYMENT_PLAN = exports.HYBRID_HOUSE_HOLD_PAYMENT_PLAN = exports.DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN = exports.MOBILE_HOUSE_HOLD_PAYMENT_PLAN = exports.FAF_HYBRID_PLAN = exports.FAF_DRIVE_IN_PLAN = exports.FAF_MOBILE_PLAN = exports.HOUSE_HOLD_HYBRID_PLAN = exports.HOUSE_HOLD_DRIVE_IN_PLAN = exports.HOUSE_HOLD_MOBILE_PLAN = exports.RIDE_SHARE_CATEGORY = exports.GARAGE_CATEGORY = exports.HYBRID_CATEGORY = exports.DRIVE_IN_CATEGORY = exports.MOBILE_CATEGORY = exports.DRIVE_IN_ONE_TIME_PAYMENT_PLAN = exports.MOBILE_ONE_TIME_PAYMENT_PLAN = exports.ONE_TIME_DRIVE_IN_PLAN = exports.ONE_TIME_MOBILE_PLAN = exports.QUARTER_PAYMENT_PLAN = exports.BI_PAYMENT_PLAN = exports.ANNUAL_PAYMENT_PLAN = exports.VIN_PATTERN = exports.TWENTY_FOUR_HOUR_EXPIRY = exports.PAY_STACK_BANKS = exports.PAY_STACK_PLANS = exports.BOOKINGS = exports.LOG_LEVEL_COLORS = exports.APPOINTMENT_STATUS = exports.VIN_FILTER_CONSTRAINTS = exports.TAGS = exports.UPLOAD_BASE_PATH = exports.PASSWORD_PATTERN = void 0;
exports.PAYMENT_CHANNELS = exports.TRANSACTION_TYPE = exports.INVOICE_STATUS = exports.ESTIMATE_STATUS = exports.ESTIMATE_EXPIRY_DAYS = exports.INITIAL_LABOURS_VALUE = exports.INITIAL_PARTS_VALUE = exports.INITIAL_CHECK_LIST_VALUES = exports.JOB_STATUS = exports.AGENDA_COLLECTION_NAME = exports.VERIFY_TRANSACTION_ERROR = exports.VERIFY_TRANSACTION = exports.INIT_TRANSACTION = exports.NOTIFICATION_SEEN = exports.UPDATE_INVOICE = exports.CREATED_ESTIMATE = exports.TXN_REFERENCE = exports.TXN_CANCELLED = exports.CANCEL_APPOINTMENT = exports.APPROVE_JOB = exports.ASSIGN_DRIVER_JOB = exports.RESCHEDULE_APPOINTMENT = exports.BOOK_APPOINTMENT = exports.MOBILE_INSPECTION_TIME = void 0;
const Generic_1 = __importDefault(require("../utils/Generic"));
const uuid_1 = require("uuid");
exports.PASSWORD_PATTERN = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&+=])(?=\\S+$).{8,20}$';
exports.UPLOAD_BASE_PATH = 'uploads';
exports.TAGS = [
    { name: '2/3-Wheeler', icon: 'fa-person-biking' },
    { name: 'Sedan/SUV/CUV', icon: 'fa-car' },
    { name: 'Buses/Mini-Van', icon: 'fa-van-shuttle' },
    { name: 'Pickup Truck', icon: 'fa-truck-pickup' },
    { name: '0.5 - 3 Ton Truck', icon: 'fa-tractor' },
    { name: 'Heavy Duty Truck', icon: 'fa-tractor' },
];
exports.VIN_FILTER_CONSTRAINTS = [
    'vin',
    'model',
    'make',
    'modelYear',
    'engineModel',
    'engineCylinders',
    'plantCountry',
    'fuelTypePrimary',
    'engineDisplacementCcm',
    'displacementCc',
    'plateNumber',
];
exports.APPOINTMENT_STATUS = {
    pending: 'Pending',
    complete: 'Complete',
    inProgress: 'In-Progress',
    reject: 'Rejected',
    cancel: 'Cancelled',
};
exports.LOG_LEVEL_COLORS = {
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
};
exports.BOOKINGS = 'cache:BOOKINGS';
exports.PAY_STACK_PLANS = 'cache:PAY_STACK_PLANS';
exports.PAY_STACK_BANKS = 'cache:PAY_STACK_BANKS';
exports.TWENTY_FOUR_HOUR_EXPIRY = 24 * 60 * 60 * 1000;
exports.VIN_PATTERN = /^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$/;
exports.ANNUAL_PAYMENT_PLAN = 'One Time Payment';
exports.BI_PAYMENT_PLAN = 'Biannual Payment Plans';
exports.QUARTER_PAYMENT_PLAN = 'Quarterly Payment Plans';
exports.ONE_TIME_MOBILE_PLAN = Generic_1.default.generateSlug('one time mobile');
exports.ONE_TIME_DRIVE_IN_PLAN = Generic_1.default.generateSlug('one time drive-in');
exports.MOBILE_ONE_TIME_PAYMENT_PLAN = Generic_1.default.generateSlug('mobile one time payment plan');
exports.DRIVE_IN_ONE_TIME_PAYMENT_PLAN = Generic_1.default.generateSlug('drive-in one time payment plan');
exports.MOBILE_CATEGORY = 'Mobile';
exports.DRIVE_IN_CATEGORY = 'Drive-in';
exports.HYBRID_CATEGORY = 'Hybrid';
exports.GARAGE_CATEGORY = 'Garage';
exports.RIDE_SHARE_CATEGORY = 'Ride-Share';
exports.HOUSE_HOLD_MOBILE_PLAN = Generic_1.default.generateSlug('house hold mobile');
exports.HOUSE_HOLD_DRIVE_IN_PLAN = Generic_1.default.generateSlug('house hold drive-in');
exports.HOUSE_HOLD_HYBRID_PLAN = Generic_1.default.generateSlug('house hold hybrid');
exports.FAF_MOBILE_PLAN = Generic_1.default.generateSlug('family & friends mobile');
exports.FAF_DRIVE_IN_PLAN = Generic_1.default.generateSlug('family & friends drive-in');
exports.FAF_HYBRID_PLAN = Generic_1.default.generateSlug('family & friends hybrid');
exports.MOBILE_HOUSE_HOLD_PAYMENT_PLAN = Generic_1.default.generateSlug('mobile house hold payment plan');
exports.DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN = Generic_1.default.generateSlug('drive-in house hold payment plan');
exports.HYBRID_HOUSE_HOLD_PAYMENT_PLAN = Generic_1.default.generateSlug('hybrid house hold payment plan');
exports.MOBILE_FAF_PAYMENT_PLAN = Generic_1.default.generateSlug('mobile family & friends payment plan');
exports.DRIVE_IN_FAF_PAYMENT_PLAN = Generic_1.default.generateSlug('drive-in family & friends payment plan');
exports.HYBRID_FAF_PAYMENT_PLAN = Generic_1.default.generateSlug('hybrid family & friends payment plan');
exports.INSPECTIONS_SERVICE = 'Inspection';
exports.MAINTENANCE_SERVICE = 'Maintenance';
exports.ONE_TIME_SUBSCRIPTION = Generic_1.default.generateSlug('One Time');
exports.HOUSE_HOLD_SUBSCRIPTION = Generic_1.default.generateSlug('House Hold');
exports.FAF_SUBSCRIPTION = Generic_1.default.generateSlug('Family & Friends');
exports.SERVICES = [
    {
        name: 'Vehicle Inspection Program',
        slug: exports.INSPECTIONS_SERVICE,
        description: `This program is designed to take away your worries about identifying issues with your car (whenever they arise). You will be entitled to a number of inspections for a period of 12-months, anywhere in Nigeria. This comes with a complimentary road-side rescue. There’s been nothing better, since agege bread!`,
    },
    {
        name: 'Annual Vehicle Maintenance Program',
        slug: exports.MAINTENANCE_SERVICE,
        description: 'Over 80% of our vehicle’s health over time, and its longevity is determined by our maintenance habits. This program takes over and automates your vehicle maintenance activity, and ensures your never miss a service with our multi-modal service delivery anywhere in Nigeria. This is the best thing to happen to your vehicle!',
    },
];
exports.SUBSCRIPTIONS = [
    { name: 'One Time', slug: exports.ONE_TIME_SUBSCRIPTION },
    { name: 'House Hold', slug: exports.HOUSE_HOLD_SUBSCRIPTION },
    { name: 'Family & Friends', slug: exports.FAF_SUBSCRIPTION },
];
exports.CATEGORIES = [
    { name: exports.MOBILE_CATEGORY },
    { name: exports.DRIVE_IN_CATEGORY },
    { name: exports.HYBRID_CATEGORY },
    { name: exports.GARAGE_CATEGORY },
    { name: exports.RIDE_SHARE_CATEGORY },
];
const VEHICLE_RISK_TEXT = 'Vehicle Health & Risk Report';
const HOME_OFFICE_LOCATION_TEXT = 'Home, office or any location within AMAC, Abuja';
const CLOSEST_OFFICE_LOCATION_TEXT = 'Any Jiffix Garage Closest to you';
const ONE_THREE_VEHICLES = '1-3 vehicle';
const FOUR_SIX_VEHICLES = '4-6 vehicle';
const PLAN_DESC_REPORT = JSON.stringify({
    name: VEHICLE_RISK_TEXT,
    tag: 'report',
});
const PLAN_DESC_HOME_OFFICE = JSON.stringify({
    name: HOME_OFFICE_LOCATION_TEXT,
    tag: 'address',
});
const PLAN_DESC_CLOSEST_OFFICE = JSON.stringify({
    name: CLOSEST_OFFICE_LOCATION_TEXT,
    tag: 'address',
});
const ONE_TIME_PLAN_DESC_VEHICLES = JSON.stringify({
    name: '1 vehicle',
    tag: 'vehicles',
});
const HOUSE_HOLD_PLAN_DESC_VEHICLES = JSON.stringify({
    name: ONE_THREE_VEHICLES,
    tag: 'vehicles',
});
const FAF_PLAN_DESC_VEHICLES = JSON.stringify({
    name: FOUR_SIX_VEHICLES,
    tag: 'vehicles',
});
exports.PAYMENT_PLANS = {
    oneTime: [
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.MOBILE_ONE_TIME_PAYMENT_PLAN,
            value: 9000,
            hasPromo: true,
            discount: 44.44,
            descriptions: [ONE_TIME_PLAN_DESC_VEHICLES, PLAN_DESC_HOME_OFFICE, PLAN_DESC_REPORT],
        },
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.DRIVE_IN_ONE_TIME_PAYMENT_PLAN,
            value: 5000,
            hasPromo: true,
            discount: 80,
            descriptions: [ONE_TIME_PLAN_DESC_VEHICLES, PLAN_DESC_CLOSEST_OFFICE, PLAN_DESC_REPORT],
        },
    ],
    houseHold: [
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.MOBILE_HOUSE_HOLD_PAYMENT_PLAN,
            value: 33750,
            hasPromo: false,
            discount: 0,
            descriptions: [
                HOUSE_HOLD_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '7 mobile inspections',
                    tag: 'inspections',
                }),
                PLAN_DESC_HOME_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN,
            value: 18060,
            hasPromo: false,
            discount: 0,
            descriptions: [
                HOUSE_HOLD_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '7 in-garage inspections',
                    tag: 'inspections',
                }),
                PLAN_DESC_CLOSEST_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.HYBRID_HOUSE_HOLD_PAYMENT_PLAN,
            value: 22600,
            hasPromo: false,
            discount: 0,
            descriptions: [
                HOUSE_HOLD_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '7 inspections (5 Drive-in | 2 Mobile)',
                    tag: 'inspections',
                }),
                PLAN_DESC_HOME_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
    ],
    faf: [
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.MOBILE_FAF_PAYMENT_PLAN,
            value: 56700,
            hasPromo: false,
            discount: 0,
            descriptions: [
                FAF_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '13 mobile inspections',
                    tag: 'inspections',
                }),
                PLAN_DESC_HOME_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.DRIVE_IN_FAF_PAYMENT_PLAN,
            value: 33540,
            hasPromo: false,
            discount: 0,
            descriptions: [
                FAF_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '13 in-garage inspections',
                    tag: 'inspections',
                }),
                PLAN_DESC_CLOSEST_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
        {
            name: exports.ANNUAL_PAYMENT_PLAN,
            label: exports.HYBRID_FAF_PAYMENT_PLAN,
            value: 40680,
            hasPromo: false,
            discount: 0,
            descriptions: [
                FAF_PLAN_DESC_VEHICLES,
                JSON.stringify({
                    name: '13 inspections (9 Drive-in | 4 Mobile)',
                    tag: 'inspections',
                }),
                PLAN_DESC_CLOSEST_OFFICE,
                PLAN_DESC_REPORT,
            ],
        },
    ],
};
exports.PLANS = [
    [
        {
            label: exports.ONE_TIME_MOBILE_PLAN,
            minVehicles: 1,
            maxVehicles: 1,
            validity: '12 months',
            inspections: 1,
            mobile: 1,
            driveIn: 0,
        },
        {
            label: exports.ONE_TIME_DRIVE_IN_PLAN,
            minVehicles: 1,
            maxVehicles: 1,
            validity: '12 months',
            inspections: 1,
            mobile: 0,
            driveIn: 1,
        },
    ],
    [
        {
            label: exports.HOUSE_HOLD_MOBILE_PLAN,
            minVehicles: 1,
            maxVehicles: 3,
            validity: '12 months',
            inspections: 7,
            mobile: 7,
            driveIn: 0,
        },
        {
            label: exports.HOUSE_HOLD_DRIVE_IN_PLAN,
            minVehicles: 1,
            maxVehicles: 3,
            validity: '12 months',
            inspections: 7,
            mobile: 0,
            driveIn: 7,
        },
        {
            label: exports.HOUSE_HOLD_HYBRID_PLAN,
            minVehicles: 1,
            maxVehicles: 3,
            validity: '12 months',
            inspections: 7,
            mobile: 2,
            driveIn: 5,
        },
    ],
    [
        {
            label: exports.FAF_MOBILE_PLAN,
            minVehicles: 4,
            maxVehicles: 6,
            validity: '12 months',
            inspections: 13,
            mobile: 13,
            driveIn: 0,
        },
        {
            label: exports.FAF_DRIVE_IN_PLAN,
            minVehicles: 4,
            maxVehicles: 6,
            validity: '12 months',
            inspections: 13,
            mobile: 0,
            driveIn: 13,
        },
        {
            label: exports.FAF_HYBRID_PLAN,
            minVehicles: 4,
            maxVehicles: 6,
            validity: '12 months',
            inspections: 13,
            mobile: 4,
            driveIn: 9,
        },
    ],
];
exports.PAYMENT_TERMS = [
    {
        name: exports.ANNUAL_PAYMENT_PLAN,
        split: 1,
        quota: '/yr',
        interest: 0,
    },
    {
        name: exports.BI_PAYMENT_PLAN,
        split: 2,
        quota: '/6mo',
        interest: 4,
    },
    {
        name: exports.QUARTER_PAYMENT_PLAN,
        split: 4,
        quota: '/qtr',
        interest: 5,
    },
];
exports.MESSAGES = {
    http: {
        200: 'Ok',
        201: 'Accepted',
        202: 'Created',
        400: 'Bad Request. Please Contact Support.',
        401: 'You Are Not Authenticated. Please Contact Support.',
        403: 'You Are Forbidden From Accessing This Resource.',
        404: 'Not Found. Please Contact Support.',
        500: 'Something Went Wrong. Please Contact Support.',
    },
};
exports.QUEUE_EVENTS = {
    name: 'DEFAULT',
};
exports.MAIN_OFFICE = 'No. 10, 45 Road, off 1st Avenue Gwarimpa';
exports.RESCHEDULE_CONSTRAINT = 3600000;
exports.MOBILE_INSPECTION_TIME = 3; //3hrs;
exports.BOOK_APPOINTMENT = 'event:BOOK_APPOINTMENT';
exports.RESCHEDULE_APPOINTMENT = 'event:RESCHEDULE_APPOINTMENT';
exports.ASSIGN_DRIVER_JOB = 'event:ASSIGN_DRIVER_JOB';
exports.APPROVE_JOB = 'event:APPROVE_JOB';
exports.CANCEL_APPOINTMENT = 'event:CANCEL_APPOINTMENT';
exports.TXN_CANCELLED = 'event:TXN_CANCELLED';
exports.TXN_REFERENCE = 'event:TXN_REFERENCE';
exports.CREATED_ESTIMATE = 'event:CREATED_ESTIMATE';
exports.UPDATE_INVOICE = 'event:UPDATE_INVOICE';
exports.NOTIFICATION_SEEN = 'event:NOTIFICATION_SEEN';
exports.INIT_TRANSACTION = 'event:INIT_TRANSACTION';
exports.VERIFY_TRANSACTION = 'event:VERIFY_TRANSACTION';
exports.VERIFY_TRANSACTION_ERROR = 'event:VERIFY_TRANSACTION_ERROR';
exports.AGENDA_COLLECTION_NAME = 'appointment_jobs';
exports.JOB_STATUS = {
    complete: 'Complete',
    pending: 'Pending',
    inProgress: 'In-Progress',
    canceled: 'Canceled',
};
exports.INITIAL_CHECK_LIST_VALUES = {
    id: (0, uuid_1.v4)(),
    title: '',
    questions: [
        {
            id: (0, uuid_1.v4)(),
            answers: [{ id: (0, uuid_1.v4)(), answer: '', weight: '', color: '' }],
            media: false,
            note: false,
            question: '',
        },
    ],
};
exports.INITIAL_PARTS_VALUE = {
    name: '',
    warranty: { warranty: '', interval: '' },
    quantity: { quantity: '', unit: '' },
    price: '0',
    amount: '0',
};
exports.INITIAL_LABOURS_VALUE = { title: '', cost: '0' };
exports.ESTIMATE_EXPIRY_DAYS = 7;
exports.ESTIMATE_STATUS = {
    sent: 'Sent',
    invoiced: 'Invoiced',
    draft: 'Draft',
};
exports.INVOICE_STATUS = {
    paid: 'Paid',
    overDue: 'Overdue',
    dueSoon: 'Due soon',
    deposit: 'Deposit',
    update: {
        draft: 'Draft',
        sent: 'Sent',
        refund: 'Refunded',
    },
};
exports.TRANSACTION_TYPE = {
    deposit: 'Deposit',
    transfer: 'Transfer',
    refund: 'Refund',
};
exports.PAYMENT_CHANNELS = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer', 'eft'];
