import React, { useEffect, useMemo, useState } from "react";
import { Divider, Paper, Stack, Typography } from "@mui/material";
import { cyan, lime, orange, teal } from "@mui/material/colors";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getAnalyticsAction } from "../../store/actions/dashboardActions";
import AnalyticsCard from "../../components/data/AnalyticsCard";
import AppPieChart from "../../components/charts/AppPieChart";
import moment from "moment";
import AppStackedColumnChart from "../../components/charts/AppStackedColumnChart";
import { MONTHS } from "../../config/constants";
import { computeMonthlyColumnChartData } from "../../utils/generic";
import { getCustomersAction } from "../../store/actions/customerActions";

function DashboardPage() {
  const [barChartSeries, setBarChartSeries] = useState<any[]>();

  const dashboardReducer = useAppSelector((state) => state.dashboardReducer);
  const customerReducer = useAppSelector((state) => state.customerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dashboardReducer.getAnalyticsStatus === "idle") {
      dispatch(getAnalyticsAction());
    }
  }, [dashboardReducer.getAnalyticsStatus, dispatch]);

  useEffect(() => {
    if (customerReducer.getCustomersStatus === "idle") {
      dispatch(getCustomersAction());
    }
  }, [customerReducer.getCustomersStatus, dispatch]);

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

  const totalCustomers = useMemo(
    () => customerReducer.customers.length,
    [customerReducer.customers]
  );

  return (
    <React.Fragment>
      <Typography
        variant="h6"
        component="h6"
        sx={{ m: { xs: 1, sm: 1, md: 2 } }}
      >
        Total customers: {totalCustomers}
      </Typography>
      <Stack
        direction="column"
        spacing={5}
        justifyContent="center"
        alignItems="center"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <AnalyticsCard
            data={dashboardReducer.analytics?.dailyData.appointments.data[0]}
            bgColor={teal[400]}
          />
          <AnalyticsCard
            data={dashboardReducer.analytics?.dailyData.customers.data[0]}
            bgColor={cyan[400]}
          />
          <AnalyticsCard
            data={dashboardReducer.analytics?.dailyData.vehicles.data[0]}
            bgColor={lime[400]}
          />
          <AnalyticsCard
            data={dashboardReducer.analytics?.dailyData.transactions.data[0]}
            bgColor={orange[300]}
          />
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Paper>
            <AppPieChart
              title={`Appointments, ${moment().format("MMM YYYY")}.`}
              series={dashboardReducer.analytics?.monthlyData.appointments}
            />
          </Paper>
          <Paper>
            <AppPieChart
              title={`Customers, ${moment().format("MMM YYYY")}.`}
              series={dashboardReducer.analytics?.monthlyData.customers}
            />
          </Paper>
          <Paper>
            <AppPieChart
              title={`Vehicles, ${moment().format("MMM YYYY")}.`}
              series={dashboardReducer.analytics?.monthlyData.vehicles}
            />
          </Paper>
          <Paper>
            <AppPieChart
              title={`Transactions, ${moment().format("MMM YYYY")}.`}
              series={dashboardReducer.analytics?.monthlyData.transactions}
            />
          </Paper>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{ width: "100%" }}
        >
          <AppStackedColumnChart
            title=""
            categories={MONTHS}
            yAxisText="Monthly Appointments, Customers, Vehicles and Transactions"
            series={barChartSeries}
          />
        </Stack>
      </Stack>
    </React.Fragment>
  );
}

export default DashboardPage;
