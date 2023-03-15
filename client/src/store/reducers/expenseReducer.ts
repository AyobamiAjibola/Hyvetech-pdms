import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';

import { IBeneficiary, IExpense, IExpenseCategory, IExpenseType } from '@app-models';
import {
  createBeneficiaryAction,
  createExpenseAction,
  getBeneficiariesAction,
  getExpenseCategories,
  getExpensesAction,
  getExpenseTypesActions,
} from '../actions/expenseAction';

interface IExpenseState {
  createEstimateStatus: IThunkAPIStatus;
  createEstimateSuccess: string;
  createEstimateError?: string;

  createExpenseError: string;
  createExpenseStatus: IThunkAPIStatus;
  createExpenseSuccess: string;

  createBeneficiaryError: string;
  createBeneficiaryStatus: IThunkAPIStatus;
  createBeneficiarySuccess: string;

  saveEstimateStatus: IThunkAPIStatus;
  saveEstimateSuccess: string;
  saveEstimateError?: string;

  updateEstimateStatus: IThunkAPIStatus;
  updateEstimateSuccess: string;
  updateEstimateError?: string;

  deleteEstimateStatus: IThunkAPIStatus;
  deleteEstimateSuccess: string;
  deleteEstimateError: string;

  sendDraftEstimateStatus: IThunkAPIStatus;
  sendDraftEstimateSuccess: string;
  sendDraftEstimateError?: string;

  getExpensesStatus: IThunkAPIStatus;
  getExpenseSuccess: string;
  getExpenseError?: string;

  expense: IExpense | null;
  expenses: IExpense[];

  beneficiary: IBeneficiary | null;
  beneficiaries: IBeneficiary[];

  expenseTypes: IExpenseType[];
  expenseCategories: IExpenseCategory[];
}

const initialState: IExpenseState = {
  createEstimateError: '',
  createEstimateStatus: 'idle',
  createEstimateSuccess: '',

  createExpenseError: '',
  createExpenseStatus: 'idle',
  createExpenseSuccess: '',

  createBeneficiaryError: '',
  createBeneficiaryStatus: 'idle',
  createBeneficiarySuccess: '',

  saveEstimateError: '',
  saveEstimateStatus: 'idle',
  saveEstimateSuccess: '',

  updateEstimateError: '',
  updateEstimateStatus: 'idle',
  updateEstimateSuccess: '',

  deleteEstimateError: '',
  deleteEstimateStatus: 'idle',
  deleteEstimateSuccess: '',

  sendDraftEstimateError: '',
  sendDraftEstimateStatus: 'idle',
  sendDraftEstimateSuccess: '',

  getExpenseError: '',
  getExpensesStatus: 'idle',
  getExpenseSuccess: '',

  expenses: [],
  expense: null,

  beneficiary: null,
  beneficiaries: [],

  expenseTypes: [],
  expenseCategories: [],
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearCreateEspenseStatus(state: IExpenseState) {
      state.createExpenseStatus = 'idle';
      state.createExpenseSuccess = '';
      state.createExpenseError = '';
    },

    clearCreateBeneficiaryStatus(state: IExpenseState) {
      state.createBeneficiaryStatus = 'idle';
      state.createBeneficiarySuccess = '';
      state.createBeneficiaryError = '';
    },
    clearUpdateExpenseStatus(state: IExpenseState) {
      state.updateEstimateStatus = 'idle';
      state.updateEstimateSuccess = '';
      state.updateEstimateError = '';
    },

    clearDeleteExpenseStatus(state: IExpenseState) {
      state.deleteEstimateStatus = 'idle';
      state.deleteEstimateSuccess = '';
      state.deleteEstimateError = '';
    },
    clearGetExpenseStatus(state: IExpenseState) {
      state.getExpensesStatus = 'idle';
      state.getExpenseSuccess = '';
      state.getExpenseError = '';
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getExpensesAction.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpensesAction.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenses = action.payload.results as IExpense[];
      })
      .addCase(getExpensesAction.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getBeneficiariesAction.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getBeneficiariesAction.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.beneficiaries = action.payload.results as IBeneficiary[];
      })
      .addCase(getBeneficiariesAction.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getExpenseCategories.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpenseCategories.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenseCategories = action.payload.results as IExpenseCategory[];
      })
      .addCase(getExpenseCategories.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(getExpenseTypesActions.pending, state => {
        state.getExpensesStatus = 'loading';
      })
      .addCase(getExpenseTypesActions.fulfilled, (state, action) => {
        state.getExpensesStatus = 'completed';
        state.getExpenseSuccess = action.payload.message;
        state.expenseTypes = action.payload.results as IExpenseType[];
      })
      .addCase(getExpenseTypesActions.rejected, (state, action) => {
        state.getExpensesStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(createExpenseAction.pending, state => {
        state.createExpenseStatus = 'loading';
      })
      .addCase(createExpenseAction.fulfilled, (state, action) => {
        state.createExpenseStatus = 'completed';
        state.createExpenseSuccess = action.payload.message;
        state.expense = action.payload.result as IExpense;
      })
      .addCase(createExpenseAction.rejected, (state, action) => {
        state.createExpenseStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });

    builder
      .addCase(createBeneficiaryAction.pending, state => {
        state.createBeneficiaryStatus = 'loading';
      })
      .addCase(createBeneficiaryAction.fulfilled, (state, action) => {
        state.createBeneficiaryStatus = 'completed';
        state.createBeneficiarySuccess = action.payload.message;
        state.expense = action.payload.result as IExpense;
      })
      .addCase(createBeneficiaryAction.rejected, (state, action) => {
        state.createBeneficiaryStatus = 'failed';

        if (action.payload) {
          state.getExpenseError = action.payload.message;
        } else state.getExpenseError = action.error.message;
      });
  },
});

export const {
  clearCreateEspenseStatus,
  clearDeleteExpenseStatus,
  clearCreateBeneficiaryStatus,
  clearGetExpenseStatus,
  clearUpdateExpenseStatus,
} = expenseSlice.actions;

export default expenseSlice.reducer;
