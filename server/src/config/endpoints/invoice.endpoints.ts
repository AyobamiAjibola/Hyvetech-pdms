import {
  completeEstimateDepositHandler,
  generateInvoiceHandler,
  getInvoicesHandler,
  updateCompletedInvoicePaymentHandler,
} from '../../routes/invoiceRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const invoiceEndpoints: RouteEndpoints = [
  {
    name: 'complete estimate deposit',
    method: 'post',
    path: '/transactions/complete-estimate-deposit',
    handler: completeEstimateDepositHandler,
  },
  {
    name: 'generate invoice',
    method: 'post',
    path: '/transactions/generate-invoice',
    handler: generateInvoiceHandler,
  },
  {
    name: 'update completed invoice payment',
    method: 'patch',
    path: '/transactions/update-completed-invoice-payment',
    handler: updateCompletedInvoicePaymentHandler,
  },
  {
    name: 'get invoices',
    method: 'get',
    path: '/invoices',
    handler: getInvoicesHandler,
  },
];

export default invoiceEndpoints;
