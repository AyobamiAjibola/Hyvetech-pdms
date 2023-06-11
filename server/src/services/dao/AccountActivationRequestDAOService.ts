import AccountActivationRequest from '../../models/AccountActivationRequest';
import AccountActivationRequestRepository from '../../repositories/AccountActivationRequestRepository';
import { appModelTypes } from '../../@types/app-model';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import ICrudDAO = appModelTypes.ICrudDAO;
import {
  Optional,
  InferCreationAttributes,
  CreateOptions,
  InferAttributes,
  UpdateOptions,
  FindOptions,
  DestroyOptions,
} from 'sequelize';
import { appCommonTypes } from '../../@types/app-common';
import PasswordEncoder from '../../utils/PasswordEncoder';
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class AccountActivationRequestDAOService implements ICrudDAO<AccountActivationRequest> {
  private readonly accountActivationReuestRepository: AccountActivationRequestRepository;

  private readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(accountActivationRepo: AccountActivationRequestRepository) {
    this.accountActivationReuestRepository = accountActivationRepo;
    this.passwordEncoder = new PasswordEncoder();
  }
  async create(
    values: Optional<
      InferCreationAttributes<AccountActivationRequest, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<AccountActivationRequest, { omit: never }>>
    >,
    options?: CreateOptions<InferAttributes<AccountActivationRequest, { omit: never }>> | undefined,
  ): Promise<AccountActivationRequest> {
    values.pin = await this.passwordEncoder.encode(values.pin);
    return this.accountActivationReuestRepository.save(values, options);
  }
  update(
    t: AccountActivationRequest,
    values: Optional<
      InferCreationAttributes<AccountActivationRequest, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<AccountActivationRequest, { omit: never }>>
    >,
    options?: UpdateOptions<InferAttributes<AccountActivationRequest, { omit: never }>> | undefined,
  ): Promise<AccountActivationRequest> {
    return this.accountActivationReuestRepository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?: FindOptions<InferAttributes<AccountActivationRequest, { omit: never }>> | undefined,
  ): Promise<AccountActivationRequest | null> {
    return this.accountActivationReuestRepository.findById(id, options);
  }
  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<AccountActivationRequest, { omit: never }>> | undefined,
  ): Promise<void> {
    return this.accountActivationReuestRepository.deleteById(id, options);
  }
  findByAny(
    options: FindOptions<InferAttributes<AccountActivationRequest, { omit: never }>>,
  ): Promise<AccountActivationRequest | null> {
    return this.accountActivationReuestRepository.findOne(options);
  }
  findAll(
    options?: FindOptions<InferAttributes<AccountActivationRequest, { omit: never }>> | undefined,
  ): Promise<AccountActivationRequest[]> {
    return this.accountActivationReuestRepository.findAll(options);
  }
}
