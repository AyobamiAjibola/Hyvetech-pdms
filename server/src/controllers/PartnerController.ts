import { Request } from "express";
import Joi from "joi";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import { Op } from "sequelize";
import { CATEGORIES } from "../config/constants";
import Generic from "../utils/Generic";
import { appCommonTypes } from "../@types/app-common";
import settings from "../config/settings";
import Partner from "../models/Partner";
import Category from "../models/Category";
import User from "../models/User";
import Contact from "../models/Contact";
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import HttpResponse = appCommonTypes.HttpResponse;

interface ICreatePartnerBody {
  category: string;
  email: string;
  name: string;
  phone: string;
  state: string;
}

export default class PartnerController {
  private declare passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

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
        //find ride share category
        category = await dataSources.categoryDAOService.findByAny({
          where: {
            name: value?.category,
          },
        });

        //find ride share admin role
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
}
