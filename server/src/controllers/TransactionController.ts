import { Request } from 'express';
import { appEventEmitter } from '../services/AppEventEmitter';
import {
  INIT_TRANSACTION,
  PAYMENT_CHANNELS,
  TXN_CANCELLED,
  TXN_REFERENCE,
  VERIFY_TRANSACTION,
} from '../config/constants';
import { appCommonTypes } from '../@types/app-common';
import HttpStatus from '../helpers/HttpStatus';
import { TryCatch } from '../decorators';
import Joi from 'joi';
import CustomAPIError from '../exceptions/CustomAPIError';
import dataSources from '../services/dao';
import axiosClient from '../services/api/axiosClient';
import Transaction from '../models/Transaction';
import { CreationAttributes } from 'sequelize/types';
import AppLogger from '../utils/AppLogger';
import HttpResponse = appCommonTypes.HttpResponse;
import IDepositForEstimate = appCommonTypes.IDepositForEstimate;
import AnyObjectType = appCommonTypes.AnyObjectType;
import IInitTransaction = appCommonTypes.IInitTransaction;

const transactionDoesNotExist = 'Transaction Does not exist.';

export default class TransactionController {
  private static LOG = AppLogger.init(TransactionController.name).logger;

  public static async subscriptionsTransactionStatus(req: Request) {
    try {
      const query = req.query;

      if (query.status && query.status === 'cancelled') {
        appEventEmitter.emit(TXN_CANCELLED, { cancelled: true });
      }

      if (query.reference) {
        appEventEmitter.emit(TXN_REFERENCE, { reference: query.reference });
      }

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
      } as HttpResponse<any>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name depositForEstimate
   * @description The method a customer calls when they are ready to make a deposit for an estimate.
   * @description This method performs the Deposit Transaction.
   * @description The first deposit from the customer, is the payable amount (depositAmount) to the system account
   * @description via a payment gateway (paystack). Here we initialize a transaction, send the response via socket.io to the customer mobile app.
   * @description The callback response from the payment gateway, is sent back to the server, the {@method initTransactionCallback }
   * @description verifies the transaction, and sends a response via socket.io to the customer mobile app to close the transaction.
   * @param req {
       @field customerId:number,
       @field estimateId: number,
       @field partnerId: number,
       @field vin: string,
       @field depositAmount: number,
       @field grandTotal: number,
   * }
   */
  @TryCatch
  public static async depositForEstimate(req: Request) {
    //validate request body
    const { error, value } = Joi.object<IDepositForEstimate>({
      customerId: Joi.number().required().label('Customer Id'),
      estimateId: Joi.number().required().label('Estimate Id'),
      partnerId: Joi.number().required().label('Partner Id'),
      depositAmount: Joi.number().required().label('Deposit Amount'),
      grandTotal: Joi.number().required().label('Total Amount'),
      vin: Joi.string().required().label('Vehicle Identification Number'),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    //verify estimate exist
    const estimate = await dataSources.estimateDAOService.findById(value.estimateId);

    if (!estimate)
      return Promise.reject(CustomAPIError.response(`Estimate does not exist.`, HttpStatus.NOT_FOUND.code));

    const partner = await estimate.$get('partner');

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist`, HttpStatus.NOT_FOUND.code));

    const banks = await dataSources.bankDAOService.findAll();

    if (!banks.length)
      return Promise.reject(CustomAPIError.response(`No banks Please contact support`, HttpStatus.NOT_FOUND.code));

    const bank = banks.find(bank => bank.name === partner.bankName);

    if (!bank)
      return Promise.reject(
        CustomAPIError.response(
          `Bank ${partner.bankName} does not exist. Please contact support`,
          HttpStatus.NOT_FOUND.code,
        ),
      );

    const customer = await dataSources.customerDAOService.findById(value.customerId);

    if (!customer)
      return Promise.reject(CustomAPIError.response(`Customer does not exist.`, HttpStatus.NOT_FOUND.code));

    const vehicle = await dataSources.vehicleDAOService.findByAny({
      where: { vin: value.vin },
    });

    if (!vehicle)
      return Promise.reject(
        CustomAPIError.response(`Vehicle with VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code),
      );

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    //initialize payment
    const metadata = {
      cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
    };
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = '/transaction/initialize';

    const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}${endpoint}`;
    const amount = Math.round(value.depositAmount * 100);

    const initResponse = await axiosClient.post(`${endpoint}`, {
      email: customer.email,
      amount,
      callback_url: callbackUrl,
      metadata,
      channels: PAYMENT_CHANNELS,
    });

    const data = initResponse.data.data;

    const txnValues: Partial<Transaction> = {
      reference: data.reference,
      authorizationUrl: data.authorization_url,
      type: 'Deposit',
      purpose: `${partner.name}: Estimate-${estimate.code}${
        value.grandTotal === value.depositAmount ? ' Payment' : ' Deposit Payment'
      }`,
      status: initResponse.data.message,
      amount: value.depositAmount,
    };

    const transaction = await dataSources.transactionDAOService.create(txnValues as CreationAttributes<Transaction>);

    await customer.$add('transactions', [transaction]);

    appEventEmitter.emit(INIT_TRANSACTION, { customer, response: data });

    const response: HttpResponse<void> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    return Promise.resolve(response);
  }

  /**
   * @name initTransactionCallback
   * @description This method handles verification of the transactions and updating the transaction table accordingly.
   * @param req
   */
  @TryCatch
  public static async initTransactionCallback(req: Request) {
    const { reference } = req.query as unknown as { reference: string };

    const transaction = await dataSources.transactionDAOService.findByAny({
      where: { reference },
    });

    if (!transaction) {
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));
    }

    const customer = await transaction.$get('customer');

    if (!customer) {
      return Promise.reject(CustomAPIError.response('Customer Does not exist.', HttpStatus.NOT_FOUND.code));
    }

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    //verify payment
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = `/transaction/verify/${reference}`;

    const axiosResponse = await axiosClient.get(endpoint);

    const data = axiosResponse.data.data;

    const $transaction = {
      reference: data.reference,
      channel: data.authorization.channel,
      cardType: data.authorization.card_type,
      bank: data.authorization.bank,
      last4: data.authorization.last4,
      expMonth: data.authorization.exp_month,
      expYear: data.authorization.exp_year,
      countryCode: data.authorization.country_code,
      brand: data.authorization.brand,
      currency: data.currency,
      status: data.status,
      paidAt: data.paid_at,
      type: transaction.type,
    };

    appEventEmitter.emit(VERIFY_TRANSACTION, { customer, transaction: $transaction });

    const response: HttpResponse<void> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async updateTransaction(req: Request) {
    const value = req.body;

    const transaction = await dataSources.transactionDAOService.findByAny({
      where: { reference: value.reference },
    });

    if (!transaction) {
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));
    }

    await transaction.update({
      channel: value.channel,
      cardType: value.cardType,
      bank: value.bank,
      last4: value.last4,
      expMonth: value.expMonth,
      expYear: value.expYear,
      countryCode: value.countryCode,
      brand: value.brand,
      currency: value.currency,
      status: value.status,
      paidAt: value.paidAt,
    });

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: 'Transaction updated successfully',
      result: transaction,
    } as HttpResponse<Transaction>);
  }

  @TryCatch
  public static async initRefundCustomer(req: Request) {
    const partner = req.user.partner;

    //validate request body
    const { error, value } = Joi.object<AnyObjectType>({
      callbackUrl: Joi.string().required().label('Customer Id'),
      amount: Joi.number().required().label('Estimate Id'),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    //initialize payment
    const metadata = {
      cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
    };
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = '/transaction/initialize';

    const callbackUrl = value.callbackUrl;
    const amount = Math.round(value.amount * 100);

    const initResponse = await axiosClient.post(`${endpoint}`, {
      email: partner.email,
      amount,
      callback_url: callbackUrl,
      metadata,
      channels: PAYMENT_CHANNELS,
    });

    const data = initResponse.data.data;

    const txnValues: Partial<Transaction> = {
      reference: data.reference,
      authorizationUrl: data.authorization_url,
      type: 'Deposit',
      purpose: ``,
      status: initResponse.data.message,
      amount: value.amount,
    };

    const transaction = await dataSources.transactionDAOService.create(txnValues as CreationAttributes<Transaction>);

    await partner.$add('transactions', [transaction]);

    const response: HttpResponse<IInitTransaction> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: {
        reference: data.reference,
        authorizationUrl: data.authorization_url,
      },
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async verifyRefundCustomer(req: Request) {
    const { reference } = req.query as unknown as { reference: string };

    const transaction = await dataSources.transactionDAOService.findByAny({
      where: { reference },
    });

    if (!transaction) {
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));
    }

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    //verify payment
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = `/transaction/verify/${reference}`;

    const axiosResponse = await axiosClient.get(endpoint);

    const data = axiosResponse.data.data;

    const $transaction = {
      reference: data.reference,
      channel: data.authorization.channel,
      cardType: data.authorization.card_type,
      bank: data.authorization.bank,
      last4: data.authorization.last4,
      expMonth: data.authorization.exp_month,
      expYear: data.authorization.exp_year,
      countryCode: data.authorization.country_code,
      brand: data.authorization.brand,
      currency: data.currency,
      status: data.status,
      paidAt: data.paid_at,
      type: transaction.type,
    };

    await transaction.update($transaction);

    const response: HttpResponse<void> = {
      code: HttpStatus.OK.code,
      message: 'Refund Successful!',
    };

    return Promise.resolve(response);
  }
}
