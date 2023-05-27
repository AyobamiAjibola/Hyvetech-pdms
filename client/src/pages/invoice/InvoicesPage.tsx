import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IInvoice } from '@app-models';
import { Box, Button, Chip, Collapse, DialogActions, DialogContentText, Grid, Paper, Typography } from '@mui/material';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAppSelector from '../../hooks/useAppSelector';
import AppAlert from '../../components/alerts/AppAlert';
import moment from 'moment';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Cancel, Edit, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
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
import { INVOICE_STATUS, LOCAL_STORAGE, MESSAGES } from '../../config/constants';
import { getpaymentRecievedAction, verifyRefundCustomerAction } from '../../store/actions/transactionActions';
import useAdmin from '../../hooks/useAdmin';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { clearDeleteInvoiceStatus, clearSaveInvoiceStatus, clearSendInvoiceStatus } from '../../store/reducers/invoiceReducer';
import { formatNumberToIntl, reload } from '../../utils/generic';
import { CustomHookMessage } from '@app-types';
import { getExpensesAction } from '../../store/actions/expenseAction';

function InvoicesPage() {
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const transactionReducer = useAppSelector(state => state.transactionReducer);
  const expenseReducer = useAppSelector(state => state.expenseReducer);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<CustomHookMessage>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [invDel, setInvDel] = useState<boolean>(false);
  const [closeEstimateModal, setCloseEstimateModal] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  const invoice = useInvoice();
  const navigate = useNavigate();
  const { isTechAdmin, isSuperAdmin } = useAdmin();
  const routerQuery = useRouterQuery();

  useEffect(() => {
    if(invoiceReducer.deleteInvoiceStatus === 'completed') {
      dispatch(clearDeleteInvoiceStatus())
        setSuccess({
            message: "Invoice Deleted Successfully"
        })

        reload()
    }

    if(invoiceReducer.deleteInvoiceStatus === 'failed') {
      dispatch(clearDeleteInvoiceStatus())
      if(invoiceReducer?.deleteInvoiceError === "transExpError") {
        setInvDel(true)
      }
    }

  }, [dispatch, invoiceReducer.deleteInvoiceStatus])

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
              {params.row.code.split('_')[0]}
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
            sx={{ display: isTechAdmin ? 'block' : 'none' }}
            key={2}
            icon={<Cancel sx={{ color: 'indianred' }} />}
            onClick={() => {
              const _invoice = params.row as IInvoice;
              invoice.onDelete(_invoice.id)
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

  const handleToggleShowReport = () => {
    setShowReport(() => {
      return !showReport;
    })
  };

  useEffect(() => {
    dispatch(getExpensesAction());
    dispatch(getpaymentRecievedAction())
  }, [dispatch]);

  const totalExpensesAmount = useMemo(() => {
    if (expenseReducer.getExpensesStatus === 'completed') {
      let amount = 0;
      expenseReducer.expenses.forEach((expense) => {
        amount += expense.amount;
      });
      return amount;
    }
    return 0;
  }, [expenseReducer.getExpensesStatus, expenseReducer.expenses]);

  const totalTransactionAmount = useMemo(() => {
    if (transactionReducer.getPaymentRecievedStatus === 'completed') {
      let amount = 0;
      transactionReducer.paymentRecieve.forEach((tranx) => {
        amount += tranx.amount;
      });
      return amount;
    }
    return 0;
  }, [transactionReducer.getPaymentRecievedStatus, transactionReducer.paymentRecieve]);

  const totalInvoiceAmount = useMemo(() => {
    if (invoiceReducer.getInvoicesStatus === 'completed') {
      let amount = 0;
      invoice.invoices.forEach((invoice) => {
        amount += invoice.grandTotal;
      });
      return amount;
    }
    return 0;
  }, [invoiceReducer.getInvoicesStatus, invoiceReducer.invoices]);

  const totalReceivableAmount = useMemo(() => {
    if (invoiceReducer.getInvoicesStatus === 'completed') {
      let amount = 0;
      invoice.invoices.forEach((invoice) => {
        amount += invoice.dueAmount;
      });
      return amount;
    }
    return 0;
  }, [invoiceReducer.getInvoicesStatus, invoiceReducer.invoices]);



  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
            Invoices
          </Typography>
        </Grid>
      </Grid>

      {isTechAdmin && <Grid container
        sx={{
          display: 'flex', mb: 2,
          justifyContent: 'right',
          alignItems: 'center', flexDirection: 'column'
        }}
      >
        <Box
          onClick={() => handleToggleShowReport()}
          sx={{
            cursor: 'pointer', '&:hover': {color: 'grey'},
            color: showReport ? '#747bff' : 'black',
            width: '100%', display: 'flex',
            justifyContent: 'right', alignItems: 'center'
          }}
        >
          <Typography sx={{fontSize: 16, textShadow: 5}}>
            {showReport ? 'Hide report' : 'Show report'}
          </Typography>
          {showReport ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </Box>
        <Collapse in={showReport} timeout={{ enter: 800, exit: 500 }}
          sx={{width: '100%', mt: 1}}
        >
          <Paper elevation={3}
            sx={{
              backgroundColor: 'white',
              width: '100%', p: 4, height: 'auto',
              display: 'flex', alignItems: 'center',
              justifyContent: 'right', gap: 2, flexDirection: 'column'
            }}
          >
            <Grid container>
              <Grid item md={4} xs={12} flexDirection='row'>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  No of Expenses recorded:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    {expenseReducer.expenses.length}
                  </span>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  No of Payments recorded:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    {transactionReducer.paymentRecieve.length}
                  </span>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  Total Amount of Expenses:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    &#x20A6;{formatNumberToIntl(totalExpensesAmount)}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  Total Amount of Payment:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    &#x20A6;{formatNumberToIntl(totalTransactionAmount)}
                  </span>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  Book Profit:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    &#x20A6;{formatNumberToIntl(totalInvoiceAmount - totalExpensesAmount)}
                  </span>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  Actual Profit:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    &#x20A6;{formatNumberToIntl(totalTransactionAmount - totalExpensesAmount)}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={4} xs={12}>
                <Typography sx={{fontSize: 15, color: '#7F7F7F'}}>
                  Total Receivable:&nbsp;
                  <span style={{fontSize: 16, color: 'black'}}>
                    &#x20A6;{formatNumberToIntl(totalReceivableAmount)}
                  </span>
                </Typography>
              </Grid>
              <Grid md={8}/>
            </Grid>
          </Paper>
        </Collapse>
      </Grid>}

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
          // onClose={() => invoice.handleCloseEdit()}
          onClose={() => setCloseEstimateModal(true)}
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
      {closeEstimateModal && <AppModal
        fullWidth
        show={closeEstimateModal}
        Content={<DialogContentText>{MESSAGES.closeEstimateModal}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button
              onClick={() => {
                setCloseEstimateModal(false),
                invoice.handleCloseEdit()
              }}
            >
              Yes
            </Button>
            <Button onClick={() => setCloseEstimateModal(false)}>No</Button>
          </DialogActions>
        }
        onClose={() => setCloseEstimateModal(false)}
      />}
      <AppLoader show={transactionReducer.initRefundCustomerStatus === 'loading'} />
      <AppLoader show={transactionReducer.verifyRefundCustomerStatus === 'loading'} />
      <AppModal
        fullWidth
        show={invoice.showDelete}
        Content={<DialogContentText>{MESSAGES.cancelText}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => invoice.setShowDelete(false)}>Disagree</Button>
            <Button onClick={invoice.handleDelete}>Agree</Button>
          </DialogActions>
        }
        onClose={() => invoice.setShowDelete(false)}
      />

      <AppAlert
        alertType="error"
        show={undefined !== error}
        message={error?.message}
        onClose={() => setError(undefined)}
      />

      <AppAlert
        alertType="success"
        show={undefined !== success}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />

      <AppModal
        fullWidth
        show={invDel}
        Content={<DialogContentText>{MESSAGES.deleteInvoice}</DialogContentText>}
        ActionComponent={
          <DialogActions>
            <Button onClick={() => setInvDel(false)}>Cancel</Button>
          </DialogActions>
        }
        onClose={() => setInvDel(false)}
      />
    </React.Fragment>
  );
}

export default InvoicesPage;
