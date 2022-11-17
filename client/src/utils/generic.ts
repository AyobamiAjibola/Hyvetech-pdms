import { IDashboardData } from '@app-interfaces';
import { IJob, IVehicle } from '@app-models';
import settings from '../config/settings';

export function formatNumberToIntl(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
  }).format(amount);
}

export function computeMonthlyColumnChartData(dashboardData: IDashboardData) {
  const appointmentData = dashboardData.monthlyData.appointments.data.map((value: any) => value.y);
  const appointment = {
    name: dashboardData.monthlyData.appointments.name,
    data: appointmentData,
    stack: 'A',
  };

  const customerData = dashboardData.monthlyData.customers.data.map((value: any) => value.y);
  const customer = {
    name: dashboardData.monthlyData.customers.name,
    data: customerData,
    stack: 'A',
  };

  const vehicleData = dashboardData.monthlyData.vehicles.data.map((value: any) => value.y);
  const vehicle = {
    name: dashboardData.monthlyData.vehicles.name,
    data: vehicleData,
    stack: 'B',
  };

  const transactionData = dashboardData.monthlyData.transactions.data.map((value: any) => value.y);
  const transaction = {
    name: dashboardData.monthlyData.transactions.name,
    data: transactionData,
    stack: 'B',
  };

  return [appointment, customer, vehicle, transaction];
}

interface IGetRideSharePlanJobs {
  jobs: Partial<IJob>[];
  maxDriveIn: number;
}

export function getRideSharePlanJobs(config: IGetRideSharePlanJobs) {
  const maxDriveIn = config.maxDriveIn;
  const tempJobs = [...config.jobs];

  tempJobs.length += maxDriveIn - tempJobs.length;

  const startIndex = config.jobs.length > 0 ? config.jobs.length : 0;

  for (let i = startIndex; i < tempJobs.length; i++) tempJobs[i] = {};

  return tempJobs;
}

interface IGetPlanVehicle {
  vehicles: Partial<IVehicle>[];
  maxVehicle: number;
}

export function getPlanVehicles(plan: IGetPlanVehicle) {
  const tempVehicles = [...plan.vehicles];

  //We want the vehicle list to be determined by max vehicles allowable by the plan
  //so on component mount, we increment the size of the list by the max vehicle allowable
  //keeping in mind the existing vehicle in plan.
  tempVehicles.length += plan.maxVehicle - tempVehicles.length;

  //Start from the second index if plan already has vehicle subscribed to it
  const startIndex = plan.vehicles.length > 0 ? plan.vehicles.length : 0;

  for (let i = startIndex; i < tempVehicles.length; i++) {
    //since we are increasing the size of the array, we set the new elements on the array to empty object
    tempVehicles[i] = {};
  }

  return tempVehicles;
}

export default function generatePageNumbers(count: number) {
  const pages = [];

  for (let i = 0; i <= count; i++) {
    pages.push(i);
  }

  return pages;
}

export function getImageUrl(imageUrl: any) {
  if (typeof imageUrl === 'object') return URL.createObjectURL(imageUrl);

  return `${settings.api.baseURL}/${imageUrl}`;
}
