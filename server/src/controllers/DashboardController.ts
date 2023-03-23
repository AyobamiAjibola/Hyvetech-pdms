import { Request } from 'express';
import { appCommonTypes } from '../@types/app-common';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import HttpResponse = appCommonTypes.HttpResponse;

export default class DashboardController {
  public static async getData(req: Request) {
    try {
      const response: HttpResponse<any> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: {
          monthlyData: await this.getMonthlyData(dataSources),
          dailyData: await this.getDailyData(dataSources),
        },
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private static async getDailyData(context: { [p: string]: any }) {
    return {
      customers: await context.customerDAOService.getTotalDailyCustomers(),
      appointments: await context.appointmentDAOService.getTotalDailyAppointments(),
      vehicles: await context.vehicleDAOService.getTotalDailyVehicles(),
      transactions: await context.transactionDAOService.getTotalDailyTransactions(),
    };
  }

  private static async getMonthlyData(context: { [p: string]: any }) {
    return {
      customers: await context.customerDAOService.getTotalMonthlyCustomers(),
      appointments: await context.appointmentDAOService.getTotalMonthlyAppointments(),
      vehicles: await context.vehicleDAOService.getTotalMonthlyVehicles(),
      transactions: await context.transactionDAOService.getTotalMonthlyTransactions(),
    };
  }
}
