import { TryCatch } from '../decorators';
import { Request } from 'express';
import Joi from 'joi';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import { INIT_TRANSACTION, INVOICE_STATUS, JOB_STATUS } from '../config/constants';
import axiosClient from '../services/api/axiosClient';
import { Attributes, CreationAttributes } from 'sequelize';
import Transaction from '../models/Transaction';
import Invoice from '../models/Invoice';
import Generic from '../utils/Generic';
import Estimate from '../models/Estimate';
import Job from '../models/Job';
import { appEventEmitter } from '../services/AppEventEmitter';
import { appCommonTypes } from '../@types/app-common';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import moment from 'moment';
import HttpResponse = appCommonTypes.HttpResponse;
import IDepositForEstimate = appCommonTypes.IDepositForEstimate;
import IGenerateInvoice = appCommonTypes.IGenerateInvoice;

const transactionDoesNotExist = 'Transaction Does not exist.';

export default class InvoiceController {
  @TryCatch
  public static async generateInvoice(req: Request) {
    const { error, value } = Joi.object<IGenerateInvoice>({
      estimateId: Joi.number().required().label('Estimate Id'),
      txnRef: Joi.string().required().label('Transaction Reference'),
      transaction: Joi.object().required().label('Transaction Update'),
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
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));

    const estimate = await dataSources.estimateDAOService.findById(value.estimateId);

    if (!estimate)
      return Promise.reject(CustomAPIError.response(`Estimate does not exist.`, HttpStatus.NOT_FOUND.code));

    const vehicle = await estimate.$get('vehicle');

    if (!vehicle) return Promise.reject(CustomAPIError.response(`Vehicle does not exist.`, HttpStatus.NOT_FOUND.code));

    const customer = await estimate.$get('customer');

    if (!customer)
      return Promise.reject(CustomAPIError.response(`Customer does not exist.`, HttpStatus.NOT_FOUND.code));

    const partner = await estimate.$get('partner');

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist.`, HttpStatus.NOT_FOUND.code));

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

    const recipient = {
      name: partner.name,
      account_number: partner.accountNumber,
      bank_code: bank.code,
      currency: bank.currency,
    };

    const dueAmount = estimate.grandTotal - estimate.depositAmount;
    const systemFee = estimate.depositAmount * 0.035;
    const partnerFee = Math.round((estimate.depositAmount - systemFee) * 100);

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
      amount: partnerFee,
    };

    const transferResponse = await axiosClient.post(endpoint, transfer);

    const transferData = transferResponse.data.data;

    const transferTransactionValues: Partial<Attributes<Transaction>> = {
      amount: partnerFee,
      type: 'Transfer',
      reference: `${transferData.reference}:${transaction.reference}`,
      status: transferData.status,
      bank: partner.bankName,
      purpose: `${partner.name}: Estimate-${estimate.code}`,
      channel: 'bank',
      currency: bank.currency,
      paidAt: new Date(),
    };

    const transferTransaction = await dataSources.transactionDAOService.create(
      transferTransactionValues as CreationAttributes<Transaction>,
    );

    const invoiceValues: Partial<Attributes<Invoice>> = {
      code: Generic.randomize({ number: true, count: 6 }),
      depositAmount: estimate.depositAmount,
      dueAmount,
      grandTotal: estimate.grandTotal,
      status: estimate.grandTotal === estimate.depositAmount ? INVOICE_STATUS.paid : INVOICE_STATUS.dueSoon,
      dueDate: moment().days(estimate.expiresIn).toDate(),
    };

    const invoice = await dataSources.invoiceDAOService.create(invoiceValues as CreationAttributes<Invoice>);

    await estimate.$set('invoice', invoice);
    await invoice.$set('transactions', [transaction]);
    await partner.$set('transactions', [transferTransaction]);

    //Update Initial Deposit Transaction
    await transaction.update({
      channel: value.transaction.channel,
      cardType: value.transaction.cardType,
      bank: value.transaction.bank,
      last4: value.transaction.last4,
      expMonth: value.transaction.expMonth,
      expYear: value.transaction.expYear,
      countryCode: value.transaction.countryCode,
      brand: value.transaction.brand,
      currency: value.transaction.currency,
      status: value.transaction.status,
      paidAt: value.transaction.paidAt,
    });

    const job = await this.doAssignJob(estimate);

    await partner.$add('jobs', [job]);

    const response: HttpResponse<Invoice> = {
      code: HttpStatus.OK.code,
      message: 'Invoice successfully created',
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async invoices(req: Request) {
    const invoices = await dataSources.invoiceDAOService.findAll({
      include: [
        {
          model: Estimate,
          include: [Customer, Vehicle],
        },
        Transaction,
      ],
    });

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: invoices,
    } as HttpResponse<Invoice>);
  }

  /**
   * @name completeEstimateDeposit
   * @description The method a customer calls when they are ready to pay for outstanding deposit for an estimate.
   * @description This method performs the Deposit Transaction.
   * @param req {
       @field invoiceId: number,
       @field customerId: number,
   * }
   */
  @TryCatch
  public static async completeEstimateDeposit(req: Request) {
    const { error, value } = Joi.object<IDepositForEstimate>({
      customerId: Joi.number().required().label('Customer Id'),
      invoiceId: Joi.number().required().label('Invoice Id'),
      dueAmount: Joi.number().required().label('Due Amount'),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    const invoice = await dataSources.invoiceDAOService.findById(value.invoiceId);

    if (!invoice)
      return Promise.reject(
        CustomAPIError.response(`Invoice with Id: ${value.invoiceId} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    const customer = await dataSources.customerDAOService.findById(value.customerId);

    if (!customer)
      return Promise.reject(CustomAPIError.response(`Customer does not exist.`, HttpStatus.NOT_FOUND.code));

    const estimate = await invoice.$get('estimate');

    if (!estimate)
      return Promise.reject(CustomAPIError.response(`Estimate does not exist.`, HttpStatus.NOT_FOUND.code));

    const partner = await estimate.$get('partner');

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist.`, HttpStatus.NOT_FOUND.code));

    const transactions = await invoice.$get('transactions');

    if (!transactions.length)
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));

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
    const amount = Math.round(value.dueAmount * 100);

    const initResponse = await axiosClient.post(`${endpoint}`, {
      email: customer.email,
      amount,
      callback_url: callbackUrl,
      metadata,
    });

    const data = initResponse.data.data;

    const txnValues: Partial<Transaction> = {
      reference: data.reference,
      authorizationUrl: data.authorization_url,
      type: 'Payment',
      purpose: `${partner.name}: Estimate-${estimate.code} Complete Payment`,
      status: initResponse.data.message,
      amount,
    };

    const $transaction = await dataSources.transactionDAOService.create(txnValues as CreationAttributes<Transaction>);

    await invoice.$add('transactions', [$transaction]);
    await customer.$add('transactions', [$transaction]);

    appEventEmitter.emit(INIT_TRANSACTION, { customer, response: data });

    const response: HttpResponse<void> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async updateCompletedInvoicePayment(req: Request) {
    const value = req.body;

    const transaction = await dataSources.transactionDAOService.findByAny({
      where: { reference: value.reference },
    });

    if (!transaction) {
      return Promise.reject(CustomAPIError.response(transactionDoesNotExist, HttpStatus.NOT_FOUND.code));
    }

    const invoice = await transaction.$get('invoice');

    if (!invoice) {
      return Promise.reject(CustomAPIError.response('Invoice does not exist', HttpStatus.NOT_FOUND.code));
    }

    await invoice.update({
      dueAmount: 0,
      depositAmount: invoice.depositAmount + invoice.dueAmount,
      status: INVOICE_STATUS.paid,
    });

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
      message: 'Payment complete',
    } as HttpResponse<void>);
  }

  private static async doAssignJob(estimate: Estimate) {
    const partner = await estimate.$get('partner');

    if (!partner) throw new Error('Partner does not exist');

    const invoice = await estimate.$get('invoice');

    if (!invoice) throw new Error('Invoice does not exist');

    const vehicle = await estimate.$get('vehicle');

    if (!vehicle) throw new Error('Vehicle does not exist');

    const customer = await estimate.$get('customer');

    if (!customer) throw new Error('Vehicle does not exist');

    const jobValues: Partial<Job> = {
      status: JOB_STATUS.pending,
      type: `Inspection`,
      name: `Estimate-${estimate.code} Job`,
      vehicleOwner: `${customer.firstName} ${customer.lastName}`,
    };

    const job = await dataSources.jobDAOService.create(jobValues as CreationAttributes<Job>);

    //associate partner with job
    await partner.$add('jobs', [job]);

    //associate vehicle with job
    await vehicle.update({
      onInspection: true,
      onMaintenance: true,
      isBooked: true,
    });

    await vehicle.$add('jobs', [job]);

    return job;
  }
}
