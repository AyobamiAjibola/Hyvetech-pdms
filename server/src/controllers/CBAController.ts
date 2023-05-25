import { HasPermission, TryCatch } from '../decorators';
import BankService, * as appModels from '../services/BankService';
import { appCommonTypes } from '../@types/app-common';
import HttpResponse = appCommonTypes.HttpResponse;
import HttpStatus from '../helpers/HttpStatus';
import { Request } from 'express';
import CBAService from '../services/CBAService';
import Joi = require('joi');
import PartnerAccount, {
  $savePartnerAccountSchema,
  PartnerAccountSchemaType,
  PerformNameEnquirySchemaType,
  performNameEnquirySchema,
} from '../models/PartnerAccount';
import dataSources from '../services/dao';
import CustomAPIError from '../exceptions/CustomAPIError';
import {
  $saveAccountActivationRequestSchema,
  AccountActivationRequestSchemaType,
} from '../models/AccountActivationRequest';
import dao from '../services/dao';
import settings, { MANAGE_ALL, MANAGE_TECHNICIAN } from '../config/settings';

const NO_ACCOUNT_PROVISIONED = 'No account is provisioned for user';
const PARTNER_NOT_FOUND = 'Partner account not found';

export const accountTransferSchema: Joi.SchemaMap<appModels.AccountTransferDTO> = {
  trackingReference: Joi.string().optional().label('trackingReference'),
  beneficiaryAccount: Joi.string().required().label('beneficiaryAccount'),
  amount: Joi.number().required().label('amount'),
  narration: Joi.string().required().label('narration'),
  beneficiaryBankCode: Joi.string().required().label('beneficiaryBankCode'),
  beneficiaryName: Joi.string().optional().label('beneficiaryName'),
  senderName: Joi.string().optional().label('senderName'),
  nameEnquiryId: Joi.number().required().label('nameEnquiryId'),
  saveAsBeneficiary: Joi.boolean().optional().label('saveAsBeneficiary'),
  bankName: Joi.string().optional().label('bankName'),
};

class CBAController {
  private readonly bankService: BankService;
  constructor(bankService: BankService) {
    this.bankService = bankService;
  }
  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async createAccount(req: Request) {
    const account = await this.doCreateAccount(req);

    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: 'Account created successfully',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async getAccountBalance(req: Request) {
    const account = await this.doGetAccountBalance(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: 'Account balance retrieved successfully',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async initiateAccountTranfer(req: Request) {
    const account = await this.doInitiateTransfer(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: 'Transaction successful',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async getAccountTransactions(req: Request) {
    const account = await this.doGetAccountTransactions(req);

    console.log('account> ', account.postingsHistory);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: 'Account transactions retrieved successfully',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async getKyRequests(req: Request) {
    const account = await this.doGetKycRequests(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: 'Account requests successfully',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async performNameEnquiry(req: Request) {
    const account = await this.doPerformNameEnquiry(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: 'Account details retrieved successfully',
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async performAccountActivation(req: Request) {
    const data = await this.doAccountActivation(req);

    const response: HttpResponse<typeof data> = {
      code: HttpStatus.OK.code,
      message: 'Account provisioned successfully',
      result: data,
    };

    return Promise.resolve(response);
  }

  private async doAccountActivation(req: Request) {
    const requestId = req.params.id;

    const accountRequest = await dataSources.accountActivationDAOService.findById(+requestId);

    if (!accountRequest)
      return Promise.reject(
        CustomAPIError.response(`No active request for given request ID {${requestId}}`, HttpStatus.BAD_REQUEST.code),
      );

    const partner = await dao.partnerDAOService.findById(accountRequest.partnerId);
    if (!partner) return Promise.reject(CustomAPIError.response(PARTNER_NOT_FOUND, HttpStatus.BAD_REQUEST.code));

    const user = await dataSources.userDAOService.findByAdminUserByPartnerId(partner.id);

    if (!user) return Promise.reject(CustomAPIError.response('No such user found', HttpStatus.BAD_REQUEST.code));

    const partnerAccount = await dao.partnerAccountDaoService.findByAny({ where: { partnerId: partner.id } });

    if (partnerAccount) return partnerAccount;

    if (partner.email.trim() === '')
      return Promise.reject(CustomAPIError.response('Please provide partner email', HttpStatus.BAD_REQUEST.code));

    if (partner.phone.trim() === '')
      return Promise.reject(CustomAPIError.response('Please provide partner phone', HttpStatus.BAD_REQUEST.code));

    const response = await dataSources.partnerAccountDaoService.create({
      firstName: accountRequest.businessName,
      lastName: 'Ltd',
      phoneNumber: partner.phone,
      email: partner.email,
      businessName: accountRequest.businessName,
      partnerId: partner.id,
    });

    partner.accountName = `${response.firstName} ${response.lastName}`;
    partner.accountNumber = response.accountNumber;
    partner.bankName = response.accountProvider;
    accountRequest.isApproved = true;

    partner.accountProvisionStatus = 'APPROVED';

    partner.isAccountProvisioned = true;

    await partner.save();

    await accountRequest.save();
    return response;
  }

  @TryCatch
  public async performAccountActivationRequest(req: Request) {
    const data = await this.doAccountActivationRequest(req);

    const response: HttpResponse<typeof data> = {
      code: HttpStatus.OK.code,
      message: 'Request sent successfully',
      result: data,
    };

    return Promise.resolve(response);
  }

  private async doAccountActivationRequest(req: Request) {
    const { error, value } = Joi.object<AccountActivationRequestSchemaType>(
      $saveAccountActivationRequestSchema,
    ).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    const partner = await dao.partnerDAOService.findById(req.user.partnerId);
    if (!partner) return Promise.reject(CustomAPIError.response(PARTNER_NOT_FOUND, HttpStatus.BAD_REQUEST.code));

    if (partner.accountProvisionStatus === 'PENDING')
      return Promise.reject(
        CustomAPIError.response('Your account request is still been reviewed.', HttpStatus.BAD_REQUEST.code),
      );
    value.partnerId = partner.id;

    value.isApproved = false;

    const response = await dao.accountActivationDAOService.create(value);

    partner.accountProvisionStatus = 'PENDING';

    await partner.save();

    // send mail here

    // eslint-disable-next-line promise/catch-or-return
    dataSources.mailService
      .sendHtmlMail({
        to: 'admin@myautohyve.com',
        from: 'support@myautohyve.com',
        subject: 'Account activation request',
        html: `
         <div> The following AutoHyve user is activating a HyvePay account and requires verification.</div>

         <div>
           AutoHyve user details:
          - ${req.user.firstName} ${req.user.lastName} \n
          - ${value.businessName} \n
          - ${req.user.phone} \n
          - ${req.user.email} \n 
         </div>
          <br />

         <div>
          Attached are the users identification documents: \n
            1. ID card 
            2. NIN 
            3. CAC (if available)
         </div>
        `,
      })
      .then(() => {
        console.log('successfully send');

        return 0;
      })
      .catch((err: any) => {
        console.log('error', err);
      });

    return response;
  }

  private async doPerformNameEnquiry(req: Request) {
    const { error, value } = Joi.object<PerformNameEnquirySchemaType>(performNameEnquirySchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partnerId,
      },
    });
    if (!partnerAcount)
      return Promise.reject(CustomAPIError.response(NO_ACCOUNT_PROVISIONED, HttpStatus.BAD_REQUEST.code));

    return this.bankService.performNameEnquiry({
      beneficiaryAccountNumber: value.beneficiaryAccountNumber,
      beneficiaryBankCode: value.beneficiaryBankCode,
      senderTrackingReference: partnerAcount.accountRef,
      isRequestFromVirtualAccount: 'True',
    });
  }

  private async doInitiateTransfer(req: Request) {
    const { error, value } = Joi.object<appModels.AccountTransferDTO>(accountTransferSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const partnerAccount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partner.id,
      },
    });

    if (!partnerAccount)
      return Promise.reject(CustomAPIError.response('Account not found', HttpStatus.BAD_REQUEST.code));

    const beneficiary = await dataSources.beneficiaryDAOService.findByAny({
      where: {
        accountNumber: value.beneficiaryAccount,
      },
    });

    value.trackingReference = partnerAccount?.accountRef;
    value.clientFeeCharge = +settings.kuda.transferChargeFee;
    const response = await this.bankService.intiateTransfer(value);

    if (!value.saveAsBeneficiary) return response;

    if (beneficiary) return response;

    await dataSources.beneficiaryDAOService.create({
      name: value.beneficiaryName,
      accountName: value.beneficiaryName,
      accountNumber: value.beneficiaryAccount,
      bankCode: value.beneficiaryBankCode,
      partnerId: req.user.partner.id,
      bankName: value.bankName as string,
    });

    return response;
  }

  private async doGetAccountTransactions(req: Request) {
    const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partnerId,
      },
    });
    if (!partnerAcount)
      return Promise.reject(CustomAPIError.response(NO_ACCOUNT_PROVISIONED, HttpStatus.BAD_REQUEST.code));

    return this.bankService.getAccountTransactionLog({
      page: {
        pageSize: 0,
        pageNumber: 100,
      },
      accountId: partnerAcount.accountRef as string,
    });
  }

  private async doCreateAccount(req: Request) {
    const { error, value } = Joi.object<PartnerAccountSchemaType>($savePartnerAccountSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const account = await dataSources.partnerAccountDaoService.findByAny({ where: { partnerId: req.user.partnerId } });

    if (account)
      return Promise.reject(
        CustomAPIError.response('Account has already been provisioned for partner', HttpStatus.BAD_REQUEST.code),
      );

    const partner = await dataSources.partnerDAOService.findById(req.user.partnerId);

    if (!partner)
      return Promise.reject(CustomAPIError.response('Partner account not found', HttpStatus.BAD_REQUEST.code));

    if (!req.user.phone || req.user.phone.trim() === '')
      return Promise.reject(CustomAPIError.response('Phone number is required', HttpStatus.BAD_REQUEST.code));

    const response = dataSources.partnerAccountDaoService.create({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phone,
      email: req.user.email,
      businessName: value.businessName,
      partnerId: req.user.partnerId,
    });

    partner.isAccountProvisioned = true;

    await partner.save();

    return response;
  }

  private async doGetAccountBalance(req: Request) {
    const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partnerId,
      },
    });

    if (!partnerAcount)
      return Promise.reject(CustomAPIError.response('No account is provisioned for user', HttpStatus.BAD_REQUEST.code));

    const response = await this.bankService.getVirtualAccountBalance(partnerAcount?.accountRef as string);
    response.accountNumber = partnerAcount.accountNumber;
    response.accountName = `${partnerAcount.firstName} ${partnerAcount.lastName}`;
    response.accountProvider = partnerAcount.accountProvider;

    return response;
  }

  private async doGetKycRequests(req: Request) {
    return dataSources.accountActivationDAOService.findAll({});
  }
}

export default CBAController;
