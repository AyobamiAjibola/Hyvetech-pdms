import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import RoleRepository from '../../repositories/RoleRepository';
import Role from '../../models/Role';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;
import Permission from '../../models/Permission';

export default class RoleDAOService implements ICrudDAO<Role> {
  private roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  create(values: CreationAttributes<Role>, options?: CreateOptions<Attributes<Role>>): Promise<Role> {
    return this.roleRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Role>): Promise<void> {
    return this.roleRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Role>>): Promise<Role[]> {
    return this.roleRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Role>>): Promise<Role | null> {
    return this.roleRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Role>>): Promise<Role | null> {
    return this.roleRepository.findById(id, options);
  }

  update(role: Role, values: InferAttributes<Role>, options: UpdateOptions<Attributes<Role>>): Promise<Role> {
    return this.roleRepository.updateOne(role, values, options);
  }

  findBySlugName(slugName: string) {
    return this.roleRepository.findOne({ where: { slug: slugName } });
  }

  findRolePermissionsById(id: number) {
    return this.roleRepository.findById(id, {
      include: [
        {
          model: Permission,
          attributes: ['action', 'subject', 'name'],
          through: { attributes: [] },
        },
      ],
    });
  }
}
