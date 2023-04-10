import React, { useCallback, useEffect, useMemo } from 'react';
import { IInvoice } from '@app-models';
import { Chip, Grid, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit } from '@mui/icons-material';
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
import { formatNumberToIntl } from '../../utils/generic';

function InvoicesPage() {
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const transactionReducer = useAppSelector(state => state.transactionReducer);
  const dispatch = useAppDispatch();

  const invoice = useInvoice();
  const navigate = useNavigate();
  const { isTechAdmin, isSuperAdmin } = useAdmin();
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

  const superAdminColumns = useMemo(() => {
    return [
      {
        field: 'createdAt',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        width: 150,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
        sortingOrder: ['desc'],
      },
      {
        field: 'code',
        headerName: 'Invoice #',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        type: 'number',
        width: 100,
      },
      {
        field: 'name',
        headerName: 'Name of workshop',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          const partner = param.row.estimate?.partner;

          return partner ? `${partner?.name}` : '';
        },
      },
      {
        field: 'fullName',
        headerName: 'Customer Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 150,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const customer = estimate?.customer;

          return `${customer?.firstName || ''} ${customer?.lastName || ''}`;
        },
      },
      // {
      //   field: 'updateStatus',
      //   headerName: 'Update Status',
      //   headerAlign: 'center',
      //   align: 'center',
      //   sortable: true,
      //   type: 'string',
      //   width: 180,
      //   renderCell: params => {
      //     return params.row.updateStatus === INVOICE_STATUS.update.sent ? (
      //       <Chip label={INVOICE_STATUS.update.sent} size="small" color="success" />
      //     ) : params.row.updateStatus === INVOICE_STATUS.update.draft ? (
      //       <Chip label={INVOICE_STATUS.update.draft} size="small" color="info" />
      //     ) : params.row.updateStatus === INVOICE_STATUS.update.refund ? (
      //       <Chip label={INVOICE_STATUS.update.refund} size="small" color="error" />
      //     ) : null;
      //   },
      // },
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
          const vehicle = estimate?.vehicle;

          return vehicle ? `${vehicle?.modelYear} ${vehicle?.make} ${vehicle?.model} (${vehicle?.plateNumber})` : '';
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
        headerName: 'Amount Paid',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 150,
        sortable: true,
      },
      // {
      //   field: 'dueAmount',
      //   headerName: 'Due Amount',
      //   headerAlign: 'center',
      //   align: 'center',
      //   type: 'number',
      //   width: 150,
      //   sortable: true,
      //   valueFormatter: ({ value }) => {
      //     return value ? (Math.sign(value) === -1 ? 0 : value) : 0;
      //   },
      // },
      {
        field: 'updatedAt',
        headerName: 'Last Modified',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('LLL') : '-';
        },
        sortable: true,
      },
      // {
      //   field: 'actions',
      //   type: 'actions',
      //   headerAlign: 'center',
      //   align: 'center',
      //   getActions: (params: any) => [
      //     <GridActionsCellItem
      //       key={0}
      //       icon={<Visibility sx={{ color: 'dodgerblue' }} />}
      //       onClick={() => {
      //         void dispatch(getInvoicesAction());
      //         const invoice = params.row as IInvoice;
      //         const estimate = invoice.estimate;

      //         navigate(`/invoices/${invoice.id}`, { state: { invoice, estimate } });
      //       }}
      //       label="View"
      //       showInMenu={false}
      //     />,
      //     <GridActionsCellItem
      //       key={2}
      //       icon={<Edit sx={{ display: isTechAdmin ? 'block' : 'none', color: 'limegreen' }} />}
      //       disabled={!isTechAdmin}
      //       onClick={() => {
      //         const _invoice = params.row as IInvoice;

      //         invoice.onEdit(_invoice.id);
      //       }}
      //       label="Edit"
      //       showInMenu={false}
      //     />,
      //     <GridActionsCellItem
      //       key={2}
      //       icon={<Cancel sx={{ color: 'indianred' }} />}
      //       onClick={() => {
      //         //
      //       }}
      //       label="Delete"
      //       showInMenu={false}
      //     />,
      //   ],
      // },
    ] as GridColDef<IInvoice>[];
  }, [dispatch, invoice, isSuperAdmin, navigate]);

  const techColumns = useMemo(() => {
    return [
      // {
      //   field: 'updateStatus',
      //   headerName: 'Update Status',
      //   headerAlign: 'center',
      //   align: 'center',
      //   sortable: true,
      //   type: 'string',
      //   width: 180,
      //   renderCell: params => {
      //     return params.row.updateStatus === INVOICE_STATUS.update.sent ? (
      //       <Chip label={INVOICE_STATUS.update.sent} size="small" color="success" />
      //     ) : params.row.updateStatus === INVOICE_STATUS.update.draft ? (
      //       <Chip label={INVOICE_STATUS.update.draft} size="small" color="info" />
      //     ) : params.row.updateStatus === INVOICE_STATUS.update.refund ? (
      //       <Chip label={INVOICE_STATUS.update.refund} size="small" color="error" />
      //     ) : null;
      //   },
      // },
      {
        field: 'createdAt',
        headerName: 'Date',
        headerAlign: 'center',
        align: 'center',
        width: 100,
        type: 'string',
        valueFormatter: ({ value }) => {
          return value ? moment(value).format('DD/MM/YYYY') : '-';
        },
        sortable: true,
      },
      {
        field: 'code',
        headerName: 'Invoice #',
        headerAlign: 'center',
        align: 'center',
        sortable: true,
        width: 100,
        type: 'string',
        renderCell: params => {
          return (
            <span
              style={{ color: 'skyblue', cursor: 'pointer' }}
              onClick={() => {
                void dispatch(getInvoicesAction());
                const invoice = params.row as IInvoice;
                const estimate = invoice.estimate;

                navigate(`/invoices/${invoice.id}`, { state: { invoice, estimate } });
              }}>
              {params.row.code}
            </span>
          );
        },
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 200,
        sortable: true,
        valueGetter: param => {
          console.log(param)
          const estimate = param.row.estimate;
          const customer = estimate?.customer;

          return `${customer?.firstName || ''} ${customer?.lastName || ''}`;
        },
      },
      {
        field: 'model',
        headerName: 'Vehicle',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        width: 170,
        sortable: true,
        valueGetter: param => {
          const estimate = param.row.estimate;
          const vehicle = estimate?.vehicle;

          return vehicle ? `${vehicle?.modelYear} ${vehicle?.make} ${vehicle?.model} (${vehicle?.plateNumber})` : '';
        },
      },
      {
        field: 'grandTotal',
        headerName: 'Grand Total',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 120,
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? (Math.sign(value) === -1 ? 0 : formatNumberToIntl(value)) : 0;
        }
      },
      {
        field: 'depositAmount',
        headerName: 'Amount Paid',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? (Math.sign(value) === -1 ? 0 : formatNumberToIntl(value)) : 0;
        }
      },
      {
        field: 'dueAmount',
        headerName: 'Receivable',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? (Math.sign(value) === -1 ? 0 : formatNumberToIntl(value)) : 0;
        },
      },
      {
        field: 'refundable',
        headerName: 'Refund Due',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        width: 100,
        sortable: true,
        valueFormatter: ({ value }) => {
          return value ? (Math.sign(value) === -1 ? 0 : formatNumberToIntl(value)) : 0;
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        headerAlign: 'center',
        align: 'center',
        width: 100,
        sortable: true,
        type: 'string',
        renderCell: params => {
          return params.row.status === INVOICE_STATUS.paid ? (
            <Chip label={"Fully Paid"} size="small" color="success" />
          ) : ((params.row.status === INVOICE_STATUS.deposit) && (params.row.depositAmount != 0) ) ? (
            <Chip label={ (params.row.depositAmount != 0) ? "Partially Paid" : ""} size="small" color="warning" />
          ) : (params.row.status === INVOICE_STATUS.deposit && (params.row.depositAmount == 0)) ? (
            <Chip label={ (params.row.depositAmount != 0) ? "" : "Not Paid"} size="small" color="error" />
          ) : params.row.status === INVOICE_STATUS.overDue ? (
            <Chip label={INVOICE_STATUS.overDue} size="small" color="error" />
          ) : null;
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: (params: any) => [
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
  }, [dispatch, invoice, isTechAdmin, navigate]);

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
            // columns={columns}
            columns={isTechAdmin ? techColumns :
                      isSuperAdmin ? superAdminColumns : []
                    }
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
      {invoice.showEdit && (
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
              validateOnChange
              enableReinitialize>
              <InvoiceForm
                showEdit={invoice.showEdit}
                setLabourTotal={invoice.setLabourTotal}
                setPartTotal={invoice.setPartTotal}
                setGrandTotal={invoice.setGrandTotal}
                setDiscount={invoice.setDiscount}
                setDiscountType={invoice.setDiscountType}
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
          onClose={() => invoice.handleCloseEdit()}
        />
      )}
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
