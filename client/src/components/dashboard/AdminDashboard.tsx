import React, { useEffect, useMemo, useState } from "react";
import { Divider, Grid, Paper } from "@mui/material";
import AnalyticsCard from "../data/AnalyticsCard";
import { blue, blueGrey, brown, cyan, deepOrange, green, indigo, teal } from "@mui/material/colors";
import AppPieChart from "../charts/AppPieChart";
import moment from "moment";
import AppStackedColumnChart from "../charts/AppStackedColumnChart";
import { MONTHS } from "../../config/constants";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getAnalyticsAction } from "../../store/actions/dashboardActions";
import { getCustomersAction } from "../../store/actions/customerActions";
import { computeMonthlyColumnChartData } from "../../utils/generic";
import { getDriversAction } from "../../store/actions/rideShareActions";
import AppLoader from "../loader/AppLoader";

import { getTechniciansAction } from "../../store/actions/technicianActions";
import DataCard from "../data/DataCard";
import { getPartnersAction } from "../../store/actions/partnerActions";

function AdminDashboard() {
  const [barChartSeries, setBarChartSeries] = useState<any[]>();

  const dashboardReducer = useAppSelector((state) => state.dashboardReducer);
  const customerReducer = useAppSelector((state) => state.customerReducer);
  const rideShareReducer = useAppSelector((state) => state.rideShareReducer);
  const technicianReducer = useAppSelector((state) => state.technicianReducer);
  const partnerReducer = useAppSelector((state) => state.partnerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === "idle") {
      dispatch(getAnalyticsAction());
    }
  }, [dashboardReducer.getAnalyticsStatus, dispatch]);

  useEffect(() => {
    dispatch(getCustomersAction());
    dispatch(getDriversAction());
    dispatch(getTechniciansAction());
    dispatch(getPartnersAction());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === "completed") {
      if (dashboardReducer.analytics) {
        setBarChartSeries(computeMonthlyColumnChartData(dashboardReducer.analytics));
      }
    }
  }, [dashboardReducer.analytics, dashboardReducer.stackedMonthlyData, dashboardReducer.getAnalyticsStatus]);

  const totalCustomers = useMemo(() => customerReducer.customers.length, [customerReducer.customers]);

  const totalDrivers = useMemo(() => rideShareReducer.drivers.length, [rideShareReducer.drivers]);

  const totalTechnicians = useMemo(() => technicianReducer.technicians.length, [technicianReducer.technicians]);

  const totalPartners = useMemo(() => partnerReducer.partners.length, [partnerReducer.partners]);

  return (
    <React.Fragment>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Grid item xs={12} container direction="column">
          <Grid item container xs spacing={2}>
            <Grid item xs={12} md={3}>
              <DataCard title="Total Partners" data={totalPartners} bgColor={green[600]} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DataCard data={totalCustomers} title="Total Customers" bgColor={blueGrey[600]} />
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
                  title={`Customers, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData.customers}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Appointments, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData.appointments}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Vehicles, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData.vehicles}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper>
                <AppPieChart
                  title={`Transactions, ${moment().format("MMM YYYY")}.`}
                  series={dashboardReducer.analytics?.monthlyData.transactions}
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
            yAxisText="Monthly Appointments, Customers, DriverVehicles and Transactions"
            series={barChartSeries}
          />
        </Grid>
      </Grid>
      <AppLoader show={dashboardReducer.getAnalyticsStatus === "loading"} />
      <AppLoader show={customerReducer.getCustomersStatus === "loading"} />
      <AppLoader show={rideShareReducer.getDriversStatus === "loading"} />
      <AppLoader show={technicianReducer.getTechniciansStatus === "loading"} />
    </React.Fragment>
  );
}

export default AdminDashboard;
