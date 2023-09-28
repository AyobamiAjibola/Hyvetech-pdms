import React, { useEffect, useState } from 'react';
import { Box, Divider,
    Grid,
    // Select,
    // Paper,
    Stack, 
    Typography} from '@mui/material';
// import AnalyticsCard from '../data/AnalyticsCard';
import { cyan, green, lime, orange, purple, teal } from '@mui/material/colors';
// import AppPieChart from '../charts/AppPieChart';
// import moment from 'moment';
import AppStackedColumnChart from '../charts/AppStackedColumnChart';
import { MONTHS } from '../../config/constants';
import DataCard from '../data/DataCard';
import useAppSelector from '../../hooks/useAppSelector';
import { formatNumberToIntl } from '../../utils/generic';
import AppLoader from '../loader/AppLoader';
import useAdmin from '../../hooks/useAdmin';
import capitalize from 'capitalize';
import { DatePicker } from 'antd';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getTechAnalyticsAction } from '../../store/actions/dashboardActions';

const { RangePicker } = DatePicker;

function TechDashboard() {

    const dispatch = useAppDispatch()
    const {user} = useAdmin()
    const techDashboardReducer = useAppSelector( _ => _.dashboardReducer.techAnalytics)
    const techDashboardReducerMain = useAppSelector( _ => _.dashboardReducer)
    const [_month, _setMonth] = useState<any>( ( (new Date()).getMonth() + 1 )  );
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [reload, setReload] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<any>(new Date().getFullYear());

    const handleDateRangeChange = (dates: any) => {
      if(dates) {
          setStartDate(moment(dates[0].$d).format('YYYY/MM/DD'))
          setEndDate(moment(dates[1].$d).format('YYYY/MM/DD'))
      } else {
        setReload(true)
      }
    };

    useEffect(() => {
      if(techDashboardReducerMain.getTechAnalyticsStatus === 'idle' || start_date || end_date || selectedYear || reload) {
        dispatch(getTechAnalyticsAction({
          start_date, end_date, year: selectedYear
        }))
      }
    },[
      techDashboardReducerMain.getTechAnalyticsStatus,
      start_date, end_date, selectedYear, reload
    ])

    useEffect(() => {
      if(techDashboardReducerMain.getTechAnalyticsStatus === 'completed') {
        setStartDate("");
        setEndDate("");
        setSelectedYear(null);
        setReload(false)
      }
    },[techDashboardReducerMain.getTechAnalyticsStatus])
    // useEffect(()=>{
    //     // @ts-ignore
    //     dispatch(getTechAnalyticsAction(_month))
    // }, [_month])
  return (
    <React.Fragment>
      {/* <Typography variant="h6" component="h6" sx={{ m: { xs: 1, sm: 1, md: 2 } }}>
        Total customers: {0}
      </Typography> */}

      <Box component='div'
        sx={{
          display: 'flex',
          width: {sm: '80%', xs: document.documentElement.clientWidth},
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

        <Typography sx={{ fontWeight: 600, fontSize: {sm: 30, xs: 25} }}>
          Welcome {user && capitalize.words(user?.firstName) || ""}
        </Typography>
        <div
          style={{
            justifyContent: 'right',
            alignItems: 'right'
          }}
          >
          <RangePicker onChange={handleDateRangeChange}
            style={{
                width: '100%',
                height: '2rem'
            }}
          />
        </div>
      </Box>
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
            width: {sm: '100%', xs: document.documentElement.clientWidth},
            gap: 4
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
                <DataCard title='Estimates Sent' data={(techDashboardReducer?.mEstimate || 0)} bgColor={orange[300]} />
                <DataCard title='Invoices Generated' data={(techDashboardReducer?.mInvoice || 0)} bgColor={orange[600]} />
                <DataCard title='Total Receivable' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mReceivable || 0)} bgColor={orange[900]} />
            </Grid>

            <Grid item
              sx={{
                display: 'flex',
                flexDirection: {lg: 'row', xs: 'column'},
                width: {lg: '100%', xs: '50%'},
                gap: {lg: 8, md: 4, xs: 2}, ml: {lg: 10}
              }}
            >
                <DataCard title='Service(s) Due' data={(techDashboardReducer?.mReminder || 0)} bgColor={green[300]} />
                <DataCard title='Profit/Loss' data={'₦ '+formatNumberToIntl(techDashboardReducer?.mRevenue - techDashboardReducer?.mExpense || 0)} bgColor={purple[300]} />
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
