import { Request } from 'express';
import { HasPermission, TryCatch } from '../decorators';
import HttpStatus from '../helpers/HttpStatus';
import Expense, { $saveExpenseSchema, $updateExpenseSchema, ExpenseSchemaType, expenseType } from '../models/Expense';
import dao from '../services/dao';
import AppLogger from '../utils/AppLogger';
import { appCommonTypes } from '../@types/app-common';

import HttpResponse = appCommonTypes.HttpResponse;
import Beneficiary, { $saveBeneficiarySchema, beneficiarySchemaType } from '../models/Beneficiary';
import ExpenseType, { $saveExpenseTypeSchema, expenseTypeSchemaType } from '../models/ExpenseType';
import ExpenseCategory, { $saveExpenseCategorySchema, expenseCategorySchemaType } from '../models/ExpenseCategory';
import Joi = require('joi');
import CustomAPIError from '../exceptions/CustomAPIError';
import { CreationAttributes, Op } from 'sequelize';
import Invoice from '../models/Invoice';
import { CREATE_EXPENSE, DELETE_EXPENSE, MANAGE_TECHNICIAN, READ_EXPENSE, UPDATE_EXPENSE } from '../config/settings';

export default class ExpenseController {
  private static LOGGER = AppLogger.init(ExpenseController.name).logger;

  @TryCatch
  public async getAllBeneficiaries(req: Request) {
    const partner = req.user.partner;
    const beneficiaries = await dao.beneficiaryDAOService.findAll({ where: { partnerId: partner.id } });

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

    const data = expenses.filter(item => item.partnerId === req.user.partner.id || !item.partnerId);

    const response: HttpResponse<ExpenseType> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: data,
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
  @HasPermission([MANAGE_TECHNICIAN])
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
  @HasPermission([MANAGE_TECHNICIAN])
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
  @HasPermission([MANAGE_TECHNICIAN])
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
  @HasPermission([MANAGE_TECHNICIAN, CREATE_EXPENSE])
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
  @HasPermission([MANAGE_TECHNICIAN, READ_EXPENSE, CREATE_EXPENSE])
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
  @HasPermission([MANAGE_TECHNICIAN, READ_EXPENSE, CREATE_EXPENSE])
  public async getExpenseById(req: Request) {
    const expense = await this.doGetExpenseById(req);

    const response: HttpResponse<Expense> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: expense,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, DELETE_EXPENSE])
  public async deleteExpenseById(req: Request) {
    await this.doDeleteExpenseById(req);

    const response: HttpResponse<null> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, UPDATE_EXPENSE])
  public async updateExpense(req: Request) {
    const expense = await this.doExpenseUpdate(req);

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

  private async doDeleteExpenseById(req: Request) {
    return dao.expenseDAOService.deleteById(+req.params.id);
  }

  private async doExpenseUpdate(req: Request) {
    const { error, value } = Joi.object<Expense>($updateExpenseSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value?.id)
      return Promise.reject(CustomAPIError.response('Expense ID is required', HttpStatus.BAD_REQUEST.code));

    const values: Partial<Expense> = {
      reference: value?.reference,
      status: value.reference.trim() !== '' ? 'PAID' : 'UNPAID',
    };
    const expenseOld = await dao.expenseDAOService.findById(value.id);

    if (!expenseOld) return Promise.reject(CustomAPIError.response('Expense not found', HttpStatus.NOT_FOUND.code));

    return dao.expenseDAOService.update(expenseOld, values as CreationAttributes<Expense>);
  }

  private async doGetAllExpenses(req: Request) {
    const partner = req.user.partner;
    const expenses = await dao.expenseDAOService.findAll({
      where: { partnerId: partner.id },
      include: [Beneficiary, ExpenseCategory, ExpenseType],
    });
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

    if (!['overhead', 'others'].includes(category.name.toLowerCase()) && !value.invoiceId)
      return Promise.reject(CustomAPIError.response('Invoice is required', HttpStatus.BAD_REQUEST.code));

    const type = await dao.expenseTypeDAOService.findById(value.expenseTypeId);
    if (!type) return Promise.reject(CustomAPIError.response('Expense Type not found', HttpStatus.NOT_FOUND.code));

    const invoice = await dao.invoiceDAOService.findById(value.invoiceId);

    if (!invoice && !['overhead', 'others'].includes(category.name.toLowerCase()))
      return Promise.reject(CustomAPIError.response('Invoice not found', HttpStatus.NOT_FOUND.code));

    const data: Partial<Expense> = {
      amount: value.amount,
      reference: value.reference,
      status: value.reference ? 'PAID' : 'UNPAID',
      expenseCategoryId: value.expenseCategoryId,
      expenseTypeId: value.expenseTypeId,
      beneficiaryId: value.beneficiaryId,
      invoiceId: value.invoiceId,
      partnerId: partner.id,
      invoiceCode: invoice?.code,
    };

    const expense = await dao.expenseDAOService.create(data as CreationAttributes<Expense>);
    if (invoice) await invoice.$add('expenses', [expense]);

    await beneficiary.$add('expenses', [expense]);
    await category.$add('expense', [expense]);
    await type.$add('expense', [expense]);
    await partner.$add('expenses', [expense]);

    return expense;
  }

  private async doCreateBeneficiary(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<beneficiarySchemaType>($saveBeneficiarySchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const beneficiary = await dao.beneficiaryDAOService.findByAny({
      where: { name: value.name, partnerId: partner.id },
    });

    if (beneficiary)
      return Promise.reject(CustomAPIError.response('Beneficiary already exists.', HttpStatus.BAD_REQUEST.code));

    return dao.beneficiaryDAOService.create({ ...value, partnerId: partner.id });
  }

  private async doCreateExpenseType(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<expenseTypeSchemaType>($saveExpenseTypeSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const expenseType = await dao.expenseTypeDAOService.findByAny({
      where: { name: value.name, partnerId: partner.id },
    });

    if (expenseType)
      return Promise.reject(CustomAPIError.response('Expense type already exists.', HttpStatus.BAD_REQUEST.code));

    const type = await dao.expenseTypeDAOService.create({ ...value, partnerId: partner.id });

    await partner.$add('expenseTypes', [type]);
    return type;
  }

  private async doCreateExpenseCategory(req: Request) {
    const { error, value } = Joi.object<expenseCategorySchemaType>($saveExpenseCategorySchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const expenseCategory = await dao.expenseCategoryDAOService.findByAny({
      where: { name: value.name },
    });

    if (expenseCategory)
      return Promise.reject(CustomAPIError.response('Expense category already exists.', HttpStatus.BAD_REQUEST.code));

    return dao.expenseCategoryDAOService.create(value);
  }
}
