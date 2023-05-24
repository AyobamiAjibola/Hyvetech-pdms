declare module '@cba-models' {
  interface AccountDTO {
    email: string;
    phoneNumber: string;
    lastName: string;
    firstName: string;
    id?: string;
  }

  interface AccountResponseDTO {
    accountNumber: string;
  }

  interface PaginationDTO {
    pageSize: number;
    pageNumber: number;
  }

  interface AccountBalanceDTO {
    ledgerBalance: number;
    availableBalance: number;
    withdrawableBalance: number;
  }

  interface AccountTransactionLogDTO {
    accountId: string;
    page: PaginationDTO;
  }

  interface PostingEntry {
    ReferenceNumber: string;
    ReversalReferenceNumber: string;
    AccountNumber: string;
    LinkedAccountNumber: string;
    RealDate: string;
    Amount: number;
    OpeningBalance: number;
    BalanceAfter: number;
    Narration: string;
    InstrumentNumber: string;
    PostingRecordType: string;
    PostedBy: string;
  }
}
