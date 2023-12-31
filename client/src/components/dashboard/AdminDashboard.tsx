import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  // InputLabel, MenuItem,
  Paper,
  TextField,
} from "@mui/material";
// import AnalyticsCard from '../data/AnalyticsCard';
import {
  amber,
  blueGrey,
  brown,
  cyan,
  deepPurple,
  green,
  indigo,
  lime,
  orange,
  pink,
  purple,
  red,
} from "@mui/material/colors";
import AppPieChart from "../charts/AppPieChart";
import moment from "moment";
import AppStackedColumnChart from "../charts/AppStackedColumnChart";
import { MONTHS } from "../../config/constants";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import {
  getAnalyticsAction,
  getMainAccountTransactionAnalytics,
  getSuperAnalyticsAction,
} from "../../store/actions/dashboardActions";
import {
  computeMonthlyColumnChartData,
  formatNumberToIntl,
} from "../../utils/generic";
import { getDriversAction } from "../../store/actions/rideShareActions";
import AppLoader from "../loader/AppLoader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getTechniciansAction } from "../../store/actions/technicianActions";
import DataCard from "../data/DataCard";
import { getPartnersAction } from "../../store/actions/partnerActions";
import useNewCustomer from "../../hooks/useNewCustomer";
import {
  CalendarMonth,
  Cancel,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { startOfMonth, endOfDay } from "date-fns";

function AdminDashboard() {
  const [barChartSeries, setBarChartSeries] = useState<any[]>();
  const [_month, _setMonth] = useState<any | null>(null);
  const [_year, _setYear] = useState<any | null>(null);
  const [_day, _setDay] = useState<any | null>(null);
  const [filterDate, setFilterDate] = useState(new Date());
  const [toggle, setToggle] = useState<boolean>(false);
  const [_startDate, _setStartDate] = useState<any | null>();
  const [_endDate, _setEndDate] = useState<any | null>();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const dashboardReducer = useAppSelector((state) => state.dashboardReducer);
  const customers = useNewCustomer();
  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const technicianReducer = useAppSelector((state) => state.technicianReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);

  const handleChange = () => {
    setToggle(!toggle);
    setShowCalendar(false);
  };

  const handleSelect = (ranges: any) => {
    _setStartDate(ranges.selection.startDate);
    _setEndDate(ranges.selection.endDate);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(
      getSuperAnalyticsAction({
        year: _year,
        month: _month,
        day: _day,
        start_date: _startDate,
        end_date: _endDate,
      })
    );

    dispatch(getMainAccountTransactionAnalytics());
  }, [_day, _endDate]);

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === "idle") {
      dispatch(getAnalyticsAction());
    }
  }, [dashboardReducer.getAnalyticsStatus, dispatch]);

  useEffect(() => {
    dispatch(getDriversAction());
    dispatch(getTechniciansAction());
    dispatch(getPartnersAction());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === "completed") {
      if (dashboardReducer.analytics) {
        setBarChartSeries(
          computeMonthlyColumnChartData(dashboardReducer.analytics)
        );
      }
    }
  }, [
    dashboardReducer.analytics,
    dashboardReducer.stackedMonthlyData,
    dashboardReducer.getAnalyticsStatus,
  ]);

  const handleDate = (newValue: any) => {
    setFilterDate(newValue);
  };

  useEffect(() => {
    if (toggle === true) {
      _setDay(filterDate.getDate());
      _setMonth(filterDate.getMonth() + 1);
      _setYear(filterDate.getFullYear());
    } else if (toggle === false) {
      _setDay(null);
      _setMonth(null);
      _setYear(null);
    }
  }, [filterDate, toggle]);

  useEffect(() => {
    if (toggle === true) {
      _setStartDate(null);
      _setEndDate(null);
    } else if (toggle === false) {
      _setStartDate(startOfMonth(new Date()));
      _setEndDate(endOfDay(new Date()));
    }
  }, [toggle]);

  //@ts-ignore
  const yes = partnerReducer.partners.filter(partner => partner.upVote === 'yes')
  //@ts-ignore
  const no = partnerReducer.partners.filter(partner => partner.upVote === 'no')

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          ml: { lg: 13, xs: 2 },
          mr: { lg: 0, xs: 2 },
        }}
      >
        <Box mb={2}>
          <IconButton
            onClick={handleChange}
            aria-label="Click to toggle date range"
          >
            {toggle ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ToggleOn color="success" fontSize="large" />
                &nbsp;
                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                  Filter by date
                </span>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ToggleOff color="warning" fontSize="large" />
                &nbsp;
                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                  Filter by date range
                </span>
              </Box>
            )}
          </IconButton>
        </Box>
        {toggle === true && (
          <Box mt={2} mb={2} sx={{ width: "50%" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                minDate={new Date("2022/01/01")}
                openTo="year"
                views={["year", "month", "day"]}
                value={filterDate}
                onChange={handleDate}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleCalendar}>
                      <CalendarMonth fontSize="large" />
                    </IconButton>
                  ),
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Filter analytics data"
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        )}
        {toggle === false && (
          <Box
            sx={{
              display: "flex",
              width: { lg: "60%", xs: "100%" },
              mb: 2,
            }}
          >
            {!showCalendar && (
              <Box sx={{ width: "100%" }}>
                <TextField
                  id="outlined-read-only-input"
                  label=""
                  value={`${moment(_startDate)?.format(
                    "MMMM D, YYYY"
                  )} - ${moment(new Date())?.format("MMMM D, YYYY")}`}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={toggleCalendar}>
                        <CalendarMonth fontSize="large" />
                      </IconButton>
                    ),
                  }}
                  sx={{ width: "70%" }}
                />
              </Box>
            )}
            <Collapse in={showCalendar} timeout={{ enter: 800, exit: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={() => setShowCalendar(false)}
                    sx={{
                      color: "#FF6666",
                    }}
                  >
                    <Cancel fontSize="medium" />
                  </IconButton>
                </Box>
                <DateRangePicker
                  maxDate={new Date()}
                  ranges={[
                    {
                      startDate: _startDate,
                      endDate: _endDate,
                      key: "selection",
                    },
                  ]}
                  onChange={handleSelect}
                />
              </Box>
            </Collapse>
          </Box>
        )}
      </Box>
        
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            ml: 12, gap: 3, my: 4
          }}
        >
          <DataCard
            title="YES"
            data={yes.length || 0}
            bgColor={green[500]}
          />
          <DataCard
            title="NO"
            data={no.length || 0}
            bgColor={red[500]}
          />
        </Box>

      <Grid
        container
        spacing={{ xs: 3, md: 6 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Grid
          item
          xs={12}
          container
          direction="column"
          sx={{
            ml: { lg: 12, md: 6 },
          }}
        >
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Total Partners"
                data={dashboardReducer.superAnalytics?.mAllPartner || 0}
                bgColor={brown[400]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                data={dashboardReducer.superAnalytics?.mAllCustomer || 0}
                title="Total Customers"
                bgColor={blueGrey[600]}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Users"
                data={dashboardReducer.superAnalytics?.mAllUser || 0}
                bgColor={indigo[600]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="column"
          sx={{
            ml: { lg: 12, md: 6 },
          }}
        >
          <Grid item container xs spacing={4}>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Total Estimate Value"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.superAnalytics?.estimateValue || 0
                  )
                }
                bgColor={amber[600]}
                count={dashboardReducer.superAnalytics?.mAllEstimate}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Total Invoice Value"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.superAnalytics?.invoiceValue || 0
                  )
                }
                bgColor={lime[600]}
                count={dashboardReducer.superAnalytics?.mAllInvoice}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Total Payments Received"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.superAnalytics?.paymentReceived || 0
                  )
                }
                bgColor={pink[300]}
                count={dashboardReducer.superAnalytics?.mAllPayment}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="column"
          sx={{
            ml: { lg: 12, md: 6 },
          }}
        >
          <Grid item container xs spacing={4}>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Total Expense Value"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.superAnalytics?.expenseValue || 0
                  )
                }
                bgColor={orange[300]}
                count={dashboardReducer.superAnalytics?.mAllExpense}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Total Receivables"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.superAnalytics?.receivables || 0
                  )
                }
                bgColor={deepPurple[600]}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard
                title="Vehicles"
                data={dashboardReducer.superAnalytics?.mAllVehicle || 0}
                bgColor={deepPurple[600]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="column"
          sx={{
            ml: { lg: 7, md: 6 },
          }}
        >
          <Grid item container xs spacing={4}>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Item(s)"
                data={dashboardReducer.superAnalytics?.mAllReminder || 0}
                bgColor={cyan[600]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: -1 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Item(s)"
                data={dashboardReducer.superAnalytics?.mAllItem || 0}
                bgColor={purple[600]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              {/* <DataCard title="" data={0} bgColor={purple[100]} /> */}
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          container
          direction="column"
          sx={{
            ml: { lg: 7, md: 6 },
          }}
        >
          <Grid item container xs spacing={4}>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Gross Inflow"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.transaction.totalCredit / 100 || 0
                  )
                }
                bgColor={cyan[600]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: -1 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Number of Transactions"
                data={dashboardReducer.transaction.totalRecordInStore || 0}
                bgColor={purple[600]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                ml: { md: 5 },
                mr: { md: 5 },
              }}
            >
              <DataCard
                title="Gross Transaction Volumne"
                data={
                  "₦ " +
                  formatNumberToIntl(
                    dashboardReducer.transaction.totalDebit / 100 || 0
                  )
                }
                bgColor={purple[100]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>

        {/* DAILY DATA */}
        {/* <Grid item xs={12} container direction="column">
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
        </Grid>*/}

        <Grid item xs={12} container direction="column">
          <Grid
            item
            container
            xs
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Customers, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData?.customers}
                />
              </Paper>
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Appointments, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.appointments}
                />
              </Paper>
            </Grid> */}
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Vehicles, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData?.vehicles}
                />
              </Paper>
            </Grid>

            {/* <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Transactions, ${moment().format('MMM YYYY')}.`}
                  series={dashboardReducer.analytics?.monthlyData?.transactions}
                />
              </Paper>
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider orientation="horizontal" flexItem />
        </Grid>

        <Grid item xs={12}>
          <AppStackedColumnChart
            title=""
            categories={MONTHS}
            yAxisText="Customers, Vehicles, Payment Recorded, and Number of Expenses"
            series={barChartSeries}
          />
        </Grid>
      </Grid>
      <AppLoader show={dashboardReducer.getAnalyticsStatus === "loading"} />
      <AppLoader show={customers.loading} />
      <AppLoader show={rideShareReducer.getDriversStatus === "loading"} />
      <AppLoader show={technicianReducer.getTechniciansStatus === "loading"} />
      <AppLoader
        show={dashboardReducer.getSuperAnalyticsStatus === "loading"}
      />
    </React.Fragment>
  );
}

export default AdminDashboard;
