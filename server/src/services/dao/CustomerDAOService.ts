import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import CustomerRepository from "../../repositories/CustomerRepository";
import Customer from "../../models/Customer";
import RoleRepository from "../../repositories/RoleRepository";
import { appModelTypes } from "../../@types/app-model";
import Generic from "../../utils/Generic";
import settings from "../../config/settings";
import { appCommonTypes } from "../../@types/app-common";
import moment from "moment/moment";
import ICrudDAO = appModelTypes.ICrudDAO;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class CustomerDAOService implements ICrudDAO<Customer> {
  private readonly customerRepository: CustomerRepository;
  private roleRepository: RoleRepository;
  private passwordEncoder: BcryptPasswordEncoder;

  private declare readonly startDate;
  private declare readonly endDate;
  private declare readonly year;

  constructor(
    customerRepository: CustomerRepository,
    roleRepository: RoleRepository,
    passwordEncoder: BcryptPasswordEncoder
  ) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();
    this.year = moment().year();

    this.customerRepository = customerRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  update(
    customer: Customer,
    values: InferAttributes<Customer>,
    options: UpdateOptions<InferAttributes<Customer>>
  ): Promise<Customer> {
    return this.customerRepository.updateOne(customer, values, options);
  }

  findById(id: number, options?: FindOptions<InferAttributes<Customer>>): Promise<Customer | null> {
    return this.customerRepository.findById(id, options);
  }

  deleteById(id: number, options?: DestroyOptions<InferAttributes<Customer>>): Promise<void> {
    return this.customerRepository.deleteById(id, options);
  }

  findByAny(options: FindOptions<InferAttributes<Customer>>): Promise<Customer | null> {
    return this.customerRepository.findOne(options);
  }

  findAll(options?: FindOptions<InferAttributes<Customer>>): Promise<Customer[]> {
    return this.customerRepository.findAll(options);
  }

  async create(values: CreationAttributes<Customer>, options?: CreateOptions<Attributes<Customer>>): Promise<Customer> {
    let rawPassword: string;

    if (!values.password && !values.rawPassword) {
      rawPassword = Generic.generateRandomString(8);
      values.password = await this.passwordEncoder.encode(rawPassword);
      values.rawPassword = rawPassword;
    }

    //get customer role
    const role = await this.roleRepository.findOne({
      where: { name: settings.roles[1] },
    });

    if (!role) throw new Error("Role does not exist");

    //create customer
    const customer = await this.customerRepository.save(values, options);

    //associate customer with role
    await customer.$add("roles", role);

    return customer;
  }

  public async getTotalDailyCustomers() {
    return Generic.getDailyData(this.customerRepository);
  }

  public async getTotalMonthlyCustomers() {
    return Generic.getMonthlyData(this.customerRepository);
  }
}
