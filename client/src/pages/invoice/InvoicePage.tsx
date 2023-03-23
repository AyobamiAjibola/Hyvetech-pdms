import React, { useEffect, useMemo, useState } from 'react';
import { IBillingInformation, IEstimate, IInvoice } from '@app-models';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Avatar, Box, Button, Divider, Grid, Input, Select, Stack, Typography } from '@mui/material';
import capitalize from 'capitalize';
import InsightImg from '../../assets/images/estimate_vector.png';
import { ILabour, IPart } from '../../components/forms/models/estimateModel';
import { formatNumberToIntl } from '../../utils/generic';
import settings from '../../config/settings';
import { INVOICE_STATUS } from '../../config/constants';
import { ArrowBackIosNew } from '@mui/icons-material';
import axiosClient from '../../config/axiosClient';
import AppModal from '../../components/modal/AppModal';
import { getInvoicesAction, getSingleInvoice } from '../../store/actions/invoiceActions';

import AppAlert from '../../components/alerts/AppAlert';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { setInvoiceCode } from '../../store/reducers/expenseReducer';

const API_ROOT = settings.api.rest;
// interface ILocationState {
//   estimate?: IEstimate;
//   invoice?: IInvoice;
// }

function InvoicePage() {
  const [estimate, setEstimate] = useState<IEstimate>();
  const [invoice, setInvoice] = useState<IInvoice>();
  const [owner, setOwner] = useState<string>('');
  const [parts, setParts] = useState<IPart[]>([]);
  const [labours, setLabours] = useState<ILabour[]>([]);
  const [_driver, setDriver] = useState<any>(null);
  const [billingInformation, setBillingInformation] = useState<IBillingInformation>();
  // const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const store = useAppSelector(state => state.invoiceReducer);

  const [showRecordPayment, setShowRecordPayment] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(false);
  const [recordData, setRecordData] = useState<{
    amount: string | number;
    type: string;
  }>({
    amount: '',
    type: 'Cash',
  });

  const generateExpense = () => {
    dispatch(setInvoiceCode(invoice?.code))
    // sessionStorage.setItem('inv#*C0', invoice?.code)
    navigate('/expense/create')
  }

  // @ts-ignore
  const [downloading, setDownloading] = useState<any>(false);

  const [showMessage, setshowMessage] = useState<boolean>(false);

  const params = useParams() as unknown as { id: number };

  useEffect(() => {
    dispatch(getSingleInvoice(params.id));
  }, [params]);

  useEffect(() => {
    // if (location.state) {
    //   const state = location.state as ILocationState;

    //   setInvoice(state.invoice);
    //   setEstimate(state.estimate);
    // }
    setInvoice(store.invoice);
    setEstimate(store.invoice?.estimate);
  }, [store.invoice]);

  useEffect(() => {
    if (estimate && invoice) {
      const driver = estimate.rideShareDriver;
      const customer = estimate.customer;

      const _owner = driver ? `${driver.firstName} ${driver.lastName}` : `${customer.firstName} ${customer.lastName}`;

      let _parts: IPart[];
      let _labours: ILabour[];

      if (invoice.edited && INVOICE_STATUS.update.draft) {
        _parts = !invoice.parts.length ? [] : (invoice.parts as unknown as IPart[]);
        _labours = !invoice.labours.length ? [] : (invoice.labours as unknown as ILabour[]);
      } else if (invoice.edited && invoice.updateStatus === INVOICE_STATUS.update.sent) {
        _parts = !invoice.parts.length ? [] : (invoice.parts as unknown as IPart[]);
        _labours = !invoice.labours.length ? [] : (invoice.labours as unknown as ILabour[]);
      } else {
        _parts = !estimate.parts.length ? [] : (estimate.parts as unknown as IPart[]);
        _labours = !estimate.labours.length ? [] : (estimate.labours as unknown as ILabour[]);
      }

      setParts(_parts);
      setDriver(driver || customer);
      setLabours(_labours);
      setOwner(capitalize.words(_owner));
      setBillingInformation(customer.billingInformation);
    }
  }, [estimate, invoice]);

  const subTotal = useMemo(() => {
    if (invoice && estimate) {
      const laboursTotal = invoice.edited ? invoice.laboursTotal : estimate.laboursTotal;
      const partsTotal = invoice && invoice.edited ? invoice.partsTotal : estimate.partsTotal;

      return laboursTotal + partsTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const grandTotal = useMemo(() => {
    if (invoice && estimate) {
      console.log('rices> ', invoice);
      return invoice.edited ? invoice.grandTotal : estimate.partsTotal + estimate.laboursTotal;
      // return estimate.partsTotal + estimate.laboursTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const [refundAmount, setRefundable] = useState(0);
  const [balance, setDueBalance] = useState(0);

  useEffect(() => {
    // const _grandTotal = vat + vatPart + partTotal + labourTotal;

    const _depositAmount = invoice?.depositAmount || 0;
    const _dueBalance = grandTotal - _depositAmount;

    setDueBalance(_dueBalance);

    if (_depositAmount > grandTotal) {
      setRefundable(_depositAmount - grandTotal);
      setDueBalance(0);
    } else {
      setRefundable(0);
    }
  }, [grandTotal, invoice]);

  const generateDownload = async () => {
    const rName = Math.ceil(Math.random() * 999 + 1100) + '.pdf';
    // @ts-ignore
    const payload = {
      type: 'INVOICE',
      id: invoice?.id || -1,
      rName,
    };
    setDownloading(true);

    try {
      const response = await axiosClient.post(`${API_ROOT}/request-pdf`, payload);
      console.log(response.data);
      // window.open(`${settings.api.baseURL}/uploads/pdf/${response.data.name}`)
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      setDownloading(false);
      window.open(`${settings.api.baseURL}/uploads/pdf/${rName}`);
    }, 3000);
  };

  const handlePaymentRecord = async () => {
    setRecording(true);
    try {
      const payload = {
        invoiceId: invoice?.id || 0,
        customerId: _driver.id,
        amount: recordData.amount,
        type: recordData.type,
      };

      const response = await axiosClient.post(`${API_ROOT}/transactions/update-invoice-payment-manually`, payload);
      console.log(response.data);
      // @ts-ignore
      dispatch(getInvoicesAction());
      setshowMessage(true);

      setTimeout(() => {
        setshowMessage(false);
        window.history.back();
      }, 3000);
      // alert("Record Updated");
      // window.location.reload();
    } catch (e) {
      console.log(e);
    }
    setRecording(false);
  };

  const calculateDiscount = ({
    total,
    discount,
    discountType,
  }: {
    total: number;
    discount: number | undefined;
    discountType: string | undefined;
  }) => {
    if (!discount) return 0;
    if (!discountType) return 0;

    if (discountType === 'exact') {
      return discount;
    }
    return Math.ceil(total * (discount / 100));
  };

  const calculateTaxTotal = (estimate: IInvoice | IEstimate | undefined) => {
    if (!estimate) return 0;

    if (estimate.taxPart && estimate.tax)
      return (
        parseFloat(`${estimate?.tax}`.split(',').join('')) + parseFloat(`${estimate?.taxPart}`.split(',').join(''))
      );

    if (estimate.tax && !estimate.taxPart) return parseFloat(`${estimate?.tax}`.split(',').join(''));

    if (!estimate.tax && estimate.taxPart) return parseFloat(`${estimate?.taxPart}`.split(',').join(''));

    return 0;
  };

  if (!estimate || !invoice)
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs>
          <Alert severity="warning" variant="outlined">
            <Typography>You do not have any invoice. Please contact support</Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  else
    return (
      <React.Fragment>
        <Grid>
          <Grid>
            <ArrowBackIosNew
              onClick={() => window.history.back()}
              style={{ position: 'absolute', cursor: 'pointer' }}
            />
          </Grid>
        </Grid>

        <Typography mb={3} textAlign="center" display="block" variant="subtitle1">
          #{invoice.code}
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {invoice.grandTotal !== invoice.paidAmount && (
            <Button
              style={{ marginRight: 20 }}
              variant="outlined"
              color="success"
              size="small"
              onClick={() => setShowRecordPayment(true)}>
              {'Record Payment'}
            </Button>
          )}
          <Button variant="outlined" color="success" size="small"
            sx={{ mr: 2 }}
            onClick={() => generateExpense()}
          >
            Record Expense
          </Button>
          <Button variant="outlined" color="success" size="small" onClick={() => generateDownload()}>
            {downloading ? 'Downloading...' : 'Download Pdf'}
          </Button>
        </div>

        <Grid container my={3} justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              Billing Information
            </Typography>
            <Stack>
              <Typography variant="body1" gutterBottom>
                {owner}
              </Typography>
              {billingInformation ? (
                <Typography variant="body1" gutterBottom>
                  <Typography variant="body2" gutterBottom>
                    {billingInformation.address} {billingInformation.district} {billingInformation.state}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {billingInformation.phone}
                  </Typography>
                </Typography>
              ) : (
                <Typography variant="body1" gutterBottom>
                  <p>{_driver?.email || ''}</p>
                  <p>{_driver?.phone || ''}</p>
                  {estimate.address}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs>
            <img
              alt=""
              width="20%"
              crossOrigin="anonymous"
              src={`${settings.api.baseURL}/${estimate?.partner?.logo}`}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {estimate?.partner.name}
            </Typography>
            <Stack>
              <Typography variant="body1" gutterBottom>
                {estimate?.partner?.contact.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {estimate?.partner?.contact?.district} {estimate?.partner?.contact?.state}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {estimate?.partner.phone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {estimate?.partner.email}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Divider orientation="horizontal" flexItem />
          </Grid>
        </Grid>
        <Grid container my={3}>
          <Grid item xs>
            <Typography gutterBottom>Vehicle</Typography>
            <Typography>
              {estimate?.vehicle.modelYear} {estimate?.vehicle.make} {estimate?.vehicle.model}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography gutterBottom>Reg. No</Typography>
            <Typography>{estimate?.vehicle.plateNumber}</Typography>
          </Grid>
          <Grid item xs>
            <Typography gutterBottom>Mileage</Typography>
            <Typography>
              {estimate?.vehicle.mileageValue} {estimate?.vehicle.mileageUnit}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography gutterBottom>VIN</Typography>
            <Typography>{estimate?.vehicle.vin}</Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Divider orientation="horizontal" flexItem />
          </Grid>
        </Grid>
        <Grid
          container
          my={3}
          sx={{ pb: 1.5 }}
          borderBottom="3px solid"
          borderColor={theme => (theme.palette.mode === 'dark' ? '#676767' : '#000000')}
          justifyContent="center"
          alignItems="center"
          columns={14}>
          <Grid item xs={2}>
            <Avatar src={InsightImg} sx={{ width: 20, height: 20 }} />
          </Grid>
          <Grid item xs={3}>
            Item Description
          </Grid>
          <Grid item xs={3}>
            Warranty
          </Grid>
          <Grid item xs={3}>
            Unit Cost x Qty
          </Grid>
          <Grid item xs={3}>
            Amount
          </Grid>
        </Grid>
        <Grid container>
          {!parts.length
            ? null
            : parts.map((part, idx1) => {
                const amount = formatNumberToIntl(parseInt(part.amount));

                return (
                  <Grid
                    key={idx1}
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    columns={14}
                    sx={{ pb: 2.5 }}
                    borderBottom="0.01px solid"
                    borderColor="#676767">
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                      {part.name}
                    </Grid>
                    <Grid item xs={3}>
                      {part?.warranty?.warranty || ''} {part?.warranty?.interval || ''}
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumberToIntl(+part.price)} x {part?.quantity?.quantity || ''}${part?.quantity?.unit || 0}
                    </Grid>
                    <Grid item xs={3}>
                      {amount}
                    </Grid>
                  </Grid>
                );
              })}
          {!labours.length
            ? null
            : labours.map((labour, idx1) => {
                return (
                  <Grid
                    key={idx1}
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    columns={14}
                    sx={{ pb: 2.5 }}
                    borderBottom="0.01px solid"
                    borderColor="#676767">
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                      {labour?.title}
                    </Grid>
                    <Grid item xs={3}>
                      -
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumberToIntl(+labour.cost)} x 1
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumberToIntl(+labour.cost)}
                    </Grid>
                  </Grid>
                );
              })}
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right" borderBottom="0.01px solid" borderColor="#676767">
            <Typography gutterBottom>Subtotal: {formatNumberToIntl(subTotal)}</Typography>
            {/* @ts-ignore */}
            <Typography gutterBottom>
              VAT(7.5%):{' '}
              {
                // @ts-ignore
                formatNumberToIntl(calculateTaxTotal(invoice))
              }
            </Typography>
            <Typography gutterBottom>
              Discount:
              {
                // @ts-ignore
                `(${formatNumberToIntl(
                  calculateDiscount({
                    total: grandTotal,
                    discount: invoice.discount,
                    discountType: invoice.discountType,
                  }),
                )})`
              }
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right" borderBottom="0.01px solid" borderColor="#676767">
            <Typography gutterBottom>
              TOTAL:{' '}
              {formatNumberToIntl(
                grandTotal,
                // calculateDiscount({
                //   total: grandTotal,
                //   discount: invoice.discount,
                //   discountType: invoice.discountType,
                // }) +
                // calculateTaxTotal(invoice),
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" mt={1} mb={2}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right">
            <Typography
              gutterBottom
              fontStyle="italic"
              color={theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238')}>
              Job Duration: {invoice.jobDurationValue} {invoice.jobDurationUnit}(s)
            </Typography>
          </Grid>
        </Grid>

        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={10} />
          <Grid item flexGrow={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238'),
              }}>
              <Typography>Paid</Typography>
              <Typography sx={{ ml: 5 }} />
              <Typography>₦{formatNumberToIntl(invoice.depositAmount)}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={10} />
          <Grid item flexGrow={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238'),
              }}>
              <Typography>Balance Due</Typography>
              <Typography sx={{ mr: 7 }} />
              <Typography>
                {/* ₦{Math.sign(invoice.dueAmount) === -1 ? '0.00' : formatNumberToIntl(invoice.dueAmount)} */}₦
                {Math.sign(balance) === -1 ? '0.00' : formatNumberToIntl(balance)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          <Grid item xs={10} />
          <Grid item flexGrow={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238'),
              }}>
              <Typography>Refund Due</Typography>
              <Typography sx={{ mr: 7 }} />
              {/* <Typography>₦{formatNumberToIntl(invoice.refundable)}</Typography> */}
              <Typography>₦{formatNumberToIntl(refundAmount)}</Typography>
            </Box>
          </Grid>
        </Grid>

        <AppModal
          show={showRecordPayment}
          onClose={() => setShowRecordPayment(false)}
          title="Record Payment"
          size="md"
          ActionComponent={<Button onClick={() => handlePaymentRecord()}>{recording ? 'Recording' : 'Record'}</Button>}
          // fullWidth
          Content={
            <div style={{ width: 300 }}>
              <Input
                value={recordData.amount}
                type="numeric"
                fullWidth
                placeholder={'Amount to Record Max: ' + formatNumberToIntl(invoice.dueAmount)}
                onChange={e => {
                  // process entry
                  if (parseInt(e.target.value) > invoice.dueAmount) {
                    alert('Recording above due amount, a refund might be considered');
                  } else {
                    setRecordData({ ...recordData, amount: e.target.value });
                  }
                }}
              />
              <br />
              &nbsp;
              <br />
              <Typography>Select Method</Typography>
              <br />
              <Select
                onChange={e => setRecordData({ ...recordData, type: e.target.value })}
                value={recordData.type}
                native
                fullWidth
                placeholder="Select Payment Mode">
                <option value={'Cash'}>Cash</option>
                <option value={'Transfer'}>Transfer</option>
                <option value={'Check'}>Check</option>
                <option value={'POS'}>POS</option>
              </Select>
              <br />
            </div>
          }
        />

        <AppAlert
          alertType="success"
          show={showMessage}
          message={'record recieved, re-open invoice to see changes'}
          onClose={() => setshowMessage(false)}
        />
      </React.Fragment>
    );
}

export default InvoicePage;
