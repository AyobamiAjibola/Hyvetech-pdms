import { Request } from 'express';
import Joi from 'joi';
import Estimate, { $createEstimateSchema, CreateEstimateType } from '../models/Estimate';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import Contact from '../models/Contact';
import Generic from '../utils/Generic';
import {
  CREATED_ESTIMATE,
  ESTIMATE_EXPIRY_DAYS,
  INITIAL_LABOURS_VALUE,
  INITIAL_PARTS_VALUE,
} from '../config/constants';
import Vehicle from '../models/Vehicle';
import Partner from '../models/Partner';
import Customer from '../models/Customer';
import RideShareDriver from '../models/RideShareDriver';
import { appEventEmitter } from '../services/AppEventEmitter';
import BillingInformation from '../models/BillingInformation';
import HttpResponse = appCommonTypes.HttpResponse;

export default class EstimateController {
  public async create(req: Request) {
    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate created successfully.',
    };

    try {
      const { error, value } = Joi.object<CreateEstimateType>($createEstimateSchema).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      if (!value)
        return Promise.reject(
          CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
        );

      const partner = await dataSources.partnerDAOService.findById(value.id);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
        );

      const findVehicle = await dataSources.vehicleDAOService.findByVIN(value.vin);

      let vehicle: Vehicle, customer: Customer;

      if (!findVehicle) {
        const data: any = {
          vin: value.vin,
          make: value.make,
          model: value.model,
          modelYear: value.modelYear,
          plateNumber: value.plateNumber,
          mileageValue: value.mileageValue,
          mileageUnit: value.mileageUnit,
        };

        const vin = await dataSources.vinDAOService.findByAny({
          where: { vin: value.vin },
        });

        if (!vin)
          return Promise.reject(
            CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code),
          );

        await vin.update({
          plateNumber: value.plateNumber,
        });

        vehicle = await dataSources.vehicleDAOService.create(data);
      } else {
        vehicle = await findVehicle.update({
          vin: value.vin.length ? value.vin : findVehicle.vin,
          make: value.make.length ? value.make : findVehicle.make,
          model: value.model.length ? value.model : findVehicle.model,
          modelYear: value.modelYear.length ? value.modelYear : findVehicle.modelYear,
          mileageValue: value.mileageValue.length ? value.mileageValue : findVehicle.mileageValue,
          mileageUnit: value.mileageUnit.length ? value.mileageUnit : findVehicle.mileageUnit,
          plateNumber: value.plateNumber.length ? value.plateNumber : findVehicle.plateNumber,
        });
      }

      if (vehicle.onMaintenance || vehicle.onInspection || vehicle.isBooked) {
        return Promise.reject(
          CustomAPIError.response(
            `This vehicle is currently scheduled for a Repairs/Inspection.`,
            HttpStatus.BAD_REQUEST.code,
          ),
        );
      }

      const findCustomer = await dataSources.customerDAOService.findByAny({
        where: { phone: value.phone },
        include: [Contact],
      });

      if (!findCustomer) {
        const data: any = {
          firstName: value.firstName,
          lastName: value.lastName,
          phone: value.phone,
        };

        customer = await dataSources.customerDAOService.create(data);
        await customer.$set('vehicles', [vehicle]);
      } else {
        await findCustomer.$add('vehicles', [vehicle]);
        customer = findCustomer;
      }

      const estimate = await this.doCreateEstimate(value);

      await partner.$add('estimates', [estimate]);

      await vehicle.$add('estimates', [estimate]);

      await customer.$add('estimates', [estimate]);

      appEventEmitter.emit(CREATED_ESTIMATE, { estimate, customer, vehicle, partner });

      response.result = estimate;

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async estimates(req: Request) {
    const partner = req.user.partner;

    try {
      let estimates: Estimate[];

      //Super Admin should see all estimates
      if (!partner) {
        estimates = await dataSources.estimateDAOService.findAll({
          include: [
            Vehicle,
            { model: Customer, include: [BillingInformation] },
            RideShareDriver,
            { model: Partner, include: [Contact] },
          ],
        });
      } else {
        estimates = await partner.$get('estimates', {
          include: [
            Vehicle,
            { model: Customer, include: [BillingInformation] },
            RideShareDriver,
            { model: Partner, include: [Contact] },
          ],
        });
      }

      estimates = estimates.map(estimate => {
        const parts = estimate.parts;
        const labours = estimate.labours;

        estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
        estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

        return estimate;
      });

      const response: HttpResponse<Estimate> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: estimates,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async doCreateEstimate(values: CreateEstimateType): Promise<Estimate> {
    const estimateValues: any = {
      jobDurationUnit: values.jobDurationUnit,
      labours: values.labours.map(value => JSON.stringify(value)),
      parts: values.parts.map(value => JSON.stringify(value)),
      depositAmount: values.depositAmount,
      grandTotal: values.grandTotal,
      jobDurationValue: values.jobDurationValue,
      laboursTotal: values.laboursTotal,
      partsTotal: values.partsTotal,
      address: values.address,
      addressType: values.addressType,
      tax: values.tax,
      code: Generic.randomize({ count: 6, number: true }),
      expiresIn: ESTIMATE_EXPIRY_DAYS,
    };

    return await dataSources.estimateDAOService.create(estimateValues);
  }
}
