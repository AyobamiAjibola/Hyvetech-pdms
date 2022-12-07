import VehicleRepository from '../../repositories/VehicleRepository';
import Vehicle from '../../models/Vehicle';
import { appModelTypes } from '../../@types/app-model';
import { Attributes, CreateOptions, CreationAttributes, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import moment from 'moment/moment';
import Generic from '../../utils/Generic';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class VehicleDAOService implements ICrudDAO<Vehicle> {
  private declare readonly vehicleRepository: VehicleRepository;

  private declare readonly startDate;
  private declare readonly endDate;

  constructor(vehicleRepository: VehicleRepository) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

    this.vehicleRepository = vehicleRepository;
  }

  create(values: CreationAttributes<Vehicle>, options?: CreateOptions<Attributes<Vehicle>>): Promise<Vehicle> {
    return this.vehicleRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Attributes<Vehicle>>): Promise<void> {
    return this.vehicleRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Vehicle>>): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Vehicle>>): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Vehicle>>): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id, options);
  }

  update(
    vehicle: Vehicle,
    values: CreationAttributes<Vehicle>,
    options: UpdateOptions<Attributes<Vehicle>>,
  ): Promise<Vehicle> {
    return this.vehicleRepository.updateOne(vehicle, values, options);
  }

  public async getTotalDailyVehicles() {
    return Generic.getDailyData(this.vehicleRepository);
  }

  public async getTotalMonthlyVehicles() {
    return Generic.getMonthlyData(this.vehicleRepository);
  }

  findByPlateNumber(plateNumber: string, options?: FindOptions<Attributes<Vehicle>>): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({ where: { plateNumber }, ...options });
  }

  findByVIN(vin: string, options?: FindOptions<Attributes<Vehicle>>): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({ where: { vin }, ...options });
  }
}
