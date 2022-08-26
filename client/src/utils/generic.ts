import { IDashboardData } from "@app-interfaces";

export function formatNumberToIntl(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
  }).format(amount);
}

export function computeMonthlyColumnChartData(dashboardData: IDashboardData) {
  const appointmentData = dashboardData.monthlyData.appointments.data.map(
    (value: any) => value.y
  );
  const appointment = {
    name: dashboardData.monthlyData.appointments.name,
    data: appointmentData,
    stack: "A",
  };

  const customerData = dashboardData.monthlyData.customers.data.map(
    (value: any) => value.y
  );
  const customer = {
    name: dashboardData.monthlyData.customers.name,
    data: customerData,
    stack: "A",
  };

  const vehicleData = dashboardData.monthlyData.vehicles.data.map(
    (value: any) => value.y
  );
  const vehicle = {
    name: dashboardData.monthlyData.vehicles.name,
    data: vehicleData,
    stack: "B",
  };

  const transactionData = dashboardData.monthlyData.transactions.data.map(
    (value: any) => value.y
  );
  const transaction = {
    name: dashboardData.monthlyData.transactions.name,
    data: transactionData,
    stack: "B",
  };

  return [appointment, customer, vehicle, transaction];
}

export default function generatePageNumbers(count: number) {
  const pages = [];

  for (let i = 0; i <= count; i++) {
    pages.push(i);
  }

  return pages;
}
