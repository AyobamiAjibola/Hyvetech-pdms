import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import PartnerRepository from "../../repositories/PartnerRepository";
import Partner from "../../models/Partner";
import { appModelTypes } from "../../@types/app-model";
import moment from "moment/moment";
import Generic from "../../utils/Generic";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PartnerDAOService implements ICrudDAO<Partner> {
  private readonly partnerRepository: PartnerRepository;

  private declare readonly startDate;
  private declare readonly endDate;
  private declare readonly year;

  constructor(partnerRepository: PartnerRepository) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

    this.partnerRepository = partnerRepository;
  }

  deleteById(id: number, options?: DestroyOptions<Partner>): Promise<void> {
    return this.partnerRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Partner>>): Promise<Partner[]> {
    return this.partnerRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Partner>>): Promise<Partner | null> {
    return this.partnerRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Partner>>): Promise<Partner | null> {
    return this.partnerRepository.findById(id, options);
  }

  update(
    partner: Partner,
    values: InferAttributes<Partner>,
    options: UpdateOptions<Attributes<Partner>>
  ): Promise<Partner> {
    return this.partnerRepository.updateOne(partner, values, options);
  }

  public async getTotalDailyPartners() {
    return Generic.getDailyData(this.partnerRepository);
  }

  public async getTotalMonthlyPartners() {
    return Generic.getMonthlyData(this.partnerRepository);
  }

  create(values: CreationAttributes<Partner>, options?: CreateOptions<Attributes<Partner>>): Promise<Partner> {
    return this.partnerRepository.save(values, options);
  }
}
