import { HasPermission, TryCatch } from "../decorators";
import BankService, * as appModels from "../services/BankService";
import { appCommonTypes } from "../@types/app-common";
import HttpResponse = appCommonTypes.HttpResponse;
import HttpStatus from "../helpers/HttpStatus";
import { Request } from "express";
import CBAService from "../services/CBAService";
import Joi = require("joi");
import PartnerAccount, {
  $savePartnerAccountSchema,
  $updateCBAAccountDetail,
  $updatePartnerAccountSchema,
  CBAAccountUpdateType,
  PartnerAccountSchemaType,
  PerformNameEnquirySchemaType,
  performNameEnquirySchema,
} from "../models/PartnerAccount";
import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import {
  $saveAccountActivationRequestSchema,
  AccountActivationRequestSchemaType,
} from "../models/AccountActivationRequest";
import dao from "../services/dao";
import settings, { MANAGE_ALL, MANAGE_TECHNICIAN } from "../config/settings";
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import PasswordEncoder from "../utils/PasswordEncoder";
import { appModelTypes } from "../@types/app-model";
import MailgunMessageData = appModelTypes.MailgunMessageData;
import QueueManager from "../services/QueueManager";
import { MAIL_QUEUE_EVENTS } from "../config/constants";

const NO_ACCOUNT_PROVISIONED = "No account is provisioned for user";
const PARTNER_NOT_FOUND = "Partner account not found";

export const accountTransferSchema: Joi.SchemaMap<appModels.AccountTransferDTO> =
  {
    trackingReference: Joi.string().optional().label("trackingReference"),
    beneficiaryAccount: Joi.string().required().label("beneficiaryAccount"),
    amount: Joi.number().required().label("amount"),
    narration: Joi.string().required().label("narration"),
    beneficiaryBankCode: Joi.string().required().label("beneficiaryBankCode"),
    beneficiaryName: Joi.string().optional().label("beneficiaryName"),
    senderName: Joi.string().optional().label("senderName"),
    nameEnquiryId: Joi.number().required().label("nameEnquiryId"),
    saveAsBeneficiary: Joi.boolean().optional().label("saveAsBeneficiary"),
    bankName: Joi.string().optional().label("bankName"),
    pin: Joi.string().required().label("pin"),
  };

export interface IBeneficiaryModel {
  name: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  bankCode: string;
}

export const filterAccountTransactionSchema: Joi.SchemaMap<appModels.AccountTransactionLogDTO> =
  {
    startDate: Joi.string().optional().label("startDate"),
    endDate: Joi.string().optional().label("endDate"),
    page: Joi.object({
      pageSize: Joi.number().optional().label("pageSize"),
      pageNumber: Joi.number().optional().label("pageNumber"),
    })
      .optional()
      .label("page"),
  };

class CBAController {
  private readonly bankService: BankService;
  private readonly passwordEncoded: BcryptPasswordEncoder;
  constructor(bankService: BankService) {
    this.bankService = bankService;
    this.passwordEncoded = new PasswordEncoder();
  }
  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async createAccount(req: Request) {
    const account = await this.doCreateAccount(req);

    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: "Account created successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async createBeneficiary(req: Request) {
    const { error, value } = Joi.object<IBeneficiaryModel>({
      name: Joi.string().required(),
      bankName: Joi.string().required(),
      bankCode: Joi.string().required(),
      accountName: Joi.string().required(),
      accountNumber: Joi.string().required(),
    }).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );
    if (!value)
      return Promise.reject(
        CustomAPIError.response(
          HttpStatus.BAD_REQUEST.value,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const beneficiary = await dataSources.beneficiaryDAOService.findByAny({
      where: {
        accountNumber: value.accountNumber,
        partnerId: req.user.partnerId,
      },
    });

    const response: HttpResponse<IBeneficiaryModel> = {
      message: `Beneficiary successfully created.`,
      code: HttpStatus.OK.code,
      result: null,
    };

    if (beneficiary)
      return Promise.reject(
        CustomAPIError.response(
          "Beneficiary already added",
          HttpStatus.BAD_REQUEST.code
        )
      );

    response.result = await dataSources.beneficiaryDAOService.create({
      name: value.name,
      accountName: value.accountName,
      accountNumber: value.accountNumber,
      bankCode: value.bankCode,
      partnerId: req.user.partner.id,
      bankName: value.bankName as string,
    });

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async updateAccountPin(req: Request) {
    const account = await this.doAccountPinUpdate(req);

    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: "Account updated successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async updateAccount(req: Request) {
    const account = await this.doUpdateAccount(req);
  
    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: "Account updated successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  private async doUpdateAccount(req: Request) {
    const { error, value } = Joi.object<CBAAccountUpdateType>(
      $updateCBAAccountDetail
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const account = await dataSources.partnerAccountDaoService.findByAny({
      where: { partnerId: req.user.partnerId },
      // where: { accountRef: req.params.ref }
    });

    if (!account)
      return Promise.reject(
        CustomAPIError.response(
          "Account not yet provisioned",
          HttpStatus.BAD_REQUEST.code
        )
      );

    // Check if email is changing
    if (account.email !== value.email) {
      const user = await dataSources.userDAOService.findByAny({
        where: { email: account.email },
      });
      const partner = await dataSources.partnerDAOService.findById(
        account.partnerId
      );

      if (!partner) {
        return Promise.reject(
          CustomAPIError.response(
            'Partner not found',
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

      if (!user) {
        return Promise.reject(
          CustomAPIError.response(
            'User not found',
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

       //verify password
       const hash = user.password;
       const password = value.password;
 
       const isMatch = await this.passwordEncoded.match(
         password.trim(),
         hash.trim()
       );
 
       if (!isMatch)
         return Promise.reject(
           CustomAPIError.response(
            "Password is incorrect",
            HttpStatus.BAD_REQUEST.code
           )
         );

      // Perform updates concurrently
      await Promise.all([
        dataSources.userDAOService.update(user, {
          email: value.email,
          username: value.email,
        } as any),
        dataSources.partnerDAOService.update(partner, { email: value.email } as any),
      ]);
    }

    return await dataSources.partnerAccountDaoService.update(account, {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      businessName: value.businessName,
    } as any);

  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async getAccountBalance(req: Request) {
    const account = await this.doGetAccountBalance(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Account balance retrieved successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async getAccounts(req: Request) {
    const accounts = await this.doGetVirtualAccount(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "Accounts retrieved successfully",
      result: accounts,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async disableAccount(req: Request) {
    const account = await this.doDisableAccount(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "Account disabled successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async enableAccount(req: Request) {
    const account = await this.doEnableAccount(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "Account enabled successfully",
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
      message: "Transaction successful",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async getAccountTransactions(req: Request) {
    const account = await this.doGetAccountTransactions(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Account transactions retrieved successfully",
      result: account,
    };

    return Promise.resolve(response);
  }
  
  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async getVirAccountTransactionsFiltered(req: Request) {
    const account = await this.doGetVirAccountTransactions(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Account transactions retrieved successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async getMainAccountTransactions(req: Request) {
    const account = await this.doGetMainAccountTransactions(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Account transactions retrieved successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  public async getAccountDetail(req: Request) {
    const { accountNumber } = req.body;
    const account = await dao.partnerAccountDaoService.findByAny({
      where: { accountNumber },
    });

    if (!account)
      return Promise.reject(
        CustomAPIError.response(`No such account`, HttpStatus.BAD_REQUEST.code)
      );

    const response: HttpResponse<string> = {
      code: HttpStatus.OK.code,
      message: "Account retrieved successfully",
      result: account.phoneNumber,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async getKyRequests(req: Request) {
    const account = await this.doGetKycRequests(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Account requests successfully",
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
      message: "Account details retrieved successfully",
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
      message: "Account provisioned successfully",
      result: data,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_ALL])
  public async performAccountActivationRejection(req: Request) {
    const data = await this.doAccountActivationRejection(req);

    const response: HttpResponse<typeof data> = {
      code: HttpStatus.OK.code,
      message: "Operation successful",
      result: data,
    };

    return Promise.resolve(response);
  }

  private async doAccountActivationRejection(req: Request) {
    const requestId = req.params.id;

    const accountRequest =
      await dataSources.accountActivationDAOService.findById(+requestId);

    if (!accountRequest)
      return Promise.reject(
        CustomAPIError.response(
          `No active request for given request ID {${requestId}}`,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partner = await dao.partnerDAOService.findById(
      accountRequest.partnerId
    );
    if (!partner)
      return Promise.reject(
        CustomAPIError.response(PARTNER_NOT_FOUND, HttpStatus.BAD_REQUEST.code)
      );

    const user = await dataSources.userDAOService.findByAdminUserByPartnerId(
      partner.id
    );

    if (!user)
      return Promise.reject(
        CustomAPIError.response(
          "No such user found",
          HttpStatus.BAD_REQUEST.code
        )
      );

    accountRequest.isApproved = false;

    partner.accountProvisionStatus = "NOT_REQUESTED";

    partner.isAccountProvisioned = false;

    await partner.save();

    await accountRequest.destroy();

    return partner;
  }

  private async doAccountActivation(req: Request) {
    const requestId = req.params.id;

    const accountRequest =
      await dataSources.accountActivationDAOService.findById(+requestId);

    if (!accountRequest)
      return Promise.reject(
        CustomAPIError.response(
          `No active request for given request ID {${requestId}}`,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partner = await dao.partnerDAOService.findById(
      accountRequest.partnerId
    );
    if (!partner)
      return Promise.reject(
        CustomAPIError.response(PARTNER_NOT_FOUND, HttpStatus.BAD_REQUEST.code)
      );

    const user = await dataSources.userDAOService.findByAdminUserByPartnerId(
      partner.id
    );

    if (!user)
      return Promise.reject(
        CustomAPIError.response(
          "No such user found",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partnerAccount = await dao.partnerAccountDaoService.findByAny({
      where: { partnerId: partner.id },
    });

    if (partnerAccount) return partnerAccount;

    if (partner.email.trim() === "")
      return Promise.reject(
        CustomAPIError.response(
          "Please provide partner email",
          HttpStatus.BAD_REQUEST.code
        )
      );

    if (partner.phone.trim() === "")
      return Promise.reject(
        CustomAPIError.response(
          "Please provide partner phone",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const response = await dataSources.partnerAccountDaoService.create({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: partner.phone,
      email: partner.email,
      businessName: accountRequest.businessName,
      partnerId: partner.id,
      pin: accountRequest.pin,
      nin: accountRequest.nin,
    });

    partner.accountName = `${response.firstName} ${response.lastName}`;
    partner.accountNumber = response.accountNumber;
    partner.bankName = response.accountProvider;
    accountRequest.isApproved = true;

    partner.accountProvisionStatus = "APPROVED";

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
      message: "Request sent successfully",
      result: data,
    };

    return Promise.resolve(response);
  }

  private async doAccountActivationRequest(req: Request) {
    const { error, value } = Joi.object<AccountActivationRequestSchemaType>(
      $saveAccountActivationRequestSchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );
    const partner = await dao.partnerDAOService.findById(req.user.partnerId);
    if (!partner)
      return Promise.reject(
        CustomAPIError.response(PARTNER_NOT_FOUND, HttpStatus.BAD_REQUEST.code)
      );

    if (partner.accountProvisionStatus === "PENDING")
      return Promise.reject(
        CustomAPIError.response(
          "Your account request is still been reviewed.",
          HttpStatus.BAD_REQUEST.code
        )
      );
    value.partnerId = partner.id;

    value.isApproved = false;

    const response = await dao.accountActivationDAOService.create(value);

    partner.accountProvisionStatus = "PENDING";

    await partner.save();

    // send mail here
    // eslint-disable-next-line promise/catch-or-return
    const mailData: MailgunMessageData = {
      to: settings.mailer.customerSupport,
      from: settings.mailer.from,
      subject: "Account activation requested",
      template: "partner_account_activation_request",
      "h:X-Mailgun-Variables": JSON.stringify({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        businessName: value.businessName,
        phone: req.user.phone,
        email: req.user.email,
      }),
    };

    QueueManager.dispatch({ queue: MAIL_QUEUE_EVENTS.name, data: mailData });

    return response;
  }

  private async doPerformNameEnquiry(req: Request) {
    const { error, value } = Joi.object<PerformNameEnquirySchemaType>(
      performNameEnquirySchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partnerId,
      },
    });
    if (!partnerAcount)
      return Promise.reject(
        CustomAPIError.response(
          NO_ACCOUNT_PROVISIONED,
          HttpStatus.BAD_REQUEST.code
        )
      );

    return this.bankService.performNameEnquiry({
      beneficiaryAccountNumber: value.beneficiaryAccountNumber,
      beneficiaryBankCode: value.beneficiaryBankCode,
      senderTrackingReference: partnerAcount.accountRef,
      isRequestFromVirtualAccount: "True",
    });
  }

  private async doInitiateTransfer(req: Request) {
    const { error, value } = Joi.object<appModels.AccountTransferDTO>(
      accountTransferSchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partnerAccount = await dataSources.partnerAccountDaoService.findByAny(
      {
        where: {
          partnerId: req.user.partner.id,
        },
      }
    );

    if (!partnerAccount)
      return Promise.reject(
        CustomAPIError.response(
          "Account not found",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const isMatch = await this.passwordEncoded.match(
      value.pin,
      partnerAccount?.pin.trim()
    );

    if (!isMatch)
      return Promise.reject(
        CustomAPIError.response("PIN is invalid", HttpStatus.BAD_REQUEST.code)
      );

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

  private async doGetMainAccountTransactions(req: Request) {
    const { error, value } = Joi.object<appModels.AccountTransactionLogDTO>(
      filterAccountTransactionSchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    // const startDate = req.query.startDate as string;
    // const endDate = req.query.endDate as string;

    return this.bankService.getMainAccountTransactionLog({
      startDate: value?.startDate,
      endDate: value?.endDate,
      page: {
        pageSize: value?.page?.pageSize || 1000,
        pageNumber: value?.page?.pageNumber || 1,
      },
      // pageSize: 1000,
      // pageNumber: 1,
    });
    // Filter the accounts based on the realDate range if both startDate and endDate are provided
    // if (startDate && endDate) {
    //   const filteredAccounts = response.postingsHistory.filter(account => {
    //     const realDate = new Date(account.realDate);
    //     return realDate >= new Date(startDate) && realDate <= new Date(endDate);
    //   });
  
    //   response.postingsHistory = filteredAccounts;
    // }

    // return response;
  }

  private async doGetAccountTransactions(req: Request) {
    const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
      where: {
        partnerId: req.user.partnerId,
      },
    });
    if (!partnerAcount)
      return Promise.reject(
        CustomAPIError.response(
          NO_ACCOUNT_PROVISIONED,
          HttpStatus.BAD_REQUEST.code
        )
      );

    return this.bankService.getAccountTransactionLog({
      page: {
        pageSize: 100,
        pageNumber: 0,
      },
      accountId: partnerAcount.accountRef as string,
    });
  }

  private async doGetVirAccountTransactions(req: Request) {

    // const partnerAcount = await dataSources.partnerAccountDaoService.findByAny({
    //   where: {
    //     accountRef: req.body.accountRef,
    //   },
    // });
    // if (!partnerAcount)
    //   return Promise.reject(
    //     CustomAPIError.response(
    //       NO_ACCOUNT_PROVISIONED,
    //       HttpStatus.BAD_REQUEST.code
    //     )
    //   );
    
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const response = await this.bankService.getAccountTransactionLog({
      page: {
        pageSize: 1000,
        pageNumber: 0,
      },
      accountId: req.body.accountRef // partnerAcount.accountRef as string,
    });

    // Filter the accounts based on the realDate range if both startDate and endDate are provided
    if (startDate && endDate) {
      const filteredTransactions = response.postingsHistory.filter(account => {
        const realDate = new Date(account.realDate);
        return realDate >= new Date(startDate) && realDate <= new Date(endDate);
      });

      // Sort the filteredTransactions based on realDate
      filteredTransactions.sort((a, b) => {
        const dateA = new Date(a.realDate);
        const dateB = new Date(b.realDate);
        return dateB.getTime() - dateA.getTime();
      });

      response.postingsHistory = filteredTransactions;
    } else {
      // Sort all transactions based on realDate
      response.postingsHistory.sort((a, b) => {
        const dateA = new Date(a.realDate);
        const dateB = new Date(b.realDate);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return response;
  }

  private async doCreateAccount(req: Request) {
    const { error, value } = Joi.object<PartnerAccountSchemaType>(
      $savePartnerAccountSchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const account = await dataSources.partnerAccountDaoService.findByAny({
      where: { partnerId: req.user.partnerId },
    });

    if (account)
      return Promise.reject(
        CustomAPIError.response(
          "Account has already been provisioned for partner",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const partner = await dataSources.partnerDAOService.findById(
      req.user.partnerId
    );

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(
          "Partner account not found",
          HttpStatus.BAD_REQUEST.code
        )
      );

    if (!req.user.phone || req.user.phone.trim() === "")
      return Promise.reject(
        CustomAPIError.response(
          "Phone number is required",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const response = dataSources.partnerAccountDaoService.create({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phone,
      email: req.user.email,
      businessName: value.businessName,
      partnerId: req.user.partnerId,
      pin: value.pin,
      nin: value.nin,
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
      return Promise.reject(
        CustomAPIError.response(
          "No account is provisioned for user",
          HttpStatus.BAD_REQUEST.code
        )
      );

    const response = await this.bankService.getVirtualAccountBalance(
      partnerAcount?.accountRef as string
    );
    response.accountNumber = partnerAcount.accountNumber;
    response.accountName = `${partnerAcount.firstName} ${partnerAcount.lastName}`;
    response.accountProvider = partnerAcount.accountProvider;
    response.businessName = partnerAcount.businessName;

    return response;
  }

  private async doGetVirtualAccount(req: Request) {
    const pageNumber = parseInt(req.query.pageNumber as string, 10) || 1;
    // const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const response = await this.bankService.getAllAccount({
      pageNumber,
      pageSize: 1000,
    });

    // Filter the accounts based on the creationDate range if both startDate and endDate are provided
    if (startDate && endDate) {
      const filteredAccounts = response.accounts.filter(account => {
        const creationDate = new Date(account.creationDate);
        return creationDate >= new Date(startDate) && creationDate <= new Date(endDate);
      });

      // Sort the filteredAccounts based on creationDate
      filteredAccounts.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return dateB.getTime() - dateA.getTime();
      });

      response.accounts = filteredAccounts;
    } else {
      // Sort all accounts based on creationDate
      response.accounts.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return response;
  }

  private async doDisableAccount(req: Request) {
    const refNum = req.params.refNum;
 
    const response = await this.bankService.disableAccount(refNum);

    return response;
  }

  private async doEnableAccount(req: Request) {
    const refNum = req.params.refNum;

    const response = await this.bankService.enableAccount(refNum);

    return response;
  }

  private async doGetKycRequests(req: Request) {
    return dataSources.accountActivationDAOService.findAll({});
  }

  private async doAccountPinUpdate(req: Request) {
    const { error, value } = Joi.object<
      PartnerAccountSchemaType & { currentPin: string }
    >($updatePartnerAccountSchema).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    const account = await dataSources.partnerAccountDaoService.findByAny({
      where: { partnerId: req.user.partnerId },
    });

    if (!account)
      return Promise.reject(
        CustomAPIError.response(
          "Account not yet provisioned",
          HttpStatus.BAD_REQUEST.code
        )
      );

    if (!(await this.passwordEncoded.match(value.currentPin, account.pin)))
      return Promise.reject(
        CustomAPIError.response("PIN do not match", HttpStatus.BAD_REQUEST.code)
      );

    account.pin = await this.passwordEncoded.encode(value.pin);

    await account.save();

    return null;
  }
}

export default CBAController;
