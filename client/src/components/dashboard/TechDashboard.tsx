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
import useAdmin from '../../hooks/useAdmin';
import capitalize from 'capitalize';

function TechDashboard() {

    const dispatch = useDispatch()
    const {user} = useAdmin()
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

      <div style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

        <h1 style={{ fontWeight: '500' }}>
          Welcome {user && capitalize.words(user?.firstName) || ""}
        </h1>
        <div>
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
      </div>
      <br />
      <br />

      <Stack
        direction="column"
        spacing={5}
        divider={<Divider orientation="horizontal" flexItem />}>
        <Stack direction={{xs: 'column'}}
          sx={{
            display: 'flex', flexDirection: {lg: 'column', xs: 'row'},
            justifyContent: 'left',
            alignItems: 'left',
            width: '100%', gap: 4
          }}
        >
          {/* <Grid container
            sx={{
              gap: {md: 5, xs: 3},
              display: 'flex', flexDirection: 'column',
              width: '100%', height: 'auto'
            }}
          > */}
            <Grid item
              sx={{
                display: 'flex',
                flexDirection: {lg: 'row', xs: 'column'},
                // justifyContent: 'center',
                width: {lg: '100%', xs: '50%'},
                gap: {lg: 8, md: 4, xs: 2}, ml: {lg: 10}
              }}
            >
                <DataCard title='Total Sales' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mRevenue || 0)} bgColor={teal[400]} />
                <DataCard title='Total Receipts' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mReceipt || 0)} bgColor={cyan[400]} />
                <DataCard title='Total Expenses' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mExpense || 0)} bgColor={lime[400]} />
            </Grid>

            <Grid item
              sx={{
                display: 'flex',
                flexDirection: {lg: 'row', xs: 'column'},
                // justifyContent: 'center',
                // width: window.screen.width - 160,
                width: {lg: '100%', xs: '50%'},
                gap: {lg: 8, md: 4, xs: 2}, ml: {lg: 10}
              }}
            >
                <DataCard title='Number of Estimate Sent' data={(techDashboardReducer?.mEstimate || 0)} bgColor={orange[300]} />
                <DataCard title='Number of Invoice Generated' data={(techDashboardReducer?.mInvoice || 0)} bgColor={orange[600]} />
                <DataCard title='Total Receivable' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mReceivable || 0)} bgColor={orange[900]} />
            </Grid>
          {/* </Grid> */}

        </Stack>
        <Stack direction={{ xs: 'column', sm: 'column' }}
          // spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{
            // width: window.screen.width - 160
            width: '100%'
          }}
        >

          <AppStackedColumnChart
            title="Sales Analysis"
            categories={MONTHS}
            yAxisText="Naira (₦)"
            series={techDashboardReducer?.series || []}
          />

        </Stack>
      </Stack>

      <AppLoader show={techDashboardReducerMain.getTechAnalyticsStatus === 'loading'} />
    </React.Fragment>
  );
}

export default TechDashboard;
