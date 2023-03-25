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
  accountName: string | null;
  bankName: string | null;
  accountNumber: string | null;
}

export interface IExpenseUpdateValue {
  reference: string;
  id: number | null;
}

export interface IExpenseUpdateDetailValue {
  id: number;
  note: string;
  amount: number | null;
  category: IExpenseCategory | null;
  type: IExpenseType | null;
  invoice: IInvoice | null;
  status: string;
  dateModified: any
}
