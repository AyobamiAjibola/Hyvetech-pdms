import React, { useEffect, useState } from 'react';
import { IBillingInformation, IEstimate } from '@app-models';
import { useLocation } from 'react-router-dom';
import { Alert, Avatar, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import capitalize from 'capitalize';
import InsightImg from '../../assets/images/estimate_vector.png';
import { ILabour, IPart } from '../../components/forms/models/estimateModel';
import { formatNumberToIntl } from '../../utils/generic';
import settings from '../../config/settings';
import { ArrowBackIosNew } from '@mui/icons-material';
import axiosClient from '../../config/axiosClient';

const API_ROOT = settings.api.rest;
interface ILocationState {
  estimate?: IEstimate;
}

function EstimatePage() {
  const [estimate, setEstimate] = useState<IEstimate>();
  const [owner, setOwner] = useState<string>('');
  const [parts, setParts] = useState<IPart[]>([]);
  const [labours, setLabours] = useState<ILabour[]>([]);
  const [_driver, setDriver] = useState<any>(null);
  const [billingInformation, setBillingInformation] = useState<IBillingInformation>();
  const location = useLocation();
  // @ts-ignore
  const [downloading, setDownloading] = useState<any>(false);
  const [generating, setGenerating] = useState<any>(false);

  useEffect(() => {
    if (location.state) {
      const state = location.state as ILocationState;

      setEstimate(state.estimate);
    }
  }, [location]);

  useEffect(() => {
    if (estimate) {
      const driver = estimate.rideShareDriver;
      const customer = estimate.customer;
      const _parts = estimate.parts as unknown as IPart[];
      const _labours = estimate.labours as unknown as ILabour[];

      const _owner = driver ? `${driver.firstName} ${driver.lastName}` : `${customer.firstName} ${customer.lastName}`;
      setDriver(driver || customer);
      setOwner(capitalize.words(_owner));
      setBillingInformation(customer.billingInformation);
      setParts(_parts);
      setLabours(_labours);
    }
  }, [estimate]);

  const generateDownload = async () => {
    const rName = Math.ceil(Math.random() * 999 + 1100) + '.pdf';
    // @ts-ignore
    const payload = {
      type: 'ESTIMATE',
      id: estimate?.id || -1,
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

  const generateInvoice = async ()=>{
    // 
    try{
      const payload = {
        id: estimate?.id
      };
      setGenerating(true);

      const response = await axiosClient.post(`${API_ROOT}/transactions/generate-invoice-manually`, payload);
      const code = response.data.invoiceCode;
      console.log(code)
      // window.location.href = ('/invoices/'+code);
      window.location.replace('/invoices');

    }catch(e){
      alert('an error occurred');
      console.log(e)
    }

    setGenerating(false);
  }

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
    console.log('discount>', Math.ceil(total * (discount / 100)));
    return Math.ceil(total * (discount / 100));
  };

  const calculateTaxTotal = (estimate: IEstimate | undefined) => {
    console.log(
      'tax total, ',
      parseFloat(`${estimate?.tax}`.split(',').join('')) + parseFloat(`${estimate?.taxPart}`.split(',').join('')),
    );
    if (!estimate) return 0;

    return parseFloat(`${estimate?.tax}`.split(',').join('')) + parseFloat(`${estimate?.taxPart}`.split(',').join(''));
  };

  if (!estimate)
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
            <ArrowBackIosNew
              onClick={() => window.history.back()}
              style={{ position: 'absolute', cursor: 'pointer' }}
            />
          </Grid>
        </Grid>

        <Typography mb={3} textAlign="center" display="block" variant="subtitle1">
          #{estimate.code}
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {
            (
              ( ((estimate.status).toLowerCase() === 'sent') ) &&
              
              <Button style={{ marginRight: 20 }} variant="outlined" color="success" size="small" onClick={() => generateInvoice()}>
                {generating ? 'Generating...' : 'Generate Invoice'}
              </Button>
            )
          }

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
        {!estimate.vehicle ? (
          <Grid container my={3}>
            <Typography gutterBottom>No Vehicle Info.</Typography>
          </Grid>
        ) : (
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
        )}
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
          {parts.map((part, idx1) => {
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
                  {formatNumberToIntl(+part.price)} x {part.quantity.quantity} {part.quantity.unit}
                </Grid>
                <Grid item xs={3}>
                  {amount}
                </Grid>
              </Grid>
            );
          })}
          {labours.map((labour, idx1) => {
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
            <Typography gutterBottom>
              Subtotal: {formatNumberToIntl(estimate.partsTotal + estimate.laboursTotal)}
            </Typography>
            <Typography gutterBottom>
              VAT(7.5%):
              {
                // @ts-ignore
                formatNumberToIntl(calculateTaxTotal(estimate))
              }
            </Typography>
            <Typography gutterBottom>
              Discount:
              {
                // @ts-ignore
                `(${formatNumberToIntl(
                  calculateDiscount({
                    total: estimate.partsTotal + estimate.laboursTotal,
                    discount: estimate.discount,
                    discountType: estimate.discountType,
                  }),
                )})`
              }
            </Typography>
            {/* <Typography gutterBottom>VAT-Part(7.5%): {estimate.taxPart}</Typography> */}
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right" borderBottom="0.01px solid" borderColor="#676767">
            <Typography gutterBottom>
              TOTAL:{' '}
              {formatNumberToIntl(
                estimate.partsTotal +
                  estimate.laboursTotal -
                  calculateDiscount({
                    total: estimate.partsTotal + estimate.laboursTotal,
                    discount: estimate.discount,
                    discountType: estimate.discountType,
                  }) +
                  calculateTaxTotal(estimate),
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" my={3}>
          <Grid item xs={10} />
          <Grid item flexGrow={1} sx={{ pb: 2.5 }} textAlign="right">
            <Typography
              gutterBottom
              fontStyle="italic"
              color={theme => (theme.palette.mode === 'dark' ? '#ededed' : '#263238')}>
              Job Duration: {estimate.jobDurationValue} {estimate.jobDurationUnit}
            </Typography>
          </Grid>
        </Grid>
      </React.Fragment>
    );
}

export default EstimatePage;
