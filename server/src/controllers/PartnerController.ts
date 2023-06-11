// noinspection JSUnfilteredForInLoop

import { Request } from 'express';
import Joi from 'joi';
import capitalize from 'capitalize';
import { CreationAttributes, InferAttributes, InferCreationAttributes, Op } from 'sequelize';

import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import { CATEGORIES, QUEUE_EVENTS, UPLOAD_BASE_PATH } from '../config/constants';
import Generic from '../utils/Generic';
import { appCommonTypes } from '../@types/app-common';
import settings, {
  CREATE_WORKSHOP_PROFILE,
  MANAGE_ALL,
  MANAGE_TECHNICIAN,
  READ_CUSTOMER,
  READ_DRIVER,
  READ_WORKSHOP_PROFILE,
  UPDATE_WORKSHOP_PROFILEY,
} from '../config/settings';
import Partner, { $createPartnerKyc, $createPartnerSettings, CreatePartnerType } from '../models/Partner';
import Category from '../models/Category';
import User from '../models/User';
import Contact from '../models/Contact';
import Plan, { $planSchema } from '../models/Plan';
import PaymentPlan, { $paymentPlanSchema } from '../models/PaymentPlan';
import axiosClient from '../services/api/axiosClient';
import _ from 'lodash';
import JobController from './JobController';
import { QueueManager } from 'rabbitmq-email-manager';
import formidable, { File } from 'formidable';
import garage_partner_welcome_email from '../resources/templates/email/garage_partner_welcome_email';
import ride_share_partner_welcome_email from '../resources/templates/email/ride_share_partner_welcome_email';
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import HttpResponse = appCommonTypes.HttpResponse;
import { generateEstimateHtml, generateInvoiceHtml, generatePdf, generateReceiptHtml } from '../utils/pdf';
import { HasPermission, TryCatch } from '../decorators';
import Preference, { $savePreferenceSchema, PreferenceSchemaType } from '../models/Pereference';

import { promisify } from 'util';
import ItemStock from '../models/ItemStock';
import ServiceReminder from '../models/ServiceReminder';
// import { IncomingForm, File } from 'formidable';

interface IPaymentPlanModelDescription {
  value: string;
}

interface IPaymentPlanModelCoverage {
  name: string;
  unit: string;
  value: string;
}

export interface IPricing {
  interval: string;
  amount: string;
}

export interface IDriverFilter {
  firstName: string;
  lastName: string;
  email: string;
  plateNumber: string;
}

export interface ICreatePartnerBody {
  category: string;
  email: string;
  name: string;
  phone: string;
  state: string;
}

export interface ICreatePaymentPlanBody {
  name: string;
  discount: string;
  plan: string;
  coverage: string;
  descriptions: IPaymentPlanModelDescription[];
  parameters: IPaymentPlanModelCoverage[];
  pricing: IPricing[];
}

export interface ICreatePlanBody {
  programme: string;
  serviceMode: string;
  label: string;
  minVehicles: string;
  maxVehicles: string;
  validity: string;
  mobile: string;
  driveIn: string;
}

export interface IDriverFilterProps {
  id?: number;
  fullName?: string;
  query?: string;
  raw?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phone?: string;
  };
}

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

export default class PartnerController {
  private declare passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  public static formatPartners(partners: Partner[]) {
    return partners.map(partner => this.formatPartner(partner));
  }

  public static formatPartner(partner: Partner) {
    const workingHours = partner.workingHours;
    const brands = partner.brands;

    if (workingHours || brands) {
      Object.assign(partner, {
        workingHours: workingHours.map(workingHour => JSON.parse(workingHour)),
        brands: brands.map(brand => JSON.parse(brand)),
      });
    }

    return partner;
  }

  /**
   * @name createPartner
   * @description Create partners
   * @param req
   */
  @HasPermission([MANAGE_ALL])
  public async createPartner(req: Request): Promise<HttpResponse<Partner>> {
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          const { error, value } = Joi.object({
            name: Joi.string().required().label('Name'),
            email: Joi.string().email().required().label('Email'),
            category: Joi.string().required().label('Category'),
            state: Joi.string().required().label('State'),
            phone: Joi.string().max(11).required().label('Phone Number'),
          }).validate(fields);

          if (error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

          //check if partner with email or name already exist
          const _partner = await dataSources.partnerDAOService.findByAny({
            where: { name: value.name },
          });

          if (_partner)
            return reject(CustomAPIError.response(`Partner with name already exist`, HttpStatus.BAD_REQUEST.code));

          const state = await dataSources.stateDAOService.findByAny({
            where: {
              alias: value.state,
            },
          });

          if (!state) return reject(CustomAPIError.response(`State does not exist`, HttpStatus.NOT_FOUND.code));

          const password = <string>process.env.PARTNER_PASS;
          const partnerValues: any = {
            email: value.email,
            name: value.name,
            phone: value.phone,
            slug: Generic.generateSlug(value.name),
            totalStaff: 0,
            totalTechnicians: 0,
            yearOfIncorporation: 0,
          };
          const userValues: Partial<User> = {
            username: value.email,
            email: value.email,
            firstName: 'Admin',
            lastName: 'Admin',
            // active: true,
            active: true,
            password,
            rawPassword: password,
          };
          const contactValues: any = {
            state: state.name,
            country: 'Nigeria',
          };

          let category, role, mailSubject, mailText;

          //Garage Partner
          if (value.category === CATEGORIES[3].name) {
            mailSubject = `Welcome to AutoHyve!`;
            mailText = garage_partner_welcome_email({
              partnerName: capitalize(partnerValues.name),
              password: userValues.rawPassword || '',
              appUrl: <string>process.env.CLIENT_HOST,
            });

            //find garage category
            category = await dataSources.categoryDAOService.findByAny({
              where: {
                name: value.category,
              },
            });

            //find garage admin role
            role = await dataSources.roleDAOService.findByAny({
              where: { slug: settings.roles[4] },
            });
          }

          //Ride-Share Partner
          if (value.category === CATEGORIES[4].name) {
            mailSubject = `Welcome to Auto Hyve!`;
            mailText = ride_share_partner_welcome_email({
              partnerName: capitalize(partnerValues.name),
              password: userValues.rawPassword || '',
              appUrl: <string>process.env.CLIENT_HOST,
            });

            //find ride-share category
            category = await dataSources.categoryDAOService.findByAny({
              where: {
                name: value.category,
              },
            });

            //find ride-share admin role
            role = await dataSources.roleDAOService.findByAny({
              where: { slug: settings.roles[6] },
            });
          }

          if (!category) return reject(CustomAPIError.response(`Category does not exist`, HttpStatus.BAD_REQUEST.code));

          if (!role) return reject(CustomAPIError.response(`Role does not exist`, HttpStatus.NOT_FOUND.code));

          const logo = files.logo as File;
          const basePath = `${UPLOAD_BASE_PATH}/partners`;

          if (logo) {
            partnerValues.logo = await Generic.getImagePath({
              tempPath: logo.filepath,
              filename: <string>logo.originalFilename,
              basePath,
            });
          }

          userValues.roleId = role.id;

          //create partner
          const partner = await dataSources.partnerDAOService.create(partnerValues);

          //create default admin user
          const user = await dataSources.userDAOService.create(userValues as CreationAttributes<User>);

          const contact = await dataSources.contactDAOService.create(contactValues);

          await user.$set('roles', [role]);
          await partner.$add('categories', [category]);
          await partner.$set('contact', contact);
          await partner.$set('users', user);
          await role.$add('users', [user]);

          const result = PartnerController.formatPartner(partner);

          await QueueManager.publish({
            queue: QUEUE_EVENTS.name,
            data: {
              to: user.email,
              from: `${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_FROM}>`,

              subject: mailSubject,
              html: mailText,
              bcc: [<string>process.env.SMTP_CUSTOMER_CARE_EMAIL, <string>process.env.SMTP_EMAIL_FROM],
            },
          });

          const response: HttpResponse<Partner> = {
            message: HttpStatus.OK.value,
            code: HttpStatus.OK.code,
            result,
          };

          return resolve(response);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  public async togglePartner(req: Request) {
    // start
    try {
      const partnerId = req.params.partnerId as unknown as string;

      const partner = await dataSources.partnerDAOService.findById(+partnerId, { include: [{ all: true }] });

      if (!partner)
        return Promise.reject(CustomAPIError.response('Customer does not exist', HttpStatus.NOT_FOUND.code));

      const user_id = partner.users[0].id;
      const user_active = partner.users[0].active;

      await User.update(
        {
          active: !user_active,
        },
        {
          where: {
            id: user_id,
          },
        },
      );

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: `Partner Account Adjusted successfully.`,
      } as HttpResponse<void>);
    } catch (e) {
      return Promise.reject(e);
    }
    // end
  }

  @HasPermission([MANAGE_ALL])
  public async deletePartner(req: Request) {
    try {
      const partnerId = req.params.partnerId as unknown as string;

      const partner = await dataSources.partnerDAOService.findById(+partnerId, { include: [{ all: true }] });

      if (!partner)
        return Promise.reject(CustomAPIError.response('Customer does not exist', HttpStatus.NOT_FOUND.code));

      const estimates = await partner.$get('estimates');

      await partner.$remove('estimates', estimates);

      for (let i = 0; i < estimates.length; i++) {
        await estimates[i].destroy();
      }

      await partner.destroy();

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: `Partner deleted successfully.`,
      } as HttpResponse<void>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name createKyc
   * @param req
   */
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, CREATE_WORKSHOP_PROFILE, UPDATE_WORKSHOP_PROFILEY])
  public async createKyc(req: Request) {
    const partnerId = req.params.partnerId as string;

    try {
      const { error, value } = Joi.object<CreatePartnerType>($createPartnerKyc).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const partner = await dataSources.partnerDAOService.findById(+partnerId, {
        include: [Contact, Category, User],
      });

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(`Partner with id ${partnerId} does not exist`, HttpStatus.BAD_REQUEST.code),
        );

      for (const valueKey in value) {
        //@ts-ignore
        if (value[valueKey].length) {
          //@ts-ignore
          await partner.update({ [valueKey]: value[valueKey] });
        }
      }

      if (value.workshopAddress.length) {
        const contact = await partner.$get('contact');
        if (contact) {
          await contact.update({ address: value.workshopAddress });
          await partner.$set('contact', contact);
        }
      }

      const result = PartnerController.formatPartner(partner);
      console.log(result, 'result');

      const response: HttpResponse<Partner> = {
        code: HttpStatus.OK.code,
        message: `Updated KYC Successfully`,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name createSettings
   * @param req
   */
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, CREATE_WORKSHOP_PROFILE, UPDATE_WORKSHOP_PROFILEY])
  public async createSettings(req: Request): Promise<HttpResponse<InferAttributes<Partner>>> {
    const partnerId = req.params.partnerId as string;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        const logo = files.logo as File;
        const basePath = `${UPLOAD_BASE_PATH}/partners`;

        try {
          const { error, value } = Joi.object<CreatePartnerType>($createPartnerSettings).validate(fields);

          if (error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

          const partner = await dataSources.partnerDAOService.findById(+partnerId, {
            include: [Contact, Category, User],
          });

          if (!partner)
            return reject(
              CustomAPIError.response(`Partner with id ${partnerId} does not exist`, HttpStatus.BAD_REQUEST.code),
            );

          //@ts-ignore
          value.brands = JSON.parse(value.brands);
          //@ts-ignore
          value.workingHours = JSON.parse(value.workingHours);

          for (const valueKey in value) {
            //@ts-ignore
            if (valueKey !== 'logo' && value[valueKey].length) {
              //@ts-ignore
              await partner.update({ [valueKey]: value[valueKey] });
            }
          }

          if (logo) {
            partner.set({
              logo: await Generic.getImagePath({
                tempPath: logo.filepath,
                filename: <string>logo.originalFilename,
                basePath,
              }),
            });

            await partner.save();
          }

          // const partnerJson = partner.toJSON();
          const response: HttpResponse<InferAttributes<Partner>> = {
            code: HttpStatus.OK.code,
            message: `Updated Settings Successfully`,
            result: partner,
          };

          resolve(response);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  /**
   * @name getPartners
   */
  @HasPermission([MANAGE_ALL])
  public async getPartners(req: Request) {
    try {
      const partners = await dataSources.partnerDAOService.findAll({
        include: [Category, User, Contact, ItemStock, ServiceReminder],
      });

      const results = PartnerController.formatPartners(partners);

      const response: HttpResponse<Partner> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name getPartner
   * @param id
   */
  @HasPermission([
    MANAGE_ALL,
    MANAGE_TECHNICIAN,
    READ_WORKSHOP_PROFILE,
    CREATE_WORKSHOP_PROFILE,
    UPDATE_WORKSHOP_PROFILEY,
  ])
  public async getPartner(req: Request) {
    try {
      const partner = await dataSources.partnerDAOService.findById(+req.params.id || +req.params.partnerId, {
        include: [Category, User, Contact],
      });

      if (!partner)
        return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

      const result = PartnerController.formatPartner(partner);

      const response: HttpResponse<Partner> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name addPlan
   * @param body
   * @param partnerId
   */
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, CREATE_WORKSHOP_PROFILE, UPDATE_WORKSHOP_PROFILEY])
  public async addPlan(body: ICreatePlanBody, partnerId: number) {
    try {
      const { error, value } = Joi.object($planSchema).validate(body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      if (undefined === value)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      const planExist = await dataSources.planDAOService.findByAny({
        where: { label: value.label },
      });

      if (planExist)
        return Promise.reject(
          CustomAPIError.response(`Plan with name ${value.label} already exist.`, HttpStatus.BAD_REQUEST.code),
        );

      const partner = await dataSources.partnerDAOService.findById(partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(`Partner with ${partnerId} does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      const category = await dataSources.categoryDAOService.findByAny({
        where: { name: value.serviceMode },
      });

      if (!category)
        return Promise.reject(
          CustomAPIError.response(`Category with ${value.serviceMode} does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      //todo: use type of programme to find subscription
      const subValues: any = {
        name: value.label,
        slug: Generic.generateSlug(value.label),
      };

      const subscription = await dataSources.subscriptionDAOService.create(subValues);

      if (!subscription)
        return Promise.reject(CustomAPIError.response(`Error adding subscription.`, HttpStatus.BAD_REQUEST.code));

      Object.assign(value, {
        label: Generic.generateSlug(`${value.label} (${value.serviceMode})`),
      });

      const plan = await dataSources.planDAOService.create(value);

      await subscription.$add('plans', [plan]);
      await partner.$add('plans', [plan]);

      await plan.$add('categories', [category]);

      const plans = await dataSources.planDAOService.findAll({
        include: [{ model: Partner, where: { id: partnerId } }],
      });

      const response: HttpResponse<Plan> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results: plans,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name addPaymentPlan
   * @param body
   * @param partnerId
   */
  @HasPermission([MANAGE_ALL])
  public async addPaymentPlan(body: ICreatePaymentPlanBody, partnerId: number) {
    try {
      const { value, error } = Joi.object<ICreatePaymentPlanBody>($paymentPlanSchema).validate(body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      if (undefined === value)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      const partner = await dataSources.partnerDAOService.findById(partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(`Partner with ${partnerId} does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      const plan = await dataSources.planDAOService.findByAny({
        where: { label: value.plan },
      });

      if (!plan)
        return Promise.reject(
          CustomAPIError.response(`Plan with ${value.plan} does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      const serviceMode = plan.serviceMode;

      const serviceModeCategory = await dataSources.categoryDAOService.findByAny({
        where: { name: serviceMode },
      });

      if (!serviceModeCategory)
        return Promise.reject(
          CustomAPIError.response(
            `Service Mode Category with ${serviceMode} does not exist.`,
            HttpStatus.NOT_FOUND.code,
          ),
        );

      const paymentGateway = await dataSources.paymentGatewayDAOService.findByAny({
        where: { default: true },
      });

      if (!paymentGateway)
        return Promise.reject(
          CustomAPIError.response(`No default payment gateway available.`, HttpStatus.NOT_FOUND.code),
        );

      const pricing = value.pricing;

      const axiosResponse = await axiosClient.get(`${paymentGateway.baseUrl}/plan`);

      const _gwPaymentPlans = axiosResponse.data.data;

      pricing.map(async price => {
        const name = capitalize.words(`${price.interval} ${value.name}`);

        const exist = _gwPaymentPlans.find((value: any) => value.name === name);

        //Only create non-existing plan in paystack
        if (!exist) {
          const payload = {
            name,
            interval: price.interval,
            amount: `${+price.amount * 100}`,
          };

          const response = await axiosClient.post(`${paymentGateway.baseUrl}/plan`, payload, {
            headers: {
              Authorization: `Bearer ${paymentGateway.secretKey}`,
            },
          });

          return response.data;
        }

        return exist;
      });

      const paymentPlanData: any[] = pricing.map(price => ({
        discount: +value.discount,
        hasPromo: value.discount.length !== 0,
        name: capitalize.words(`${price.interval} ${value.name}`),
        label: Generic.generateSlug(`${plan.serviceMode} ${value.name}`),
        value: price.amount,
        coverage: value.coverage,
        descriptions: value.descriptions.map(value => JSON.stringify({ ...value })),
        parameters: value.parameters.map(value => JSON.stringify({ ...value })),
        pricing: value.pricing.map(value => JSON.stringify({ ...value })),
      }));

      //check if name and label already exist
      for (const datum of paymentPlanData) {
        const exist = await dataSources.paymentPlanDAOService.findByAny({
          where: {
            [Op.or]: [{ name: datum.name }, { label: datum.label }],
          },
        });

        if (exist) {
          return Promise.reject(
            CustomAPIError.response(
              `Payment Plan with info: ${datum.name} already exist.`,
              HttpStatus.BAD_REQUEST.code,
            ),
          );
        }
      }

      const paymentPlan = await dataSources.paymentPlanDAOService.bulkCreate(paymentPlanData);

      //link plan payment plans
      await plan.$add('paymentPlans', paymentPlan);

      const paymentPlans = await dataSources.paymentPlanDAOService.findAll({
        include: [{ model: Plan, where: { partnerId: partnerId } }],
      });

      const response: HttpResponse<PaymentPlan> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results: paymentPlans,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name getPlans
   * @param partnerId
   */
  public async getPlans(partnerId: number) {
    try {
      const plans = await dataSources.planDAOService.findAll({
        include: [{ model: Partner, where: { id: partnerId } }],
      });

      const response: HttpResponse<Plan> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results: plans,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name getPaymentPlans
   * @param partnerId
   */
  public async getPaymentPlans(partnerId: number) {
    try {
      const partner = await dataSources.partnerDAOService.findById(partnerId, {
        include: [Plan],
      });

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(`Partner with ${partnerId} does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      const paymentPlans = await dataSources.paymentPlanDAOService.findAll({
        include: [{ model: Plan, where: { partnerId: partnerId } }],
      });

      const response: HttpResponse<PaymentPlan> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results: paymentPlans,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async filterDrivers(req: Request) {
    const partnerId = req.params.partnerId as string;

    const driverInfo: IDriverFilterProps[] = [];

    const response: HttpResponse<IDriverFilterProps> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: driverInfo,
    };

    try {
      const { error, value } = Joi.object<IDriverFilter>({
        email: Joi.string().email().allow('').label('Email'),
        firstName: Joi.string().allow('').label('First Name'),
        lastName: Joi.string().allow('').label('Last Name'),
        plateNumber: Joi.string().allow('').label('Plate Number'),
      }).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist`, HttpStatus.NOT_FOUND.code));

      const driverInfo: IDriverFilterProps[] = [];

      const hasValues = _.values<IDriverFilter>(value).some(filter => filter.length > 0);

      if (!hasValues) return Promise.resolve(response);

      for (const valueKey in value) {
        if (valueKey === 'plateNumber') {
          const vehicle = await dataSources.vehicleDAOService.findByAny({
            where: { plateNumber: value[valueKey] },
          });

          if (!vehicle) return Promise.resolve(response);

          const driver = await vehicle.$get('rideShareDriver');

          if (!driver) return Promise.resolve(response);

          driverInfo.push({
            id: driver.id,
            fullName: `${driver.firstName} ${driver.lastName}`,
          });

          response.results = driverInfo;
        }

        const driver = await dataSources.rideShareDriverDAOService.findByAny({
          where: {
            [valueKey]: {
              // @ts-ignore
              [Op.iLike]: value[valueKey],
            },
          },
        });

        if (!driver) return Promise.resolve(response);

        driverInfo.push({
          id: driver.id,
          fullName: `${driver.firstName} ${driver.lastName}`,
        });

        response.results = driverInfo;
      }

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, UPDATE_WORKSHOP_PROFILEY, MANAGE_TECHNICIAN])
  public async updatePreferences(req: Request) {
    const res = await this.doUpdatePreferences(req);

    const response: HttpResponse<Preference> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: res,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, UPDATE_WORKSHOP_PROFILEY, READ_WORKSHOP_PROFILE])
  public async getPreferences(req: Request) {
    const res = await this.doGetPreferences(req);

    const response: HttpResponse<Preference | null> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: res,
    };

    return response;
  }

  private doGetPreferences(req: Request) {
    return dataSources.preferenceDAOService.findByAny({ where: { partnerId: req.user.partnerId } });
  }

  private async doUpdatePreferences(req: Request) {
    const { error, value } = Joi.object<PreferenceSchemaType>($savePreferenceSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const preference = await dataSources.preferenceDAOService.findByAny({ where: { partnerId: req.user.partnerId } });
    const values: Partial<Preference> = {
      termsAndCondition: value.termsAndCondition,
      partnerId: value.partnerId,
    };

    const partner = await dataSources.partnerDAOService.findById(req.user.partner.id);

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist`, HttpStatus.NOT_FOUND.code));

    let preferenceUpdate!: Preference;

    if (!preference)
      preferenceUpdate = await dataSources.preferenceDAOService.create(values as CreationAttributes<Preference>);
    else
      preferenceUpdate = await dataSources.preferenceDAOService.update(
        preference,
        values as InferCreationAttributes<Preference>,
      );

    await preferenceUpdate.$set('partner', partner);
    await partner?.$set('preference', preferenceUpdate);

    return preferenceUpdate;
  }

  @HasPermission([READ_CUSTOMER, MANAGE_TECHNICIAN, MANAGE_ALL, READ_DRIVER])
  public async driversFilterData(req: Request) {
    const partnerId = req.params.partnerId as string;
    const path = req.path;

    path.search('owners-filter-data');
    const driverInfo: IDriverFilterProps[] = [];

    const response: HttpResponse<IDriverFilterProps> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: driverInfo,
    };

    try {
      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner) return Promise.reject(CustomAPIError.response(`Partner does not exist`, HttpStatus.NOT_FOUND.code));

      let drivers: any[] = [];

      switch (path) {
        case path.match('owners-filter-data')?.input:
          drivers = await dataSources.customerDAOService.findAll({
            where: {
              [Op.not]: { firstName: 'Anonymous' },
            },
          });
          break;
        case path.match('partner-filter-data')?.input:
          drivers = await dataSources.customerDAOService.findAll({
            where: {
              [Op.not]: { firstName: 'Anonymous' },
              partnerId: partnerId,
            },
          });
          break;
        case path.match('drivers-filter-data')?.input:
          drivers = await dataSources.rideShareDriverDAOService.findAll();
          break;
        default:
      }

      if (!drivers.length) return Promise.resolve(response);

      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];
        // const fullName = `${driver.firstName} ${driver.lastName} ${driver.email} ${driver.companyName}`;
        const fullName = `${driver.firstName} ${driver.lastName} ${driver?.companyName || ''} ${driver.email} ${
          driver.phone
        }`;
        const email = driver.email;

        const vehicles = await drivers[i].$get('vehicles');

        driverInfo[i] = {
          id: driver.id,
          fullName,
          query: `${email} ${fullName}`,
          raw: {
            email: email,
            firstName: driver.firstName,
            lastName: driver.lastName,
            companyName: driver.companyName,
            phone: driver.phone,
          },
        };

        for (let j = 0; j < vehicles.length; j++) {
          const vehicle = vehicles[j];

          Object.assign(driverInfo[i], {
            query: `${driverInfo[i].query} ${vehicle.plateNumber} ${vehicle.vin}`,
          });

          // Object.assign(driverInfo[i], {
          //   fullName: `${driverInfo[i].fullName} ${(vehicle.plateNumber !== "") ? "plate:"+vehicle.plateNumber : ""} vin:${(vehicle.vin !== "") ? "vin:"+vehicle.vin : "" }`,
          // });
        }
      }

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async jobs(req: Request) {
    const partnerId = req.params.partnerId as string;

    return JobController.jobs(+partnerId);
  }

  public async deletePlan(req: Request) {
    try {
      const planId = req.query.planId as string;
      const paymentPlanId = req.query.paymentPlanId as string;

      if (planId) {
        const plan = await dataSources.planDAOService.findById(+planId);

        const result = plan;

        if (!plan) return Promise.reject(CustomAPIError.response(`Plan does not exist`, HttpStatus.NOT_FOUND.code));

        const subscription = await plan.$get('subscriptions');

        if (subscription) {
          await subscription.$remove('plans', plan);
          await subscription.destroy();
        }

        await plan.destroy();

        const response: HttpResponse<Plan> = {
          code: HttpStatus.OK.code,
          message: `Deleted plan successfully.`,
          result,
        };

        return Promise.resolve(response);
      }

      if (paymentPlanId) {
        const paymentPlan = await dataSources.paymentPlanDAOService.findById(+paymentPlanId);

        const result = paymentPlan;

        if (!paymentPlan)
          return Promise.reject(CustomAPIError.response(`Payment Plan does not exist`, HttpStatus.NOT_FOUND.code));

        const plan = await dataSources.planDAOService.findById(paymentPlan.planId);

        if (!plan) return Promise.reject(CustomAPIError.response(`Plan does not exist`, HttpStatus.NOT_FOUND.code));

        await plan.$remove('paymentPlans', paymentPlan);
        await paymentPlan.destroy();

        const response: HttpResponse<PaymentPlan> = {
          code: HttpStatus.OK.code,
          message: `Deleted Payment Plan successfully.`,
          result,
        };

        return Promise.resolve(response);
      }

      return Promise.reject({
        code: HttpStatus.BAD_REQUEST.code,
        message: HttpStatus.BAD_REQUEST.value,
      } as HttpResponse<any>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async requestPdf(req: Request) {
    // ..
    try {
      const { type, id } = req.body;
      const rName = req.body.rName;

      let html: string | null = '';
      let partner = null;

      switch (type) {
        case 'ESTIMATE':
          html = await generateEstimateHtml(id);
          break;

        case 'INVOICE':
          partner = req.user.partner;
          html = await generateInvoiceHtml(id, partner.id);
          break;

        case 'RECEIPT':
          partner = req.user.partner;
          html = await generateReceiptHtml(id, partner.id, rName);
          break;

        default:
          break;
      }

      // const rName = req.body.rName;
      await generatePdf(html, rName);

      return Promise.resolve({
        code: 200,
        message: HttpStatus.CREATED.value,
        name: rName,
      } as HttpResponse<any>);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
