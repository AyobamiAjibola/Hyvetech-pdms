import TransactionRepository from "../../repositories/TransactionRepository";
import Transaction from "../../models/Transaction";
import { appModelTypes } from "../../@types/app-model";
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Optional,
  UpdateOptions,
} from "sequelize/types";
import { NullishPropertiesOf } from "sequelize/types/utils";
import moment from "moment/moment";
import Generic from "../../utils/Generic";
import { Attributes } from "sequelize";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class TransactionDAOService implements ICrudDAO<Transaction> {
  private readonly transactionRepository: TransactionRepository;

  private declare readonly startDate;
  private declare readonly endDate;

  constructor(transactionRepository: TransactionRepository) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

    this.transactionRepository = transactionRepository;
  }

  create(
    values: Optional<
      InferCreationAttributes<Transaction>,
      NullishPropertiesOf<InferCreationAttributes<Transaction>>
    >,
    options?: CreateOptions<Attributes<Transaction>>
  ): Promise<Transaction> {
    return this.transactionRepository.save(values, options);
  }

  update(
    transaction: Transaction,
    values: InferAttributes<Transaction>,
    options: UpdateOptions<InferAttributes<Transaction>>
  ): Promise<Transaction> {
    return this.transactionRepository.updateOne(transaction, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<Transaction>>
  ): Promise<Transaction | null> {
    return this.transactionRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<Transaction>>
  ): Promise<void> {
    return this.transactionRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<Transaction>>
  ): Promise<Transaction | null> {
    return this.transactionRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<Transaction>>
  ): Promise<Transaction[]> {
    return this.transactionRepository.findAll(options);
  }

  public async getTotalDailyTransactions() {
    return Generic.getDailyData(this.transactionRepository);
  }

  public async getTotalMonthlyTransactions() {
    return Generic.getMonthlyData(this.transactionRepository);
  }
}
