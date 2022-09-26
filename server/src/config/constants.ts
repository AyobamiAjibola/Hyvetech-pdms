import Generic from "../utils/Generic";
import { appCommonTypes } from "../@types/app-common";
import QueueEvents = appCommonTypes.QueueEvents;

export const PASSWORD_PATTERN =
  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&+=])(?=\\S+$).{8,20}$";

export const UPLOAD_BASE_PATH = "uploads";

export const VIN_FILTER_CONSTRAINTS = [
  "vin",
  "model",
  "make",
  "modelYear",
  "engineModel",
  "engineCylinders",
  "plantCountry",
  "fuelTypePrimary",
  "engineDisplacementCcm",
  "displacementCc",
];

export const APPOINTMENT_STATUS = {
  pending: "Pending",
  complete: "Complete",
  inProgress: "In-Progress",
  reject: "Rejected",
  cancel: "Cancelled",
};

export const LOG_LEVEL_COLORS = {
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
};

export const BOOKINGS = "cache:BOOKINGS";
export const PAY_STACK_PLANS = "cache:PAY_STACK_PLANS";
export const TWENTY_FOUR_HOUR_EXPIRY = 24 * 60 * 60 * 1000;
export const VIN_PATTERN = /^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$/;

export const ANNUAL_PAYMENT_PLAN = "One Time Payment";
export const BI_PAYMENT_PLAN = "Biannual Payment Plans";
export const QUARTER_PAYMENT_PLAN = "Quarterly Payment Plans";

export const ONE_TIME_MOBILE_PLAN = Generic.generateSlug("one time mobile");
export const ONE_TIME_DRIVE_IN_PLAN = Generic.generateSlug("one time drive-in");

export const MOBILE_ONE_TIME_PAYMENT_PLAN = Generic.generateSlug(
  "mobile one time payment plan"
);
export const DRIVE_IN_ONE_TIME_PAYMENT_PLAN = Generic.generateSlug(
  "drive-in one time payment plan"
);

export const MOBILE_CATEGORY = "Mobile";
export const DRIVE_IN_CATEGORY = "Drive-in";
export const HYBRID_CATEGORY = "Hybrid";
export const GARAGE_CATEGORY = "Garage";
export const RIDE_SHARE_CATEGORY = "Ride-Share";

export const HOUSE_HOLD_MOBILE_PLAN = Generic.generateSlug("house hold mobile");
export const HOUSE_HOLD_DRIVE_IN_PLAN = Generic.generateSlug(
  "house hold drive-in"
);
export const HOUSE_HOLD_HYBRID_PLAN = Generic.generateSlug("house hold hybrid");

export const FAF_MOBILE_PLAN = Generic.generateSlug("family & friends mobile");
export const FAF_DRIVE_IN_PLAN = Generic.generateSlug(
  "family & friends drive-in"
);
export const FAF_HYBRID_PLAN = Generic.generateSlug("family & friends hybrid");

export const MOBILE_HOUSE_HOLD_PAYMENT_PLAN = Generic.generateSlug(
  "mobile house hold payment plan"
);
export const DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN = Generic.generateSlug(
  "drive-in house hold payment plan"
);
export const HYBRID_HOUSE_HOLD_PAYMENT_PLAN = Generic.generateSlug(
  "hybrid house hold payment plan"
);
export const MOBILE_FAF_PAYMENT_PLAN = Generic.generateSlug(
  "mobile family & friends payment plan"
);
export const DRIVE_IN_FAF_PAYMENT_PLAN = Generic.generateSlug(
  "drive-in family & friends payment plan"
);
export const HYBRID_FAF_PAYMENT_PLAN = Generic.generateSlug(
  "hybrid family & friends payment plan"
);

export const INSPECTIONS_SERVICE = "Inspection";
export const MAINTENANCE_SERVICE = "Maintenance";

export const ONE_TIME_SUBSCRIPTION = Generic.generateSlug("One Time");
export const HOUSE_HOLD_SUBSCRIPTION = Generic.generateSlug("House Hold");
export const FAF_SUBSCRIPTION = Generic.generateSlug("Family & Friends");

export const SERVICES = [
  {
    name: "Vehicle Inspection Program",
    slug: INSPECTIONS_SERVICE,
    description: `This program is designed to take away your worries about identifying issues with your car (whenever they arise). You will be entitled to a number of inspections for a period of 12-months, anywhere in Nigeria. This comes with a complimentary road-side rescue. There’s been nothing better, since agege bread!`,
  },
  {
    name: "Annual Vehicle Maintenance Program",
    slug: MAINTENANCE_SERVICE,
    description:
      "Over 80% of our vehicle’s health over time, and its longevity is determined by our maintenance habits. This program takes over and automates your vehicle maintenance activity, and ensures your never miss a service with our multi-modal service delivery anywhere in Nigeria. This is the best thing to happen to your vehicle!",
  },
];

export const SUBSCRIPTIONS = [
  { name: "One Time", slug: ONE_TIME_SUBSCRIPTION },
  { name: "House Hold", slug: HOUSE_HOLD_SUBSCRIPTION },
  { name: "Family & Friends", slug: FAF_SUBSCRIPTION },
];

export const CATEGORIES = [
  { name: MOBILE_CATEGORY },
  { name: DRIVE_IN_CATEGORY },
  { name: HYBRID_CATEGORY },
  { name: GARAGE_CATEGORY },
  { name: RIDE_SHARE_CATEGORY },
];

const VEHICLE_RISK_TEXT = "Vehicle Health & Risk Report";
const HOME_OFFICE_LOCATION_TEXT =
  "Home, office or any location within AMAC, Abuja";
const CLOSEST_OFFICE_LOCATION_TEXT = "Any Jiffix Garage Closest to you";
const ONE_THREE_VEHICLES = "1-3 vehicle";
const FOUR_SIX_VEHICLES = "4-6 vehicle";

const PLAN_DESC_REPORT = JSON.stringify({
  name: VEHICLE_RISK_TEXT,
  tag: "report",
});

const PLAN_DESC_HOME_OFFICE = JSON.stringify({
  name: HOME_OFFICE_LOCATION_TEXT,
  tag: "address",
});

const PLAN_DESC_CLOSEST_OFFICE = JSON.stringify({
  name: CLOSEST_OFFICE_LOCATION_TEXT,
  tag: "address",
});

const ONE_TIME_PLAN_DESC_VEHICLES = JSON.stringify({
  name: "1 vehicle",
  tag: "vehicles",
});

const HOUSE_HOLD_PLAN_DESC_VEHICLES = JSON.stringify({
  name: ONE_THREE_VEHICLES,
  tag: "vehicles",
});

const FAF_PLAN_DESC_VEHICLES = JSON.stringify({
  name: FOUR_SIX_VEHICLES,
  tag: "vehicles",
});

export const PAYMENT_PLANS = {
  oneTime: [
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: MOBILE_ONE_TIME_PAYMENT_PLAN,
      value: 9000,
      hasPromo: true,
      discount: 44.44,
      descriptions: [
        ONE_TIME_PLAN_DESC_VEHICLES,
        PLAN_DESC_HOME_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: DRIVE_IN_ONE_TIME_PAYMENT_PLAN,
      value: 5000,
      hasPromo: true,
      discount: 80,
      descriptions: [
        ONE_TIME_PLAN_DESC_VEHICLES,
        PLAN_DESC_CLOSEST_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
  ],
  houseHold: [
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: MOBILE_HOUSE_HOLD_PAYMENT_PLAN,
      value: 33750,
      hasPromo: false,
      discount: 0,
      descriptions: [
        HOUSE_HOLD_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "7 mobile inspections",
          tag: "inspections",
        }),
        PLAN_DESC_HOME_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN,
      value: 18060,
      hasPromo: false,
      discount: 0,
      descriptions: [
        HOUSE_HOLD_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "7 in-garage inspections",
          tag: "inspections",
        }),
        PLAN_DESC_CLOSEST_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: HYBRID_HOUSE_HOLD_PAYMENT_PLAN,
      value: 22600,
      hasPromo: false,
      discount: 0,
      descriptions: [
        HOUSE_HOLD_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "7 inspections (5 Drive-in | 2 Mobile)",
          tag: "inspections",
        }),
        PLAN_DESC_HOME_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
  ],
  faf: [
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: MOBILE_FAF_PAYMENT_PLAN,
      value: 56700,
      hasPromo: false,
      discount: 0,
      descriptions: [
        FAF_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "13 mobile inspections",
          tag: "inspections",
        }),
        PLAN_DESC_HOME_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: DRIVE_IN_FAF_PAYMENT_PLAN,
      value: 33540,
      hasPromo: false,
      discount: 0,
      descriptions: [
        FAF_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "13 in-garage inspections",
          tag: "inspections",
        }),
        PLAN_DESC_CLOSEST_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
    {
      name: ANNUAL_PAYMENT_PLAN,
      label: HYBRID_FAF_PAYMENT_PLAN,
      value: 40680,
      hasPromo: false,
      discount: 0,
      descriptions: [
        FAF_PLAN_DESC_VEHICLES,
        JSON.stringify({
          name: "13 inspections (9 Drive-in | 4 Mobile)",
          tag: "inspections",
        }),
        PLAN_DESC_CLOSEST_OFFICE,
        PLAN_DESC_REPORT,
      ],
    },
  ],
};

export const PLANS = [
  [
    {
      label: ONE_TIME_MOBILE_PLAN,
      minVehicles: 1,
      maxVehicles: 1,
      validity: "12 months",
      inspections: 1,
      mobile: 1,
      driveIn: 0,
    },
    {
      label: ONE_TIME_DRIVE_IN_PLAN,
      minVehicles: 1,
      maxVehicles: 1,
      validity: "12 months",
      inspections: 1,
      mobile: 0,
      driveIn: 1,
    },
  ],
  [
    {
      label: HOUSE_HOLD_MOBILE_PLAN,
      minVehicles: 1,
      maxVehicles: 3,
      validity: "12 months",
      inspections: 7,
      mobile: 7,
      driveIn: 0,
    },
    {
      label: HOUSE_HOLD_DRIVE_IN_PLAN,
      minVehicles: 1,
      maxVehicles: 3,
      validity: "12 months",
      inspections: 7,
      mobile: 0,
      driveIn: 7,
    },
    {
      label: HOUSE_HOLD_HYBRID_PLAN,
      minVehicles: 1,
      maxVehicles: 3,
      validity: "12 months",
      inspections: 7,
      mobile: 2,
      driveIn: 5,
    },
  ],
  [
    {
      label: FAF_MOBILE_PLAN,
      minVehicles: 4,
      maxVehicles: 6,
      validity: "12 months",
      inspections: 13,
      mobile: 13,
      driveIn: 0,
    },
    {
      label: FAF_DRIVE_IN_PLAN,
      minVehicles: 4,
      maxVehicles: 6,
      validity: "12 months",
      inspections: 13,
      mobile: 0,
      driveIn: 13,
    },
    {
      label: FAF_HYBRID_PLAN,
      minVehicles: 4,
      maxVehicles: 6,
      validity: "12 months",
      inspections: 13,
      mobile: 4,
      driveIn: 9,
    },
  ],
];

export const PAYMENT_TERMS = [
  {
    name: ANNUAL_PAYMENT_PLAN,
    split: 1,
    quota: "/yr",
    interest: 0,
  },
  {
    name: BI_PAYMENT_PLAN,
    split: 2,
    quota: "/6mo",
    interest: 4,
  },
  {
    name: QUARTER_PAYMENT_PLAN,
    split: 4,
    quota: "/qtr",
    interest: 5,
  },
];

export const MESSAGES = {
  http: {
    200: "Ok",
    201: "Accepted",
    202: "Created",
    400: "Bad Request. Please Contact Support.",
    401: "You Are Not Authenticated. Please Contact Support.",
    403: "You Are Forbidden From Accessing This Resource.",
    404: "Not Found. Please Contact Support.",
    500: "Something Went Wrong. Please Contact Support.",
  },
};

export const QUEUE_EVENTS: QueueEvents = {
  name: "DEFAULT",
};

export const MAIN_OFFICE = "No. 10, 45 Road, off 1st Avenue Gwarimpa";

export const RESCHEDULE_CONSTRAINT = 3600000;
export const MOBILE_INSPECTION_TIME = 3; //3hrs;

export const BOOK_APPOINTMENT = "event:BOOK_APPOINTMENT";
export const RESCHEDULE_APPOINTMENT = "event:RESCHEDULE_APPOINTMENT";
export const CANCEL_APPOINTMENT = "event:CANCEL_APPOINTMENT";
export const AGENDA_COLLECTION_NAME = "appointment_jobs";
