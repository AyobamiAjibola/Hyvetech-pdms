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
import settings from '../config/settings';
import PasswordEncoder from '../utils/PasswordEncoder';
import QueueManager from 'rabbitmq-email-manager';
import { QUEUE_EVENTS } from '../config/constants';
import main_welcome_corporate_email from '../resources/templates/email/main_welcome_corporate_email';
import main_welcome_individual_email from '../resources/templates/email/main_welcome_individual_email';

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
      results: customers.reverse(),
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async addCustomers(req: Request) {
    // console.log(req.body)
    const {error, value} = Joi.object({
            firstName: Joi.string().required().label("First Name"),
            lastName: Joi.string().required().label("Last Name"),
            email: Joi.string().email().required().label("Email"),
            state: Joi.string().required().label("State"),
            district: Joi.string().required().label("District"),
            phone: Joi.string().required().label("Phone"),
            address: Joi.string().optional().label("Address"),
            creditRating: Joi.string().optional().label("Credit Rating"),
            companyName: Joi.any().allow().label("Company Name"),
            accountType: Joi.string().optional().label("Account Type"),
    }).validate(req.body);
    
    if(error){
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    value.email = (value.email).toLowerCase();

    // check if user exist
    const customer = await dataSources.customerDAOService.findByAny({
      where: {
        [Op.or]: [{ email: (value.email).toLowerCase() }, { phone: value.phone }],
      },
    });
    
    if (customer) {
      return Promise.reject(CustomAPIError.response("Customer already exist", HttpStatus.NOT_FOUND.code));
    }


    //find role by name
    const role = await dataSources.roleDAOService.findByAny({
      where: { slug: settings.roles[1] },
    });

    // const state = await dataSources.stateDAOService.findByAny({
    //   where: { alias: value.state },
    // });

    // if (!state)
    //   return Promise.reject(CustomAPIError.response(`State ${value.state} does not exist`, HttpStatus.NOT_FOUND.code));

    if (!role)
      return Promise.reject(
        CustomAPIError.response(`Role ${settings.roles[1]} does not exist`, HttpStatus.NOT_FOUND.code),
      );

      const passwordEncoder = new PasswordEncoder();

    const payload = {
      rawPassword: value.phone,
      password: (await passwordEncoder.encode(value.phone)),
      enabled: true,
      active: true,
      companyName: value.companyName,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      partnerId: req?.user.partner?.id || null
    }

    const contactValues: any = {
      label: 'Home',
      state: value.state,
      district: value.district,
      address: value.address
    };

    const contact = await dataSources.contactDAOService.create(contactValues);

    // @ts-ignore
    const user = await dataSources.customerDAOService.create(payload);

    //associate user with role
    await user.$set('roles', [role]);
    await user.$set('contacts', [contact]);

    // send mail
    let welcomeHtml;
    const fullName = `${value.firstName} ${value.lastName}`;

    if (value.companyName) welcomeHtml = main_welcome_corporate_email(fullName);
    else welcomeHtml = main_welcome_individual_email(fullName);

    // const passwordHtml = main_default_password_email(value.rawPassword);

    const queuePayload = {
      queue: QUEUE_EVENTS.name,
      data: {
        to: user.email,
        from: {
          name: <string>process.env.SMTP_EMAIL_FROM_NAME,
          address: <string>process.env.SMTP_EMAIL_FROM,
        },
        subject: `Welcome to AutoHyve`,
        html: welcomeHtml,
        bcc: [<string>process.env.SMTP_BCC, <string>process.env.SMTP_CONFIG_USERNAME],
      },
    };

    await QueueManager.publish(queuePayload);


    const response: HttpResponse<Customer> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value
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
