import {
  completeEstimateDepositHandler,
  generateInvoiceHandler,
  generateInvoiceManuallyHandler,
  getInvoicesHandler,
  saveInvoiceHandler,
  sendInvoiceHandler,
  updateCompletedInvoicePaymentHandler,
  updateCompletedInvoicePaymentManuallyHandler,
  getSingleInvoiceHandler,
  deleteInvoiceHandler,
  updateItemPaymentManuallyHandler,
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
    name: 'generate invoice manually',
    method: 'post',
    path: '/transactions/generate-invoice-manually',
    handler: generateInvoiceManuallyHandler,
  },
  {
    name: 'update completed invoice payment',
    method: 'patch',
    path: '/transactions/update-completed-invoice-payment',
    handler: updateCompletedInvoicePaymentHandler,
  },
  {
    name: 'update completed invoice payment manually',
    method: 'post',
    path: '/transactions/update-invoice-payment-manually',
    handler: updateCompletedInvoicePaymentManuallyHandler,
  },
  {
    name: 'update completed item payment manually',
    method: 'post',
    path: '/transactions/update-item-payment-manually',
    handler: updateItemPaymentManuallyHandler,
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
  {
    name: 'get invoice',
    method: 'get',
    path: '/invoice/:id',
    handler: getSingleInvoiceHandler,
  },
  {
    name: 'delete invoice',
    method: 'delete',
    path: '/invoice/:invoiceId',
    handler: deleteInvoiceHandler,
  },
];

export default invoiceEndpoints;
