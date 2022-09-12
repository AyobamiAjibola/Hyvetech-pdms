import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import UserRepository from "../../repositories/UserRepository";
import User from "../../models/User";
import { appModelTypes } from "../../@types/app-model";
import { appCommonTypes } from "../../@types/app-common";
import PasswordEncoder from "../../utils/PasswordEncoder";
import ICrudDAO = appModelTypes.ICrudDAO;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class UserDAOService implements ICrudDAO<User> {
  private userRepository: UserRepository;
  private passwordEncoder: BcryptPasswordEncoder;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = new PasswordEncoder();
  }

  update(
    user: User,
    values: InferAttributes<User>,
    options?: UpdateOptions<InferAttributes<User>>
  ): Promise<User> {
    return this.userRepository.updateOne(user, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<User>>
  ): Promise<User | null> {
    return this.userRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<User>>
  ): Promise<void> {
    return this.userRepository.deleteById(id, options);
  }

  findByAny(options: FindOptions<InferAttributes<User>>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }

  findByUsername(
    username: string,
    options?: FindOptions<InferAttributes<User>>
  ): Promise<User | null> {
    return this.userRepository.findOne({ where: { username }, ...options });
  }

  findAll(options?: FindOptions<InferAttributes<User>>): Promise<User[]> {
    return this.userRepository.findAll(options);
  }

  async create(
    values: CreationAttributes<User>,
    options?: CreateOptions<Attributes<User>>
  ): Promise<User> {
    values.password = await this.passwordEncoder.encode(values.password);

    return this.userRepository.save(values, options);
  }
}
