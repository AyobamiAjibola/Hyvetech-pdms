import { Request } from "express";
import Joi from "joi";
import capitalize from "capitalize";
import { Op } from "sequelize";

import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import { CATEGORIES } from "../config/constants";
import Generic from "../utils/Generic";
import { appCommonTypes } from "../@types/app-common";
import settings from "../config/settings";
import Partner from "../models/Partner";
import Category from "../models/Category";
import User from "../models/User";
import Contact from "../models/Contact";
import Plan, { $planSchema } from "../models/Plan";
import PaymentPlan, { $paymentPlanSchema } from "../models/PaymentPlan";
import axiosClient from "../services/api/axiosClient";
import _ from "lodash";
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import HttpResponse = appCommonTypes.HttpResponse;

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
}

export default class PartnerController {
  private declare passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * @name createPartner
   * @description Create partners
   * @param req
   */
  public async createPartner(req: Request) {
    try {
      const body = req.body as ICreatePartnerBody;

      const { error, value } = Joi.object<ICreatePartnerBody>({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        category: Joi.string().required().label("Category"),
        state: Joi.string().required().label("State"),
        phone: Joi.string().max(11).required().label("Phone Number"),
      }).validate(body);

      if (error)
        return CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        );

      //check if partner with email or name already exist
      const exist = await dataSources.partnerDAOService.findByAny({
        where: {
          [Op.or]: [{ name: value?.name }, { email: value?.email }],
        },
      });

      if (exist)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with email or name already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const state = await dataSources.stateDAOService.findByAny({
        where: {
          alias: value?.state,
        },
      });

      if (!state)
        return Promise.reject(
          CustomAPIError.response(
            `State does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const partnerValues = {
        email: value?.email,
        name: value?.name,
        phone: value?.phone,
        slug: Generic.generateSlug(value?.name),
        totalStaff: 0,
        totalTechnicians: 0,
        brands: [],
        images: [],
        yearOfIncorporation: 0,
        cac: "",
        workingHours: [],
      };
      const userValues = {
        username: value?.email,
        email: value?.email,
        firstName: "Partner",
        lastName: "Partner",
        phone: "",
        active: true,
        password: await this.passwordEncoder.encode("W3lc0m3@!!!"),
      };
      const contactValues = {
        state: state.name,
        label: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        mapUrl: "",
        country: "Nigeria",
      };

      let category;
      let role;

      //Garage Partner
      if (value?.category === CATEGORIES[3].name) {
        //find garage category
        category = await dataSources.categoryDAOService.findByAny({
          where: {
            name: value?.category,
          },
        });

        //find garage admin role
        role = await dataSources.roleDAOService.findByAny({
          where: { slug: settings.roles[4] },
        });
      }

      //Ride-Share Partner
      if (value?.category === CATEGORIES[4].name) {
        //find ride-share category
        category = await dataSources.categoryDAOService.findByAny({
          where: {
            name: value?.category,
          },
        });

        //find ride-share admin role
        role = await dataSources.roleDAOService.findByAny({
          where: { slug: settings.roles[6] },
        });
      }

      if (!category)
        return Promise.reject(
          CustomAPIError.response(
            `Category does not exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      if (!role)
        return Promise.reject(
          CustomAPIError.response(
            `Role does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      //create partner
      const partner = await dataSources.partnerDAOService.create(partnerValues);

      //create default admin user
      const user = await dataSources.userDAOService.create(userValues);

      const contact = await dataSources.contactDAOService.create(contactValues);

      await user.$add("roles", [role]);
      await partner.$add("categories", [category]);
      await partner.$set("contact", contact);
      await partner.$set("users", user);

      const response: HttpResponse<Partner> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: partner,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name getPartners
   */
  public async getPartners() {
    try {
      const partners = await dataSources.partnerDAOService.findAll({
        include: [Category, User, Contact],
      });

      const response: HttpResponse<Partner> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        results: partners,
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

  public async getPartner(id: number) {
    try {
      const partner = await dataSources.partnerDAOService.findById(id, {
        include: [Category, User, Contact],
      });

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.NOT_FOUND.value,
            HttpStatus.NOT_FOUND.code
          )
        );

      const response: HttpResponse<Partner> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: partner,
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
  public async addPlan(body: ICreatePlanBody, partnerId: number) {
    try {
      const { error, value } = Joi.object($planSchema).validate(body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      if (undefined === value)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.BAD_REQUEST.value,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const planExist = await dataSources.planDAOService.findByAny({
        where: { label: value.label },
      });

      if (planExist)
        return Promise.reject(
          CustomAPIError.response(
            `Plan with name ${value.label} already exist.`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partner = await dataSources.partnerDAOService.findById(partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with ${partnerId} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const category = await dataSources.categoryDAOService.findByAny({
        where: { name: value.serviceMode },
      });

      if (!category)
        return Promise.reject(
          CustomAPIError.response(
            `Category with ${value.serviceMode} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      //todo: use type of programme to find subscription
      const subValues: any = {
        name: value.label,
        slug: Generic.generateSlug(value.label),
      };

      const subscription = await dataSources.subscriptionDAOService.create(
        subValues
      );

      if (!subscription)
        return Promise.reject(
          CustomAPIError.response(
            `Error adding subscription.`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      Object.assign(value, {
        label: Generic.generateSlug(`${value.label} ${value.serviceMode}`),
      });

      const plan = await dataSources.planDAOService.create(value);

      await subscription.$set("plans", [plan]);
      await partner.$set("plans", [plan]);

      await plan.$add("categories", [category]);

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
  public async addPaymentPlan(body: ICreatePaymentPlanBody, partnerId: number) {
    try {
      const { value, error } =
        Joi.object<ICreatePaymentPlanBody>($paymentPlanSchema).validate(body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      if (undefined === value)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.BAD_REQUEST.value,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partner = await dataSources.partnerDAOService.findById(partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with ${partnerId} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const plan = await dataSources.planDAOService.findByAny({
        where: { label: value.plan },
      });

      if (!plan)
        return Promise.reject(
          CustomAPIError.response(
            `Plan with ${value.plan} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const serviceMode = plan.serviceMode;

      const serviceModeCategory =
        await dataSources.categoryDAOService.findByAny({
          where: { name: serviceMode },
        });

      if (!serviceModeCategory)
        return Promise.reject(
          CustomAPIError.response(
            `Service Mode Category with ${serviceMode} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const pricing = value.pricing;

      const paymentPlanData: any[] = pricing.map((price) => ({
        discount: +value.discount,
        hasPromo: value.discount.length !== 0,
        name: capitalize.words(`${price.interval} ${value.name}`),
        label: Generic.generateSlug(
          `${price.interval} ${plan.serviceMode} ${value.name}`
        ),
        coverage: value.coverage,
        descriptions: value.descriptions.map((value) =>
          JSON.stringify({ ...value })
        ),
        parameters: value.parameters.map((value) =>
          JSON.stringify({ ...value })
        ),
        pricing: value.pricing.map((value) => JSON.stringify({ ...value })),
      }));

      //link payment plan categories
      const paymentPlan = await dataSources.paymentPlanDAOService.bulkCreate(
        paymentPlanData
      );

      //link plan payment plans
      await plan.$add("paymentPlans", paymentPlan);

      const paymentGateway =
        await dataSources.paymentGatewayDAOService.findByAny({
          where: { default: true },
        });

      if (!paymentGateway)
        return Promise.reject(
          CustomAPIError.response(
            `No default payment gateway available.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      pricing.map(async (price) => {
        const payload = {
          name: capitalize.words(`${price.interval} ${value.name}`),
          interval: price.interval,
          amount: `${+price.amount * 100}`,
        };

        const response = await axiosClient.post(
          `${paymentGateway.baseUrl}/plan`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${paymentGateway.secretKey}`,
            },
          }
        );

        return response.data;
      });

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
          CustomAPIError.response(
            `Partner with ${partnerId} does not exist.`,
            HttpStatus.NOT_FOUND.code
          )
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
        email: Joi.string().email().allow("").label("Email"),
        firstName: Joi.string().allow("").label("First Name"),
        lastName: Joi.string().allow("").label("Last Name"),
        plateNumber: Joi.string().allow("").label("Plate Number"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const driverInfo: IDriverFilterProps[] = [];

      const hasValues = _.values<IDriverFilter>(value).some(
        (filter) => filter.length > 0
      );

      if (!hasValues) return Promise.resolve(response);

      for (const valueKey in value) {
        if (valueKey === "plateNumber") {
          const vehicle = await dataSources.vehicleDAOService.findByAny({
            where: { plateNumber: value[valueKey] },
          });

          if (!vehicle) return Promise.resolve(response);

          const driver = await vehicle.$get("rideShareDriver");

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

  public async driversFilterData(partnerId: number) {
    const driverInfo: IDriverFilterProps[] = [];

    const response: HttpResponse<IDriverFilterProps> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: driverInfo,
    };

    try {
      const partner = await dataSources.partnerDAOService.findById(partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const drivers = await dataSources.rideShareDriverDAOService.findAll();

      if (!drivers.length) return Promise.resolve(response);

      for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];
        const fullName = `${driver.firstName} ${driver.lastName}`;
        const email = driver.email;

        const vehicles = await drivers[i].$get("vehicles");

        driverInfo[i] = {
          id: driver.id,
          fullName,
          query: `${email} ${fullName}`,
        };

        for (let j = 0; j < vehicles.length; j++) {
          const vehicle = vehicles[j];

          Object.assign(driverInfo[i], {
            query: `${driverInfo[i].query} ${vehicle.plateNumber}`,
          });
        }
      }

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
