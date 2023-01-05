import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import Joi from 'joi';

import Role from './Role';
import CustomerRole from './CustomerRole';
import Contact from './Contact';
import PaymentDetail from './PaymentDetail';
import Appointment from './Appointment';
import Vehicle, { $vehicleSchema } from './Vehicle';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Transaction from './Transaction';
import CustomerSubscription from './CustomerSubscription';
import CustomerPlanSubscription from './CustomerPlanSubscription';
import Estimate from './Estimate';
import BillingInformation from './BillingInformation';
import CustomerWorkShop from './CustomerWorkShop';

export const $customerSchema = {
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  phone: Joi.string().max(11).required().label('Phone Number'),
  state: Joi.string().required().label('State'),
  district: Joi.string().required().label('District'),
};

export const $initTransactionSchema = {
  email: $customerSchema.email,
  phone: $customerSchema.phone,
  callbackUrl: Joi.string().allow('Payment CallbackPage URL'),
  subscriptionName: Joi.string().label('Subscription Name'),
  planCategory: Joi.string().label('Plans Category'),
  paymentPlan: Joi.string().label('Payment Plans'),
  amount: Joi.string().label('Amount'),
};

export const $verifyTransactionSchema = {
  amount: $initTransactionSchema.amount,
  email: $initTransactionSchema.email,
  paymentPlan: $initTransactionSchema.paymentPlan,
  planCategory: $initTransactionSchema.planCategory,
  subscriptionName: $initTransactionSchema.subscriptionName,
  reference: Joi.string().required().label('Payment Reference'),
};

export const $addVehicleSchema = {
  customerId: Joi.number().required().label('Customer Id'),
  ...$vehicleSchema,
};

@Table({
  timestamps: true,
  tableName: 'customers',
  paranoid: true,
})
export default class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'customer_id' })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare companyName: string;

  @Column(DataType.STRING)
  declare designation: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare rawPassword: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare gender: string;

  @Column(DataType.STRING)
  declare profileImageUrl: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare enabled: boolean;

  @Column(DataType.STRING(3000))
  declare loginToken: string;

  @Column(DataType.STRING(3000))
  declare expoSlug: string;

  @Column(DataType.STRING)
  declare gatewayId: string;

  @Column(DataType.STRING)
  declare eventId: string;

  @Column(DataType.STRING)
  declare pushToken: string;

  @Column(DataType.DATE)
  declare loginDate: Date;

  @HasOne(() => BillingInformation)
  declare billingInformation: NonAttribute<BillingInformation>;

  @HasMany(() => CustomerWorkShop)
  declare workshops: NonAttribute<Array<CustomerWorkShop>>;

  @HasMany(() => Estimate, { onDelete: 'SET NULL' })
  declare estimates: NonAttribute<Estimate[]>;

  @HasMany(() => Contact, { onDelete: 'SET NULL' })
  declare contacts: NonAttribute<Contact[]>;

  @HasMany(() => PaymentDetail, { onDelete: 'SET NULL' })
  declare paymentDetails: NonAttribute<PaymentDetail[]>;

  @HasMany(() => Vehicle, { onDelete: 'SET NULL' })
  declare vehicles: NonAttribute<Vehicle[]>;

  @HasMany(() => Transaction, { onDelete: 'SET NULL' })
  declare transactions: NonAttribute<Transaction[]>;

  @HasMany(() => Appointment, { onDelete: 'SET NULL' })
  declare appointments: NonAttribute<Appointment[]>;

  @BelongsToMany(() => CustomerSubscription, () => CustomerPlanSubscription)
  declare subscriptions: NonAttribute<
    Array<
      CustomerSubscription & {
        CustomerPlanSubscription: CustomerPlanSubscription;
      }
    >
  >;

  @BelongsToMany(() => Role, () => CustomerRole)
  declare roles: NonAttribute<Array<Role & { CustomerRole: CustomerRole }>>;
}
