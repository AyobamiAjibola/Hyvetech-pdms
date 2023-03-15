import { Request } from 'express';
import { TryCatch } from '../decorators';
import HttpStatus from '../helpers/HttpStatus';
import Expense, { $saveExpenseSchema, ExpenseSchemaType, expenseType } from '../models/Expense';
import dao from '../services/dao';
import AppLogger from '../utils/AppLogger';
import { appCommonTypes } from '../@types/app-common';

import HttpResponse = appCommonTypes.HttpResponse;
import Beneficiary, { $saveBeneficiarySchema, beneficiarySchemaType } from '../models/Beneficiary';
import ExpenseType, { $saveExpenseTypeSchema, expenseTypeSchemaType } from '../models/ExpenseType';
import ExpenseCategory, { $saveExpenseCategorySchema, expenseCategorySchemaType } from '../models/ExpenseCategory';
import Joi = require('joi');
import CustomAPIError from '../exceptions/CustomAPIError';
import { CreationAttributes } from 'sequelize';
import Invoice from '../models/Invoice';

export default class ExpenseController {
  private static LOGGER = AppLogger.init(ExpenseController.name).logger;

  @TryCatch
  public async getAllBeneficiaries(req: Request) {
    const beneficiaries = await dao.beneficiaryDAOService.findAll({});

    const response: HttpResponse<Beneficiary> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: beneficiaries,
    };

    return response;
  }

  @TryCatch
  public async getAllExpenseTypes(req: Request) {
    const expenses = await dao.expenseTypeDAOService.findAll({});

    const response: HttpResponse<ExpenseType> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: expenses,
    };

    return response;
  }

  @TryCatch
  public async getAllExpenseCategories(req: Request) {
    const expensesCategory = await dao.expenseCategoryDAOService.findAll({});

    const response: HttpResponse<ExpenseCategory> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: expensesCategory,
    };

    return response;
  }

  @TryCatch
  public async createBeneficiaryHandler(req: Request) {
    const beneficiary = await this.doCreateBeneficiary(req);

    const response: HttpResponse<Beneficiary> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: beneficiary,
    };

    return response;
  }

  @TryCatch
  public async createExpenseTypeHandler(req: Request) {
    const expenseType = await this.doCreateExpenseType(req);

    const response: HttpResponse<ExpenseType> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: expenseType,
    };

    return response;
  }

  @TryCatch
  public async createExpenseCategoryHandler(req: Request) {
    const expenseCategory = await this.doCreateExpenseCategory(req);

    const response: HttpResponse<ExpenseCategory> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: expenseCategory,
    };

    return response;
  }

  @TryCatch
  public async createExpense(req: Request) {
    const expense = await this.doCreateExpense(req);

    const response: HttpResponse<Expense> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: expense,
    };

    return response;
  }

  @TryCatch
  public async getAllExpenses(req: Request) {
    const expense = await this.doGetAllExpenses(req);

    const response: HttpResponse<Expense> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: expense,
    };

    return response;
  }

  @TryCatch
  public async getExpenseById(req: Request) {
    const expense = await this.doGetExpenseById(req);

    const response: HttpResponse<Expense> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: expense,
    };

    return response;
  }

  private async doGetExpenseById(req: Request) {
    return dao.expenseDAOService.findById(+req.params.id, {
      include: [Invoice, Beneficiary, ExpenseType, ExpenseCategory],
    });
  }

  private async doGetAllExpenses(req: Request) {
    const partner = req.user.partner;
    const expenses = await dao.expenseDAOService.findAll({ where: { partnerId: partner.id } });
    for (let i = 1; i < expenses.length; i++) {
      for (let j = i; j > 0; j--) {
        const _t1: any = expenses[j];
        const _t0: any = expenses[j - 1];

        if (new Date(_t1.updatedAt).getTime() > new Date(_t0.updatedAt).getTime()) {
          expenses[j] = _t0;
          expenses[j - 1] = _t1;

          // console.log('sorted')
        } else {
          // console.log('no sorted')
        }
      }
    }

    return expenses;
  }

  private async doCreateExpense(req: Request) {
    const partner = req.user.partner;

    if (!partner) return Promise.reject(CustomAPIError.response('Partner not found', HttpStatus.BAD_REQUEST.code));

    const { error, value } = Joi.object<ExpenseSchemaType>($saveExpenseSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const beneficiary = await dao.beneficiaryDAOService.findById(value.beneficiaryId);
    if (!beneficiary)
      return Promise.reject(CustomAPIError.response('Beneficiary not found', HttpStatus.NOT_FOUND.code));

    const category = await dao.expenseCategoryDAOService.findById(value.expenseCategoryId);
    if (!category)
      return Promise.reject(CustomAPIError.response('Expense Category not found', HttpStatus.NOT_FOUND.code));

    const type = await dao.expenseTypeDAOService.findById(value.expenseTypeId);
    if (!type) return Promise.reject(CustomAPIError.response('Expense Type not found', HttpStatus.NOT_FOUND.code));

    const invoice = await dao.invoiceDAOService.findById(value.invoiceId);

    if (!invoice) return Promise.reject(CustomAPIError.response('Invoice not found', HttpStatus.NOT_FOUND.code));

    const data: Partial<Expense> = {
      date: value.date,
      amount: value.amount,
      reference: value.reference,
      status: value.reference ? 'PAID' : 'UNPAID',
      expenseCategoryId: value.expenseCategoryId,
      expenseTypeId: value.expenseTypeId,
      beneficiaryId: value.beneficiaryId,
      invoiceId: value.invoiceId,
      partnerId: partner.id,
      invoiceCode: invoice.code,
    };

    const expense = await dao.expenseDAOService.create(data as CreationAttributes<Expense>);

    await invoice.$add('expenses', [expense]);
    await beneficiary.$add('expenses', [expense]);
    await category.$add('expense', [expense]);
    await type.$add('expense', [expense]);
    await partner.$add('expenses', [expense]);

    return expense;
  }

  private async doCreateBeneficiary(req: Request) {
    const { error, value } = Joi.object<beneficiarySchemaType>($saveBeneficiarySchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    return dao.beneficiaryDAOService.create(value);
  }

  private async doCreateExpenseType(req: Request) {
    const { error, value } = Joi.object<expenseTypeSchemaType>($saveExpenseTypeSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    return dao.expenseTypeDAOService.create(value);
  }

  private async doCreateExpenseCategory(req: Request) {
    const { error, value } = Joi.object<expenseCategorySchemaType>($saveExpenseCategorySchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    return dao.expenseCategoryDAOService.create(value);
  }
}
