// noinspection JSUnfilteredForInLoop

import { Request } from 'express';
import Joi from 'joi';
import Estimate, {
  $createEstimateSchema,
  $saveEstimateSchema,
  $updateEstimateSchema,
  CreateEstimateType,
} from '../models/Estimate';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import Contact from '../models/Contact';
import Generic from '../utils/Generic';
import {
  CREATED_ESTIMATE,
  ESTIMATE_EXPIRY_DAYS,
  ESTIMATE_STATUS,
  INITIAL_LABOURS_VALUE,
  INITIAL_PARTS_VALUE,
} from '../config/constants';
import Vehicle from '../models/Vehicle';
import Partner from '../models/Partner';
import Customer from '../models/Customer';
import RideShareDriver from '../models/RideShareDriver';
import { appEventEmitter } from '../services/AppEventEmitter';
import BillingInformation from '../models/BillingInformation';
import { TryCatch } from '../decorators';
import { CreationAttributes } from 'sequelize/types';
import HttpResponse = appCommonTypes.HttpResponse;

export default class EstimateController {
  @TryCatch
  public async create(req: Request) {
    const { estimate, customer, vehicle, partner } = await this.doCreateEstimate(req);

    await estimate.update({
      status: ESTIMATE_STATUS.sent,
    });

    appEventEmitter.emit(CREATED_ESTIMATE, { estimate, customer, vehicle, partner });

    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate created successfully.',
      result: estimate,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async save(req: Request) {
    const { estimate } = await this.doSaveEstimate(req);

    await estimate.update({
      status: ESTIMATE_STATUS.draft,
    });

    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate saved successfully.',
      result: estimate,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async update(req: Request) {
    const { estimate } = await this.doUpdateEstimate(req);

    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate updated successfully.',
      result: estimate,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async sendDraft(req: Request) {
    const estimateId = req.params.estimateId as string;

    const estimate = await dataSources.estimateDAOService.findById(+estimateId);

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found`, HttpStatus.NOT_FOUND.code));

    const { error, value } = Joi.object<CreateEstimateType>($createEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    for (const valueKey in value) {
      const key = valueKey as keyof CreateEstimateType;

      if (key === 'id') continue;

      if (key === 'parts') {
        await estimate.update({
          [key]: value.parts.map(value => JSON.stringify(value)),
        });
        continue;
      }

      if (key === 'labours') {
        await estimate.update({
          [key]: value.labours.map(value => JSON.stringify(value)),
        });
        continue;
      }

      if (key === 'depositAmount') {
        await estimate.update({
          [key]: parseInt(`${value.depositAmount}`),
        });
        continue;
      }

      if (key === 'jobDurationValue') {
        await estimate.update({
          [key]: parseInt(`${value.jobDurationValue}`),
        });
        continue;
      }

      await estimate.update({
        [key]: value[key],
      });
    }

    await estimate.update({
      status: ESTIMATE_STATUS.sent,
    });

    const customer = await estimate.$get('customer');
    const vehicle = await estimate.$get('vehicle');
    const partner = await estimate.$get('partner', { include: [Contact] });

    appEventEmitter.emit(CREATED_ESTIMATE, { estimate, customer, vehicle, partner });

    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate sent successfully.',
      result: estimate,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async estimates(req: Request) {
    const partner = req.user.partner;

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
  }

  private async doCreateEstimate(req: Request) {
    const { error, value } = Joi.object<CreateEstimateType>($createEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const partner = await dataSources.partnerDAOService.findById(value.id, { include: [Contact] });

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
        return Promise.reject(CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code));

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

    const estimateValues: Partial<Estimate> = {
      jobDurationUnit: value.jobDurationUnit,
      labours: value.labours.map(value => JSON.stringify(value)),
      parts: value.parts.map(value => JSON.stringify(value)),
      depositAmount: parseInt(`${value.depositAmount}`),
      grandTotal: value.grandTotal,
      jobDurationValue: parseInt(`${value.jobDurationValue}`),
      laboursTotal: value.laboursTotal,
      partsTotal: value.partsTotal,
      address: value.address,
      addressType: value.addressType,
      tax: value.tax,
      code: Generic.randomize({ count: 6, number: true }),
      expiresIn: ESTIMATE_EXPIRY_DAYS,
    };

    const estimate = await dataSources.estimateDAOService.create(estimateValues as CreationAttributes<Estimate>);

    await partner.$add('estimates', [estimate]);

    await vehicle.$add('estimates', [estimate]);

    await customer.$add('estimates', [estimate]);

    return { estimate, customer, vehicle, partner };
  }

  private async doSaveEstimate(req: Request) {
    const { error, value } = Joi.object<CreateEstimateType>($saveEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const partner = await dataSources.partnerDAOService.findById(value.id, { include: [Contact] });

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    let vehicle: Vehicle | null = null,
      customer: Customer;

    if (value.vin) {
      const findVehicle = await dataSources.vehicleDAOService.findByVIN(value.vin);

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
      if (vehicle) await customer.$set('vehicles', [vehicle]);
    } else {
      if (vehicle) await findCustomer.$add('vehicles', [vehicle]);
      customer = findCustomer;
    }

    const estimateValues: Partial<Estimate> = {
      jobDurationUnit: value.jobDurationUnit,
      labours: value.labours.map(value => JSON.stringify(value)),
      parts: value.parts.map(value => JSON.stringify(value)),
      depositAmount: parseInt(`${value.depositAmount}`),
      jobDurationValue: parseInt(`${value.jobDurationValue}`),
      grandTotal: value.grandTotal,
      laboursTotal: value.laboursTotal,
      partsTotal: value.partsTotal,
      address: value.address,
      addressType: value.addressType,
      tax: value.tax,
      code: Generic.randomize({ count: 6, number: true }),
      expiresIn: ESTIMATE_EXPIRY_DAYS,
    };

    const estimate = await dataSources.estimateDAOService.create(estimateValues as CreationAttributes<Estimate>);

    await partner.$add('estimates', [estimate]);

    if (vehicle) await vehicle.$add('estimates', [estimate]);

    await customer.$add('estimates', [estimate]);

    return { estimate, customer, vehicle, partner };
  }

  private async doUpdateEstimate(req: Request) {
    const estimateId = req.params.estimateId as string;

    const estimate = await dataSources.estimateDAOService.findById(+estimateId);

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found`, HttpStatus.NOT_FOUND.code));

    const { error, value } = Joi.object<CreateEstimateType>($updateEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const estimateValues: Partial<Estimate> = {
      jobDurationUnit: value.jobDurationUnit,
      labours: value.labours.map(value => JSON.stringify(value)),
      parts: value.parts.map(value => JSON.stringify(value)),
      grandTotal: value.grandTotal,
      depositAmount: parseInt(`${value.depositAmount}`),
      jobDurationValue: parseInt(`${value.jobDurationValue}`),
      laboursTotal: value.laboursTotal,
      partsTotal: value.partsTotal,
      address: value.address,
      addressType: value.addressType,
      tax: value.tax,
    };

    await estimate.update(estimateValues);

    return { estimate };
  }
}
