import React, { useCallback, useEffect, useMemo } from 'react';
import { IInvoice } from '@app-models';
import { Chip, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useInvoice from '../../hooks/useInvoice';
import AppModal from '../../components/modal/AppModal';
import { Formik } from 'formik';
import estimateModel from '../../components/forms/models/estimateModel';
import InvoiceForm from '../../components/forms/estimate/InvoiceForm';
import PaymentGateway from '../../components/modal/PaymentGateway';
import AppLoader from '../../components/loader/AppLoader';
import {
  resetInitRefundCustomerStatus,
  resetVerifyRefundCustomerStatus,
  setAuthorizationUrl,
  setOpenTransactionPopup,
} from '../../store/reducers/transactionReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import useRouterQuery from '../../hooks/useRouterQuery';
import { INVOICE_STATUS, LOCAL_STORAGE } from '../../config/constants';
import { verifyRefundCustomerAction } from '../../store/actions/transactionActions';
import useAdmin from '../../hooks/useAdmin';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { clearSaveInvoiceStatus, clearSendInvoiceStatus } from '../../store/reducers/invoiceReducer';

function InvoicesPage() {
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const transactionReducer = useAppSelector(state => state.transactionReducer);
  const dispatch = useAppDispatch();

  const invoice = useInvoice();
  const navigate = useNavigate();
  const { isTechAdmin } = useAdmin();
  const routerQuery = useRouterQuery();

  useEffect(() => {
    const reference = routerQuery.get('reference');
    const cancelPayment = routerQuery.get('pay_canceled');

    if (reference) {
      localStorage.setItem(LOCAL_STORAGE.referenceNumber, reference);
    }

    if (cancelPayment) {
      localStorage.setItem(LOCAL_STORAGE.payCancelled, cancelPayment);
    }
  }, [routerQuery]);

  const handleClosePaymentModal = useCallback(() => {
    dispatch(resetInitRefundCustomerStatus());
    dispatch(resetVerifyRefundCustomerStatus());
    dispatch(setOpenTransactionPopup(false));
  }, [dispatch]);

  const handleLocalStorage = useCallback(
    (ev: StorageEvent) => {
      if (ev.key === LOCAL_STORAGE.referenceNumber && ev.newValue && transactionReducer.invoiceId) {
        void dispatch(verifyRefundCustomerAction({ reference: ev.newValue, invoiceId: transactionReducer.invoiceId }));
      }

      if (ev.key === LOCAL_STORAGE.payCancelled && ev.newValue) {
        handleClosePaymentModal();
      }
    },
    [dispatch, handleClosePaymentModal, transactionReducer.invoiceId],
  );

  useEffect(() => {
    window.addEventListener('storage', handleLocalStorage);

    return () => {
      window.removeEventListener('storage', handleLocalStorage);
    };
  }, [handleLocalStorage]);

  useEffect(() => {
    if (transactionReducer.verifyRefundCustomerStatus === 'completed') {
      localStorage.removeItem(LOCAL_STORAGE.referenceNumber);
      localStorage.removeItem(LOCAL_STORAGE.payCancelled);
      handleClosePaymentModal();
      dispatch(getInvoicesAction());
    }
  }, [
    dispatch,
    handleClosePaymentModal,
    transactionReducer.authorizationUrl,
    transactionReducer.verifyRefundCustomerStatus,
  ]);

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'number',
      },
      {
        field: 'code',
        headerName: 'Code',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'number',
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 250,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const customer = estimate.customer;

          return `${customer.firstName} ${customer.lastName}`;
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        renderCell: params => {
          return params.row.status === INVOICE_STATUS.paid ? (
            <Chip label={INVOICE_STATUS.paid} size="small" color="success" />
          ) : params.row.status === INVOICE_STATUS.deposit ? (
            <Chip label={INVOICE_STATUS.deposit} size="small" color="warning" />
          ) : params.row.status === INVOICE_STATUS.overDue ? (
            <Chip label={INVOICE_STATUS.overDue} size="small" color="error" />
          ) : null;
        },
      },
      {
        field: 'updateStatus',
        headerName: 'Update Status',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'string',
        width: 180,
        renderCell: params => {
          return params.row.updateStatus === INVOICE_STATUS.update.sent ? (
            <Chip label={INVOICE_STATUS.update.sent} size="small" color="success" />
          ) : params.row.updateStatus === INVOICE_STATUS.update.draft ? (
            <Chip label={INVOICE_STATUS.update.draft} size="small" color="info" />
          ) : params.row.updateStatus === INVOICE_STATUS.update.refund ? (
            <Chip label={INVOICE_STATUS.update.refund} size="small" color="error" />
          ) : null;
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const customer = estimate.customer;

          return `${customer.phone}`;
        },
      },
      {
        field: 'model',
        headerName: 'Vehicle',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const vehicle = estimate.vehicle;

          return `${vehicle.modelYear} ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`;
        },
      },
      {
        field: 'grandTotal',
        headerName: 'Grand Total',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'depositAmount',
        headerName: 'Deposit Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'dueAmount',
        headerName: 'Due Amount',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).utc(false).format('LLL') : '-';
        },
        sortable: true,
      },
      {
        field: 'updatedAt',
        headerName: 'Modified Date',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).utc(false).format('LLL') : '-';
        },
        sortable: true,
      },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => [
          <GridActionsCellItem
            key={0}
            icon={<Visibility sx={{ color: 'dodgerblue' }} />}
            onClick={() => {
              const invoice = params.row as IInvoice;
              const estimate = invoice.estimate;

              navigate(`/invoices/${invoice.id}`, { state: { invoice, estimate } });
            }}
            label="View"
            showInMenu={false}
          />,
          <GridActionsCellItem
            key={2}
            icon={<Edit sx={{ display: isTechAdmin ? 'block' : 'none', color: 'limegreen' }} />}
            disabled={!isTechAdmin}
            onClick={() => {
              const _invoice = params.row as IInvoice;

              invoice.onEdit(_invoice.id);
            }}
            label="Edit"
            showInMenu={false}
          />,
          <GridActionsCellItem
            key={2}
            icon={<Cancel sx={{ color: 'indianred' }} />}
            onClick={() => {
              //
            }}
            label="Delete"
            showInMenu={false}
          />,
        ],
      },
    ] as GridColDef<IInvoice>[];
  }, [invoice, isTechAdmin, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearSaveInvoiceStatus());
      dispatch(clearSendInvoiceStatus());
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" gutterBottom>
            Invoices
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <AppDataGrid
            rows={invoice.invoices}
            columns={columns}
            showToolbar
            loading={invoiceReducer.getInvoicesStatus === 'loading'}
          />
        </Grid>
      </Grid>
      <AppAlert
        alertType="success"
        show={undefined !== invoice.success}
        message={invoice.success?.message}
        onClose={() => invoice.setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== invoice.error}
        message={invoice.error?.message}
        onClose={() => invoice.setError(undefined)}
      />
      <AppModal
        fullWidth
        fullScreen
        show={invoice.showEdit}
        Content={
          <Formik
            initialValues={invoice.initialValues}
            validationSchema={estimateModel.schema}
            onSubmit={values => {
              if (invoice.save) invoice.handleSaveInvoice(values);
              if (!invoice.save) invoice.handleSendInvoice(values);
            }}
            enableReinitialize>
            <InvoiceForm
              showEdit={invoice.showEdit}
              setLabourTotal={invoice.setLabourTotal}
              setPartTotal={invoice.setPartTotal}
              setGrandTotal={invoice.setGrandTotal}
              labourTotal={invoice.labourTotal}
              partTotal={invoice.partTotal}
              grandTotal={invoice.grandTotal}
              dueBalance={invoice.dueBalance}
              setDueBalance={invoice.setDueBalance}
              refundable={invoice.refundable}
              setRefundable={invoice.setRefundable}
              showRefund={invoice.showRefund}
              setShowRefund={invoice.setShowRefund}
              onInitiateRefund={invoice.handleInitiateRefund}
              setSave={invoice.setSave}
              invoice={invoice.invoice}
            />
          </Formik>
        }
        onClose={() => {
          invoice.setShowEdit(false);
          dispatch(getInvoicesAction());
        }}
      />
      <PaymentGateway
        show={transactionReducer.openTransactionPopup}
        authUrl={transactionReducer.authorizationUrl}
        onClose={() => {
          dispatch(setAuthorizationUrl(''));
          dispatch(resetInitRefundCustomerStatus());
          dispatch(resetVerifyRefundCustomerStatus());
          dispatch(setOpenTransactionPopup(false));
        }}
      />
      <AppLoader show={transactionReducer.initRefundCustomerStatus === 'loading'} />
      <AppLoader show={transactionReducer.verifyRefundCustomerStatus === 'loading'} />
    </React.Fragment>
  );
}

export default InvoicesPage;
