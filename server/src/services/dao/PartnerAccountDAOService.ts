import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;
import PartnerAccount from "../../models/PartnerAccount";
import {
  Optional,
  InferCreationAttributes,
  CreateOptions,
  InferAttributes,
  UpdateOptions,
  FindOptions,
  DestroyOptions,
} from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import PartAccountRepository from "../../repositories/PartnerAccountRepository";
import BankService, { AccountTransactionLogDTO } from "../BankService";
import { ReferenceGenerator } from "../ReferenceGenerator";
import { appCommonTypes } from "../../@types/app-common";
import PasswordEncoder from "../../utils/PasswordEncoder";
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export class PartnerAccountDAOService implements ICrudDAO<PartnerAccount> {
  private readonly parterAccountRepository: PartAccountRepository;
  private readonly bankService: BankService;
  private passwordEncoder: BcryptPasswordEncoder;
  constructor(repository: PartAccountRepository, bankService: BankService) {
    this.parterAccountRepository = repository;
    this.bankService = bankService;
    this.passwordEncoder = new PasswordEncoder();
  }

  async create(
    values: Optional<
      InferCreationAttributes<PartnerAccount, { omit: never }>,
      NullishPropertiesOf<
        InferCreationAttributes<PartnerAccount, { omit: never }>
      >
    >,
    options?:
      | CreateOptions<InferAttributes<PartnerAccount, { omit: never }>>
      | undefined
  ): Promise<PartnerAccount> {
    const reference = ReferenceGenerator.generate();
    if (values.phoneNumber.startsWith("2340")) {
      values.phoneNumber = values.phoneNumber.slice(3);
    } else if (values.phoneNumber.startsWith("234")) {
      values.phoneNumber = `0${values.phoneNumber.slice(3)}`;
    }
    const account = await this.bankService.createAccount({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      businessName: values.businessName,
      trackingReference: reference,
    });

    values.accountNumber = account.accountNumber;
    values.accountRef = reference;

    // values.pin = await this.passwordEncoder.encode(values.pin);

    return this.parterAccountRepository.save(values, options);
  }

  getPartnerAccountBalance(accountRef: string) {
    return this.bankService.getVirtualAccountBalance(accountRef);
  }

  getPartnerAccountTransactions(payload: AccountTransactionLogDTO) {
    return this.bankService.getAccountTransactionLog(payload);
  }

  async update(
    t: PartnerAccount,
    values: Optional<
      InferCreationAttributes<PartnerAccount, { omit: never }>,
      NullishPropertiesOf<
        InferCreationAttributes<PartnerAccount, { omit: never }>
      >
    >,
    options?:
      | UpdateOptions<InferAttributes<PartnerAccount, { omit: never }>>
      | undefined
  ): Promise<PartnerAccount> {
    await this.bankService.updateAccount({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      businessName: values.businessName,
      trackingReference: t.accountRef as string,
    });
    return this.parterAccountRepository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?:
      | FindOptions<InferAttributes<PartnerAccount, { omit: never }>>
      | undefined
  ): Promise<PartnerAccount | null> {
    throw this.parterAccountRepository.findById(id, options);
  }
  deleteById(
    id: number,
    options?:
      | DestroyOptions<InferAttributes<PartnerAccount, { omit: never }>>
      | undefined
  ): Promise<void> {
    return this.parterAccountRepository.deleteById(id, options);
  }
  findByAny(
    options: FindOptions<InferAttributes<PartnerAccount, { omit: never }>>
  ): Promise<PartnerAccount | null> {
    return this.parterAccountRepository.findOne(options);
  }
  findAll(
    options?:
      | FindOptions<InferAttributes<PartnerAccount, { omit: never }>>
      | undefined
  ): Promise<PartnerAccount[]> {
    return this.parterAccountRepository.findAll(options);
  }
}
