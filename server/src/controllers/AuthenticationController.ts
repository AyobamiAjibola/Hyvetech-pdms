import { Request, Response, response } from "express";

import Joi from "joi";

import { appCommonTypes } from "../@types/app-common";
import User, {
  $loginSchema,
  $passwordResetSchema,
  $resetPasswordWithTokenSchema,
  $userSchema,
} from "../models/User";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import Generic from "../utils/Generic";
import { InferAttributes } from "sequelize/types";
import { QueueManager } from "rabbitmq-email-manager";
import email_content from "../resources/templates/email/email_content";
import create_customer_success_email from "../resources/templates/email/create_customer_success_email";
import {
  CATEGORIES,
  COOPERATE_ACCOUNT_TYPE,
  GARAGE_ADMIN_ROLE,
  INDIVIDUAL_ACCOUNT_TYPE,
  MAIL_QUEUE_EVENTS,
  QUEUE_EVENTS,
} from "../config/constants";
import dataSources from "../services/dao";
import settings from "../config/settings";
import { CreationAttributes, Op } from "sequelize";
import Permission from "../models/Permission";
import Partner from "../models/Partner";
import { TryCatch } from "../decorators";
import Contact from "../models/Contact";
import PartnerController from "./PartnerController";
import garage_partner_welcome_email from "../resources/templates/email/garage_partner_welcome_email";
import capitalize from "capitalize";
import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import ResetPasswordTokenEmail from "../resources/templates/email/reset_password_token_email";
import UserToken from "../models/UserToken";
import RedisService from "../services/RedisService";

export interface IGarageSignupModel {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  dialCode: string;
  state: string;
  district: string;
  accountType: string;
  isRegistered: boolean;
  address?: string;
  password?: string;
  confirm_password?: string;
  confirmPassword?: string;
}

const redisService = new RedisService();

interface RedisData {
  token: string;
}

export default class AuthenticationController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  public async resetPasswordWithTOken(req: Request) {
    try {
      const response: HttpResponse<any> = {
        message: `Operation successful. Please login with new password`,
        code: HttpStatus.OK.code,
      };
      const { error, value } = Joi.object(
        $resetPasswordWithTokenSchema
      ).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const user = await dataSources.userDAOService.findByAny({
        where: {
          resetCode: value.token,
        },
      });

      if (!user)
        return Promise.reject(
          CustomAPIError.response(
            "Invalid authentication code",
            HttpStatus.BAD_REQUEST.code
          )
        );

      user.password = await this.passwordEncoder.encode(value.password);

      user.resetCode = "";

      await user.save();

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async sendPasswordResetToken(req: Request) {
    try {
      // const response: HttpResponse<any> = {
      //   message: `Password reset link sent successfully`,
      //   code: HttpStatus.OK.code,
      // };
      const { error, value } = Joi.object($passwordResetSchema).validate(
        req.body
      );

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const user = await dataSources.userDAOService.findByAny({
        where: {
          email: value.email,
        },
      });

      if (!user) 
        return Promise.reject(
        CustomAPIError.response(
          "User not found",
          HttpStatus.NOT_FOUND.code
        ));

      const resetCode = "" + Math.floor(Math.random() * 10000);

      // const mailText = ResetPasswordTokenEmail({
      //   firstName: user.firstName,
      //   code: resetCode,
      // });

      // await QueueManager.publish({
      //   queue: MAIL_QUEUE_EVENTS.name,
      //   data: {
      //     to: user.email,
      //     from: {
      //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
      //       address: <string>process.env.SMTP_EMAIL_FROM,
      //     },
      //     subject: `Reset Password`,
      //     html: mailText,
      //     bcc: [
      //       <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
      //       <string>process.env.SMTP_EMAIL_FROM,
      //     ],
      //   },
      // });

      user.resetCode = `${resetCode}`;

      await user.save();

      // const phone = user.phone.startsWith('0') ? user.phone.replace('0', '234') : user.phone

      dataSources.termiiService
        .sendMessage({
          to: user.phone,
          sms: `Your password reset code is ${resetCode}`,
          channel: "generic",
          type: "plain",
        })
        .then(() => {
          console.log("message sent successfully>");
          return -1;
        })
        .catch((error) => {
          console.log("Failed to send message? ", error);
        });

      // return response;
      const response: HttpResponse<User> = {
        message: `Token sent successfully.`,
        code: HttpStatus.OK.code,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @TryCatch
  public async preSignUp(req: Request) {
    const { error, value } = Joi.object<any>({
      phone: Joi.string().required().label("phone"),
      email: Joi.string().email().required().label("email"),
    }).validate(req.body);

    if(error) return Promise.reject(
      CustomAPIError.response(
        error.details[0].message, 
        HttpStatus.BAD_REQUEST.code));

    const email = await dataSources.userDAOService.findByAny({
      where: { email: value.email } 
    })

    if(email) 
      return Promise.reject(
        CustomAPIError.response(
          "User with email already exist",
          HttpStatus.BAD_REQUEST.code))

    const phone = await dataSources.userDAOService.findByAny({
      where: { phone: Generic.parsePhone(value.phone) }
    })

    if(phone) 
      return Promise.reject(
        CustomAPIError.response(
          "User with phone number already exist",
          HttpStatus.BAD_REQUEST.code));

    const token = redisService.generateToken();

    const data = {
      token: token,
    };
    const actualData = JSON.stringify(data);

    redisService.saveToken("jiffix_sign_up_token", actualData, 180);

    // const mailText = ResetPasswordTokenEmail({
    //   firstName: value.firstName,
    //   code: token,
    // });

    // await QueueManager.publish({
    //   queue: MAIL_QUEUE_EVENTS.name,
    //   data: {
    //     to: value.email,
    //     from: {
    //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
    //       address: <string>process.env.SMTP_EMAIL_FROM,
    //     },
    //     subject: `Reset Password`,
    //     html: mailText,
    //     bcc: [
    //       <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
    //       <string>process.env.SMTP_EMAIL_FROM,
    //     ],
    //   },
    // });

    await dataSources.termiiService
      .sendMessage({
        to: value.phone,
        sms: `Your password reset code is ${token}`,
        channel: "generic",
        type: "plain",
      })
      .then(() => {
        console.log("message sent successfully>");
        return -1;
      })
      .catch((error) => {
        console.log("Failed to send message? ", error);
      });

      const response: HttpResponse<User> = {
        message: `Token sent successfully ${token}`,
        code: HttpStatus.OK.code,
      };

      return Promise.resolve(response);
  }

  @TryCatch
  public async verifyToken (req: Request) {
    const { error, value } = Joi.object<any>({
      token: Joi.string().required().label("token")
    }).validate(req.body);

    if(error) return Promise.reject(
      CustomAPIError.response(
        error.details[0].message, 
        HttpStatus.BAD_REQUEST.code));

    const redisData = await redisService.getToken("jiffix_sign_up_token");

    if(redisData) {
      const { token }: any = redisData;

      if(token !== value.token) 
        return Promise.reject(
          CustomAPIError.response(
            'Token is incorrect', 
            HttpStatus.BAD_REQUEST.code));

      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value
      };
      
      redisService.deleteRedisKey("jiffix_sign_up_token")
      return Promise.resolve(response);
    
    } else {
      return Promise.reject(
        CustomAPIError.response('Token has expired, please try signing up again.', 
        HttpStatus.BAD_REQUEST.code))
    }
  }

  @TryCatch
  public async changePassword(req: Request) {

    const userId = req.user.id;

    const { error, value } = Joi.object({
      newPassword: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
          "string.pattern.base": `Password does not meet requirement.`,
        })
        .required()
        .label("password"),
      confirmPassword: Joi.ref("newPassword"),
      currentPassword: Joi.string().required(),
    }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

    const user = await dataSources.userDAOService.findById(+userId);
    if(!user)
      return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

    //verify password
    const hash = user.password;
    const password = value.currentPassword;

    const isMatch = await this.passwordEncoder.match(
      password.trim(),
      hash.trim()
    );
  
    if(!isMatch)
      return Promise.reject(
        CustomAPIError.response("The current password does not match.",
        HttpStatus.NOT_FOUND.code));

    await dataSources.userDAOService.update(
      user,
      <InferAttributes<User>>{password: value.newPassword}
    )

    const response: HttpResponse<User> = {
      message: `Password changed successfully`,
      code: HttpStatus.OK.code
    };

    return Promise.resolve(response);

  }

  /**
   * @name signup
   * @param req
   */
  public async signup(req: Request) {
    try {
      const { error, value } = Joi.object($userSchema).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const userExist = await dataSources.userDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email, phone: value.phone }],
        },
      });

      if (userExist)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.BAD_REQUEST.value,
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

      value.password = Generic.generateRandomString(15);

      const user = await dataSources.userDAOService.create(value);

      //associate user with role
      await user.$set("roles", [role]);

      const platforms = value.companyName.split(",");

      for (const platform of platforms) {
        const partner = await dataSources.partnerDAOService.findByAny({
          where: { name: platform },
        });

        if (!partner)
          return Promise.reject(
            CustomAPIError.response(
              HttpStatus.NOT_FOUND.value,
              HttpStatus.NOT_FOUND.code
            )
          );

        await partner.$add("users", [user]);
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

      // todo: Send email with credentials
      await QueueManager.publish({
        queue: MAIL_QUEUE_EVENTS.name,
        data: {
          to: user.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: `Welcome to Jiffix ${value.companyName}`,
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

  /**
   * @name signIn
   * @param req
   */
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
      const user = await dataSources.userDAOService.findByUsername(
        value.username,
        { include: [Partner] }
      );

      if (!user)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      //verify password
      const hash = user.password;
      const password = value.password;

      const isMatch = await this.passwordEncoder.match(
        password,
        hash.trim()
      );

      if (!isMatch)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      if (!user.active)
        return Promise.reject(
          CustomAPIError.response(
            "Account is disabled. Please contact administrator",
            HttpStatus.UNAUTHORIZED.code
          )
        );

      const role = await dataSources.roleDAOService.findById(user.roleId, {
        include: [Permission],
      });

      if (!role)
        return Promise.reject(
          CustomAPIError.response(
            `Roles does not exist`,
            HttpStatus.UNAUTHORIZED.code
          )
        );

      const permissions = [];

      for (const _permission of role.permissions) {
        permissions.push(_permission.toJSON());
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: user.id,
        partnerId: user.partnerId,
        accountType: user.accountType,
        permissions,
      });

      // const { accessToken, refreshToken }: any = await Generic.generateJWT({
      //   userId: user.id,
      //   partnerId: user.partnerId,
      //   permissions,
      // });
      
      //update user authentication date and authentication token
      const updateValues = {
        loginDate: new Date(),
        loginToken: jwt,
      };

      await dataSources.userDAOService.update(
        user,
        <InferAttributes<User>>updateValues
      );

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: "Login successful",
        result: jwt
        // tokens: {jwt, accessToken, refreshToken},
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
          username: "guest",
        },
      });

      if (user) {
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
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.BAD_REQUEST.value,
            HttpStatus.BAD_REQUEST.code
          )
        );

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: settings.roles[2] },
      });

      if (!role)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.NOT_FOUND.value,
            HttpStatus.NOT_FOUND.code
          )
        );

      const hash = await this.passwordEncoder.encode(rawPassword);

      const guestUser: any = {
        firstName: "Anonymous",
        lastName: "Anonymous",
        username: "guest",
        password: hash,
      };

      const created = await dataSources.userDAOService.create(guestUser);
      await created.$add("roles", [role]);

      const roles = await created.$get("roles");

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

  public async signOut(req: Request, res: Response) {
    try {
      await req.user.update({ loginToken: "" });
      // const cookies = req.signedCookies;
      // const cookieName = settings.cookie.refreshToken;
  
      // const cookie = cookies[cookieName];

      // await UserToken.destroy({ where: {token: cookie }});

      const response: HttpResponse<null> = {
        code: HttpStatus.OK.code,
        message: "Signed out successfully",
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @TryCatch
  public async checkAuth(req: Request, res: Response) {
 
    if (req.isTokenExpired) {
      // res.redirect('/session-expired');
      console.log('expired')
      const response: HttpResponse<boolean> = {
        code: HttpStatus.OK.code,
        message: "Protected route",
        result: false
      };
  
      return Promise.resolve(response);
    } else {
      const response: HttpResponse<boolean> = {
        code: HttpStatus.OK.code,
        message: "Protected route",
        result: true
      };
  
      return Promise.resolve(response);
    }
    
  }

  @TryCatch
  public async garageSignup(req: Request) {
    const { error, value } = Joi.object<IGarageSignupModel>({
      firstName: Joi.string().max(80).label("First Name").required(),
      lastName: Joi.string().max(80).label("Last Name").required(),
      name: Joi.string().optional().allow("").label("Workshop/Business Name"),
      email: Joi.string().email().label("Email Address").required(),
      accountType: Joi.string().label("Account Type").required(),
      address: Joi.string().optional().label('Address'),
      phone: Joi.string().required().label("Phone Number"),
      dialCode: Joi.string().optional().label("Dial Code"),
      state: Joi.string().label("State").required(),
      district: Joi.string().label("District").required(),
      password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
      .messages({
        "string.pattern.base": `Password does not meet requirement.`,
      })
      .required()
      .label("password"),
      confirm_password: Joi.ref("password"),
      confirmPassword: Joi.ref("password"),
      isRegistered: Joi.boolean()
        .truthy()
        .label("Legally Registered")
        .optional(),
    }).validate(req.body);

    if (error)
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.BAD_REQUEST.code
        )
      );
    if (!value)
      return Promise.reject(
        CustomAPIError.response(
          HttpStatus.BAD_REQUEST.value,
          HttpStatus.BAD_REQUEST.code
        )
      );

    // const userExist = await dataSources.userDAOService.findByAny({
    //   where: {email: value.email }
    // });

    // if (userExist)
    //   return Promise.reject(
    //     CustomAPIError.response(
    //       `User with email already exist`,
    //       HttpStatus.BAD_REQUEST.code
    //     )
    //   );

    //check if partner with email or name already exist
    if(value.accountType === COOPERATE_ACCOUNT_TYPE) {
      const partnerExist = await dataSources.partnerDAOService.findByAny({
        where: {
          [Op.or]: [{ name: value.name }, { email: value.email }],
        },
      });
  
      if (partnerExist)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with name or email already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );
    }

    if(value.accountType === INDIVIDUAL_ACCOUNT_TYPE) {
      const partnerExist = await dataSources.partnerDAOService.findByAny({
        where: { email: value.email }
      });
  
      if (partnerExist)
        return Promise.reject(
          CustomAPIError.response(
            `User with email already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );
    }
    
    const state = await dataSources.stateDAOService.findByAny({
      where: {
        name: value.state,
      },
    });

    if (!state)
      return Promise.reject(
        CustomAPIError.response(
          `State does not exist`,
          HttpStatus.NOT_FOUND.code
        )
      );

    const password = value.password || <string>process.env.PARTNER_PASS;

    //find garage admin role
    const role = await dataSources.roleDAOService.findByAny({
      where: { slug: settings.roles[4] },
    });

    if (!role)
      return Promise.reject(
        CustomAPIError.response(
          `Role does not exist`,
          HttpStatus.NOT_FOUND.code
        )
      );

    const partnerValues: Partial<Partner> = {
      email: value.email,
      name: value.name || value.email,
      phone: value.phone,
      slug: Generic.generateSlug(value.name || value.email),
      totalStaff: 0,
      totalTechnicians: 0,
      yearOfIncorporation: 0,
    };

    const userValues: Partial<User> = {
      username: value.email,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      active: true,
      password,
      accountType: value.accountType,
      rawPassword: password,
      roleId: role.id,
      phone: value.phone,
      address: value.address
    };

    const contactValues: Partial<Contact> = {
      state: state.name,
      country: "Nigeria",
      district: value.district
    };

    //find garage category
    const category = await dataSources.categoryDAOService.findByAny({
      where: {
        name: CATEGORIES[3].name,
      },
    });

    if (!category)
      return Promise.reject(
        CustomAPIError.response(
          `Category does not exist`,
          HttpStatus.BAD_REQUEST.code
        )
      );

    // if(value.accountType === COOPERATE_ACCOUNT_TYPE) {
    //   const partnerValues: Partial<Partner> = {
    //     email: value.email,
    //     name: value.name,
    //     phone: value.phone,
    //     slug: Generic.generateSlug(value.name),
    //     totalStaff: 0,
    //     totalTechnicians: 0,
    //     yearOfIncorporation: 0,
    //   };

    //   const contact = await dataSources.contactDAOService.create(
    //     <CreationAttributes<Contact>>contactValues
    //   );

    //   const partner = await dataSources.partnerDAOService.create(
    //     <CreationAttributes<Partner>>partnerValues
    //   );

    //   await partner.$add("categories", [category]);
    //   await partner.$set("contact", contact);
    //   await partner.$set("users", user);

    //   result = PartnerController.formatPartner(partner);

    //   const mailSubject = `Welcome to AutoHyve!`;
  
    //   const mailText = garage_partner_welcome_email({
    //     partnerName: capitalize(partnerValues.name as string),
    //     password: userValues.rawPassword as string,
    //     appUrl: <string>process.env.CLIENT_HOST,
    //   });
  
    //   await QueueManager.publish({
    //     queue: MAIL_QUEUE_EVENTS.name,
    //     data: {
    //       to: user.email,
    //       from: `${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_FROM}>`,
    //       subject: mailSubject,
    //       html: mailText,
    //       bcc: [
    //         <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
    //         <string>process.env.SMTP_EMAIL_FROM,
    //       ],
    //     },
    //   });
    // }

    const contact = await dataSources.contactDAOService.create(
      <CreationAttributes<Contact>>contactValues
    );


    //create partner
    const partner = await dataSources.partnerDAOService.create(
      <CreationAttributes<Partner>>partnerValues
    );

    //create default admin user
    const user = await dataSources.userDAOService.create(
      <CreationAttributes<User>>userValues
    );
    
    await user.$set("roles", [role]);

    await partner.$add("categories", [category]);
    await partner.$set("contact", contact);
    await partner.$set("users", user);
    await role.$add("users", [user]);

    const result = PartnerController.formatPartner(partner);

    // const mailSubject = `Welcome to AutoHyve!`;
  
    //   const mailText = garage_partner_welcome_email({
    //     partnerName: capitalize(partnerValues.name as string),
    //     password: userValues.rawPassword as string,
    //     appUrl: <string>process.env.CLIENT_HOST,
    //   });
  
    //   await QueueManager.publish({
    //     queue: MAIL_QUEUE_EVENTS.name,
    //     data: {
    //       to: user.email,
    //       from: `${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_FROM}>`,
    //       subject: mailSubject,
    //       html: mailText,
    //       bcc: [
    //         <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
    //         <string>process.env.SMTP_EMAIL_FROM,
    //       ],
    //     },
    //   });

    const response: HttpResponse<Partner | User> = {
      message: `Account successfully created.`,
      code: HttpStatus.OK.code,
      result
    };

    return Promise.resolve(response);
  }
}
