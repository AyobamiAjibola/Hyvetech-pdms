import React, { useEffect, useMemo, useState } from 'react';
import { Box, Divider, Grid, InputLabel, MenuItem, Paper, TextField } from '@mui/material';
import AnalyticsCard from '../data/AnalyticsCard';
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lime, orange, pink, purple, red, teal, yellow } from '@mui/material/colors';
import AppPieChart from '../charts/AppPieChart';
import moment from 'moment';
import AppStackedColumnChart from '../charts/AppStackedColumnChart';
import { MONTHS } from '../../config/constants';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getAnalyticsAction, getSuperAnalyticsAction } from '../../store/actions/dashboardActions';
import { computeMonthlyColumnChartData, formatNumberToIntl } from '../../utils/generic';
import { getDriversAction } from '../../store/actions/rideShareActions';
import AppLoader from '../loader/AppLoader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { getTechniciansAction } from '../../store/actions/technicianActions';
import DataCard from '../data/DataCard';
import { getPartnersAction } from '../../store/actions/partnerActions';
import useNewCustomer from '../../hooks/useNewCustomer';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function AdminDashboard() {
  const [barChartSeries, setBarChartSeries] = useState<any[]>();
  const [_month, _setMonth] = useState<any | null>(null);
  const [monthly, setMonthly] = useState<any | null>(((new Date()).getMonth() + 1));
  const [_year, _setYear] = useState<any | null>(null);
  const [_day, _setDay] = useState<any | null>(null);
  const [_params, _setParams] = useState<any | null>(null);
  const [_paramYear, _setParamYear] = useState<any | null>(null);
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterBool, setFilterBool] = useState("false");

  const dispatch = useAppDispatch();

  const dashboardReducer = useAppSelector(state => state.dashboardReducer);
  const customers = useNewCustomer();
  const rideShareReducer = useAppSelector(state => state.rideShareReducer);
  const technicianReducer = useAppSelector(state => state.technicianReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);

  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const yearOptions = [];

    for (let year = currentYear; year >= startYear; year--) {
      yearOptions.push(<MenuItem key={year} value={year}>{year}</MenuItem>);
    }

    return (
      <Select
        labelId="annual-data-label"
        id="annual-data"
        label="Annual Data"
        value={_paramYear || ''}
        onChange={(e: any) => {_setParams(null), setMonthly(null), _setParamYear(e.target.value)}}
      >
        <MenuItem value=''><em>None</em></MenuItem>
        {yearOptions}
      </Select>
    );
  };

  const handleChange = (event: any) => {
    setFilterBool(event.target.value);
  };

  useEffect(()=>{
      // @ts-ignore
      dispatch(getSuperAnalyticsAction({
        year: _year, month: _month, paramMonth: monthly,
        day: _day, params: _params, paramYear: _paramYear
      }))
  }, [_day, _params, _paramYear, monthly])

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === 'idle') {
      dispatch(getAnalyticsAction());
    }
  }, [dashboardReducer.getAnalyticsStatus, dispatch]);

  useEffect(() => {
    dispatch(getDriversAction());
    dispatch(getTechniciansAction());
    dispatch(getPartnersAction());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === 'completed') {
      if (dashboardReducer.analytics) {
        setBarChartSeries(computeMonthlyColumnChartData(dashboardReducer.analytics));
      }
    }
  }, [dashboardReducer.analytics, dashboardReducer.stackedMonthlyData, dashboardReducer.getAnalyticsStatus]);

  const totalDrivers = useMemo(() => rideShareReducer.drivers.length, [rideShareReducer.drivers]);
  const totalTechnicians = useMemo(() => technicianReducer.technicians.length, [technicianReducer.technicians]);
  const totalPartners = useMemo(() => partnerReducer.partners.length, [partnerReducer.partners]);

  const handleDate = (newValue: any) => {
    setFilterDate(newValue)
  }

  useEffect(() => {
    if(filterBool === "true") {
      _setDay(filterDate.getDate());
      _setMonth(filterDate.getMonth() + 1);
      _setYear(filterDate.getFullYear());
    } else if (filterBool === "false") {
      _setDay(null);
      _setMonth(null);
      _setYear(null);
    }
  }, [filterDate, filterBool]);

  useEffect(() => {
    if(filterBool === "true") {
      setMonthly(null);
      _setParams(null)
      _setParamYear(null)
    } else if (filterBool === "false") {
      setMonthly((new Date()).getMonth() + 1)
    }
  }, [filterBool]);

  return (
    <React.Fragment>
      <Box
        sx={{
          width: '100%',
          ml: 2, mr: 2
        }}
      >
        <Box mb={2}>
          <FormControl component="fieldset">
            <RadioGroup aria-label="truthFalse" name="truthFalse" value={filterBool} onChange={handleChange}>
              {filterBool === "false" && <FormControlLabel value="true" control={<Radio />} label="Filter by date" />}
              {filterBool === "true" && <FormControlLabel value="false" control={<Radio />} label="Filter by months, week and years" />}
            </RadioGroup>
          </FormControl>
        </Box>
        {filterBool === "true" &&
          <Box mt={2} mb={2}
            sx={{ width: '50%' }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                minDate={new Date('2022/01/01')}
                openTo="year"
                views={['year', 'month', 'day']}
                value={filterDate}
                onChange={ handleDate }
                renderInput={(params: any) =>
                  <TextField
                    {...params}
                    fullWidth
                    label="Filter analytics data"
                    variant="outlined"
                  />
                }
              />
            </LocalizationProvider>
          </Box>
        }
        {filterBool === "false" &&
          <Box
            sx={{
              display: 'flex',
              width: '60%',
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="weekly-select-label">Weekly Data</InputLabel>
              <Select
                labelId="weekly-select-label"
                id="weekly-select"
                value={_params || ''}
                label="Weekly Data"
                onChange={(e: any) =>{_setParamYear(null), setMonthly(null), _setParams(e.target.value)}}
              >
                <MenuItem value=''><em>None</em></MenuItem>
                <MenuItem value={"this_week"}>This Week&apos;s data</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="annual-data-label">Annual Data</InputLabel>
                {renderYearOptions()}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="monthly-select-label">Monthly Data</InputLabel>
              <Select
                labelId="monthly-select-label"
                id="monthly-select"
                value={monthly || ''}
                label="monthly Data"
                onChange={(e: SelectChangeEvent) => {_setParams(null), _setParamYear(null), setMonthly(e.target.value as string)}}
              >
                <MenuItem value=''><em>None</em></MenuItem>
                <MenuItem value={"1"}>January</MenuItem>
                <MenuItem value={"2"}>February</MenuItem>
                <MenuItem value={"3"}>March</MenuItem>
                <MenuItem value={"4"}>April</MenuItem>
                <MenuItem value={"5"}>May</MenuItem>
                <MenuItem value={"6"}>June</MenuItem>
                <MenuItem value={"7"}>July</MenuItem>
                <MenuItem value={"8"}>August</MenuItem>
                <MenuItem value={"9"}>September</MenuItem>
                <MenuItem value={"10"}>October</MenuItem>
                <MenuItem value={"11"}>November</MenuItem>
                <MenuItem value={"12"}>December</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Partners" data={totalPartners} bgColor={green[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard data={(dashboardReducer.superAnalytics?.mAllCustomer || 0)} title="Total Customers" bgColor={blueGrey[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Drivers" data={totalDrivers} bgColor={indigo[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Technicians" data={totalTechnicians} bgColor={brown[600]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Estimates" data={(dashboardReducer.superAnalytics?.mAllEstimate || 0)} bgColor={orange[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Invoices" data={(dashboardReducer.superAnalytics?.mAllInvoice || 0)} bgColor={purple[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Expenses" data={(dashboardReducer.superAnalytics?.mAllExpense || 0)} bgColor={yellow[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Payment Recorded" data={(dashboardReducer.superAnalytics?.mAllPayment || 0)} bgColor={pink[600]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Estimate Value" data={'₦ '+formatNumberToIntl(dashboardReducer.superAnalytics?.estimateValue || 0)} bgColor={amber[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Invoice Value" data={'₦ '+formatNumberToIntl(dashboardReducer.superAnalytics?.invoiceValue || 0)} bgColor={lime[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Payments Received" data={'₦ '+formatNumberToIntl(dashboardReducer.superAnalytics?.paymentReceived || 0)} bgColor={pink[300]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Expense Value" data={'₦ '+formatNumberToIntl(dashboardReducer.superAnalytics?.expenseValue || 0)} bgColor={red[600]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Receivables" data={'₦ '+formatNumberToIntl(dashboardReducer.superAnalytics?.receivables || 0)} bgColor={deepPurple[600]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <AnalyticsCard data={dashboardReducer.analytics?.dailyData.appointments.data[0]} bgColor={teal[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <AnalyticsCard data={dashboardReducer.analytics?.dailyData.customers.data[0]} bgColor={cyan[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <AnalyticsCard data={dashboardReducer.analytics?.dailyData.vehicles.data[0]} bgColor={blue[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <AnalyticsCard
                data={dashboardReducer.analytics?.dailyData.transactions.data[0]}
                bgColor={deepOrange[600]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Customers, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.customers}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Appointments, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.appointments}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Vehicles, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.vehicles}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Transactions, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.transactions}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>

        <Grid item xs={12}>
          <AppStackedColumnChart
            title=""
            categories={MONTHS}
            yAxisText="Monthly Appointments, Customers, DriverVehicles, Transactions, Total Sales value, and Total Expenses value"
            series={barChartSeries}
          />
        </Grid>
      </Grid>
      <AppLoader show={dashboardReducer.getAnalyticsStatus === 'loading'} />
      <AppLoader show={customers.loading} />
      <AppLoader show={rideShareReducer.getDriversStatus === 'loading'} />
      <AppLoader show={technicianReducer.getTechniciansStatus === 'loading'} />
      <AppLoader show={dashboardReducer.getSuperAnalyticsStatus === 'loading'} />
    </React.Fragment>
  );
}

export default AdminDashboard;
