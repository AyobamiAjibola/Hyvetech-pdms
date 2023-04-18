import { HasPermission, TryCatch } from '../decorators';
import { Request } from 'express';
import Joi from 'joi';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import {
  ESTIMATE_STATUS,
  INIT_TRANSACTION,
  INITIAL_LABOURS_VALUE,
  INITIAL_PARTS_VALUE,
  INVOICE_STATUS,
  JOB_STATUS,
  PAYMENT_CHANNELS,
  TRANSACTION_TYPE,
  UPDATE_INVOICE,
} from '../config/constants';
import axiosClient from '../services/api/axiosClient';
import { Attributes, CreationAttributes } from 'sequelize';
import Transaction from '../models/Transaction';
import Invoice, { $saveInvoiceSchema, $sendInvoiceSchema, InvoiceSchemaType } from '../models/Invoice';
import Generic from '../utils/Generic';
import Estimate from '../models/Estimate';
import Job from '../models/Job';
import { appEventEmitter } from '../services/AppEventEmitter';
import { appCommonTypes } from '../@types/app-common';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import moment from 'moment';
import Partner from '../models/Partner';
import Contact from '../models/Contact';
import BillingInformation from '../models/BillingInformation';
import DraftInvoice from '../models/DraftInvoice';
import HttpResponse = appCommonTypes.HttpResponse;
import IDepositForEstimate = appCommonTypes.IDepositForEstimate;
import IGenerateInvoice = appCommonTypes.IGenerateInvoice;
import { CREATE_ESTIMATE, CREATE_INVOICE, CREATE_PAYMENT, DELETE_ESTIMATE, MANAGE_ALL, MANAGE_TECHNICIAN, READ_INVOICE, UPDATE_PAYMENT } from '../config/settings';

const transactionDoesNotExist = 'Transaction Does not exist.';

export default class InvoiceController {
  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_INVOICE])
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
    let systemFee = estimate.depositAmount * 0.035;

    if (systemFee >= 500) systemFee = 500;

    const partnerFee = Math.round(estimate.depositAmount - systemFee);

    //get default payment gateway
    const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
      where: { default: true },
    });

    if (!paymentGateway)
      return Promise.reject(CustomAPIError.response(`No payment gateway found`, HttpStatus.NOT_FOUND.code));

    axiosClient.defaults.baseURL = `${paymentGateway.baseUrl}`;
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;

    let endpoint = '/balance';

    const balanceResponse = await axiosClient.get(endpoint);

    // if (balanceResponse.data.data.balance < partnerFee * 100)
    //   return Promise.reject(
    //     CustomAPIError.response('Insufficient Balance. Please contact support.', HttpStatus.BAD_REQUEST.code),
    //   );

    endpoint = '/transferrecipient';

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

    const transferData = transferResponse.data.data;

    const transferTransactionValues: Partial<Attributes<Transaction>> = {
      amount: partnerFee,
      type: TRANSACTION_TYPE.transfer,
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

    const fetch_invoice = await dataSources.invoiceDAOService.findAll({
      include: [{
        model: Estimate,
        where: { partnerId: partner.id }
      }],
    });

    const invoiceValues: Partial<Attributes<Invoice>> = {
      // code: Generic.randomize({ number: true, count: 6 }),
      code: Generic.generateCode(fetch_invoice, 'INV', partner.id),
      depositAmount: estimate.depositAmount,
      paidAmount: estimate.depositAmount,
      tax: estimate.tax,
      taxPart: estimate.taxPart,
      dueAmount,
      grandTotal: estimate.grandTotal,
      status: estimate.grandTotal === estimate.depositAmount ? INVOICE_STATUS.paid : INVOICE_STATUS.deposit,
      dueDate: moment().days(estimate.expiresIn).toDate(),
    };

    const invoice = await dataSources.invoiceDAOService.create(invoiceValues as CreationAttributes<Invoice>);

    await estimate.update({ status: ESTIMATE_STATUS.invoiced });
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
  @HasPermission([MANAGE_TECHNICIAN, CREATE_INVOICE])
  public static async generateInvoiceManually(req: Request) {
    try {
      const partner = req.user.partner
      const estimate = await dataSources.estimateDAOService.findById(req.body.id);

      if (!estimate) {
        const response: HttpResponse<any> = {
          code: HttpStatus.BAD_REQUEST.code,
          message: 'Error',
        };

        return Promise.resolve(response);
      }

      const fetch_invoice = await dataSources.invoiceDAOService.findAll({
        include: [{
          model: Estimate,
          where: { partnerId: partner.id }
        }],
      });

      // const invoiceCode = Generic.randomize({ number: true, count: 6 });
      const invoiceValues: Partial<Attributes<Invoice>> = {
        code: Generic.generateCode(fetch_invoice, 'INV', partner.id),
        // code: invoiceCode,
        depositAmount: 0,
        paidAmount: 0,
        tax: estimate.tax,
        taxPart: estimate.taxPart,
        dueAmount: estimate.grandTotal,
        discount: estimate?.discount || 0,
        discountType: estimate?.discountType || 'percentage',
        grandTotal: estimate.grandTotal,
        status: estimate.grandTotal === estimate.depositAmount ? INVOICE_STATUS.paid : INVOICE_STATUS.deposit,
        dueDate: moment().days(estimate.expiresIn).toDate(),
      };

      const invoice = await dataSources.invoiceDAOService.create(invoiceValues as CreationAttributes<Invoice>);

      const count = estimate.count + 1
      await estimate.update({ status: ESTIMATE_STATUS.invoiced, count: count });
      //@ts-ignore
      await estimate.addInvoice(invoice);
      // await estimate.$set('invoices', [invoice])

      const response: any = {
        code: HttpStatus.OK.code,
        invoiceCode: invoice.id,
        message: 'Invoice successfully created',
      };

      return Promise.resolve(response);
    } catch (e) {
      console.log(e);
      const response: HttpResponse<Invoice> = {
        code: HttpStatus.BAD_REQUEST.code,
        message: 'Error Generating Invoice',
      };

      return Promise.resolve(response);
    }
  }

  public static async getSingleInvoice(req: Request) {
    const invoice = await this.doGetInvoice(req);
    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: invoice,
    } as HttpResponse<Invoice>);
  }

  private static async doGetInvoice(req: Request) {
    const partner = req.user.partner;
    let invoices = await dataSources.invoiceDAOService.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: Estimate,
          where: { partnerId: partner.id },
          include: [
            { model: Customer, include: [BillingInformation], paranoid: false },
            Vehicle,
            {
              model: Partner,
              include: [Contact],
            },
          ],
        },
        Transaction,
        DraftInvoice,
      ],
    });
    // sort by date updated
    for (let i = 1; i < invoices.length; i++) {
      for (let j = i; j > 0; j--) {
        const _t1: any = invoices[j];
        const _t0: any = invoices[j - 1];

        if (new Date(_t1.updatedAt).getTime() > new Date(_t0.updatedAt).getTime()) {
          invoices[j] = _t0;
          invoices[j - 1] = _t1;

          // console.log('sorted')
        } else {
          // console.log('no sorted')
        }
      }
    }

    invoices = invoices.map(invoice => {
      const parts = invoice.estimate.parts;
      const labours = invoice.estimate.labours;

      invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
      invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

      if (invoice.edited && invoice.updateStatus === INVOICE_STATUS.update.draft) {
        const parts = invoice.draftInvoice.parts;
        const labours = invoice.draftInvoice.labours;

        invoice.draftInvoice.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        invoice.draftInvoice.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
      }
      if (invoice.edited && invoice.updateStatus === INVOICE_STATUS.update.sent) {
        const parts = invoice.parts;
        const labours = invoice.labours;

        invoice.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        invoice.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
      }

      return invoice;
    });
    return invoices[0];
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, READ_INVOICE, CREATE_INVOICE])
  public static async invoices(req: Request) {
    const partner = req.user.partner;

    let invoices: Invoice[];

    //Super Admin should see all invoices
    if (!partner) {
      invoices = await dataSources.invoiceDAOService.findAll({
        include: [
          {
            model: Estimate,
            include: [
              { model: Customer, include: [BillingInformation], paranoid: false },
              Vehicle,
              {
                model: Partner,
                include: [Contact],
              },
            ],
          },
          Transaction,
          DraftInvoice,
        ],
      });
    } else {
      invoices = await dataSources.invoiceDAOService.findAll({
        include: [
          {
            model: Estimate,
            where: { partnerId: partner.id },
            include: [
              { model: Customer, include: [BillingInformation], paranoid: false },
              Vehicle,
              {
                model: Partner,
                include: [Contact],
              },
            ],
          },
          Transaction,
          DraftInvoice,
        ],
      });
    }

    // sort by date updated
    for (let i = 1; i < invoices.length; i++) {
      for (let j = i; j > 0; j--) {
        const _t1: any = invoices[j];
        const _t0: any = invoices[j - 1];

        if (new Date(_t1.updatedAt).getTime() > new Date(_t0.updatedAt).getTime()) {
          invoices[j] = _t0;
          invoices[j - 1] = _t1;

          // console.log('sorted')
        } else {
          // console.log('no sorted')
        }
      }
    }

    invoices = invoices.map(invoice => {
      let parts = invoice.estimate?.parts;
      let labours = invoice.estimate?.labours;

      parts = parts?.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
      labours = labours?.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

      if (invoice.edited && invoice.updateStatus === INVOICE_STATUS.update.sent) {
        const parts = invoice.parts;
        const labours = invoice.labours;

        invoice.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        invoice.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
      }

      if (invoice.edited && invoice.updateStatus === INVOICE_STATUS.update.draft) {
        let parts = invoice?.draftInvoice.parts;
        let labours = invoice?.draftInvoice.labours;

        parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
      }

      if (!invoice.edited) {
        let parts = invoice.estimate?.parts;
        let labours = invoice.estimate?.labours;

        parts = parts?.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        labours = labours?.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
      }

      return invoice;
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
  @HasPermission([MANAGE_TECHNICIAN, CREATE_INVOICE])
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

    const dueAmount = value.dueAmount;

    let serviceCharge = 0.015 * dueAmount + 100;

    if (serviceCharge >= 2000) serviceCharge = 2000;

    const amount = Math.round((serviceCharge + dueAmount) * 100);

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
      type: 'Payment',
      purpose: `${partner.name}: Estimate-${estimate.code} Complete Payment`,
      status: initResponse.data.message,
      amount: value.dueAmount,
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
  @HasPermission([MANAGE_TECHNICIAN, CREATE_PAYMENT])
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

    const estimate = await invoice.$get('estimate');

    if (!estimate) {
      return Promise.reject(CustomAPIError.response('Estimate does not exist', HttpStatus.NOT_FOUND.code));
    }

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

    let systemFee = transaction.amount * 0.035;

    if (systemFee >= 5000) systemFee = 5000;

    const partnerFee = Math.round(transaction.amount - systemFee);

    let endpoint = '/balance';

    const balanceResponse = await axiosClient.get(endpoint);

    if (balanceResponse.data.data.balance < partnerFee)
      return Promise.reject(
        CustomAPIError.response('Insufficient Balance. Please contact support.', HttpStatus.BAD_REQUEST.code),
      );

    endpoint = '/transferrecipient';

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

    const transferData = transferResponse.data.data;

    const transferTransactionValues: Partial<Attributes<Transaction>> = {
      amount: partnerFee,
      type: TRANSACTION_TYPE.transfer,
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

    const amount = invoice.depositAmount + transaction.amount;
    const newDueAmount = invoice.grandTotal - amount;

    await invoice.update({
      dueAmount: newDueAmount,
      paidAmount: amount,
      depositAmount: amount,
      refundable: Math.sign(newDueAmount) === -1 ? Math.abs(newDueAmount) : invoice.refundable,
      status: newDueAmount === 0 ? INVOICE_STATUS.paid : INVOICE_STATUS.deposit,
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

    await partner.$set('transactions', [transferTransaction]);

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: 'Payment complete',
    } as HttpResponse<void>);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_PAYMENT])
  public static async updateCompletedInvoicePaymentManually(req: Request) {
    try {
      const { invoiceId, customerId, amount: _amount, type } = req.body;

      // get customer
      // const customer = await dataSources.customerDAOService.findById(customerId);

      // get invoice
      const invoice = await dataSources.invoiceDAOService.findById(invoiceId);

      if (!invoice)
        return Promise.reject(
          CustomAPIError.response(`Invoice with Id: ${invoiceId} does not exist`, HttpStatus.NOT_FOUND.code),
        );

      // update transaction
      const transferTransactionValues: Partial<Attributes<Transaction>> = {
        amount: _amount,
        type: type,
        reference: 'PTRG-' + Generic.generateRandomString(5),
        status: 'success',
        bank: 'JIFFIX',
        purpose: `PARTNER: GENERATED-FOR-${invoice.code}`,
        channel: 'bank',
        currency: 'NGN',
        paidAt: new Date(),
        cardType: 'none',
        last4: 'none',
        expMonth: 'none',
        expYear: 'none',
        countryCode: 'none',
        brand: 'none',
      };

      const transferTransaction = await dataSources.transactionDAOService.create(
        transferTransactionValues as CreationAttributes<Transaction>,
      );

      try {
        const customer = await dataSources.customerDAOService.findById(customerId);
        if (customer) {
          await customer.$add('transactions', [transferTransaction]);
        }

        // @ts-ignore
        // const estimate = await invoice.get('estimate');
        const estimate = await dataSources.estimateDAOService.findById(invoice.estimateId);

        if (estimate) {
          // console.log(estimate);
          const partner = await estimate.$get('partner');
          if (partner) {
            await partner.$add('transactions', [transferTransaction]);
          }
        }

        await invoice.$add('transactions', [transferTransaction]);
      } catch (e) {
        console.log(e);
        //
      }

      // update invoice
      const amount = invoice.depositAmount + parseInt(_amount);
      const newDueAmount = invoice.grandTotal - amount;

      const payload = {
        dueAmount: newDueAmount,
        paidAmount: amount,
        depositAmount: amount,
        refundable: Math.sign(newDueAmount) === -1 ? Math.abs(newDueAmount) : invoice.refundable,
        status: newDueAmount === 0 ? INVOICE_STATUS.paid : INVOICE_STATUS.deposit,
      };

      console.log(payload, _amount, amount);

      await invoice.update(payload);

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: 'Record Updated',
      } as HttpResponse<void>);
    } catch (e) {
      return Promise.resolve({
        code: HttpStatus.INTERNAL_SERVER_ERROR.code,
        message: 'An Error Occurred',
      } as HttpResponse<void>);
    }
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_INVOICE])
  public static async saveInvoice(req: Request) {
    const { error, value } = Joi.object<InvoiceSchemaType>($saveInvoiceSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    const invoice = await dataSources.invoiceDAOService.findById(value.id);

    if (!invoice) return Promise.reject(CustomAPIError.response(`Invoice not found.`, HttpStatus.NOT_FOUND.code));

    const estimate = await invoice.$get('estimate');

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found.`, HttpStatus.NOT_FOUND.code));

    const customer = await estimate.$get('customer');

    if (!customer) return Promise.reject(CustomAPIError.response(`Customer not found.`, HttpStatus.NOT_FOUND.code));

    let draftInvoice = await invoice.$get('draftInvoice');

    console.log('indv> ', value.grandTotal, invoice.grandTotal);

    await invoice.update({
      updateStatus: INVOICE_STATUS.update.draft,
      edited: true,
      paidAmount: invoice.depositAmount,
    });

    if (draftInvoice) {
      await this.doSave(draftInvoice, value);
    } else {
      const data: Partial<Attributes<DraftInvoice>> = {
        ...value,
        code: invoice.code,
        purpose: invoice.purpose,
        status: invoice.status,
        updateStatus: invoice.updateStatus,
        expiresIn: estimate.expiresIn,
        edited: invoice.edited,
      };

      for (const valueKey in value) {
        const key = valueKey as keyof InvoiceSchemaType;

        if (key === 'id') continue;

        if (value[key]) {
          if (key === 'parts') {
            data.parts = value.parts.map((value: string) => JSON.stringify(value));
            continue;
          }

          if (key === 'labours') {
            data.labours = value.labours.map((value: string) => JSON.stringify(value));
            continue;
          }

          if (key === 'depositAmount') {
            data.depositAmount = parseInt(`${value.depositAmount}`);
            continue;
          }

          if (key === 'paidAmount') {
            data.paidAmount = parseInt(`${value.paidAmount}`);
            continue;
          }

          if (key === 'additionalDeposit') {
            data.additionalDeposit = parseInt(`${value.additionalDeposit}`);
            continue;
          }

          if (key === 'jobDurationValue') {
            data.jobDurationValue = parseInt(`${value.jobDurationValue}`);
            continue;
          }

          data[key] = value[key];
        }
      }

      delete data.id;

      draftInvoice = await DraftInvoice.create(data as CreationAttributes<DraftInvoice>);

      await invoice.$set('draftInvoice', draftInvoice);
    }

    await estimate.update({ note: value.note });
    appEventEmitter.emit(UPDATE_INVOICE, { invoice, customer });

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: `Invoice saved successfully.`,
      result: invoice,
    } as HttpResponse<Invoice>);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_INVOICE])
  public static async sendInvoice(req: Request) {
    const { error, value } = Joi.object<InvoiceSchemaType>($sendInvoiceSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    const invoice = await dataSources.invoiceDAOService.findById(value.id);

    if (!invoice) return Promise.reject(CustomAPIError.response(`Invoice not found.`, HttpStatus.NOT_FOUND.code));

    const estimate = await invoice.$get('estimate');

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found.`, HttpStatus.NOT_FOUND.code));

    const customer = await estimate.$get('customer');

    if (!customer) return Promise.reject(CustomAPIError.response(`Customer not found.`, HttpStatus.NOT_FOUND.code));

    await invoice.update({
      parts: value.parts.map((value: string) => JSON.stringify(value)),
      labours: value.labours.map((value: string) => JSON.stringify(value)),
      depositAmount: parseInt(`${value.depositAmount}`),
      additionalDeposit: parseInt(`${value.additionalDeposit}`),
      jobDurationValue: parseInt(`${value.jobDurationValue}`),
      tax: value.tax,
      taxPart: value.taxPart,
      jobDurationUnit: value.jobDurationUnit,
      partsTotal: value.partsTotal,
      laboursTotal: value.laboursTotal,
      grandTotal: value.grandTotal,
      refundable: value.refundable,
      dueAmount: value.dueAmount,
      updateStatus: INVOICE_STATUS.update.sent,
      edited: true,
      discount: value.discount,
      discountType: value.discountType,
    });

    const draftInvoice = await invoice.$get('draftInvoice');

    if (draftInvoice) {
      // @ts-ignore
      await DraftInvoice.destroy({ where: { invoiceId: invoice.id } });

      await invoice.$set('draftInvoice', null);
    }

    await estimate.update({ note: value.note });
    appEventEmitter.emit(UPDATE_INVOICE, { invoice, customer });

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: `Invoice sent successfully.`,
      result: invoice,
    } as HttpResponse<Invoice>);
  }

  private static async doSave(invoice: DraftInvoice | Invoice, value: InvoiceSchemaType) {
    for (const valueKey in value) {
      const key = valueKey as keyof InvoiceSchemaType;

      if (key === 'id') continue;

      if (value[key]) {
        if (key === 'parts') {
          await invoice.update({
            [key]: value.parts.map((value: string) => JSON.stringify(value)),
          });

          continue;
        }

        if (key === 'labours') {
          await invoice.update({
            [key]: value.labours.map((value: string) => JSON.stringify(value)),
          });

          continue;
        }

        if (key === 'depositAmount') {
          await invoice.update({
            [key]: parseInt(`${value.depositAmount}`),
          });

          continue;
        }

        if (key === 'paidAmount') {
          await invoice.update({
            [key]: parseInt(`${value.paidAmount}`),
          });

          continue;
        }

        if (key === 'additionalDeposit') {
          await invoice.update({
            [key]: parseInt(`${value.additionalDeposit}`),
          });

          continue;
        }

        if (key === 'jobDurationValue') {
          await invoice.update({
            [key]: parseInt(`${value.jobDurationValue}`),
          });

          continue;
        }

        await invoice.update({
          [key]: value[key],
        });
      }
    }
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

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_ESTIMATE, DELETE_ESTIMATE])
  public static async delete(req: Request) {
    const invoiceId = req.params.invoiceId as string;

    const invoice = await dataSources.invoiceDAOService.findById(+invoiceId);
    if (!invoice) return Promise.reject(CustomAPIError.response(`Invoice not found`, HttpStatus.NOT_FOUND.code));

    const expense = await dataSources.expenseDAOService.findByAny({ where: {invoiceCode: invoice.code} });
    const transaction = await dataSources.transactionDAOService.findAll()
    const find_transaction = transaction.find(transaction => transaction.invoiceId === invoice.id)

    if (expense || find_transaction) return Promise.reject(CustomAPIError.response(`transExpError`, HttpStatus.NOT_FOUND.code));

    const estimate = await invoice?.$get('estimate');

    const count = estimate?.count && estimate?.count - 1
    let status: any;
    if(estimate?.count && estimate?.count === 1) {
        status = ESTIMATE_STATUS.sent
    }

    await estimate?.update({ status: status, count: count });
    await Invoice.destroy({ where: { id: +invoiceId }, force: true });

    return Promise.resolve({
      code: HttpStatus.ACCEPTED.code,
      message: 'Invoice deleted successfully',
    } as HttpResponse<void>);
  }
}
