import React from "react";
import { Divider, Paper, Stack, Typography } from "@mui/material";
import AnalyticsCard from "../data/AnalyticsCard";
import { cyan, lime, orange, teal } from "@mui/material/colors";
import AppPieChart from "../charts/AppPieChart";
import moment from "moment";
import AppStackedColumnChart from "../charts/AppStackedColumnChart";
import { MONTHS } from "../../config/constants";

function GarageDashboard() {
  return (
    <React.Fragment>
      <Typography variant="h6" component="h6" sx={{ m: { xs: 1, sm: 1, md: 2 } }}>
        Total customers: {0}
      </Typography>
      <Stack
        direction="column"
        spacing={5}
        justifyContent="center"
        alignItems="center"
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          <AnalyticsCard data={[]} bgColor={teal[400]} />
          <AnalyticsCard data={[]} bgColor={cyan[400]} />
          <AnalyticsCard data={[]} bgColor={lime[400]} />
          <AnalyticsCard data={[]} bgColor={orange[300]} />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          <Paper>
            <AppPieChart title={`Appointments, ${moment().format("MMM YYYY")}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`Customers, ${moment().format("MMM YYYY")}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`DriverVehicles, ${moment().format("MMM YYYY")}.`} series={[]} />
          </Paper>
          <Paper>
            <AppPieChart title={`Transactions, ${moment().format("MMM YYYY")}.`} series={[]} />
          </Paper>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }} sx={{ width: "100%" }}>
          <AppStackedColumnChart
            title=""
            categories={MONTHS}
            yAxisText="Monthly Appointments, Customers, DriverVehicles and Transactions"
            series={[]}
          />
        </Stack>
      </Stack>
    </React.Fragment>
  );
}

export default GarageDashboard;
