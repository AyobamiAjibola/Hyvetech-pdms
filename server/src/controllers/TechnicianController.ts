import { Request } from "express";
import Joi from "joi";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import Technician from "../models/Technician";
import { appCommonTypes } from "../@types/app-common";
import { QueueManager } from "rabbitmq-email-manager";
import { QUEUE_EVENTS } from "../config/constants";
import email_content from "../resources/templates/email/email_content";
import dataSources from "../services/dao";
import { Op } from "sequelize";
import Generic from "../utils/Generic";
import { $loginSchema } from "../models/User";
import Job from "../models/Job";
import Vehicle from "../models/Vehicle";
import create_technician_success_email from "../resources/templates/email/create_technician_success_email";
import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class TechnicianController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  public async create(req: Request) {
    try {
      const { value, error } = Joi.object({
        confirmPassword: Joi.ref("password"),
        email: Joi.string().email().required().label("Email Address"),
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        password: Joi.string().required().label("Password"),
        phone: Joi.string().required().label("Phone Number"),
        partnerId: Joi.string().required().label("Partner Id"),
        role: Joi.string().required().label("Role"),
        active: Joi.boolean().truthy().required().label("Active"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partnerId = value.partnerId;

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with Id ${partnerId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const userExist = await dataSources.technicianDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email, phone: value.phone }],
        },
      });

      if (userExist)
        return Promise.reject(
          CustomAPIError.response(
            `User with email or phone number already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: value.role },
      });

      if (!role)
        return Promise.reject(
          CustomAPIError.response(
            `Role ${value.role} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const password = value.password;
      value.rawPassword = password;
      value.password = await this.passwordEncoder.encode(password);
      value.enabled = true;

      const user = await dataSources.technicianDAOService.create(value);

      //associate user with role
      await user.$add("roles", [role]);

      //associate partner with technician
      await partner.$add("technicians", [user]);

      const mailText = create_technician_success_email({
        username: user.email,
        password: user.rawPassword,
        appUrl: <string>process.env.TECHNICIAN_APP_URL,
        whatsappUrl: <string>process.env.WHATSAPP_URL,
      });

      const mail = email_content({
        firstName: user?.firstName,
        text: mailText,
        signature: process.env.SMTP_EMAIL_SIGNATURE,
      });

      //todo: Send email with credentials
      await QueueManager.publish({
        queue: QUEUE_EVENTS.name,
        data: {
          to: user.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: `Welcome to ${partner.name} Garage`,
          html: mail,
          bcc: [
            <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
            <string>process.env.SMTP_EMAIL_FROM,
          ],
        },
      });

      const technicians = await dataSources.technicianDAOService.findAll({
        attributes: { exclude: ["password", "rawPassword"] },
      });

      const response: HttpResponse<Technician> = {
        message: `Technician created successfully`,
        code: HttpStatus.OK.code,
        results: technicians,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async update(req: Request) {
    const techId = req.params.techId as string;

    const response: HttpResponse<Technician> = {
      code: HttpStatus.OK.code,
      message: "Updated Successfully",
    };

    try {
      const { error, value } = Joi.object({
        confirmPassword: Joi.ref("password"),
        id: Joi.string().allow().label("Technician Id"),
        email: Joi.string().email().required().label("Email Address"),
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        password: Joi.string().allow("").label("Password"),
        phone: Joi.string().required().label("Phone Number"),
        active: Joi.boolean().truthy().required().label("Active"),
        partnerId: Joi.string().allow("").label("Partner Id"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const technician = await dataSources.technicianDAOService.findById(
        +techId
      );

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `User does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      //check new email and phone does not exist
      const exist = await dataSources.technicianDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email }, { phone: value.phone }],
        },
      });

      //Return same result with no modification
      if (exist) {
        if (value.password.length) {
          const password = Generic.generateRandomString(8);

          value.password = await this.passwordEncoder.encode(password);

          value.rawPassword = password;
        } else delete value.password;

        await exist.update(value);

        response.result = exist;
        return Promise.resolve(response);
      }

      if (value.password.length) {
        const password = Generic.generateRandomString(8);

        value.password = await this.passwordEncoder.encode(password);

        value.rawPassword = password;
      } else delete value.password;

      // update database
      const result = await technician.update(value);

      if (!result)
        return Promise.reject(
          CustomAPIError.response(
            "ErrorPage Updating Information",
            HttpStatus.BAD_REQUEST.code
          )
        );

      response.result = result;
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async delete(req: Request) {
    const techId = req.params.techId as string;

    try {
      const technician = await dataSources.technicianDAOService.findById(
        +techId
      );

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `Technician with Id ${techId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      await technician.update({
        active: false,
      });

      const response: HttpResponse<null> = {
        code: HttpStatus.OK.code,
        message: `Technician deactivated successfully`,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async technician(req: Request) {
    const techId = req.params.techId as string;

    try {
      const technician = await dataSources.technicianDAOService.findById(
        +techId,
        { attributes: { exclude: ["password", "loginToken", "rawPassword"] } }
      );

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `Technician with Id ${techId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const response: HttpResponse<Technician> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: technician,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async technicians(req: Request) {
    const partner = req.user.partner;
    let technicians: Technician[];

    try {
      if (partner) {
        technicians = await partner.$get("technicians", {
          attributes: { exclude: ["password", "loginToken", "rawPassword"] },
          include: [{ model: Job, include: [Vehicle] }],
        });
      } else {
        technicians = await dataSources.technicianDAOService.findAll({
          attributes: { exclude: ["password", "loginToken", "rawPassword"] },
          include: [{ model: Job, include: [Vehicle] }],
        });
      }

      const response: HttpResponse<Technician> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: technicians,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async signIn(req: Request) {
    try {
      //validate request body
      const { error, value } = Joi.object($loginSchema).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      //find user by username
      const user = await dataSources.technicianDAOService.findByAny({
        where: { email: value.username },
      });

      if (!user)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      //verify password
      const hash = user.password;
      const isMatch = await this.passwordEncoder.match(value.password, hash);

      if (!isMatch)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      const roles = await user.$get("roles");

      const permissions = [];

      for (const role of roles) {
        const _permissions = await role.$get("permissions", {
          attributes: ["action", "subject"],
        });

        for (const _permission of _permissions) {
          permissions.push(_permission.toJSON());
        }
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: user.id,
        permissions,
      });

      //update user authentication date and authentication token
      const updateValues: any = {
        loginDate: new Date(),
        loginToken: jwt,
      };

      await user.update(updateValues);

      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
        message: "Login successful",
        result: jwt,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
