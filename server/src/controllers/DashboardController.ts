import { Request } from 'express';
import { appCommonTypes } from '../@types/app-common';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import Invoice from '../models/Invoice';
import Estimate from '../models/Estimate';
import Expense from '../models/Expense';
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';
import HttpResponse = appCommonTypes.HttpResponse;

export default class DashboardController {
  public static async getTechData(req: Request) {
    //
    try {
      const user = req.user;
      const month = req?.query?.month || new Date().getMonth() + 1;

      // fetch raw data
      const estimates = await this.getEstimateRaw(user);
      const invoices = await this.getInvoiceRaw(estimates);
      const expenses = await this.getExpensesRaw(user);
      const customers = await this.getCustomersRaw(user);
      const transactions = await this.getTransactionsRaw(user);

      // get filtered for month
      const estimatesByMonth = await this.filterByMonth(estimates, month);
      const invoicesByMonth = await this.filterByMonth(invoices, month);
      const expensesByMonth = await this.filterByMonth(expenses, month);
      const customersByMonth = await this.filterByMonth(customers, month);
      // const transactionsByMonth = await this.filterByMonth(transactions, month);

      // console.log(estimates.length, invoices.length);
      const mRevenue = this.getRevenue(invoicesByMonth);
      const mReceipt = this.getReceipt(invoicesByMonth);
      const mReceivable = this.getReceivable(invoicesByMonth);
      // const mExpense = expensesByMonth.length
      const mExpense = this.getExpenses(expensesByMonth);
      const mEstimate = estimatesByMonth.length;
      const mInvoice = invoicesByMonth.length;
      const mCustomer = customersByMonth.length;

      // get series data
      const months = [
        {
          id: 1,
          month: 'January',
        },
        {
          id: 2,
          month: 'February',
        },
        {
          id: 3,
          month: 'March',
        },
        {
          id: 4,
          month: 'April',
        },
        {
          id: 5,
          month: 'May',
        },
        {
          id: 6,
          month: 'June',
        },
        {
          id: 7,
          month: 'July',
        },
        {
          id: 8,
          month: 'August',
        },
        {
          id: 9,
          month: 'September',
        },
        {
          id: 10,
          month: 'October',
        },
        {
          id: 11,
          month: 'November',
        },
        {
          id: 12,
          month: 'December',
        },
      ];

      // @ts-ignore
      const __sales = [];
      const __receipt = [];
      const __expenses = [];

      for (let i = 0; i < months.length; i++) {
        const _month = months[i];

        //

        // sales
        const _invoicesByMonth = await this.filterByMonth(invoices, _month.id);
        __sales.push(this.getRevenue(_invoicesByMonth));
        // __sales.push(_invoicesByMonth.length);

        // receipt
        // const _transactionsByMonth = await this.filterByMonth(transactions, _month.id);
        __receipt.push(this.getReceipt(_invoicesByMonth));
        // __receipt.push(_transactionsByMonth.length);
        // getTransaction

        // expenses
        const _expensesByMonth = await this.filterByMonth(expenses, _month.id);
        __expenses.push(this.getExpenses(_expensesByMonth));
        // __expenses.push(_expensesByMonth.length);
      }

      const response: HttpResponse<any> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: {
          mReceivable,
          mRevenue,
          mExpense,
          mReceipt,
          mEstimate,
          mInvoice,
          mCustomer,
          series: [
            {
              name: 'Sales',
              data: __sales,
              color: 'blue',
            },
            {
              name: 'Receipt',
              data: __receipt,
              color: 'green',
            },
            {
              name: 'Expenses',
              data: __expenses,
              color: 'red',
            },
          ],
          seriesOne: [
            {
              name: 'Sales',
              data: __sales,
            },
          ],
          seriesTwo: [
            {
              name: 'Receipt',
              data: __receipt,
            },
          ],
          seriesThree: [
            {
              name: 'Expenses',
              data: __expenses,
            },
          ],
        },
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static getReceivable(invoices: Invoice[]) {
    let amount = 0;

    invoices.map(_invoice => {
      amount = amount + _invoice.dueAmount;
    });

    return amount;
  }

  public static getTransaction(transactions: Transaction[]) {
    let amount = 0;

    transactions.map(_transaction => {
      amount = amount + _transaction.amount;
    });

    return amount;
  }

  public static getExpenses(expenses: Expense[]) {
    let amount = 0;

    expenses.map(_expense => {
      amount = amount + _expense.amount;
    });

    return amount;
  }

  public static getRevenue(invoices: Invoice[]) {
    let amount = 0;

    invoices.map(_invoice => {
      amount = amount + _invoice.grandTotal;
    });

    return amount;
  }

  public static getReceipt(invoices: Invoice[]) {
    let amount = 0;

    invoices.map(_invoice => {
      amount = amount + _invoice.depositAmount;
    });

    return amount;
  }

  public static async filterByMonth(collection: any[], month: any) {
    const newCollection: any[] = [];
    const year = 2023;

    collection.map(_item => {
      if (_item != null) {
        const _month = new Date(_item.createdAt).getMonth() + 1;
        const _year = new Date(_item.createdAt).getFullYear();

        if (_month == month && _year == year) {
          newCollection.push(_item);
        }
      }
    });

    return newCollection;
  }

  public static async getTransactionsRaw({ partner: { id } }: any) {
    //
    return await Transaction.findAll({
      where: {
        // @ts-ignore
        partnerId: id,
      },
    });
  }

  public static async getCustomersRaw({ partner: { id } }: any) {
    //
    return await Customer.findAll({
      where: {
        // @ts-ignore
        partnerId: id,
      },
    });
  }

  public static async getExpensesRaw({ partner: { id } }: any) {
    //
    return await Expense.findAll({
      where: {
        // @ts-ignore
        partnerId: id,
      },
    });
  }

  public static async getEstimateRaw({ partner: { id } }: any) {
    //
    return await Estimate.findAll({
      where: {
        // @ts-ignore
        partnerId: id,
      },
      include: [Invoice],
    });
  }

  public static async getInvoiceRaw(estimates: Estimate[]) {
    //
    const invoices: Invoice[] = [];

    estimates.map(_estimate => {
      if (_estimate.invoice != null) {
        invoices.push(_estimate.invoice);
      }
    });

    return invoices;
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
