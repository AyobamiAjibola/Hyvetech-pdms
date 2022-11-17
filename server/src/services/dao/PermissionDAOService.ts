import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import PermissionRepository from "../../repositories/PermissionRepository";
import Permission from "../../models/Permission";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PermissionDAOService implements ICrudDAO<Permission> {
  private permissionRepository: PermissionRepository;

  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  create(values: CreationAttributes<Permission>, options?: CreateOptions<Attributes<Permission>>): Promise<Permission> {
    return this.permissionRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Permission>): Promise<void> {
    return this.permissionRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Permission>>): Promise<Permission[]> {
    return this.permissionRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Permission>>): Promise<Permission | null> {
    return this.permissionRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Permission>>): Promise<Permission | null> {
    return this.permissionRepository.findById(id, options);
  }

  update(
    permission: Permission,
    values: InferAttributes<Permission>,
    options: UpdateOptions<Attributes<Permission>>
  ): Promise<Permission> {
    return this.permissionRepository.updateOne(permission, values, options);
  }
}
