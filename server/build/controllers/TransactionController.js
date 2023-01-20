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
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const constants_1 = require("../config/constants");
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const decorators_1 = require("../decorators");
const joi_1 = __importDefault(require("joi"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const dao_1 = __importDefault(require("../services/dao"));
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const transactionDoesNotExist = 'Transaction Does not exist.';
class TransactionController {
    static async subscriptionsTransactionStatus(req) {
        try {
            const query = req.query;
            if (query.status && query.status === 'cancelled') {
                AppEventEmitter_1.appEventEmitter.emit(constants_1.TXN_CANCELLED, { cancelled: true });
            }
            if (query.reference) {
                AppEventEmitter_1.appEventEmitter.emit(constants_1.TXN_REFERENCE, { reference: query.reference });
            }
            return Promise.resolve({
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
            });
        }
        catch (e) {
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
    static async depositForEstimate(req) {
        //validate request body
        const { error, value } = joi_1.default.object({
            customerId: joi_1.default.number().required().label('Customer Id'),
            estimateId: joi_1.default.number().required().label('Estimate Id'),
            partnerId: joi_1.default.number().required().label('Partner Id'),
            depositAmount: joi_1.default.number().required().label('Deposit Amount'),
            grandTotal: joi_1.default.number().required().label('Total Amount'),
            vin: joi_1.default.string().required().label('Vehicle Identification Number'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        //verify estimate exist
        const estimate = await dao_1.default.estimateDAOService.findById(value.estimateId);
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const partner = await estimate.$get('partner');
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const banks = await dao_1.default.bankDAOService.findAll();
        if (!banks.length)
            return Promise.reject(CustomAPIError_1.default.response(`No banks Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const bank = banks.find(bank => bank.name === partner.bankName);
        if (!bank)
            return Promise.reject(CustomAPIError_1.default.response(`Bank ${partner.bankName} does not exist. Please contact support`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await dao_1.default.customerDAOService.findById(value.customerId);
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        const vehicle = await dao_1.default.vehicleDAOService.findByAny({
            where: { vin: value.vin },
        });
        if (!vehicle)
            return Promise.reject(CustomAPIError_1.default.response(`Vehicle with VIN: ${value.vin} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
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
        let endpoint = '/balance';
        const balanceResponse = await axiosClient_1.default.get(endpoint);
        if (balanceResponse.data.data.balance === 0)
            return Promise.reject(CustomAPIError_1.default.response('Insufficient Balance. Please contact support.', HttpStatus_1.default.BAD_REQUEST.code));
        endpoint = '/transaction/initialize';
        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}${endpoint}`;
        const depositAmount = value.depositAmount;
        let serviceCharge = 0.015 * depositAmount;
        if (depositAmount >= 2500) {
            serviceCharge = 0.015 * depositAmount + 100;
        }
        if (serviceCharge >= 2000)
            serviceCharge = 2000;
        const amount = Math.round((serviceCharge + depositAmount) * 100);
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
            type: 'Deposit',
            purpose: `${partner.name}: Estimate-${estimate.code}${value.grandTotal === value.depositAmount ? ' Payment' : ' Deposit Payment'}`,
            status: initResponse.data.message,
            amount: value.depositAmount,
        };
        const transaction = await dao_1.default.transactionDAOService.create(txnValues);
        await customer.$add('transactions', [transaction]);
        AppEventEmitter_1.appEventEmitter.emit(constants_1.INIT_TRANSACTION, { customer, response: data });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        return Promise.resolve(response);
    }
    /**
     * @name initTransactionCallback
     * @description This method handles verification of the transactions and updating the transaction table accordingly.
     * @param req
     */
    static async initTransactionCallback(req) {
        const { reference } = req.query;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            where: { reference },
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
        }
        const customer = await transaction.$get('customer');
        if (!customer) {
            return Promise.reject(CustomAPIError_1.default.response('Customer Does not exist.', HttpStatus_1.default.NOT_FOUND.code));
        }
        //get default payment gateway
        const paymentGateway = await dao_1.default.paymentGatewayDAOService.findByAny({
            where: { default: true },
        });
        if (!paymentGateway)
            return Promise.reject(CustomAPIError_1.default.response(`No payment gateway found`, HttpStatus_1.default.NOT_FOUND.code));
        //verify payment
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        const endpoint = `/transaction/verify/${reference}`;
        const axiosResponse = await axiosClient_1.default.get(endpoint);
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
        AppEventEmitter_1.appEventEmitter.emit(constants_1.VERIFY_TRANSACTION, { customer, transaction: $transaction });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        return Promise.resolve(response);
    }
    static async updateTransaction(req) {
        const value = req.body;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            where: { reference: value.reference },
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
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
            code: HttpStatus_1.default.OK.code,
            message: 'Transaction updated successfully',
            result: transaction,
        });
    }
    static async initRefundCustomer(req) {
        const partner = req.user.partner;
        //validate request body
        const { error, value } = joi_1.default.object({
            callbackUrl: joi_1.default.string().required().label('Callback URL'),
            amount: joi_1.default.number().required().label('Refund Amount'),
            invoiceId: joi_1.default.number().required().label('Invoice Id'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const invoice = await dao_1.default.invoiceDAOService.findById(value.invoiceId);
        if (!invoice)
            return Promise.reject(CustomAPIError_1.default.response(`Invoice not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const estimate = await invoice.$get('estimate');
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found.`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await estimate.$get('customer');
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer not found.`, HttpStatus_1.default.NOT_FOUND.code));
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
        const callbackUrl = value.callbackUrl;
        const amount = Math.round(value.amount * 100);
        const initResponse = await axiosClient_1.default.post(`${endpoint}`, {
            email: partner.email,
            amount,
            callback_url: callbackUrl,
            metadata,
            channels: constants_1.PAYMENT_CHANNELS,
        });
        const data = initResponse.data.data;
        const txnValues = {
            reference: data.reference,
            authorizationUrl: data.authorization_url,
            type: constants_1.TRANSACTION_TYPE.refund,
            purpose: `Customer ${customer.firstName} ${customer.lastName} ${value.amount} Refund.`,
            status: initResponse.data.message,
            amount: value.amount,
        };
        const transaction = await dao_1.default.transactionDAOService.create(txnValues);
        await partner.$add('transactions', [transaction]);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: {
                reference: data.reference,
                authorizationUrl: data.authorization_url,
                invoiceId: invoice.id,
            },
        };
        return Promise.resolve(response);
    }
    static async verifyRefundCustomer(req) {
        const { reference, invoiceId } = req.query;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            where: { reference },
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response(transactionDoesNotExist, HttpStatus_1.default.NOT_FOUND.code));
        }
        const invoice = await dao_1.default.invoiceDAOService.findById(invoiceId);
        if (!invoice)
            return Promise.reject(CustomAPIError_1.default.response(`Invoice not found.`, HttpStatus_1.default.NOT_FOUND.code));
        //get default payment gateway
        const paymentGateway = await dao_1.default.paymentGatewayDAOService.findByAny({
            where: { default: true },
        });
        if (!paymentGateway)
            return Promise.reject(CustomAPIError_1.default.response(`No payment gateway found`, HttpStatus_1.default.NOT_FOUND.code));
        //verify payment
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        const endpoint = `/transaction/verify/${reference}`;
        const axiosResponse = await axiosClient_1.default.get(endpoint);
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
        await invoice.update({
            edited: true,
            updateStatus: constants_1.INVOICE_STATUS.update.refund,
            refundable: 0,
            depositAmount: 0,
        });
        await invoice.$add('transactions', [transaction]);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Refund Successful!',
        };
        return Promise.resolve(response);
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController, "depositForEstimate", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController, "initTransactionCallback", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController, "updateTransaction", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController, "initRefundCustomer", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController, "verifyRefundCustomer", null);
exports.default = TransactionController;
