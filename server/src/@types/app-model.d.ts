import { Model } from "sequelize-typescript";
import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  CreationOptional,
  DestroyOptions,
  FindOptions,
  SyncOptions,
  UpdateOptions,
} from "sequelize";
import { BulkCreateOptions } from "sequelize/types/model";

export declare namespace appModelTypes {
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

  interface IState {
    id: number;
    name: string;
    alias: string;
    districts: IDistrict[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDistrict {
    id: number;
    name: string;
    discounts: IDiscount[];
    state: IState;
    stateId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDiscount {
    id: number;
    label: string;
    description: string;
    value: number;
    districts: IDistrict[];
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

  interface IPartner {
    id: CreationOptional<number>;
    name: string;
    slug: string;
    phone: string;
    email: string;
    totalStaff: number;
    totalTechnicians: number;
    brands: string[];
    images: string[];
    yearOfIncorporation: number;
    cac: string;
    workingHours: string[];
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
    serviceStatus: string;
    purpose: string;
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

  interface ISubscription {
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

  type DomainClass<M> = new () => M;

  abstract class AbstractCrudRepository<
    M extends Model = Model,
    Id extends number = number
  > {
    /**
     * @name save
     * @param values
     * @param options
     * @desc
     * Save an instance of a model to the database.
     * This method calls sequelize create method.
     * Pass optional config, to control the query outcome
     */
    save(
      values: CreationAttributes<M>,
      options?: CreateOptions<Attributes<M>>
    ): Promise<M>;

    /**
     * @name exist
     * @param t
     * @param options
     * @desc
     * Checks if an instance of a model exist in the database.
     * This method calls sequelize find one method.
     * Pass optional config, to control the query outcome
     */
    exist(t: M, options?: FindOptions<Attributes<M>>): Promise<boolean>;

    /**
     * @name findById
     * @param id
     * @param options
     * @desc
     * Find model instance by Id.
     * This method calls sequelize findByPk method.
     * Pass optional config, to control the query outcome
     */
    findById(id: Id, options?: FindOptions<Attributes<M>>): Promise<M | null>;

    /**
     *
     * @param options
     */
    findAll(options?: FindOptions<Attributes<M>>): Promise<M[]>;

    /**
     *
     * @param options
     */
    findOne(options: FindOptions<Attributes<M>>): Promise<M | null>;

    /**
     * @name deleteById
     * @param id
     * @param options
     * @desc
     * Delete model data by Id..
     * This method calls the destroy method in sequelize.
     * Pass optional config, to control the query outcome
     */
    deleteById(id: Id, options?: DestroyOptions<Attributes<M>>): Promise<void>;

    /**
     * @name deleteOne
     * @param t
     * @param options
     * @desc
     * Delete model data by Id..
     * This method calls the destroy method of the model instance in sequelize.
     * Pass optional config, to control the query outcome
     */
    deleteOne(t: M, options?: DestroyOptions<Attributes<M>>): Promise<void>;

    /**
     * @name deleteAll
     * @param options
     * @desc
     * Delete all model data.
     * This method calls the sync method in sequelize with option force set to true.
     * Pass optional config, to control the query outcome
     */
    deleteAll(options?: SyncOptions): Promise<void>;

    /**
     * @name updateOne
     * @param t
     * @param values
     * @param options
     * @desc
     * Update model by any of its attributes.
     * This method calls the update method in sequelize.
     * Pass optional config, to control the query outcome
     */
    updateOne(
      t: M,
      values: Attributes<M>,
      options?: UpdateOptions<Attributes<M>>
    ): Promise<M>;

    /**
     * @name bulkCreate
     * @param records
     * @param options
     * @desc
     * Create models passed as arrays, at once..
     * This method calls the bulkCreate method in sequelize.
     * Pass optional config, to control the query outcome
     */
    bulkCreate(
      records: ReadonlyArray<CreationAttributes<M>>,
      options?: BulkCreateOptions<Attributes<M>>
    ): Promise<M[]>;

    model?: string;
  }

  interface ICrudDAO<M extends Model = Model> {
    create(
      values: CreationAttributes<M>,
      options?: CreateOptions<Attributes<M>>
    ): Promise<M>;

    update(
      t: M,
      values: CreationAttributes<M>,
      options?: UpdateOptions<Attributes<M>>
    ): Promise<M>;

    findById(
      id: number,
      options?: FindOptions<Attributes<M>>
    ): Promise<M | null>;

    deleteById(
      id: number,
      options?: DestroyOptions<Attributes<M>>
    ): Promise<void>;

    findByAny(options: FindOptions<Attributes<M>>): Promise<M | null>;

    findAll(options?: FindOptions<Attributes<M>>): Promise<M[]>;
  }
}
