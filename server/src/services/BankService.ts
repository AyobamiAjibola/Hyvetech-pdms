import Joi from "joi";

export default interface BankService {
  createAccount: (payload: AccountDTO) => Promise<AccountResponseDTO>;
  getAllAccount: (payload: PaginationDTO) => Promise<AccountDTO[]>;
  getMainAccountBalance: () => Promise<AccountBalanceDTO>;
  getVirtualAccountBalance: (accountId: string) => Promise<AccountBalanceDTO>;

  getBanks: () => Promise<Bank[]>;

  getAccountTransactionLog: (
    payload: AccountTransactionLogDTO
  ) => Promise<AccountTransactionsResponseDTO>;

  getMainAccountTransactionLog: (
    payload: AccountTransactionLogDTO
  ) => Promise<AccountTransactionsResponseDTO>;

  performNameEnquiry: (payload: ConfirmRecipientDTO) => Promise<AccountHolder>;

  updateAccount: (payload: AccountUpdateDTO) => Promise<AccountResponseDTO>;

  intiateTransfer: (
    payload: AccountTransferDTO
  ) => Promise<AccountTransferResponseDTO>;
}

export interface Bank {
  bankName: string;
  bankCode: string;
}

export interface AccountDTO {
  email: string;
  phoneNumber: string;
  businessName?: string;
  lastName: string;
  firstName: string;
  trackingReference?: string;
  id?: string;
}

export interface AccountUpdateDTO {
  email?: string;
  businessName?: string;
  lastName?: string;
  firstName?: string;
  trackingReference: string;
}

export interface AccountResponseDTO {
  accountNumber: string;
}

export interface PaginationDTO {
  pageSize: number;
  pageNumber: number;
}

export interface AccountBalanceDTO {
  ledgerBalance: number;
  availableBalance: number;
  withdrawableBalance: number;
  accountNumber?: string;
  accountName?: string;
  accountProvider?: string;
  businessName: string;
}

export interface AccountTransactionLogDTO {
  accountId?: string;
  page?: PaginationDTO;
  startDate?: string;
  endDate?: string;
}

export interface PostingEntry {
  referenceNumber: string;
  reversalReferenceNumber: string;
  accountNumber: string;
  linkedAccountNumber: string;
  realDate: string;
  amount: number;
  openingBalance: number;
  balanceAfter: number;
  narration: string;
  instrumentNumber: string;
  postingRecordType: string;
  postedBy: string;
}

export interface AccountTransactionsResponseDTO {
  postingsHistory: PostingEntry[];
  totalRecordInStore: number;
  totalDebit: number;
  totalCredeit: number;
  statusCode: string;
  message: string;
}

export interface ConfirmRecipientDTO {
  beneficiaryAccountNumber: string;
  beneficiaryBankCode: string;
  senderTrackingReference: string;
  isRequestFromVirtualAccount: string;
}

export interface AccountHolder {
  beneficiaryAccountNumber: string;
  beneficiaryName: string;
  senderAccountNumber: string;
  senderName: string;
  beneficiaryCustomerID: number;
  beneficiaryBankCode: string;
  nameEnquiryID: string;
  responseCode: string;
  transferCharge: number;
  sessionID: string;
}

export interface AccountTransferDTO {
  trackingReference?: string;
  beneficiaryAccount: string;
  amount: number;
  narration: string;
  beneficiaryBankCode: string;
  beneficiaryName: string;
  senderName?: string;
  nameEnquiryId: string;
  clientFeeCharge?: number;
  saveAsBeneficiary?: boolean;
  bankName?: string;
  pin: string;
}

export interface AccountTransferResponseDTO {
  requestReference: string;
  transactionReference: string;
  responseCode: string;
  status: boolean;
  message: string;
  data: any;
}
