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
import { HasPermission } from '../decorators';
import { MANAGE_ALL, MANAGE_TECHNICIAN, VIEW_ANALYTICS } from '../config/settings';
import User from '../models/User';
import Vehicle from '../models/Vehicle';
import Partner from '../models/Partner';
import ServiceReminder from '../models/ServiceReminder';
import dao from '../services/dao';
import { Op } from 'sequelize';
import ItemStock from '../models/ItemStock';

export default class DashboardController {
  // @HasPermission([MANAGE_ALL, VIEW_ANALYTICS, MANAGE_TECHNICIAN])
  public static async getTechData(req: Request) {
    //
    try {
      const user = req.user;
      // const month = req?.query?.month || new Date().getMonth() + 1;
      const { start_date, end_date } = req?.query;
      const { year } = req?.body;

      // fetch raw data
      const estimates = await this.getEstimateRaw(user);
      const invoices = await this.getInvoiceRaw(estimates);
      const expenses = await this.getExpensesRaw(user);
      const customers = await this.getCustomersRaw(user);
      const transactions = await this.getTransactionsRaw(user);
      const reminders = await this.getReminderRaw(user);

      // get filtered for date
      const estimatesByMonth = await this.filterByDate(estimates, start_date, end_date);
      const invoicesByMonth = await this.filterByDate(invoices, start_date, end_date);
      const expensesByMonth = await this.filterByDate(expenses, start_date, end_date);
      const customersByMonth = await this.filterByDate(customers, start_date, end_date);
      const remindersByMonth = await this.filterByDate(reminders, start_date, end_date);
      const transactionsByMonth = await this.filterByDate(transactions, start_date, end_date);

      const mRevenue = this.getRevenue(invoicesByMonth);
      const mReceipt = this.getReceipt(invoicesByMonth);
      const mReceivable = this.getReceivable(invoicesByMonth);
      const mTransaction = this.getTransaction(transactionsByMonth);
      const mExpense = this.getExpenses(expensesByMonth);
      const mEstimate = estimatesByMonth.length;
      const mInvoice = invoicesByMonth.length;
      const mCustomer = customersByMonth.length;
      const mReminder = remindersByMonth.length;

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

      const ___sales = [];
      const ___receipt = [];
      const ___expenses = [];

      const _year = year === null ? new Date().getFullYear() : year

      for (let i = 0; i < months.length; i++) {
        const _month = months[i];
      
        // sales
        const _invoicesByMonth = await this._filterByMonth(invoices, _month.id, _year);
        ___sales.push(this.getRevenue(_invoicesByMonth));
      
        // receipt
        // const _transactionsByMonth = await this.filterByMonth(transactions, _month.id, year);
        ___receipt.push(this.getReceipt(_invoicesByMonth));

        //expenses
        const _expensesByMonth = await this._filterByMonth(expenses, _month.id, _year);
        ___expenses.push(this.getExpenses(_expensesByMonth));
      }
      

      for (let i = 0; i < months.length; i++) {
        const _month = months[i];

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
        const _expensesByMonth = await this.filterByMonthExp(expenses, _month.id);
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
          mTransaction,
          mReceipt,
          mEstimate,
          mInvoice,
          mCustomer,
          mReminder,
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
          seriesNew: [
            {
              label: 'Total Sales',
              data: ___sales,
              backgroundColor: '#FAA21B',
            },
            {
              label: 'Total Receipts',
              data: ___receipt,
              backgroundColor: '#FFD89B',
            },
            {
              label: 'Total Expenses',
              data: ___expenses,
              backgroundColor: '#B2976C',
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

  public static async filterByDate(collection: any[], start_date: any, end_date: any) {
    let newCollection: any[] = [];

    if (start_date && end_date) {
      collection.map(_item => {
        if (_item != null) {
          const itemDate = new Date(_item.createdAt);
          
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if(itemDate >= startDate && itemDate <= endDate) {
              newCollection.push(_item);
            }
          }
      });
    } else {
      return collection
    }

    return newCollection;
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

  public static async _filterByMonth(collection: any[], month: number, year: number) {
    return collection.filter((_item) => {
      if (_item != null) {
        const createdAtDate = new Date(_item.createdAt);
        const itemMonth = createdAtDate.getMonth() + 1; // Months are zero-based
        const itemYear = createdAtDate.getFullYear();
  
        return itemMonth === month && itemYear === year;
      }
  
      return false;
    });
  }
  

  //expenses filter by date modified
  public static async filterByMonthExp(collection: any[], month: any) {
    const newCollection: any[] = [];
    const year = new Date().getFullYear();

    collection.map(_item => {
      if (_item != null) {
        const _month = new Date(_item.dateModified).getMonth() + 1;
        const _year = new Date(_item.dateModified).getFullYear();

        if (_month == month && _year == year) {
          newCollection.push(_item);
        }
      }
    });

    return newCollection;
  }

  public static async filterByMonthAndYear(collection: any[], start_date: any, end_date: any, month: any, day: any, year: any) {
    const newCollection: any[] = [];

    collection.map(_item => {
      if (_item != null) {
        const _month = new Date(_item.createdAt).getMonth() + 1;
        const _year = new Date(_item.createdAt).getFullYear();
        const _day = new Date(_item.createdAt).getDate();
        const itemDate = new Date(_item.createdAt);

        if (start_date && end_date) {
          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          if(itemDate >= startDate && itemDate <= endDate) {
            newCollection.push(_item);
          }
        }

        if(month && year && day) {
          if (_month == month && _year == year && _day == day) {
            newCollection.push(_item);
          }
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

  public static async getReminderRaw({ partner: { id } }: any) {

    return await ServiceReminder.findAll({
      where: {
        // @ts-ignore
        partnerId: id,
        [Op.or]: [
          { reminderStatus: 'Due today' },
          { reminderStatus: { [Op.startsWith]: 'Overdue' } }
        ]
      },
    });
  }

  //Super Admin
  public static async getEstimateSuperAdminRaw() {
    return await Estimate.findAll({
      include: [Invoice],
    });
  }

  public static async getUsersSuperAdminRaw() {
    return await User.findAll();
  }

  public static async getVehicleSuperAdminRaw() {
    return await Vehicle.findAll();
  }

  public static async getPartnerSuperAdminRaw() {
    return await Partner.findAll();
  }

  public static async getInvoiceSuperAdminRaw() {
    return await Invoice.findAll();
  }

  public static async getExpensesSuperAdminRaw() {
    return await Expense.findAll();
  }

  public static async getTransactionsSuperAdminRaw() {
    return await Transaction.findAll();
  }

  public static async getCustomersSuperAdminRaw() {
    return await Customer.findAll();
  }

  public static async getRemindersSuperAdminRaw() {
    return await ServiceReminder.findAll();
  }

  public static async getItemsSuperAdminRaw() {
    return await ItemStock.findAll();
  }

  public static getEstimateValueAdmin(estimates: Estimate[]) {
    let amount = 0;

    estimates.map(_estimate => {
      amount = amount + _estimate.grandTotal;
    });

    return amount;
  }

  //end

  public static async getInvoiceRaw(estimates: Estimate[]) {

    const invoices: any = [];

    estimates.map(_estimate => {
      if (_estimate.invoice) {
        invoices.push(_estimate.invoice);
      }
    });

    // const filteredArray = invoices.filter((array: any) => array.length > 0);
    // const arrayOfInvoices = filteredArray.map((array: any) => array.filter((item: any) => item instanceof Invoice));
    // const arrayOfDataValues = arrayOfInvoices.map((array: any) => array.map((invoice: any) => invoice.dataValues));
    // const concat = [].concat(...arrayOfDataValues);
    const result = invoices
      .filter((array: any) => array.length > 0)
      .map((array: any) => array.filter((item: any) => item instanceof Invoice))
      .map((array: any) => array.map((invoice: any) => invoice.dataValues))
      .flat();


    return result;
  }

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
      // appointments: await context.appointmentDAOService.getTotalMonthlyAppointments(),
      vehicles: await context.vehicleDAOService.getTotalMonthlyVehicles(),
      transactions: await context.transactionDAOService.getTotalMonthlyTransactions(),
      // sales: await context.invoiceDAOService.getTotalMonthlyInvoice(),
      expenses: await context.expenseDAOService.getTotalMonthlyExpenses()
    };
  }

  // @HasPermission([MANAGE_ALL])
  public static async getDataSuperAdmin (req: Request) {
    try {
      const month = req?.query?.month;
      const year = req?.query?.year;
      const day = req?.query?.day;
      const { start_date, end_date } = req?.query

      const estimates = await this.getEstimateSuperAdminRaw();
      const invoices = await this.getInvoiceSuperAdminRaw();
      const expenses = await this.getExpensesSuperAdminRaw();
      const payments = await this.getTransactionsSuperAdminRaw();
      const customers = await this.getCustomersSuperAdminRaw();
      const users = await this.getUsersSuperAdminRaw();
      const vehicles = await this.getVehicleSuperAdminRaw();
      const partners = await this.getPartnerSuperAdminRaw();
      const reminders = await this.getRemindersSuperAdminRaw();
      const items = await this.getItemsSuperAdminRaw();

      const allEstimate = await this.filterByMonthAndYear(estimates, start_date, end_date, month, day, year);
      const allInvoice = await this.filterByMonthAndYear(invoices, start_date, end_date, month, day, year);
      const allExpense = await this.filterByMonthAndYear(expenses, start_date, end_date, month, day, year);
      const allPayments = await this.filterByMonthAndYear(payments, start_date, end_date, month, day, year);
      const allCustomers = await this.filterByMonthAndYear(customers, start_date, end_date, month, day, year);
      const allUsers = await this.filterByMonthAndYear(users, start_date, end_date, month, day, year);
      const allVehicles = await this.filterByMonthAndYear(vehicles, start_date, end_date, month, day, year);
      const allPartners = await this.filterByMonthAndYear(partners, start_date, end_date, month, day, year);
      const allReminders = await this.filterByMonthAndYear(reminders, start_date, end_date, month, day, year);
      const allItems = await this.filterByMonthAndYear(items, start_date, end_date, month, day, year);

      const receivables = this.getReceivable(allInvoice)
      const paymentReceived = this.getTransaction(allPayments)
      const invoiceValue = this.getRevenue(allInvoice);
      const estimateValue = this.getEstimateValueAdmin(allEstimate);
      const expenseValue = this.getExpenses(allExpense);
      const mAllEstimate = allEstimate.length;
      const mAllInvoice = allInvoice.length;
      const mAllExpense = allExpense.length;
      const mAllPayment = allPayments.length;
      const mAllCustomer = allCustomers.length;
      const mAllUser = allUsers.length;
      const mAllVehicle = allVehicles.length;
      const mAllPartner = allPartners.length;
      const mAllReminder = allReminders.length;
      const mAllItem = allItems.length

      const response: HttpResponse<any> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: {
          mAllEstimate,
          mAllInvoice,
          mAllExpense,
          mAllPayment,
          mAllCustomer,
          estimateValue,
          expenseValue,
          invoiceValue,
          paymentReceived,
          receivables, mAllReminder, mAllItem,
          mAllUser, mAllVehicle, mAllPartner
        },
      };

      return Promise.resolve(response);
    } catch (e: any) {
      return Promise.reject(e);
    }
  }
}
