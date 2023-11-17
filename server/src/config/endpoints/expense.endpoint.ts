import { dashboardHandler } from '../../routes/dashboardRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import {
  createBeneficiaryHandler,
  createExpense,
  createExpenseCategoryHandler,
  createExpenseTypeHandler,
  deleteBeneficiaryHandler,
  deleteExpenseHandler,
  getAllBeneficiaries,
  getAllExpenseCategories,
  getAllExpenses,
  getAllExpensesById,
  getAllExpenseTypes,
  updateExpenseDetailsHandler,
  updateExpenseHandler,
} from '../../routes/expenseRoute';

const expenseEndpoints: RouteEndpoints = [
  {
    name: 'expense',
    method: 'get',
    path: '/expenses',
    handler: getAllExpenses,
  },
  {
    name: 'expense',
    method: 'get',
    path: '/expense/:id',
    handler: getAllExpensesById,
  },
  {
    name: 'expense',
    method: 'patch',
    path: '/expense',
    handler: updateExpenseHandler,
  },
  {
    name: 'expense',
    method: 'patch',
    path: '/expense/:id',
    handler: updateExpenseDetailsHandler,
  },
  {
    name: 'expense',
    method: 'delete',
    path: '/expense/:id',
    handler: deleteExpenseHandler,
  },
  {
    name: 'beneficiary',
    method: 'delete',
    path: '/beneficiary/:beneficiaryId',
    handler: deleteBeneficiaryHandler,
  },
  {
    name: 'expense',
    method: 'post',
    path: '/expense/create',
    handler: createExpense,
  },
  {
    name: 'expense',
    method: 'post',
    path: '/beneficiary/create',
    handler: createBeneficiaryHandler,
  },
  {
    name: 'expense',
    method: 'get',
    path: '/beneficiaries',
    handler: getAllBeneficiaries,
  },
  {
    name: 'expense',
    method: 'get',
    path: '/expense-types',
    handler: getAllExpenseTypes,
  },
  {
    name: 'expense',
    method: 'post',
    path: '/expense-type/create',
    handler: createExpenseTypeHandler,
  },
  {
    name: 'expense',
    method: 'get',
    path: '/expense-categories',
    handler: getAllExpenseCategories,
  },
  {
    name: 'expense',
    method: 'post',
    path: '/expense-category/create',
    handler: createExpenseCategoryHandler,
  },
];
export default expenseEndpoints;
