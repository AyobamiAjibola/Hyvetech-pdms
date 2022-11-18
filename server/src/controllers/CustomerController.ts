import Joi from 'joi';

import { appCommonTypes } from '../@types/app-common';
import HttpStatus from '../helpers/HttpStatus';
import Customer from '../models/Customer';
import CustomAPIError from '../exceptions/CustomAPIError';
import dataSources from '../services/dao';
import Vehicle from '../models/Vehicle';
import Appointment from '../models/Appointment';
import Transaction from '../models/Transaction';
import VehicleFault from '../models/VehicleFault';
import { Request } from 'express';
import HttpResponse = appCommonTypes.HttpResponse;
import AppRequestParams = appCommonTypes.AppRequestParams;
import { Op } from 'sequelize';

const CUSTOMER_ID = 'Customer Id';

export default class CustomerController {
  public static async allCustomers() {
    try {
      const customers = await dataSources.customerDAOService.findAll({
        attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
        where: {
          [Op.not]: { firstName: 'Anonymous' },
        },
      });

      const response: HttpResponse<Customer> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: customers,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async customer(customerId: number) {
    const response: HttpResponse<Customer> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    try {
      const customer = await dataSources.customerDAOService.findById(customerId, {
        attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
        include: [{ all: true }],
      });

      if (!customer) {
        response.result = customer;
        return Promise.resolve(response);
      }

      response.result = customer;
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async customerVehicles(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object<AppRequestParams>({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    try {
      const customer = await dataSources.customerDAOService.findById(+value?.customerId);

      if (!customer) {
        return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
      }

      const vehicles = await customer.$get('vehicles');

      const response: HttpResponse<Vehicle> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: vehicles,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async customerAppointments(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    try {
      const customer = await dataSources.customerDAOService.findById(+value.customerId);

      if (!customer) {
        return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
      }

      const appointments = await customer.$get('appointments', {
        include: [
          { model: Vehicle },
          { model: VehicleFault },
          {
            model: Customer,
            attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
          },
        ],
      });

      const response: HttpResponse<Appointment> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: appointments,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async customerTransactions(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    try {
      const customer = await dataSources.customerDAOService.findById(+value.customerId);

      if (!customer) {
        return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
      }

      const transactions = await customer.$get('transactions');

      const response: HttpResponse<Transaction> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: transactions,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
