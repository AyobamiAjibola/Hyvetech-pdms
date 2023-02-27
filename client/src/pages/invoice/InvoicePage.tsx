import React, { useEffect, useMemo, useState } from 'react';
import { IBillingInformation, IEstimate, IInvoice } from '@app-models';
import { useLocation } from 'react-router-dom';
import { Alert, Avatar, Box, Divider, Grid, Stack, Typography } from '@mui/material';
import capitalize from 'capitalize';
import InsightImg from '../../assets/images/estimate_vector.png';
import { ILabour, IPart } from '../../components/forms/models/estimateModel';
import { formatNumberToIntl } from '../../utils/generic';
import settings from '../../config/settings';
import { INVOICE_STATUS } from '../../config/constants';
import { ArrowBackIosNew } from '@mui/icons-material';

interface ILocationState {
  estimate?: IEstimate;
  invoice?: IInvoice;
}

function InvoicePage() {
  const [estimate, setEstimate] = useState<IEstimate>();
  const [invoice, setInvoice] = useState<IInvoice>();
  const [owner, setOwner] = useState<string>('');
  const [parts, setParts] = useState<IPart[]>([]);
  const [labours, setLabours] = useState<ILabour[]>([]);
  const [_driver, setDriver] = useState<any>(null);
  const [billingInformation, setBillingInformation] = useState<IBillingInformation>();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;

      setInvoice(state.invoice);
      setEstimate(state.estimate);
    }
  }, [location]);

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
      setDriver(driver || customer)
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
      return invoice.edited ? invoice.grandTotal : estimate.grandTotal;
    }
    return 0;
  }, [estimate, invoice]);

  if (!estimate || !invoice)
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs>
          <Alert severity="warning" variant="outlined">
            <Typography>You do not have any estimate. Please contact support</Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  else
    return (
      <React.Fragment>

        <Grid>

          <Grid>
            <ArrowBackIosNew onClick={() => window.history.back()} style={{ position: 'absolute', cursor: 'pointer' }} />
          </Grid>

        </Grid>

        <Typography mb={3} textAlign="center" display="block" variant="subtitle1">
          #{invoice.code}
        </Typography>
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
                  <p>
                    {_driver?.email || ""}
                  </p>
                  <p>
                    {_driver?.phone || ""}
                  </p>
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
                    {part.warranty.warranty} {part.warranty.interval}
                  </Grid>
                  <Grid item xs={3}>
                    {formatNumberToIntl(+part.price)} x {part.quantity.quantity}${part.quantity.unit}
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
                    {labour.title}
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
            <Typography gutterBottom>VAT(7.5%): {formatNumberToIntl((parseFloat(estimate?.tax || 0)) + (parseFloat(estimate?.taxPart || 0)))}</Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right" borderBottom="0.01px solid" borderColor="#676767">
            <Typography gutterBottom>TOTAL: {formatNumberToIntl(grandTotal)}</Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" mt={1} mb={2}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right">
            <Typography
              gutterBottom
              fontStyle="italic"
              color={theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238')}>
              Job Duration: {estimate.jobDurationValue} {estimate.jobDurationUnit}(s)
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
                ₦{Math.sign(invoice.dueAmount) === -1 ? '0.00' : formatNumberToIntl(invoice.dueAmount)}
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
              <Typography>₦{formatNumberToIntl(invoice.refundable)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
}

export default InvoicePage;
