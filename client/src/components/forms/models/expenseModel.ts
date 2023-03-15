import { IBeneficiary, IExpenseCategory, IExpenseType, IInvoice } from '@app-models';

export interface IExpenseValues {
  beneficiary: IBeneficiary;
  invoice: IInvoice;
  category: IExpenseCategory;
  type: IExpenseType;
  amount: number;
  reference: string | null;
  date: string;
}

export interface IBeneficiaryValue {
  name: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
}
