// @ts-nocheck
import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import AppAlert from '../../components/alerts/AppAlert';
import AppLoader from '../../components/loader/AppLoader';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { getpaymentRecievedAction } from '../../store/actions/transactionActions';
// import useInvoice from '../../hooks/useInvoice';

import { resetPaymentRecieveStatus } from '../../store/reducers/transactionReducer';
import { formatNumberToIntl } from '../../utils/generic';


export default function PaymentRecieve() {
    // const invoiceReducer = useAppSelector(state => state.invoiceReducer);
    const transactionReducer = useAppSelector(state => state.transactionReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isTechAdmin } = useAdmin();
    // const invoice = useInvoice();

    useEffect(()=>{
      // @ts-ignore
      dispatch(getpaymentRecievedAction());
      console.log()
    }, [dispatch])

    const techColumns = useMemo(() => {
        return [
          
          {
            field: 'updatedAt',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            width: 200,
            type: 'string',
            valueFormatter: ({ value }: any) => {
              return value ? moment(value).format('LLL') : '-';
            },
            sortable: true,
          },
          {
            field: 'reference',
            headerName: 'Receipt',
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            type: 'string',
            renderCell: (params: any) => {
              return (
                <span
                  style={{ color: 'skyblue', cursor: 'pointer' }}
                  onClick={() => {
                    // 
                  }}>
                  {params.row.reference}
                </span>
              );
            },
          },
          {
            field: 'customer.name',
            headerName: 'Customer Name',
            headerAlign: 'center',
            align: 'center',
            width: 300,
            sortable: true,
            type: 'string',
            renderCell: (params: any) => {
              return (
                <span
                  onClick={() => {
                    // params.row.customer 
                  }}>
                  {`${params?.row?.customer?.firstName || ""} ${params?.row?.customer?.lastName || ""}`}
                </span>
              );
            },
          },
          {
            field: 'invoice.code',
            headerName: 'Invoice',
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            type: 'string',
            renderCell: (params: any) => {
              return (
                <span
                  style={{ color: 'skyblue', cursor: 'pointer' }}
                  onClick={() => {
                    // 
                    if(params.row.invoice == undefined){
                      return ;
                    }
                    void dispatch(getInvoicesAction());
                    const invoice = params.row.invoice as IInvoice;

                    const parts = invoice.estimate.parts;
                    const labours = invoice.estimate.labours;

                    // Object.assign(invoice.estimate, {
                    //   parts: parts.length ? parts.map(part => JSON.parse(part)) : []
                    // })
                    // // invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [];
                    // invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [];

                    const __parts = parts.length ? parts.map(part => JSON.parse(part)) : [];
                    const __labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [];


                    const estimate = invoice.estimate;

                    // sorted for both

                    // console.log({ invoice, estimate });
                    const _newInvoice = {
                      ...invoice,
                      estimate: {
                        parts: __parts,
                        labours: __labours
                      },
                      parts: __parts,
                      labours: __labours
                    };

                    const _newEstimate = {
                      ...estimate,
                      parts: __parts,
                      labours: __labours
                    } ;

                    const __state: any = {
                      invoice: {..._newInvoice, estimate: _newEstimate},
                      estimate: _newEstimate
                    };

                    console.log(__state)

                    navigate(`/invoices/${invoice.id}`, { state: __state });
                  }}>
                  {params?.row?.invoice?.code || ""}
                </span>
              );
            },
          },
          {
            field: 'type',
            headerName: 'Mode of Payment',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 250,
            sortable: true,
            valueGetter: (param: any) => {
              return param.row.type;
            },
          },
          {
            field: 'amount',
            headerName: 'Amount Paid',
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (param: any) => {
              return `${param.row.currency} ${formatNumberToIntl(param.row.amount)}`;
            },
          },
          
        ];
      }, [dispatch, transactionReducer, isTechAdmin, navigate]);

    return (
        <React.Fragment>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={10}>
                <Typography variant="h4" gutterBottom>
                    Payment Recieved
                </Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                <AppDataGrid
                    rows={transactionReducer.paymentRecieve}
                    // columns={columns}
                    columns={techColumns}
                    // columns={[]}
                    showToolbar
                    loading={transactionReducer.getPaymentRecievedStatus === 'loading'}
                />
                </Grid>
            </Grid>
            {/* <AppAlert
                alertType="success"
                show={transactionReducer.getPaymentRecievedStatus === 'completed'}
                message={'Fetched Successfully'}
                onClose={() => dispatch(resetPaymentRecieveStatus())}
            /> */}
            <AppAlert
                alertType="error"
                show={transactionReducer.getPaymentRecievedStatus === 'failed'}
                message={transactionReducer.getPaymentRecievedError}
                onClose={() => dispatch(resetPaymentRecieveStatus())}
            />
            
            <AppLoader show={transactionReducer.getPaymentRecievedStatus === 'loading'} />
        </React.Fragment>
    )
}