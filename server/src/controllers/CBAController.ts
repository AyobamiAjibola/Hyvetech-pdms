import { HasPermission, TryCatch } from "../decorators";
import BankService, * as appModels from "../services/BankService";
import { appCommonTypes } from "../@types/app-common";
import HttpResponse = appCommonTypes.HttpResponse;
import HttpStatus from "../helpers/HttpStatus";
import { Request } from "express";
import CBAService from "../services/CBAService";
import Joi = require("joi");
import PartnerAccount, {
  $resetPartnerAccountPinSchema,
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
import User from "../models/User";
import Partner from "../models/Partner";
import { InferAttributes } from "sequelize";
import Expense from "../models/Expense";

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
    NameEnquirySessionID: Joi.string().optional().label("NameEnquirySessionID"),
    saveAsBeneficiary: Joi.boolean().optional().label("saveAsBeneficiary"),
    bankName: Joi.string().optional().label("bankName"),
    pin: Joi.string().required().label("pin"),
    expenseId: Joi.number().optional().label("expense id"),
  };

export const performBulkNameEnquirySchema: Joi.SchemaMap<appModels.BulkNameEnquiryDTO> =
  {
    Data: Joi.array().items(
      Joi.object({
        AccountNumber: Joi.string().required().label("AccountNumber"),
        BankCode: Joi.string().optional().label("bankCode")
      })
    )
  }

export const bulkAccountTransferSchema: Joi.SchemaMap<appModels.BulkAccountTransferDTO> =
  {
    TrackingReference: Joi.string().optional().label("trackingReference"),
    ClientAccountNumber: Joi.string().optional().label("clientAccountNumber"),
    narration: Joi.string().optional().label("narration"),
    NotificationEmail: Joi.string().optional().label("notificationEmail"),
    TotalAmount: Joi.string().optional().label("total amount"),
    BeneficiaryPaymentData: Joi.array().items(
      Joi.object({
        accountNumber: Joi.string().optional().label("accountNumber"),
        amountInKobo: Joi.string().optional().label("amountInKobo"),
        AmountInKobo: Joi.number().optional().label("AmountInKobo"),
        feeAmountInKobo: Joi.string().optional().label("feeAmountInKobo"),
        FeeAmountInKobo: Joi.number().optional().label("FeeAmountInKobo"),
        destinationAccountName: Joi.string().optional().label("destinationAccountName"),
        DestinationAccountName: Joi.string().optional().label("DestinationAccountName"),
        bankCode: Joi.string().optional().label("bankCode"),
        nameEnquirySessionId: Joi.string().optional().label("nameEnquirySessionId"),
        bank: Joi.object().optional().label("bank"),
        beneficiary: Joi.object().optional().label("beneficiary"),
        accountName: Joi.string().optional().label("accountName"),
        amount: Joi.string().optional().label("amount"),
        Narration: Joi.string().optional().allow('').label("Narration"),
        narration: Joi.string().optional().allow('').label("narration"),
        saveAsBeneficiary: Joi.boolean().optional().label("saveAsBeneficiary"),
      })
    ).required().label("BeneficiaryPaymentData"),
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
  public async resetAccountPin(req: Request) {
    const account = await this.doAccountPinReset(req);

    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: "Pin changed successfully",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async updateAccount(req: Request) {
    await this.doUpdateAccount(req);
  
    const response: HttpResponse<PartnerAccount> = {
      code: HttpStatus.OK.code,
      message: "Email updated successfully"
    };

    return Promise.resolve(response);
  }

  private async doUpdateAccount(req: Request) {

    const userId = req.user.id;

    const { error, value } = Joi.object({
      email: Joi.string().email().required().label('email'),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
          "string.pattern.base": `Password does not meet requirement.`,
        })
        .required()
        .label("password"),
    }).validate(req.body);
  
    if (error) {
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );
    }
  
    // Verify password first
    const findUser = await dataSources.userDAOService.findById(userId)

    if(!findUser)
      return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
  
    const hash = findUser.password;
    const password = value.password;

    const isMatch = await this.passwordEncoded.match(
      password.trim(),
      hash.trim()
    );
  
    if (!isMatch) {
      return Promise.reject(
        CustomAPIError.response(
          "Password is incorrect",
          HttpStatus.BAD_REQUEST.code
        )
      );
    }

    const user_email = await dataSources.userDAOService.findByAny({
      where: {email: value.email}
    });

    if(value.email && findUser.email !== value.email){
        if(user_email) {
          return Promise.reject(CustomAPIError.response('User with this email already exists', HttpStatus.NOT_FOUND.code))
        }
    };

    const userEmail: Partial<User> = {
      email: value.email
    }

    await dataSources.userDAOService.update(findUser, userEmail as InferAttributes<User>);

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
  public async initiateBulkAccountTransfer(req: Request) {
    const account = await this.doInitiateBulkTransfer(req);

    const response: HttpResponse<typeof account> = {
      code: HttpStatus.OK.code,
      message: "Transaction successful",
      result: account,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN])
  public async performBulkNameEnquiry(req: Request) {
    const account = await this.doPerformBulkNameEnquiry(req);

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

    partner.isAccountProvisioned = "false";

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

    partner.isAccountProvisioned = "true";

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

    // eslint-disable-next-line promise/catch-or-return
    const mailDataIndividual: MailgunMessageData = {
      to: settings.mailer.customerSupport,
      from: settings.mailer.from,
      subject: "Account activation requested",
      template: "partner_account_activation_request",
      "h:X-Mailgun-Variables": JSON.stringify({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        email: req.user.email,
      }),
    };

    QueueManager.dispatch({ queue: MAIL_QUEUE_EVENTS.name, data: req.user.accountType === 'individual' ? mailDataIndividual : mailData });

    return response;
  }

  private async doPerformBulkNameEnquiry(req: Request) {
    const { error, value } = Joi.object<appModels.BulkNameEnquiryDTO>(
      performBulkNameEnquirySchema
    ).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );

    let payload = [];
    for(const data of value.Data) {
      payload.push({
        AccountNumber: data.AccountNumber,
        BankCode: data.BankCode
      })
    }

    //@ts-ignore
    return this.bankService.performBulkNameEnquiry(payload);
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

    const expense = await dataSources.expenseDAOService.findById(value.expenseId as number);
    if(expense) {
      await dataSources.expenseDAOService.update(expense, { status: 'PAID', reference: response.requestReference } as any)
    }
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

  private async doInitiateBulkTransfer(req: Request) {

      const { error, value } = Joi.object<appModels.BulkAccountTransferDTO>(
        bulkAccountTransferSchema
      ).validate(req.body);

      if (error) {
        throw CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        );
      }
  
      const partnerAccount = await dataSources.partnerAccountDaoService.findByAny({
        where: {
          partnerId: req.user.partner.id,
        },
      });
  
      if (!partnerAccount) {
        throw CustomAPIError.response(
          "Account not found",
          HttpStatus.BAD_REQUEST.code
        );
      };

      const isMatch = await this.passwordEncoded.match(
        value.pin,
        partnerAccount.pin.trim()
      );
  
      if (!isMatch) {
        throw CustomAPIError.response("PIN is invalid", HttpStatus.BAD_REQUEST.code);
      }
  
      let totalAmountInKobo = 0;
      let beneficiaryPaymentData: any = [];

      for (const data of value.BeneficiaryPaymentData) {
        const transferChargeFee = +settings.kuda.transferChargeFee;
        const amountInKobo = data.amount * 100;
        data.FeeAmountInKobo = transferChargeFee;
        data.DestinationAccountName = data.accountName as string;
        data.AmountInKobo = amountInKobo;
        data.bankCode = data.bank?.value;
        data.Narration = data.narration;
        data.nameEnquirySessionId = data.nameEnquirySessionId;
  
        if (data.saveAsBeneficiary) {
          const beneficiary = await dataSources.beneficiaryDAOService.findByAny({
            where: {
              accountNumber: data.accountNumber,
            },
          });
  
          if (!beneficiary) {
            await dataSources.beneficiaryDAOService.create({
              name: data.accountName as string,
              accountName: data.accountName as string,
              accountNumber: data.accountNumber,
              bankCode: data.bank.value,
              partnerId: req.user.partner.id,
              bankName: data.bank.label as string,
            });
          }
        }

        if(data.accountNumber === partnerAccount.accountNumber) {
          throw CustomAPIError.response("One of the recipient accounts includes the sender's account; please remove it.", HttpStatus.BAD_REQUEST.code);
        }
  
        totalAmountInKobo += +data.amount;
        beneficiaryPaymentData.push({
          FeeAmountInKobo: data.FeeAmountInKobo,
          DestinationAccountName: data.DestinationAccountName,
          AmountInKobo: data.AmountInKobo,
          bankCode: data.bankCode,
          Narration: data.Narration,
          nameEnquirySessionId: data.nameEnquirySessionId,
          accountNumber: data.accountNumber
        });
      }
  
      const trackingReference = partnerAccount.accountRef;
      const clientAccountNumber = settings.client_account_number;
      const totalAmount = (totalAmountInKobo * 100).toString();
      const notificationEmail = partnerAccount.email;
  
      const response = await this.bankService.initiateBulkTransfer({
        // ...value,
        BeneficiaryPaymentData: beneficiaryPaymentData,
        TrackingReference: trackingReference,
        ClientAccountNumber: clientAccountNumber,
        TotalAmount: totalAmount,
        NotificationEmail: notificationEmail,
        narration: value.narration,
        pin: value.pin
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
      businessName: req.user.accountType === 'individual' ? `${req.user.firstName} ${req.user.lastName}` : value.businessName,
      partnerId: req.user.partnerId,
      pin: value.pin,
      nin: value.nin,
    });

    partner.isAccountProvisioned = "true";

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

  private async doAccountPinReset(req: Request) {
    const { error, value } = Joi.object<
      PartnerAccountSchemaType & { resetCode: string }
    >($resetPartnerAccountPinSchema).validate(req.body);

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
    
    const user = await dataSources.userDAOService.findByAny({
      where: { email: account.email }
    })

    if(user?.resetCode !== value.resetCode) {
      return Promise.reject(CustomAPIError.response(
        "Reset code is not correct", HttpStatus.BAD_REQUEST.code
      ))
    }

    user.resetCode = "";
    await user.save();

    account.pin = await this.passwordEncoded.encode(value.pin);
    await account.save();

    return null;
  }
}

export default CBAController;
