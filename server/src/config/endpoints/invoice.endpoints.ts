import {
  completeEstimateDepositHandler,
  generateInvoiceHandler,
  getInvoicesHandler,
  saveInvoiceHandler,
  sendInvoiceHandler,
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

  {
    name: 'save invoice',
    method: 'patch',
    path: '/invoices/save',
    handler: saveInvoiceHandler,
  },

  {
    name: 'send invoice',
    method: 'patch',
    path: '/invoices/send',
    handler: sendInvoiceHandler,
  },
];

export default invoiceEndpoints;
