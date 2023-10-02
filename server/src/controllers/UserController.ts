import { Request } from 'express';

import dataSources from '../services/dao';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Partner from '../models/Partner';
import { appCommonTypes } from '../@types/app-common';
import formidable, { File } from 'formidable';
import User, { $saveUserSchema, $updateUserSchema, UserSchemaType } from '../models/User';

import Contact from '../models/Contact';
import Joi = require('joi');
import { CreationAttributes, InferAttributes, Op } from 'sequelize';
import { HasPermission, TryCatch } from '../decorators';
import {
  CREATE_CUSTOMER,
  CREATE_USER,
  DELETE_USER,
  MANAGE_ALL,
  MANAGE_TECHNICIAN,
  READ_USER,
  UPDATE_USER,
} from '../config/settings';
import PasswordEncoder from '../utils/PasswordEncoder';
import Role from '../models/Role';
import Permission from '../models/Permission';

import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import { ALLOWED_FILE_TYPES, MAX_SIZE_IN_BYTE, MESSAGES, UPLOAD_BASE_PATH } from '../config/constants';
import Generic from '../utils/Generic';

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

export default class UserController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }
  @HasPermission([MANAGE_TECHNICIAN, READ_USER, CREATE_CUSTOMER])
  public async user(req: Request) {
    const userId = req.params.userId as string;
    try {
      const user = await dataSources.userDAOService.findById(+userId, {
        include: [
          {
            model: Role,
            include: [Permission],
          },
          {
            model: Partner,
            include: [Contact],
          },
        ],
      });

      if (!user)
        return Promise.reject(
          CustomAPIError.response(`User with Id: ${userId} does not exist`, HttpStatus.NOT_FOUND.code),
        );

      const response: HttpResponse<User> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: user,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @HasPermission([MANAGE_TECHNICIAN, READ_USER, CREATE_USER, CREATE_CUSTOMER])
  public async users(req: Request) {
    try {
      const partner = req.user.partner;
      const users = await dataSources.userDAOService.findAll({
        where: {
          partnerId: partner.id,
        },
        include: [Role],
        order: [['updatedAt', 'DESC']],
      });

      const response: HttpResponse<User> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: users,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER, CREATE_CUSTOMER])
  public async createUser(req: Request) {
    const user = await this.doCreateUser(req);

    const response: HttpResponse<User> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, UPDATE_USER, CREATE_USER])
  public async updateUserStatus(req: Request) {
    const user = await this.doUpdateUserStatus(req);

    const response: HttpResponse<User> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, UPDATE_USER, CREATE_USER])
  public async updateUser(req: Request) {
    const user = await this.doUpdateUser(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, DELETE_USER])
  public async deleteUser(req: Request) {
    const user = await this.doDeleteUser(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "User deleted successfully",
      result: user,
    };

    return response;
  }

  private async doCreateUser(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<UserSchemaType>($saveUserSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findById(value.roleId);

    if (!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

    const userValues: Partial<User> = {
      ...value,
      password: value.password,
      roleId: role.id,
      partnerId: partner.id,
      active: true,
      username: value.email,
    };

    const oldUser = await dataSources.userDAOService.findByAny({
      where: { [Op.or]: [{ email: value.email }, { username: value.email }] },
    });

    if (oldUser) return Promise.reject(CustomAPIError.response('User already exists', HttpStatus.BAD_REQUEST.code));

    const user = await dataSources.userDAOService.create(userValues as CreationAttributes<User>);

    await role?.$add('users', [user]);
    await user.$add('roles', [role]);

    return user;
  }

  private async doUpdateUserStatus(req: Request) {
    const partner = req.user.partner;

    const user = await dataSources.userDAOService.findById(+req.params.userId, { include: [{ model: Role }] });

    if (!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));

    if (
      user.roles[0]?.slug === MANAGE_TECHNICIAN &&
      !req.permissions.map(item => item.name).includes(MANAGE_TECHNICIAN)
    )
      return Promise.reject(
        CustomAPIError.response('Unauthorized access. Please contact system admin', HttpStatus.UNAUTHORIZED.code),
      );

    return dataSources.userDAOService.update(user, {
      active: !user.active,
    } as InferAttributes<User>);
  }

  private async doUpdateUser(req: Request): Promise<HttpResponse<any>> {
    return new Promise ((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          const { error, value } = Joi.object<any>($updateUserSchema).validate(fields);
          if (error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

          const user = await dataSources.userDAOService.findById(+value.id, { include: [{ model: Role }] });
          if (!user) return reject(
            CustomAPIError.response(
              'User not found', 
              HttpStatus.BAD_REQUEST.code
            ));

          const role = await dataSources.roleDAOService.findByAny({
            where: {id: user.roleId}
          });

          if (
            user.roles[0]?.slug === MANAGE_TECHNICIAN &&
            !req.permissions.map(item => item.name).includes(MANAGE_TECHNICIAN)
          )
            return reject(
              CustomAPIError.response('Unauthorized access. Please contact system admin', HttpStatus.UNAUTHORIZED.code),
            );

          if (!role) return reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

          // const user_email = await dataSources.userDAOService.findByAny({
          //   where: {email: value.email}
          // });

          // if(value.email && user.email !== value.email){
          //     if(user_email) {
          //       return reject(CustomAPIError.response('User with this email already exists', HttpStatus.NOT_FOUND.code))
          //     }
          // };

          const user_phone = await dataSources.userDAOService.findByAny({
            where: {phone: value.phone}
          });

          if(value.phone && user.phone !== value.phone){
              if(user_phone) {
                return reject(CustomAPIError.response('User with this phone number already exists', HttpStatus.NOT_FOUND.code))
              }
          };

          const contact = await dataSources.contactDAOService.findByAny({
            //@ts-ignore
            where: { partnerId: user.partnerId }
          })

          if(!contact) {
            return reject(CustomAPIError.response('Contact not found', HttpStatus.NOT_FOUND.code))
          }

          const contactValues = {
            state: value.state,
            district: value.district
          }

          const profile_image = files.profileImageUrl as File;
          const basePath = `${UPLOAD_BASE_PATH}/user`;
          
          let _profileImageUrl = ''
          if(profile_image) {
              // File size validation
              const maxSizeInBytes = MAX_SIZE_IN_BYTE
              if (profile_image.size > maxSizeInBytes) {
                  return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
              }
      
              // File type validation
              const allowedFileTypes = ALLOWED_FILE_TYPES;
              if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
                  return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
              }
      
              _profileImageUrl = await Generic.getImagePath({
                  tempPath: profile_image.filepath,
                  filename: profile_image.originalFilename as string,
                  basePath,
              });
          };

          const userValues: Partial<User> = {
            firstName: value.firstName,
            lastName: value.lastName,
            phone: value.phone,
            // email: value.email,
            address: value.address,
            // roleId: role.id,
            profileImageUrl: _profileImageUrl ? _profileImageUrl : user.profileImageUrl
          };

          // if (value.password && value.password.trim() !== '') userValues.password = value.password;
          await dataSources.contactDAOService.update(contact, contactValues as InferAttributes<Contact>)
          await dataSources.userDAOService.update(user, userValues as InferAttributes<User>);

          await role.$set('users', [user]);
          await user.$set('roles', [role]);
          
          //@ts-ignore
          return resolve(user);
          
        } catch (e) {
          return reject(e);
        }
        
      })
    })
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER, MANAGE_ALL])
  public async createUserByPartner(req: Request) {
    const partnerId = req.user.partnerId;

    const { error, value } = Joi.object<any>({
      email: Joi.string().required().email().label("email"),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
          "string.pattern.base": `Password does not meet requirement.`,
        })
        .required()
        .label("password"),
      phone: Joi.string().required().label("phone"),
      lastName: Joi.string().required().label("last name"),
      firstName: Joi.string().required().label("first name"),
      role: Joi.string().required().label("role")
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const partner = await dataSources.partnerDAOService.findById(partnerId)
    if(!partner)
      return Promise.reject(
        CustomAPIError.response('Partner not found',
        HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findByAny({
      where: {
        [Op.and]: [
          { name: value.role },
          { partnerId: partner.id }
        ]
      }
    });

    if (!role) return Promise.reject(
        CustomAPIError.response('Role not found',
        HttpStatus.BAD_REQUEST.code));

    const user = await dataSources.userDAOService.findByAny({
      where: {
        [Op.or]: [
          { email: value.email },
          { phone: value.phone }
        ]
      }
    });
    if (user) return Promise.reject(
      CustomAPIError.response('User with this email or phone already exist',
      HttpStatus.BAD_REQUEST.code));

    // const user_email = await dataSources.userDAOService.findByAny({
    //   where: {email: value.email}
    // });

    // if(value.email && user.email !== value.email){
    //     if(user_email) {
    //       return reject(CustomAPIError.response('User with this email already exists', HttpStatus.NOT_FOUND.code))
    //     }
    // };

    // const user_phone = await dataSources.userDAOService.findByAny({
    //   where: {phone: value.phone}
    // });

    // if(value.phone && user.phone !== value.phone){
    //     if(user_phone) {
    //       return Promise.reject(CustomAPIError.response('User with this phone number already exists', HttpStatus.NOT_FOUND.code))
    //     }
    // };

    // const profile_image = files.profileImageUrl as File;
    // const basePath = `${UPLOAD_BASE_PATH}/user`;

    // let _profileImageUrl = ''
    // if(profile_image) {
    //     // File size validation
    //     const maxSizeInBytes = MAX_SIZE_IN_BYTE
    //     if (profile_image.size > maxSizeInBytes) {
    //         return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
    //     }

    //     // File type validation
    //     const allowedFileTypes = ALLOWED_FILE_TYPES;
    //     if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
    //         return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
    //     }

    //     _profileImageUrl = await Generic.getImagePath({
    //         tempPath: profile_image.filepath,
    //         filename: profile_image.originalFilename as string,
    //         basePath,
    //     });
    // };

    const userValues: Partial<User> = {
      ...value,
      username: value.email,
      companyName: partner.name,
      roleId: role.id,
      partnerId: partner.id,
    };

    const newUser = await dataSources.userDAOService.create(
      <CreationAttributes<User>>userValues
    );

    await newUser.$set("roles", [role]);
    await role.$add("users", [newUser]);
    
    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "User created successfully",
      result: newUser,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER, MANAGE_ALL])
  public async updateUserByPartner(req: Request) {
    const partnerId = req.user.partnerId;

    const { error, value } = Joi.object<any>({
      userId: Joi.number().required().label("user id"),
      email: Joi.string().required().email().label("email"),
      password: Joi.string().allow("")
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
          "string.pattern.base": `Password does not meet requirement.`,
        })
        .label("password"),
      phone: Joi.string().required().label("phone"),
      lastName: Joi.string().required().label("last name"),
      firstName: Joi.string().required().label("first name"),
      role: Joi.string().required().label("role")
    }).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const user = await dataSources.userDAOService.findById(value.userId);
    if(!user)
      return Promise.reject(
        CustomAPIError.response('User not found',
        HttpStatus.BAD_REQUEST.code));

    const partner = await dataSources.partnerDAOService.findById(partnerId)
    if(!partner)
      return Promise.reject(
        CustomAPIError.response('Partner not found',
        HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findByAny({
      where: {
        [Op.and]: [
          { name: value.role },
          { partnerId: partner.id }
        ]
      }
    });

    if (!role) return Promise.reject(
        CustomAPIError.response('Role not found',
        HttpStatus.BAD_REQUEST.code));

    const user_email = await dataSources.userDAOService.findByAny({
      where: {email: value.email}
    });

    if(value.email && user.email !== value.email){
        if(user_email) {
          return Promise.reject(CustomAPIError.response('User with this email already exist', HttpStatus.NOT_FOUND.code))
        }
    };

    const user_phone = await dataSources.userDAOService.findByAny({
      where: {phone: value.phone}
    });

    if(value.phone && user.phone !== value.phone){
        if(user_phone) {
          return Promise.reject(CustomAPIError.response('User with this phone number already exists', HttpStatus.NOT_FOUND.code))
        }
    };

    const userValues: Partial<User> = {
      ...value,
      roleId: role.id
    };

    const updatedUser = await dataSources.userDAOService.update(user, userValues as InferAttributes<User>);

    await updatedUser.$set("roles", [role]);
    await role.$add("users", [updatedUser]);
    
    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: "User updated successfully",
      result: updatedUser,
    };

    return response;
  }

  private async doDeleteUser(req: Request) {

    const id = +req.params.id;

    const user = await dataSources.userDAOService.findById(id);
    if(!user)
      return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

    const partnerEmail = await dataSources.partnerDAOService.findByAny({
      where: { email: user.email }
    })
    if(partnerEmail)
    return Promise.reject(CustomAPIError.response("This user can not be deleted", HttpStatus.NOT_FOUND.code));
      
    const response = await dataSources.userDAOService.deleteById(+req.params.id);
    
    return response;
  }
}
