import { IBeneficiary, IExpenseCategory, IExpenseType, IInvoice } from '@app-models';

export interface IExpenseValues {
  beneficiary: IBeneficiary;
  invoice: IInvoice | null;
  category: IExpenseCategory;
  type: IExpenseType;
  amount: number;
  reference: string | null;
  note: string | null;
  dateModified: any;
}

export interface IBeneficiaryValue {
  name: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
}

export interface IExpenseUpdateValue {
  reference: string;
  id: number | null;
}

export interface IExpenseUpdateDetailValue {
  note: string;
}
