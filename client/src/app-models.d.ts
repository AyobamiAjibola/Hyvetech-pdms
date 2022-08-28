declare module "@app-models" {
  interface IUser {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    loginToken: string;
    gatewayId: string;
    loginDate: Date;
    contacts: IContact[];
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IContact {
    id: number;
    label: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    state: string;
    country: string;
    customer: ICustomer;
    customerId: number;
    user: IUser;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPaymentDetail {
    id: number;
    channel: string;
    provider: string;
    bankName: string;
    bankCode: string;
    bankAccountNumber: string;
    ussdCode: string;
    cardType: string;
    cardName: string;
    cardNumber: string;
    cardExpiryDate: Date;
    ccv: string;
    authorizationCode: string;
    customer: ICustomer;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IVehicle {
    id: number;
    vin: string;
    model: string;
    make: string;
    engineCylinders: string;
    modelYear: string;
    engineModel: string;
    imageUrl: string;
    nickname: string;
    plateNumber: string;
    type: string;
    isBooked: boolean;
    isOwner: boolean;
    customer: ICustomer;
    customerId: number;
    appointment: IAppointment;
    appointmentId: number;
    subscription: ICustomerSubscription;
    customerSubscriptionId: number;
    tags: ITag;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ITag {
    id: number;
    name: string;
    vehicles: IVehicle[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ITransaction {
    id: number;
    reference: string;
    amount: number;
    status: string;
    authorizationUrl: string;
    isRequestForInspection: boolean;
    last4: string;
    expMonth: string;
    expYear: string;
    channel: string;
    cardType: string;
    bank: string;
    countryCode: string;
    brand: string;
    currency: string;
    planCode: string;
    paidAt: Date;
    customer: ICustomer;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IAppointment {
    id: number;
    code: string;
    status: string;
    appointmentDate: Date;
    serviceLocation: string;
    timeSlot: string;
    planCategory: string;
    modeOfService: string;
    programme: string;
    serviceCost: string;
    inventoryFile: string;
    reportFile: string;
    estimateFile: string;
    vehicle: IVehicle;
    vehicleFault: IVehicleFault;
    customer: ICustomer;
    customerId: number;
    jobs: IJob;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IJob {
    id: number;
    type: string;
    name: string;
    duration: string;
    appointments: IAppointment;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICustomerSubscription {
    id: number;
    status: string;
    planType: string;
    planCategory: string;
    modeOfService: string;
    paymentPlan: string;
    maxVehicle: number;
    vehicleCount: number;
    minVehicle: number;
    isHybrid: boolean;
    mobileCount: number;
    maxMobile: number;
    driveInCount: number;
    maxDriveIn: number;
    inspections: number;
    subscriber: string;
    amount: string;
    programme: string;
    planCode: string;
    subscriptionDate: Date;
    nextPaymentDate: Date;
    customers: ICustomer[];
    vehicles: IVehicle[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDefaultSubscription {
    id: number;
    name: string;
    description: string;
    active: boolean;
    plans: IPlan[];
  }

  interface IPlan {
    id: number;
    label: string;
    validity: string;
    minVehicles: number;
    maxVehicles: number;
    inspections: number;
    paymentPlans: IPaymentPlan[];
    paymentTerms: IPaymentTerm[];
    categories: Category[];
    active: boolean;
  }

  interface IPaymentPlan {
    id: number;
    name: string;
    label: string;
    discount: number;
    value: number;
    hasPromo: boolean;
    descriptions: string[];
  }

  interface IPaymentTerm {
    id: number;
    name: string;
    interest: number;
    split: number;
    discount: number;
    quota: string;
  }

  interface Category {
    id: number;
    name: string;
    description: string;
    plans: IPlan[];
    paymentPlans: IPaymentPlan[];
  }

  interface IPermission {
    id: number;
    name: string;
    action: string;
    subject: string;
    inverted: boolean;
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IRole {
    id: number;
    name: string;
    slug: string;
    permissions: IPermission[];
    customers: ICustomer[];
    users: IUser[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IVehicleFault {
    id: number;
    description: string;
    imagePath: string;
    videoPath: string;
    appointment: IAppointment;
    appointmentId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICustomer {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    loginToken: string;
    gatewayId: string;
    loginDate: Date;
    contacts: IContact[];
    paymentDetails: IPaymentDetail[];
    vehicles: IVehicle[];
    transactions: ITransaction[];
    appointments: IAppointment[];
    subscriptions: ICustomerSubscription[];
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ISchedule {
    id: number;
    name: string;
    status: string;
    default: boolean;
    date?: string;
    timeSlots: ITimeSlot[];
  }

  interface ITimeSlot {
    id: number;
    time: string;
    label: string;
    available: boolean;
  }
}
