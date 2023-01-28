"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const joi_1 = __importDefault(require("joi"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const constants_1 = require("../config/constants");
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Invoice_1 = require("../models/Invoice");
const Generic_1 = __importDefault(require("../utils/Generic"));
const Estimate_1 = __importDefault(require("../models/Estimate"));
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const Customer_1 = __importDefault(require("../models/Customer"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const moment_1 = __importDefault(require("moment"));
const Partner_1 = __importDefault(require("../models/Partner"));
const Contact_1 = __importDefault(require("../models/Contact"));
const BillingInformation_1 = __importDefault(require("../models/BillingInformation"));
const DraftInvoice_1 = __importDefault(require("../models/DraftInvoice"));
const transactionDoesNotExist = 'Transaction Does not exist.';
class InvoiceController {
    static async generateInvoice(req) {
        const { error, value } = joi_1.default.object({
            estimateId: joi_1.default.number().required().label('Estimate Id'),
            txnRef: joi_1.default.string().required().label('Transaction Reference'),
            transaction: joi_1.default.object().required().label('Transaction Update'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            where: {
                reference: value.txnRef,
            },
        });
        if (!transaction)
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
        const estimate = await dao_1.default.estimateDAOService.findById(value.estimateId);
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const vehicle = await estimate.$get('vehicle');
        if (!vehicle)
            return Promise.reject(CustomAPIError_1.default.response(`Vehicle does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await estimate.$get('customer');
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const partner = await estimate.$get('partner');
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const banks = await dao_1.default.bankDAOService.findAll();
        if (!banks.length)
            return Promise.reject(CustomAPIError_1.default.response(`No banks Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const bank = banks.find(bank => bank.name === partner.bankName);
        if (!bank)
            return Promise.reject(CustomAPIError_1.default.response(`Bank ${partner.bankName} does not exist. Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const recipient = {
            name: partner.name,
            account_number: partner.accountNumber,
            bank_code: bank.code,
            currency: bank.currency,
        };
        const dueAmount = estimate.grandTotal - estimate.depositAmount;
        let systemFee = estimate.depositAmount * 0.035;
        if (systemFee >= 500)
            systemFee = 500;
        const partnerFee = Math.round(estimate.depositAmount - systemFee);
        //get default payment gateway
        const paymentGateway = await dao_1.default.paymentGatewayDAOService.findByAny({
            where: { default: true },
        });
        if (!paymentGateway)
            return Promise.reject(CustomAPIError_1.default.response(`No payment gateway found`, HttpStatus_1.default.NOT_FOUND.code));
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        let endpoint = '/balance';
        const balanceResponse = await axiosClient_1.default.get(endpoint);
        if (balanceResponse.data.data.balance < partnerFee * 100)
            return Promise.reject(CustomAPIError_1.default.response('Insufficient Balance. Please contact support.', HttpStatus_1.default.BAD_REQUEST.code));
        endpoint = '/transferrecipient';
        const recipientResponse = await axiosClient_1.default.post(endpoint, recipient);
        const recipientCode = recipientResponse.data.data.recipient_code;
        endpoint = '/transfer';
        const transfer = {
            source: 'balance',
            recipient: recipientCode,
            reason: `Estimate-${estimate.code} Deposit`,
            amount: partnerFee * 100,
        };
        const transferResponse = await axiosClient_1.default.post(endpoint, transfer);
        const transferData = transferResponse.data.data;
        const transferTransactionValues = {
            amount: partnerFee,
            type: constants_1.TRANSACTION_TYPE.transfer,
            reference: `${transferData.reference}:${transaction.reference}`,
            status: transferData.status,
            bank: partner.bankName,
            purpose: `${partner.name}: Estimate-${estimate.code}`,
            channel: 'bank',
            currency: bank.currency,
            paidAt: new Date(),
        };
        const transferTransaction = await dao_1.default.transactionDAOService.create(transferTransactionValues);
        const invoiceValues = {
            code: Generic_1.default.randomize({ number: true, count: 6 }),
            depositAmount: estimate.depositAmount,
            paidAmount: estimate.depositAmount,
            tax: estimate.tax,
            taxPart: estimate.taxPart,
            dueAmount,
            grandTotal: estimate.grandTotal,
            status: estimate.grandTotal === estimate.depositAmount ? constants_1.INVOICE_STATUS.paid : constants_1.INVOICE_STATUS.deposit,
            dueDate: (0, moment_1.default)().days(estimate.expiresIn).toDate(),
        };
        const invoice = await dao_1.default.invoiceDAOService.create(invoiceValues);
        await estimate.update({ status: constants_1.ESTIMATE_STATUS.invoiced });
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
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Invoice successfully created',
        };
        return Promise.resolve(response);
    }
    static async invoices(req) {
        const partner = req.user.partner;
        let invoices;
        //Super Admin should see all invoices
        if (!partner) {
            invoices = await dao_1.default.invoiceDAOService.findAll({
                include: [
                    {
                        model: Estimate_1.default,
                        include: [
                            { model: Customer_1.default, include: [BillingInformation_1.default], paranoid: false },
                            Vehicle_1.default,
                            {
                                model: Partner_1.default,
                                include: [Contact_1.default],
                            },
                        ],
                    },
                    Transaction_1.default,
                    DraftInvoice_1.default,
                ],
            });
        }
        else {
            invoices = await dao_1.default.invoiceDAOService.findAll({
                include: [
                    {
                        model: Estimate_1.default,
                        where: { partnerId: partner.id },
                        include: [
                            { model: Customer_1.default, include: [BillingInformation_1.default], paranoid: false },
                            Vehicle_1.default,
                            {
                                model: Partner_1.default,
                                include: [Contact_1.default],
                            },
                        ],
                    },
                    Transaction_1.default,
                    DraftInvoice_1.default,
                ],
            });
        }
        // sort by date updated
        for (let i = 1; i < invoices.length; i++) {
            for (let j = i; j > 0; j--) {
                const _t1 = invoices[j];
                const _t0 = invoices[j - 1];
                if (((new Date(_t1.updatedAt)).getTime()) > ((new Date(_t0.updatedAt)).getTime())) {
                    invoices[j] = _t0;
                    invoices[j - 1] = _t1;
                    // console.log('sorted')
                }
                else {
                    // console.log('no sorted')
                }
            }
        }
        invoices = (invoices).map(invoice => {
            const parts = invoice.estimate.parts;
            const labours = invoice.estimate.labours;
            invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [constants_1.INITIAL_PARTS_VALUE];
            invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [constants_1.INITIAL_LABOURS_VALUE];
            if (invoice.edited && invoice.updateStatus === constants_1.INVOICE_STATUS.update.sent) {
                const parts = invoice.parts;
                const labours = invoice.labours;
                invoice.parts = parts.length ? parts.map(part => JSON.parse(part)) : [constants_1.INITIAL_PARTS_VALUE];
                invoice.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [constants_1.INITIAL_LABOURS_VALUE];
            }
            return invoice;
        });
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: invoices,
        });
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
    static async completeEstimateDeposit(req) {
        const { error, value } = joi_1.default.object({
            customerId: joi_1.default.number().required().label('Customer Id'),
            invoiceId: joi_1.default.number().required().label('Invoice Id'),
            dueAmount: joi_1.default.number().required().label('Due Amount'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const invoice = await dao_1.default.invoiceDAOService.findById(value.invoiceId);
        if (!invoice)
            return Promise.reject(CustomAPIError_1.default.response(`Invoice with Id: ${value.invoiceId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await dao_1.default.customerDAOService.findById(value.customerId);
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const estimate = await invoice.$get('estimate');
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const partner = await estimate.$get('partner');
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const transactions = await invoice.$get('transactions');
        if (!transactions.length)
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
        //get default payment gateway
        const paymentGateway = await dao_1.default.paymentGatewayDAOService.findByAny({
            where: { default: true },
        });
        if (!paymentGateway)
            return Promise.reject(CustomAPIError_1.default.response(`No payment gateway found`, HttpStatus_1.default.NOT_FOUND.code));
        //initialize payment
        const metadata = {
            cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
        };
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        const endpoint = '/transaction/initialize';
        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}${endpoint}`;
        const dueAmount = value.dueAmount;
        let serviceCharge = 0.015 * dueAmount + 100;
        if (serviceCharge >= 2000)
            serviceCharge = 2000;
        const amount = Math.round((serviceCharge + dueAmount) * 100);
        const initResponse = await axiosClient_1.default.post(`${endpoint}`, {
            email: customer.email,
            amount,
            callback_url: callbackUrl,
            metadata,
            channels: constants_1.PAYMENT_CHANNELS,
        });
        const data = initResponse.data.data;
        const txnValues = {
            reference: data.reference,
            authorizationUrl: data.authorization_url,
            type: 'Payment',
            purpose: `${partner.name}: Estimate-${estimate.code} Complete Payment`,
            status: initResponse.data.message,
            amount: value.dueAmount,
        };
        const $transaction = await dao_1.default.transactionDAOService.create(txnValues);
        await invoice.$add('transactions', [$transaction]);
        await customer.$add('transactions', [$transaction]);
        AppEventEmitter_1.appEventEmitter.emit(constants_1.INIT_TRANSACTION, { customer, response: data });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        return Promise.resolve(response);
    }
    static async updateCompletedInvoicePayment(req) {
        const value = req.body;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            where: { reference: value.reference },
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
        }
        const invoice = await transaction.$get('invoice');
        if (!invoice) {
            return Promise.reject(CustomAPIError_1.default.response('Invoice does not exist', HttpStatus_1.default.NOT_FOUND.code));
        }
        const estimate = await invoice.$get('estimate');
        if (!estimate) {
            return Promise.reject(CustomAPIError_1.default.response('Estimate does not exist', HttpStatus_1.default.NOT_FOUND.code));
        }
        const partner = await estimate.$get('partner');
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const banks = await dao_1.default.bankDAOService.findAll();
        if (!banks.length)
            return Promise.reject(CustomAPIError_1.default.response(`No banks Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const bank = banks.find(bank => bank.name === partner.bankName);
        if (!bank)
            return Promise.reject(CustomAPIError_1.default.response(`Bank ${partner.bankName} does not exist. Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const recipient = {
            name: partner.name,
            account_number: partner.accountNumber,
            bank_code: bank.code,
            currency: bank.currency,
        };
        let systemFee = transaction.amount * 0.035;
        if (systemFee >= 5000)
            systemFee = 5000;
        const partnerFee = Math.round(transaction.amount - systemFee);
        let endpoint = '/balance';
        const balanceResponse = await axiosClient_1.default.get(endpoint);
        if (balanceResponse.data.data.balance < partnerFee)
            return Promise.reject(CustomAPIError_1.default.response('Insufficient Balance. Please contact support.', HttpStatus_1.default.BAD_REQUEST.code));
        endpoint = '/transferrecipient';
        const recipientResponse = await axiosClient_1.default.post(endpoint, recipient);
        const recipientCode = recipientResponse.data.data.recipient_code;
        endpoint = '/transfer';
        const transfer = {
            source: 'balance',
            recipient: recipientCode,
            reason: `Estimate-${estimate.code} Deposit`,
            amount: partnerFee * 100,
        };
        const transferResponse = await axiosClient_1.default.post(endpoint, transfer);
        const transferData = transferResponse.data.data;
        const transferTransactionValues = {
            amount: partnerFee,
            type: constants_1.TRANSACTION_TYPE.transfer,
            reference: `${transferData.reference}:${transaction.reference}`,
            status: transferData.status,
            bank: partner.bankName,
            purpose: `${partner.name}: Estimate-${estimate.code}`,
            channel: 'bank',
            currency: bank.currency,
            paidAt: new Date(),
        };
        const transferTransaction = await dao_1.default.transactionDAOService.create(transferTransactionValues);
        const amount = invoice.depositAmount + transaction.amount;
        const newDueAmount = invoice.grandTotal - amount;
        await invoice.update({
            dueAmount: newDueAmount,
            paidAmount: amount,
            depositAmount: amount,
            refundable: Math.sign(newDueAmount) === -1 ? Math.abs(newDueAmount) : invoice.refundable,
            status: newDueAmount === 0 ? constants_1.INVOICE_STATUS.paid : constants_1.INVOICE_STATUS.deposit,
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
            code: HttpStatus_1.default.OK.code,
            message: 'Payment complete',
        });
    }
    static async saveInvoice(req) {
        const { error, value } = joi_1.default.object(Invoice_1.$saveInvoiceSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const invoice = await dao_1.default.invoiceDAOService.findById(value.id);
        if (!invoice)
            return Promise.reject(CustomAPIError_1.default.response(`Invoice not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const estimate = await invoice.$get('estimate');
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await estimate.$get('customer');
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer not found.`, HttpStatus_1.default.NOT_FOUND.code));
        let draftInvoice = await invoice.$get('draftInvoice');
        await invoice.update({
            updateStatus: constants_1.INVOICE_STATUS.update.draft,
            edited: true,
            paidAmount: invoice.depositAmount,
        });
        if (draftInvoice) {
            await this.doSave(draftInvoice, value);
        }
        else {
            const data = {
                ...value,
                code: invoice.code,
                purpose: invoice.purpose,
                status: invoice.status,
                updateStatus: invoice.updateStatus,
                expiresIn: estimate.expiresIn,
                edited: invoice.edited,
            };
            for (const valueKey in value) {
                const key = valueKey;
                if (key === 'id')
                    continue;
                if (value[key]) {
                    if (key === 'parts') {
                        data.parts = value.parts.map((value) => JSON.stringify(value));
                        continue;
                    }
                    if (key === 'labours') {
                        data.labours = value.labours.map((value) => JSON.stringify(value));
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
            draftInvoice = await DraftInvoice_1.default.create(data);
            await invoice.$set('draftInvoice', draftInvoice);
        }
        AppEventEmitter_1.appEventEmitter.emit(constants_1.UPDATE_INVOICE, { invoice, customer });
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: `Invoice saved successfully.`,
            result: invoice,
        });
    }
    static async sendInvoice(req) {
        const { error, value } = joi_1.default.object(Invoice_1.$sendInvoiceSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const invoice = await dao_1.default.invoiceDAOService.findById(value.id);
        if (!invoice)
            return Promise.reject(CustomAPIError_1.default.response(`Invoice not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const estimate = await invoice.$get('estimate');
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await estimate.$get('customer');
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer not found.`, HttpStatus_1.default.NOT_FOUND.code));
        await invoice.update({
            parts: value.parts.map((value) => JSON.stringify(value)),
            labours: value.labours.map((value) => JSON.stringify(value)),
            depositAmount: parseInt(`${value.depositAmount}`),
            additionalDeposit: parseInt(`${value.additionalDeposit}`),
            jobDurationValue: parseInt(`${value.jobDurationValue}`),
            tax: value.tax,
            jobDurationUnit: value.jobDurationUnit,
            partsTotal: value.partsTotal,
            laboursTotal: value.laboursTotal,
            grandTotal: value.grandTotal,
            refundable: value.refundable,
            dueAmount: value.dueAmount,
            updateStatus: constants_1.INVOICE_STATUS.update.sent,
            edited: true,
        });
        const draftInvoice = await invoice.$get('draftInvoice');
        if (draftInvoice) {
            // @ts-ignore
            await DraftInvoice_1.default.destroy({ where: { invoiceId: invoice.id } });
            await invoice.$set('draftInvoice', null);
        }
        AppEventEmitter_1.appEventEmitter.emit(constants_1.UPDATE_INVOICE, { invoice, customer });
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: `Invoice sent successfully.`,
            result: invoice,
        });
    }
    static async doSave(invoice, value) {
        for (const valueKey in value) {
            const key = valueKey;
            if (key === 'id')
                continue;
            if (value[key]) {
                if (key === 'parts') {
                    await invoice.update({
                        [key]: value.parts.map((value) => JSON.stringify(value)),
                    });
                    continue;
                }
                if (key === 'labours') {
                    await invoice.update({
                        [key]: value.labours.map((value) => JSON.stringify(value)),
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
    static async doAssignJob(estimate) {
        const partner = await estimate.$get('partner');
        if (!partner)
            throw new Error('Partner does not exist');
        const invoice = await estimate.$get('invoice');
        if (!invoice)
            throw new Error('Invoice does not exist');
        const vehicle = await estimate.$get('vehicle');
        if (!vehicle)
            throw new Error('Vehicle does not exist');
        const customer = await estimate.$get('customer');
        if (!customer)
            throw new Error('Vehicle does not exist');
        const jobValues = {
            status: constants_1.JOB_STATUS.pending,
            type: `Inspection`,
            name: `Estimate-${estimate.code} Job`,
            vehicleOwner: `${customer.firstName} ${customer.lastName}`,
        };
        const job = await dao_1.default.jobDAOService.create(jobValues);
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
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "generateInvoice", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "invoices", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "completeEstimateDeposit", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "updateCompletedInvoicePayment", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "saveInvoice", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController, "sendInvoice", null);
exports.default = InvoiceController;
