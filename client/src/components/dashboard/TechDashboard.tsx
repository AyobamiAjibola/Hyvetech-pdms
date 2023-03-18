import React, { useEffect, useState } from 'react';
import { Divider,
    Grid,
    Select,
    // Paper,
    Stack } from '@mui/material';
// import AnalyticsCard from '../data/AnalyticsCard';
import { cyan, lime, orange, teal } from '@mui/material/colors';
// import AppPieChart from '../charts/AppPieChart';
// import moment from 'moment';
import AppStackedColumnChart from '../charts/AppStackedColumnChart';
import { MONTHS } from '../../config/constants';
import DataCard from '../data/DataCard';
import { useDispatch } from 'react-redux';
import { getTechAnalyticsAction } from '../../store/actions/dashboardActions';
import useAppSelector from '../../hooks/useAppSelector';
import { formatNumberToIntl } from '../../utils/generic';
import AppLoader from '../loader/AppLoader';

function TechDashboard() {

    const dispatch = useDispatch()
    const techDashboardReducer = useAppSelector( _ => _.dashboardReducer.techAnalytics)
    const techDashboardReducerMain = useAppSelector( _ => _.dashboardReducer)
    const [_month, _setMonth] = useState<any>( ( (new Date()).getMonth() + 1 )  )

    useEffect(()=>{
        // @ts-ignore
        dispatch(getTechAnalyticsAction(_month))
    }, [_month])
  return (
    <React.Fragment>
      {/* <Typography variant="h6" component="h6" sx={{ m: { xs: 1, sm: 1, md: 2 } }}>
        Total customers: {0}
      </Typography> */}

      <div style={{ display: 'flex', width: window.screen.width - 160, justifyContent: 'flex-end' }}>
        <Select value={_month} onChange={(e: any) => _setMonth(e.target.value)} native={true}>
            <option value={"1"}>January</option>
            <option value={"2"}>February</option>
            <option value={"3"}>March</option>
            <option value={"4"}>April</option>
            <option value={"5"}>May</option>
            <option value={"6"}>June</option>
            <option value={"7"}>July</option>
            <option value={"8"}>August</option>
            <option value={"9"}>Sepetember</option>
            <option value={"10"}>October</option>
            <option value={"11"}>November</option>
            <option value={"12"}>December</option>
        </Select>
      </div>
      <br />
      <br />

      <Stack
        direction="column"
        spacing={5}
        // justifyContent="center"
        // alignItems="center"
        divider={<Divider orientation="horizontal" flexItem />}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid container style={{ flex: 1, display: 'flex', }}>
                <Grid item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: window.screen.width - 160, marginBottom: 25 }}>
                    <DataCard title='Total Revenue' data={formatNumberToIntl(techDashboardReducer?.mRevenue || 0)} bgColor={teal[400]} />
                    <DataCard title='Total Receivables' data={formatNumberToIntl(techDashboardReducer?.mReceivable || 0)} bgColor={cyan[400]} />
                    <DataCard title='Total Expenses' data={(techDashboardReducer?.mExpense || 0)} bgColor={lime[400]} />
                </Grid>

                <Grid item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: window.screen.width - 160, }}>
                    <DataCard title='Total Number of Estimate' data={(techDashboardReducer?.mEstimate || 0)} bgColor={orange[300]} />
                    <DataCard title='Total Number of Invoice' data={(techDashboardReducer?.mInvoice || 0)} bgColor={orange[600]} />
                    <DataCard title='Total Number of Customer' data={(techDashboardReducer?.mCustomer || 0)} bgColor={orange[900]} />
                </Grid>
            </Grid>
          
        </Stack>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          <Paper>
            <AppPieChart title={`Appointments, ${moment().format('MMM YYYY')}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`Customers, ${moment().format('MMM YYYY')}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`DriverVehicles, ${moment().format('MMM YYYY')}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`Transactions, ${moment().format('MMM YYYY')}.`} series={[]} />
          </Paper>
        </Stack> */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} sx={{ width: '100%' }}>
          <AppStackedColumnChart
            title=""
            categories={MONTHS}
            yAxisText="Monthly Data for Sales, Receipt, Expenses"
            series={techDashboardReducer?.series || []}
          />
        </Stack>
      </Stack>

      <AppLoader show={techDashboardReducerMain.getTechAnalyticsStatus === 'loading'} />
    </React.Fragment>
  );
}

export default TechDashboard;
