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
import { Op } from 'sequelize';
import { TryCatch } from '../decorators';
import HttpResponse = appCommonTypes.HttpResponse;
import AppRequestParams = appCommonTypes.AppRequestParams;
import Contact from '../models/Contact';

const CUSTOMER_ID = 'Customer Id';

export default class CustomerController {
  @TryCatch
  public static async allCustomers() {
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
  }

  @TryCatch
  public static async allNewCustomers(req: Request) {

    // console.log(req)

    // so let's process some information
    // check if requester is a user admin
    let customers;

    if(req?.user?.id == 1){
      // user is admin
      customers = await dataSources.customerDAOService.findAll({
        attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
        where: {
          [Op.not]: { firstName: 'Anonymous' },
        },
      });
    }else{
      // user created by workshop
      customers = await dataSources.customerDAOService.findAll({
        attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
        where: {
          [Op.not]: { firstName: 'Anonymous' },
          partnerId: req?.user?.partner.id
        },
        include: [Contact]
      });
    }

    const response: HttpResponse<Customer> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: customers,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async updateCustomers(req: Request) {
    console.log(req.body)
    const {error, value} = Joi.object({
      id: Joi.any().required().label("Customer Id"),
      firstName: Joi.string().optional().label("First Name"),
      lastName: Joi.string().optional().label("Last Name"),
      phone: Joi.string().optional().label("Phone"),
      creditRating: Joi.any().optional().label("Credit Rating"),
      state: Joi.string().optional().label("State"),
      district: Joi.string().optional().label("District"),
    }).validate(req.body);
    
    if(error){
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    // check if user exist
    const customer = await dataSources.customerDAOService.findById(value.id);
    
    if (!customer) {
      return Promise.reject(CustomAPIError.response("Customer not found", HttpStatus.NOT_FOUND.code));
    }

    customer.phone = value.phone;
    customer.firstName = value.firstName;
    customer.lastName = value.lastName;
    customer.creditRating = value.creditRating;
    await customer.save()

    // update contact also
    // await dataSources.contactDAOService.update({
    //   district: value.district,
    //   state: value.state,
    // }, {
    //   where: {
        
    //   }
    // })

    await Contact.update({
      district: value.district,
      state: value.state,
    }, {
      where: {
        // @ts-ignore
        customerId: value.id
      }
    })

    const response: HttpResponse<Customer> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async customer(customerId: number) {
    const response: HttpResponse<Customer> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

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
  }

  @TryCatch
  public static async customerVehicles(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object<AppRequestParams>({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

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
  }

  @TryCatch
  public static async customerAppointments(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

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
  }

  @TryCatch
  public static async customerTransactions(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      customerId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

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
  }

  @TryCatch
  public static async suggestWorkshop(req: Request) {
    const { error, value } = Joi.object({
      name: Joi.string().required().label('Name of workshop'),
      phone: Joi.string().required().label('Contact phone number'),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    const customerId = req.params.customerId as string;

    const customer = await dataSources.customerDAOService.findById(+customerId);

    if (!customer)
      return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

    const findByName = await dataSources.customerWorkShopDAOService.findByAny({
      where: { name: value.name },
    });

    if (findByName)
      return Promise.reject(
        CustomAPIError.response(`${value.name} has already been suggested`, HttpStatus.BAD_REQUEST.code),
      );

    const workShop = await dataSources.customerWorkShopDAOService.create(value);

    await customer.$add('workshops', [workShop]);

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: `Thank you! We will take it from here :)`,
    } as HttpResponse<void>);
  }
}
