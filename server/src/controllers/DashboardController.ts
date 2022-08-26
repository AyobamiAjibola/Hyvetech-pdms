import { appCommonTypes } from "../@types/app-common";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import HttpResponse = appCommonTypes.HttpResponse;

export default class DashboardController {
  private static async getDailyData(context: { [p: string]: any }) {
    return {
      customers: await context.customerDAOService.getTotalDailyCustomers(),
      appointments:
        await context.appointmentDAOService.getTotalDailyAppointments(),
      vehicles: await context.vehicleDAOService.getTotalDailyVehicles(),
      transactions:
        await context.transactionDAOService.getTotalDailyTransactions(),
    };
  }

  private static async getMonthlyData(context: { [p: string]: any }) {
    return {
      customers: await context.customerDAOService.getTotalMonthlyCustomers(),
      appointments:
        await context.appointmentDAOService.getTotalMonthlyAppointments(),
      vehicles: await context.vehicleDAOService.getTotalMonthlyVehicles(),
      transactions:
        await context.transactionDAOService.getTotalMonthlyTransactions(),
    };
  }

  public static async getData() {
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
}
