import { Request } from "express";

import { appCommonTypes } from "../@types/app-common";
import Joi from "joi";
import User, { $loginSchema, $userSchema } from "../models/User";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import PasswordEncoder from "../utils/PasswordEncoder";
import Generic from "../utils/Generic";
import { InferAttributes } from "sequelize/types";
import QueueManager from "../services/QueueManager";
import email_content from "../resources/templates/email/email_content";
import create_customer_success_email from "../resources/templates/email/create_customer_success_email";
import { QUEUE_EVENTS } from "../config/constants";
import dataSources from "../services/dao";
import HttpResponse = appCommonTypes.HttpResponse;

export default class AuthenticationController {
  public static async signup(req: Request) {
    try {
      const { error, value } = Joi.object($userSchema).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
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
            HttpStatus.NOT_FOUND.value,
            HttpStatus.NOT_FOUND.code
          )
        );

      //create user
      const user = await dataSources.userDAOService.create(value);

      //associate user with role
      await user.$set("roles", [role]);

      const mailText = create_customer_success_email({
        username: user.email,
        loginUrl: process.env.CUSTOMER_APP_HOST,
      });

      const mail = email_content({
        firstName: user?.firstName,
        text: mailText,
        signature: process.env.SMTP_EMAIL_SIGNATURE,
      });

      //todo: Send email with credentials
      await QueueManager.dispatch({
        queue: QUEUE_EVENTS.name,
        data: {
          to: user.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: `Welcome to Jiffix!`,
          html: mail,
          bcc: [
            <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
            <string>process.env.SMTP_EMAIL_FROM,
          ],
        },
      });

      const response: HttpResponse<User> = {
        message: `User created successfully`,
        code: HttpStatus.OK.code,
        result: user,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async signIn(req: Request) {
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
      const user = await dataSources.userDAOService.findByUsername(
        value.username
      );

      if (!user)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      //verify passwords
      const passwordEncoder = new PasswordEncoder();

      const hash = user.password;
      const isMatch = await passwordEncoder.match(value.password, hash);

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
      const updateValues = {
        loginDate: new Date(),
        loginToken: jwt,
      };

      await dataSources.userDAOService.update(
        user,
        <InferAttributes<User>>updateValues
      );

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
