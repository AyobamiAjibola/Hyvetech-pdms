// @ts-nocheck
import { Button, DialogActions, DialogContentText, Divider, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppAlert from '../../components/alerts/AppAlert';
import AppLoader from '../../components/loader/AppLoader';
import AppDataGrid from '../../components/tables/AppDataGrid';
import useAdmin from '../../hooks/useAdmin';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getInvoicesAction } from '../../store/actions/invoiceActions';
import { deleteSingleTransactionAction, getpaymentRecievedAction } from '../../store/actions/transactionActions';
// import useInvoice from '../../hooks/useInvoice';

import { resetDeletePaymentRecieveStatus, resetPaymentRecieveStatus } from '../../store/reducers/transactionReducer';
import { formatNumberToIntl } from '../../utils/generic';
import { 
  hashString, 
} from 'react-hash-string'
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Cancel } from '@mui/icons-material';
import AppModal from '../../components/modal/AppModal';
import settings from '../../config/settings';
import ReactToPdf from 'react-to-pdf'


export default function PaymentRecieve() {
    // const invoiceReducer = useAppSelector(state => state.invoiceReducer);
    const transactionReducer = useAppSelector(state => state.transactionReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isTechAdmin, user } = useAdmin();
    const [records, setRecords] = useState([])
    const [showWarning, setShowWarning] = useState(false)
    const [showReceipt, setShowReceipt] = useState(false)
    const [receiptData, setReceiptData] = useState(null)
    const [activeRecord, setactiveRecord] = useState(null)
    // const invoice = useInvoice();

    const ref = React.createRef();
    const options = {
      unit: 'in',
      format: [6,6]
  };

    const partnerName = (user?.partner?.name || " ")

    // console.log(receiptData, "receiptDatareceiptData")

    useEffect(()=>{
      // reverse
      const temp = [];
      const __old = transactionReducer?.paymentRecieve || [];

      for (let index = (__old.length - 1); index >= 0; index--) {
        const element = __old[index];
        temp.push(element);
      }

      setRecords(temp);

    }, [transactionReducer?.paymentRecieve])

    useEffect(()=>{
      if( transactionReducer.deletePaymentRecievedStatus == "completed" ){
        // @ts-ignore
      dispatch(getpaymentRecievedAction());
      }
      
    }, [transactionReducer.deletePaymentRecievedStatus])

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
            headerName: 'Receipt #',
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            width: 170,
            type: 'string',
            renderCell: (params: any) => {
              // console.log(params, "paramsparams")
              return (
                <span
                  style={{ color: 'skyblue', cursor: 'pointer' }}
                  onClick={() => {
                    // 
                    setShowReceipt(true);
                    setReceiptData(params.row)
                  }}>
                  {/* {params.row.reference} */}
                  {`${partnerName[0]}RC-${hashString(`${partnerName[0]}C${params.row.id}`)}`}
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
            headerName: 'Invoice #',
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
            width: 150,
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
            width: 160,
            sortable: true,
            valueGetter: (param: any) => {
              return `${param.row.currency} ${formatNumberToIntl(param.row.amount)}`;
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
                icon={<Cancel sx={{ color: 'indianred' }} />}
                onClick={() => {
                  //

                  setShowWarning(true);
                  setactiveRecord({
                    trans_id: params.row.id,
                    amount: params.row.amount,
                    invoice: params?.row?.invoice || null,
                  })
                }}
                label="Delete"
                showInMenu={false}
              />,
            ],
          },
          
        ];
      }, [dispatch, transactionReducer, isTechAdmin, navigate]);

    return (
        <React.Fragment>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={10}>
                <Typography variant="h4" gutterBottom>
                    Payments Received
                </Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                <AppDataGrid
                    rows={records}
                    // columns={columns}
                    columns={techColumns}
                    // columns={[]}
                    showToolbar
                    loading={transactionReducer.getPaymentRecievedStatus === 'loading'}
                />
                </Grid>
            </Grid>
            <AppAlert
                alertType="success"
                show={transactionReducer.deletePaymentRecievedStatus === 'completed'}
                message={'Processed Successfully'}
                onClose={() => dispatch(resetDeletePaymentRecieveStatus())}
            />
            <AppAlert
                alertType="error"
                show={transactionReducer.getPaymentRecievedStatus === 'failed'}
                message={transactionReducer.getPaymentRecievedError}
                onClose={() => dispatch(resetPaymentRecieveStatus())}
            />

            <AppAlert
                alertType="error"
                show={transactionReducer.deletePaymentRecievedStatus === 'failed'}
                message={transactionReducer.deletePaymentRecievedError}
                onClose={() => dispatch(resetDeletePaymentRecieveStatus())}
            />
            <AppModal
              fullWidth
              show={showWarning}
              Content={<DialogContentText>{`              
                Are you sure you want to carry out this action? If you agree to do this, the affected entity, will not be able to execute certain features on the app
              `}</DialogContentText>}
              ActionComponent={
                <DialogActions>
                  <Button onClick={() => setShowWarning(false)}>Disagree</Button>
                  <Button onClick={()=>{
                    // 
                    dispatch(deleteSingleTransactionAction(activeRecord));
                    setShowWarning(false);
                  }}>Agree</Button>
                </DialogActions>
              }
              onClose={() => setShowWarning(false)}
            />

            <AppModal
              fullWidth
              show={showReceipt}
              Content={
                <div ref={ref} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{ flex: 0.4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img
                        alt=""
                        width="52%"
                        crossOrigin="anonymous"
                        src={`${settings.api.baseURL}/${user?.partner?.logo}`}
                      />
                    </div>
                    <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h4'>
                      {partnerName}.
                    </Typography>
                    <Typography>
                      {user?.partner?.contact?.address},
                      &nbsp;
                      {user?.partner?.contact?.country}
                    </Typography>
                    <br />

                    <Typography>
                      {user?.partner?.phone}
                      <br />
                      {user?.partner?.email}
                    </Typography>
                    </div>
                  </div>

                  <br />
                  <Divider orientation="horizontal" />
                  <br />
                  
                  <div>
                    <Typography style={{ fontWeight: 'normal', textAlign: 'center' }}>
                      PAYMENT RECEIPT
                    </Typography>
                    <br />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                      <div style={{ flex: 1, display: 'flex', flex: 0.68, marginRight: 20, flexDirection: 'column' }}>
                        
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography style={{ fontSize: 13 }}>Payment Date</Typography>
                          <Typography style={{ fontSize: 13, fontWeight: '600' }}>{new Date((receiptData?.updatedAt || "")).toDateString()}</Typography>
                        </div>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography style={{ fontSize: 13 }}>Mode of Payment</Typography>
                          <Typography style={{ fontSize: 13, fontWeight: '600' }}>{receiptData?.type || ""}</Typography>
                        </div>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography style={{ fontSize: 13 }}>Payment Reference</Typography>
                          <Typography style={{ fontSize: 13, fontWeight: '600' }}>
                          {`${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id || ""}`)}`}
                          </Typography>
                        </div>

                      </div>

                      <div style={{ flex: 1, display: 'flex', flex: 0.3, flexDirection: 'column', alignItems: 'center' }}>
                        <Typography style={{ fontSize: 11 }}>
                          Amount Received
                        </Typography>
                        <Typography style={{ fontSize: 13, fontWeight: '600' }}>
                          N {formatNumberToIntl(receiptData?.amount || 0)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography style={{ marginTop: 10, marginBottom: 10, fontWeight: '800' }}>Recieved From</Typography>
                      <Typography style={{ fontSize: 13 }}>{receiptData?.customer?.firstName || ""}{' '}{receiptData?.customer?.lastName || ""}</Typography>
                      {/* <Typography style={{ fontSize: 13 }}>{receiptData?.customer.contacts[0]?.address || ""}</Typography> */}
                      <Typography style={{ fontSize: 13 }}>{receiptData?.customer.contacts[0]?.district || ""}</Typography>
                      <Typography style={{ fontSize: 13 }}>{receiptData?.customer.contacts[0]?.state || ""}</Typography>
                    </div>

                    <div>
                      <Typography style={{ marginTop: 10, marginBottom: 10, fontWeight: '800' }}>Payment For</Typography>
                    </div>

                  </div>
                  <div>
                    <table style={{ width: '100%' }}>
                      <thead style={{ backgroundColor: 'grey', borderColor: 'grey' }}>
                        <tr style={{ borderColor: 'grey' }}>
                          
                          <th style={{ borderColor: 'grey' }}>
                            <Typography style={{ fontSize: 13 }}>Invoice #</Typography>
                          </th>

                          <th style={{ borderColor: 'grey' }}>
                            <Typography style={{ fontSize: 13 }}>Invoice Date</Typography>
                          </th>

                          <th style={{ borderColor: 'grey' }}>
                            <Typography style={{ fontSize: 13 }}>Invoice Amount</Typography>
                          </th>

                          <th style={{ borderColor: 'grey' }}>
                            <Typography style={{ fontSize: 13 }}>Payment Amount</Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          
                          <td>
                            <Typography style={{ fontSize: 13, textAlign: 'center' }}>INV-{receiptData?.invoice?.code || ""}</Typography>
                          </td>

                          <td>
                            <Typography style={{ fontSize: 13, textAlign: 'center' }}>{(new Date(receiptData?.invoice?.updatedAt || "")).toDateString()}</Typography>
                          </td>

                          <td>
                            <Typography style={{ fontSize: 13, textAlign: 'center' }}>N {formatNumberToIntl(receiptData?.invoice?.grandTotal || "")}</Typography>
                          </td>

                          <td>
                            <Typography style={{ fontSize: 13, textAlign: 'center' }}>N {formatNumberToIntl(receiptData?.amount || "")}</Typography>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              }
              ActionComponent={
                <DialogActions>
                  <ReactToPdf targetRef={ref} filename={`${hashString(`${partnerName[0]}C${receiptData?.id || ""}`)}.pdf`} options={options} x={.5} y={.5} scale={0.8}>
                    {({toPdf}) => (
                        <Button onClick={toPdf}>DOWNLOAD</Button>
                    )}
                </ReactToPdf>
                  {/* <Button onClick={() => {
                    // 
                  }}>DOWNLOAD</Button> */}
                </DialogActions>
              }
              onClose={() => setShowReceipt(false)}
            />
            
            <AppLoader show={transactionReducer.getPaymentRecievedStatus === 'loading' || transactionReducer.deletePaymentRecievedStatus === 'loading'} />
        </React.Fragment>
    )
}