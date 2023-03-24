import { Request } from 'express';

import Joi from 'joi';

import { appCommonTypes } from '../@types/app-common';
import User, { $loginSchema, $userSchema } from '../models/User';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Generic from '../utils/Generic';
import { InferAttributes } from 'sequelize/types';
import { QueueManager } from 'rabbitmq-email-manager';
import email_content from '../resources/templates/email/email_content';
import create_customer_success_email from '../resources/templates/email/create_customer_success_email';
import { CATEGORIES, GARAGE_ADMIN_ROLE, QUEUE_EVENTS } from '../config/constants';
import dataSources from '../services/dao';
import settings from '../config/settings';
import { CreationAttributes, Op } from 'sequelize';
import Permission from '../models/Permission';
import Partner from '../models/Partner';
import { TryCatch } from '../decorators';
import Contact from '../models/Contact';
import PartnerController from './PartnerController';
import garage_partner_welcome_email from '../resources/templates/email/garage_partner_welcome_email';
import capitalize from 'capitalize';
import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export interface IGarageSignupModel {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  dialCode: string;
  state: string;
  isRegistered: boolean;
}

export default class AuthenticationController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * @name signup
   * @param req
   */
  public async signup(req: Request) {
    try {
      const { error, value } = Joi.object($userSchema).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const userExist = await dataSources.userDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email, phone: value.phone }],
        },
      });

      if (userExist)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: value.role },
      });

      if (!role) return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

      value.password = Generic.generateRandomString(15);

      const user = await dataSources.userDAOService.create(value);

      //associate user with role
      await user.$set('roles', [role]);

      const platforms = value.companyName.split(',');

      for (const platform of platforms) {
        const partner = await dataSources.partnerDAOService.findByAny({
          where: { name: platform },
        });

        if (!partner)
          return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

        await partner.$add('users', [user]);
      }

      const mailText = create_customer_success_email({
        username: user.email,
        password: user.password,
        loginUrl: process.env.CUSTOMER_APP_HOST,
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
          subject: `Welcome to Jiffix ${value.companyName}`,
          html: mail,
          bcc: [<string>process.env.SMTP_CUSTOMER_CARE_EMAIL, <string>process.env.SMTP_EMAIL_FROM],
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

  /**
   * @name signIn
   * @param req
   */
  public async signIn(req: Request) {
    try {
      //validate request body
      const { error, value } = Joi.object($loginSchema).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      //find user by username
      const user = await dataSources.userDAOService.findByUsername(value.username, { include: [Partner] });

      if (!user)
        return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      //verify password
      const hash = user.password;
      const password = value.password;

      console.log('iiii> ', password, hash);

      const isMatch = await this.passwordEncoder.match(password.trim(), hash.trim());

      if (!isMatch)
        return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      const role = await dataSources.roleDAOService.findById(user.roleId, { include: [Permission] });

      if (!role) return Promise.reject(CustomAPIError.response(`Roles does not exist`, HttpStatus.UNAUTHORIZED.code));

      const permissions = [];

      console.log(role.permissions);

      for (const _permission of role.permissions) {
        permissions.push(_permission.toJSON());
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: user.id,
        partnerId: user.partnerId,
        permissions,
      });

      //update user authentication date and authentication token
      const updateValues = {
        loginDate: new Date(),
        loginToken: jwt,
      };

      await dataSources.userDAOService.update(user, <InferAttributes<User>>updateValues);

      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
        message: 'Login successful',
        result: jwt,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name bootstrap
   * @description generate authentication token for anonymous users
   */

  public async bootstrap() {
    try {
      const user = await dataSources.userDAOService.findByAny({
        where: {
          username: 'guest',
        },
      });

      if (user) {
        const roles = await user.$get('roles');

        const permissions = [];

        for (const role of roles) {
          const _permissions = await role.$get('permissions', {
            attributes: ['action', 'subject'],
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

        await user.update({
          loginDate: new Date(),
          loginToken: jwt,
        });

        const response: HttpResponse<string> = {
          message: HttpStatus.OK.value,
          code: HttpStatus.OK.code,
          result: jwt,
        };

        return Promise.resolve(response);
      }

      const rawPassword = process.env.BOOTSTRAP_PASS;

      if (undefined === rawPassword)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: settings.roles[2] },
      });

      if (!role) return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

      const hash = await this.passwordEncoder.encode(rawPassword);

      const guestUser: any = {
        firstName: 'Anonymous',
        lastName: 'Anonymous',
        username: 'guest',
        password: hash,
      };

      const created = await dataSources.userDAOService.create(guestUser);
      await created.$add('roles', [role]);

      const roles = await created.$get('roles');

      const permissions = [];

      for (const role of roles) {
        const _permissions = await role.$get('permissions', {
          attributes: ['action', 'subject'],
        });

        for (const _permission of _permissions) {
          permissions.push(_permission.toJSON());
        }
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: created.id,
        permissions,
      });

      await created.update({
        loginDate: new Date(),
        loginToken: jwt,
      });

      const response: HttpResponse<string> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: jwt,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name signOut
   * @param req
   */

  public async signOut(req: Request) {
    try {
      await req.user.update({ loginToken: '' });

      const response: HttpResponse<null> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @TryCatch
  public async garageSignup(req: Request) {
    const { error, value } = Joi.object<IGarageSignupModel>({
      firstName: Joi.string().max(80).label('First Name').required(),
      lastName: Joi.string().max(80).label('Last Name').required(),
      name: Joi.string().required().label('Workshop/Business Name'),
      email: Joi.string().email().label('Email Address').required(),
      phone: Joi.string().length(11).required().label('Phone Number'),
      dialCode: Joi.string().required().label('Dial Code'),
      state: Joi.string().label('State').required(),
      isRegistered: Joi.boolean().truthy().label('Legally Registered').required(),
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    if (!value)
      return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

    //check if partner with email or name already exist
    const partnerExist = await dataSources.partnerDAOService.findByAny({
      where: {
        [Op.or]: [{ name: value.name }, { email: value.email }],
      },
    });

    if (partnerExist)
      return Promise.reject(
        CustomAPIError.response(`Partner with name or email already exist`, HttpStatus.BAD_REQUEST.code),
      );

    const state = await dataSources.stateDAOService.findByAny({
      where: {
        name: value.state,
      },
    });

    if (!state) return Promise.reject(CustomAPIError.response(`State does not exist`, HttpStatus.NOT_FOUND.code));

    const password = <string>process.env.PARTNER_PASS;

    const partnerValues: Partial<Partner> = {
      email: value.email,
      name: value.name,
      phone: value.phone,
      slug: Generic.generateSlug(value.name),
      totalStaff: 0,
      totalTechnicians: 0,
      yearOfIncorporation: 0,
    };

    //find garage admin role
    const role = await dataSources.roleDAOService.findByAny({
      where: { slug: settings.roles[4] },
    });

    if (!role) return Promise.reject(CustomAPIError.response(`Role does not exist`, HttpStatus.NOT_FOUND.code));

    const userValues: Partial<User> = {
      username: value.email,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      active: true,
      password,
      rawPassword: password,
      roleId: role.id,
    };

    const contactValues: Partial<Contact> = {
      state: state.name,
      country: 'Nigeria',
    };

    //find garage category
    const category = await dataSources.categoryDAOService.findByAny({
      where: {
        name: CATEGORIES[3].name,
      },
    });

    if (!category)
      return Promise.reject(CustomAPIError.response(`Category does not exist`, HttpStatus.BAD_REQUEST.code));

    //create partner
    const partner = await dataSources.partnerDAOService.create(<CreationAttributes<Partner>>partnerValues);

    //create default admin user
    const user = await dataSources.userDAOService.create(<CreationAttributes<User>>userValues);

    const contact = await dataSources.contactDAOService.create(<CreationAttributes<Contact>>contactValues);

    await partner.$add('categories', [category]);
    await partner.$set('contact', contact);
    await partner.$set('users', user);

    await role.$set('users', [user]);

    const result = PartnerController.formatPartner(partner);

    const mailSubject = `Welcome to AutoHyve!`;

    const mailText = garage_partner_welcome_email({
      partnerName: capitalize(partnerValues.name as string),
      password: userValues.rawPassword as string,
      appUrl: <string>process.env.CLIENT_HOST,
    });

    await QueueManager.publish({
      queue: QUEUE_EVENTS.name,
      data: {
        to: user.email,
        from: {
          name: <string>process.env.SMTP_EMAIL_FROM_NAME,
          address: <string>process.env.SMTP_EMAIL_FROM,
        },
        subject: mailSubject,
        html: mailText,
        bcc: [<string>process.env.SMTP_CUSTOMER_CARE_EMAIL, <string>process.env.SMTP_EMAIL_FROM],
      },
    });

    const response: HttpResponse<Partner> = {
      message: `Account successfully created.`,
      code: HttpStatus.OK.code,
      result,
    };

    return Promise.resolve(response);
  }
}
