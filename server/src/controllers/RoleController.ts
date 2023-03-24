import { Request } from 'express';
import Joi from 'joi';
import { CreationAttributes, Op } from 'sequelize';
import { HasPermission, TryCatch } from '../decorators';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Permission from '../models/Permission';
import Role, { $saveRoleSchema, $updateRoleSchema, RoleSchemaType } from '../models/Role';
import datasources from '../services/dao';
import { appCommonTypes } from '../@types/app-common';

import HttpResponse = appCommonTypes.HttpResponse;
import { MANAGE_ALL, MANAGE_TECHNICIAN } from '../config/settings';

export default class RoleController {
  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN])
  public async createRole(req: Request) {
    const partner = req.user.partner;
    const role = await this.createRoleAndPermission(req);

    const response: HttpResponse<Role> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: role,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN])
  public async getRoleAndPermission(req: Request) {
    const partner = req.user.partner;
    const role = await this.doGetRoleAndPermission(req);

    const response: HttpResponse<Role> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: role,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN])
  public async getAllPermissions(req: Request) {
    const partner = req.user.partner;
    const permissions = await this.doGetPermissions(req);

    const response: HttpResponse<Permission> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: permissions,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN])
  public async getRole(req: Request) {
    const partner = req.user.partner;
    const role = await this.doGetSingleRole(req);

    const response: HttpResponse<Role> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: role,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN])
  public async updateRole(req: Request) {
    const partner = req.user.partner;
    const role = await this.doUpdateRoleAndPermission(req);

    const response: HttpResponse<Role> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: role,
    };

    return response;
  }
  private async doGetRoleAndPermission(req: Request) {
    const partner = req.user.partner;

    const roles = await datasources.roleDAOService.findAll({
      include: [Permission],
      order: [['createdAt', 'DESC']],
    });

    return roles.filter(item => item.partnerId === partner.id || !item.partnerId);
  }

  private async doGetSingleRole(req: Request) {
    const partner = req.user.partner;

    const role = await datasources.roleDAOService.findByAny({ where: { id: req.params.id }, include: [Permission] });

    if (!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.NOT_FOUND.code));

    if (role.partnerId && role.partnerId !== partner.id)
      return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.NOT_FOUND.code));

    return role;
  }

  private async doGetPermissions(req: Request) {
    const partner = req.user.partner;

    return datasources.permissionDAOService.findAll({
      order: [['name', 'ASC']],
    });
  }
  private async createRoleAndPermission(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<RoleSchemaType>($saveRoleSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const exisitingRole = await datasources.roleDAOService.findByAny({
      where: {
        [Op.or]: [{ name: value.name, partnerId: partner.id }],
      },
    });

    if (exisitingRole)
      return Promise.reject(CustomAPIError.response('Role name already exist', HttpStatus.BAD_REQUEST.code));

    const roleValues: Partial<Role> = {
      name: value.name,
      partnerId: partner.id,
      slug: value.name,
    };

    const permissions = [];

    for (const selectedPermission of value.permissions) {
      const permission = await datasources.permissionDAOService.findByAny({ where: { name: selectedPermission } });
      if (permission) permissions.push(permission);
    }

    if (permissions.length === 0)
      return Promise.reject(CustomAPIError.response('Invalid permissions selected', HttpStatus.BAD_REQUEST.code));

    const role = await datasources.roleDAOService.create(roleValues as CreationAttributes<Role>);

    await role.$add('permissions', permissions);

    return role;
  }

  private async doUpdateRoleAndPermission(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<RoleSchemaType>($updateRoleSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const role = await datasources.roleDAOService.findByAny({
      where: {
        [Op.and]: [{ id: value.id, partnerId: partner.id }],
      },
    });

    if (!role)
      return Promise.reject(
        CustomAPIError.response(
          'Role does not exist OR Role is not available for modification',
          HttpStatus.BAD_REQUEST.code,
        ),
      );

    const permissions = [];

    for (const selectedPermission of value.permissions) {
      const permission = await datasources.permissionDAOService.findByAny({ where: { name: selectedPermission } });
      if (permission) permissions.push(permission);
    }

    if (permissions.length === 0)
      return Promise.reject(CustomAPIError.response('Invalid permissions selected', HttpStatus.BAD_REQUEST.code));

    await role.$set('permissions', permissions);

    return role;
  }
}
