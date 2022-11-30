import { Request } from 'express';
import { appEventEmitter } from '../services/AppEventEmitter';
import {
  INIT_TRANSACTION,
  INVOICE_STATUS,
  PAY_STACK_BANKS,
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
import Invoice from '../models/Invoice';
import Generic from '../utils/Generic';
import { Attributes } from 'sequelize';
import dataStore from '../config/dataStore';
import { appModelTypes } from '../@types/app-model';
import HttpResponse = appCommonTypes.HttpResponse;
import IPayStackBank = appModelTypes.IPayStackBank;

interface IDepositForEstimate {
  customerId: number;
  estimateId: number;
  partnerId: number;
  vin: string;
  depositAmount: number;
  grandTotal: number;
}

interface IGenerateInvoice {
  txnRef: string;
  estimateId: number;
}

export default class TransactionController {
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
   * @param req
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
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = '/transaction/initialize';

    const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/${endpoint}`;
    const amount = value.depositAmount * 100;

    const initResponse = await axiosClient.post(`${endpoint}`, {
      email: customer.email,
      amount,
      callback_url: callbackUrl,
    });

    const data = initResponse.data.data;

    const txnValues: Partial<Transaction> = {
      reference: data.reference,
      authorizationUrl: data.authorization_url,
      type: 'Deposit',
      purpose: `Estimate-${estimate.code}`,
      status: initResponse.data.message,
      amount,
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
      const message = 'Transaction Does not exist.';

      return Promise.reject(CustomAPIError.response(message, HttpStatus.NOT_FOUND.code));
    }

    const customer = await transaction.$get('customer');

    if (!customer) {
      const message = 'Customer Does not exist.';

      return Promise.reject(CustomAPIError.response(message, HttpStatus.NOT_FOUND.code));
    }

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    //initialize payment
    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const endpoint = `/transaction/verify/${reference}`;

    const axiosResponse = await axiosClient.get(endpoint);

    const data = axiosResponse.data.data;

    await transaction.update({
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
    });

    appEventEmitter.emit(VERIFY_TRANSACTION, { customer, transaction });

    const response: HttpResponse<void> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async generateInvoice(req: Request) {
    const { error, value } = Joi.object<IGenerateInvoice>({
      estimateId: Joi.number().required().label('Estimate Id'),
      txnRef: Joi.string().required().label('Transaction Reference'),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    const transaction = await dataSources.transactionDAOService.findByAny({
      where: {
        reference: value.txnRef,
      },
    });

    if (!transaction)
      return Promise.reject(CustomAPIError.response('Transaction Does not exist.', HttpStatus.NOT_FOUND.code));

    const estimate = await dataSources.estimateDAOService.findById(value.estimateId);

    if (!estimate)
      return Promise.reject(CustomAPIError.response(`Estimate does not exist.`, HttpStatus.NOT_FOUND.code));

    const partner = await estimate.$get('partner');

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist.`, HttpStatus.NOT_FOUND.code));

    const findBanks = await dataStore.get(PAY_STACK_BANKS);

    if (!findBanks)
      return Promise.reject(CustomAPIError.response(`No banks Please contact support`, HttpStatus.NOT_FOUND.code));

    const banks = JSON.parse(findBanks) as IPayStackBank[];

    const bank = banks.find(bank => bank.name === partner.bankName);

    if (!bank)
      return Promise.reject(
        CustomAPIError.response(
          `Bank ${partner.bankName} does not exist. Please contact support`,
          HttpStatus.NOT_FOUND.code,
        ),
      );

    const recipient = {
      name: partner.name,
      account_number: partner.accountNumber,
      bank_code: bank.code,
      currency: bank.currency,
    };

    const dueAmount = estimate.grandTotal - estimate.depositAmount;
    const systemFee = estimate.depositAmount * 0.035;
    const partnerFee = estimate.depositAmount - systemFee;

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    let endpoint = '/transferrecipient';

    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    const recipientResponse = await axiosClient.post(endpoint, recipient);

    const recipientCode = recipientResponse.data.data.recipient_code;

    endpoint = '/transfer';

    const transfer = {
      source: 'balance',
      recipient: recipientCode,
      reason: `Estimate-${estimate.code} Deposit`,
      amount: partnerFee * 100,
    };

    const transferResponse = await axiosClient.post(endpoint, transfer);

    console.log(transferResponse.data);

    const invoiceValues: Partial<Attributes<Invoice>> = {
      code: Generic.randomize({ number: true, count: 6 }),
      depositAmount: estimate.depositAmount,
      dueAmount,
      grandTotal: estimate.grandTotal,
      status: estimate.grandTotal === estimate.depositAmount ? INVOICE_STATUS.paid : INVOICE_STATUS.balance,
    };

    const invoice = await dataSources.invoiceDAOService.create(invoiceValues as CreationAttributes<Invoice>);

    await invoice.$set('transactions', [transaction]);

    const response: HttpResponse<Invoice> = {
      code: HttpStatus.OK.code,
      message: 'Invoice successfully created',
    };

    return Promise.resolve(response);
  }
}
