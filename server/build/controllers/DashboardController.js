"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
class DashboardController {
    static async getData() {
        try {
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result: {
                    monthlyData: await this.getMonthlyData(dao_1.default),
                    dailyData: await this.getDailyData(dao_1.default),
                },
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async getDailyData(context) {
        return {
            customers: await context.customerDAOService.getTotalDailyCustomers(),
            appointments: await context.appointmentDAOService.getTotalDailyAppointments(),
            vehicles: await context.vehicleDAOService.getTotalDailyVehicles(),
            transactions: await context.transactionDAOService.getTotalDailyTransactions(),
        };
    }
    static async getMonthlyData(context) {
        return {
            customers: await context.customerDAOService.getTotalMonthlyCustomers(),
            appointments: await context.appointmentDAOService.getTotalMonthlyAppointments(),
            vehicles: await context.vehicleDAOService.getTotalMonthlyVehicles(),
            transactions: await context.transactionDAOService.getTotalMonthlyTransactions(),
        };
    }
}
exports.default = DashboardController;
