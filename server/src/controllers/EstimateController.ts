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
  QUEUE_EVENTS,
} from '../config/constants';
import Vehicle from '../models/Vehicle';
import Partner from '../models/Partner';
import Customer from '../models/Customer';
import RideShareDriver from '../models/RideShareDriver';
import { appEventEmitter } from '../services/AppEventEmitter';
import BillingInformation from '../models/BillingInformation';
import { TryCatch } from '../decorators';
import { CreationAttributes } from 'sequelize/types';
import { Op } from 'sequelize';
import HttpResponse = appCommonTypes.HttpResponse;
import create_customer_success_email from '../resources/templates/email/create_customer_success_email';
import email_content from '../resources/templates/email/email_content';
import QueueManager from 'rabbitmq-email-manager';
import create_customer_from_estimate from '../resources/templates/email/create_customer_from_estimate';
import User from '../models/User';
import new_estimate_template from '../resources/templates/email/new_estimate';

export default class EstimateController {
  @TryCatch
  public async create(req: Request) {
    const { estimate, customer, vehicle, partner } = await this.doCreateEstimate(req);


    try {
      // console.log('before 1')
      await estimate.update({
        status: ESTIMATE_STATUS.sent,
      });
      // console.log('before 2')

      appEventEmitter.emit(CREATED_ESTIMATE, { estimate, customer, vehicle, partner });
      // console.log('before 3')
    } catch (e) {
      console.log(e)
    }

    const response: HttpResponse<Estimate> = {
      code: HttpStatus.OK.code,
      message: 'Estimate created successfully.',
      result: estimate,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async delete(req: Request) {
    const estimateId = req.params.estimateId as string;

    const estimate = await dataSources.estimateDAOService.findById(+estimateId);

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found`, HttpStatus.NOT_FOUND.code));

    if (estimate.status === ESTIMATE_STATUS.invoiced)
      return Promise.reject(
        CustomAPIError.response(`Cannot delete an already invoiced estimate`, HttpStatus.BAD_REQUEST.code),
      );

    await Estimate.destroy({ where: { id: +estimateId }, force: true });

    return Promise.resolve({
      code: HttpStatus.ACCEPTED.code,
      message: 'Estimate deleted successfully',
    } as HttpResponse<void>);
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

    const customer = await estimate.$get('customer');

    if (!customer)
      return Promise.reject(CustomAPIError.response(`Customer does not found`, HttpStatus.BAD_REQUEST.code));

    let vehicle = await estimate.$get('vehicle');

    if (!vehicle) {
      const value = req.body;
      const data: any = {
        vin: value.vin,
        make: value.make,
        model: value.model,
        modelYear: value.modelYear,
        plateNumber: value.plateNumber,
        mileageValue: value.mileageValue,
        mileageUnit: value.mileageUnit,
      };

      vehicle = await dataSources.vehicleDAOService.create(data);
      await customer.$add('vehicles', [vehicle]);
      await vehicle.$add('estimates', [estimate]);
      // return Promise.reject(CustomAPIError.response(`Vehicle not found`, HttpStatus.BAD_REQUEST.code))
    }

    const partner = await estimate.$get('partner', { include: [Contact] });

    if (!partner) return Promise.reject(CustomAPIError.response(`Partner not found`, HttpStatus.BAD_REQUEST.code));

    const { error, value } = Joi.object<CreateEstimateType>($createEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (estimate.status === ESTIMATE_STATUS.invoiced) {
      return Promise.reject(
        CustomAPIError.response(
          `Estimate can not be edited! Customer have made a deposit. Please refresh page.`,
          HttpStatus.BAD_REQUEST.code,
        ),
      );
    }

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

    const vin = await dataSources.vinDAOService.findByAny({ where: { vin: value.vin } });

    if (vin) await vin.update({ plateNumber: value.plateNumber });

    await vehicle.update({ plateNumber: value.plateNumber });

    await estimate.update({
      status: ESTIMATE_STATUS.sent,
    });

    let user: any = customer;
    const mail = new_estimate_template({
      firstName: customer.firstName,
      lastName: customer.lastName,
      partner,
      estimate,
      vehichleData: `${value.modelYear} ${value.make} ${value.model} `
    })

    await QueueManager.publish({
      queue: QUEUE_EVENTS.name,
      data: {
        to: user.email,
        from: {
          name: "AutoHyve",
          address: <string>process.env.SMTP_EMAIL_FROM,
        },
        subject: `${partner.name} has sent you an estimate on AutoHyve`,
        html: mail,
        bcc: [<string>process.env.SMTP_EMAIL_FROM],
      },
    });

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
          { model: Customer, include: [BillingInformation], paranoid: false },
          RideShareDriver,
          { model: Partner, include: [Contact] },
        ],
      });
    } else {
      estimates = await partner.$get('estimates', {
        include: [
          Vehicle,
          { model: Customer, include: [BillingInformation], paranoid: false },
          RideShareDriver,
          { model: Partner, include: [Contact] },
        ],
      });
    }

    // sort by date updated
    for (let i = 1; i < estimates.length; i++) {

      for (let j = i; j > 0; j--) {
        const _t1: any = estimates[j];
        const _t0: any = estimates[j - 1];

        if (((new Date(_t1.updatedAt)).getTime()) > ((new Date(_t0.updatedAt)).getTime())) {
          estimates[j] = _t0;
          estimates[j - 1] = _t1;

          // console.log('sorted')
        } else {
          // console.log('no sorted')
        }

      }
    }

    estimates = (estimates).map(estimate => {
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

    console.log(error)

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const partner = await dataSources.partnerDAOService.findById(value.id, { include: [Contact, User] });

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    // check if partner is active
    try {
      if ((!(partner?.users[0]?.active || true) || false)) {
        return Promise.reject(
          CustomAPIError.response(`Partner Account Inactive`, HttpStatus.NOT_FOUND.code),
        );
      }
    } catch (_e: any) { }

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

      const isVinExistMandatory = false;

      if (isVinExistMandatory) {
        if (!vin)
          return Promise.reject(CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code));

        await vin.update({
          plateNumber: value.plateNumber,
        });
      }

      vehicle = await dataSources.vehicleDAOService.create(data);
    } else {
      const vin = await dataSources.vinDAOService.findByAny({
        where: { vin: value.vin },
      });

      if (!vin)
        return Promise.reject(CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code));

      vehicle = await findVehicle.update({
        vin: value.vin.length ? value.vin : findVehicle.vin,
        make: value.make.length ? value.make : findVehicle.make,
        model: value.model.length ? value.model : findVehicle.model,
        modelYear: value.modelYear.length ? value.modelYear : findVehicle.modelYear,
        mileageValue: value.mileageValue.length ? value.mileageValue : findVehicle.mileageValue,
        mileageUnit: value.mileageUnit.length ? value.mileageUnit : findVehicle.mileageUnit,
        plateNumber: value.plateNumber.length ? value.plateNumber : findVehicle.plateNumber,
      });

      await vin.update({
        plateNumber: value.plateNumber,
      });
    }

    const findCustomer = await dataSources.customerDAOService.findByAny({
      where: {
        email: value.email
      },
      include: [Contact],
    });

    if (!findCustomer) {
      const data: any = {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email,
      };

      customer = await dataSources.customerDAOService.create(data);
      await customer.$set('vehicles', [vehicle]);
      // try to link a contact with this customer

      const contactValue: any = {
        label: "Home",
        // @ts-ignore
        state: value?.state || "Abuja (FCT)"
      }

      const contact = await dataSources.contactDAOService.create(contactValue);
      await customer.$set('contacts', [contact]);


      // send email of user info
      // start
      // let user: any = customer;

      // const mailText = create_customer_success_email({
      //   username: user.email,
      //   password: user.password,
      //   loginUrl: process.env.CUSTOMER_APP_HOST,
      // });

      // const mail = email_content({
      //   firstName: user?.firstName,
      //   text: mailText,
      //   signature: process.env.SMTP_EMAIL_SIGNATURE,
      // });

      // const mail = create_customer_from_estimate({
      //   firstName: customer.firstName,
      //   lastName: customer.lastName,
      //   partner,
      //   vehichleData: `${value.modelYear} ${value.make} ${value.model}`
      // })

      // //todo: Send email with credentials
      // await QueueManager.publish({
      //   queue: QUEUE_EVENTS.name,
      //   data: {
      //     to: user.email,
      //     from: {
      //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
      //       address: <string>process.env.SMTP_EMAIL_FROM,
      //     },
      //     subject: `You Have a New Estimate`,
      //     html: mail,
      //     bcc: [<string>process.env.SMTP_EMAIL_FROM],
      //   },
      // });
      // stop
    } else {
      await findCustomer.$add('vehicles', [vehicle]);
      customer = findCustomer;

      // send mail to customer also
      // let user: any = customer;
      // const mail = new_estimate_template({
      //   firstName: customer.firstName,
      //   lastName: customer.lastName,
      //   partner,
      //   vehichleData: `${value.modelYear} ${value.make} ${value.model}`
      // })

      // //todo: Send email with credentials
      // await QueueManager.publish({
      //   queue: QUEUE_EVENTS.name,
      //   data: {
      //     to: user.email,
      //     from: {
      //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
      //       address: <string>process.env.SMTP_EMAIL_FROM,
      //     },
      //     subject: `You Have a New Estimate`,
      //     html: mail,
      //     bcc: [<string>process.env.SMTP_EMAIL_FROM],
      //   },
      // });
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
      taxPart: value.taxPart,
      code: Generic.randomize({ count: 6, number: true }),
      expiresIn: ESTIMATE_EXPIRY_DAYS,
    };

    const estimate = await dataSources.estimateDAOService.create(estimateValues as CreationAttributes<Estimate>);

    await partner.$add('estimates', [estimate]);

    await vehicle.$add('estimates', [estimate]);

    await customer.$add('estimates', [estimate]);

    console.log('reach0')
    // send mail
    let user: any = customer;
    const mail = new_estimate_template({
      firstName: customer.firstName,
      lastName: customer.lastName,
      partner,
      estimate,
      vehichleData: `${value.modelYear} ${value.make} ${value.model} `
    })

    console.log('reach1')

    //todo: Send email with credentials
    await QueueManager.publish({
      queue: QUEUE_EVENTS.name,
      data: {
        to: user.email,
        from: {
          name: "AutoHyve",
          address: <string>process.env.SMTP_EMAIL_FROM,
        },
        subject: `${partner.name} has sent you an estimate on AutoHyve`,
        html: mail,
        bcc: [<string>process.env.SMTP_EMAIL_FROM],
      },
    });

    // console.log(estimate, customer, vehicle, partner, 'reach2')

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

        // disable vin doesn't exist
        if (!vin) {
          // return Promise.reject(
          //   CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code),
          // );
        } else {
          // @ts-ignore
          await vin.update({
            plateNumber: value.plateNumber,
          });
        }


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
      where: {
        email: value.email
      },
      include: [Contact],
    });

    if (!findCustomer) {
      const data: any = {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email,
      };

      customer = await dataSources.customerDAOService.create(data);
      if (vehicle) await customer.$set('vehicles', [vehicle]);

      try {
        const contactValue: any = {
          label: "Home",
          // @ts-ignore
          state: value?.state || "Abuja (FCT)"
        }

        const contact = await dataSources.contactDAOService.create(contactValue);
        await customer.$set('contacts', [contact]);
      } catch (e) {
        console.log(e)
      }

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
      taxPart: value.taxPart,
      code: Generic.randomize({ count: 6, number: true }),
      expiresIn: ESTIMATE_EXPIRY_DAYS,
    };

    const estimate = await dataSources.estimateDAOService.create(estimateValues as CreationAttributes<Estimate>);

    await partner.$add('estimates', [estimate]);

    if (vehicle) await vehicle.$add('estimates', [estimate]);

    try {
      await customer.$add('estimates', [estimate]);
    } catch (e) {
      console.log(e)
    }

    return { estimate, customer, vehicle, partner };
  }

  private async doUpdateEstimate(req: Request) {
    const estimateId = req.params.estimateId as string;

    const estimate = await dataSources.estimateDAOService.findById(+estimateId);

    if (!estimate) return Promise.reject(CustomAPIError.response(`Estimate not found`, HttpStatus.NOT_FOUND.code));

    if (estimate.status === ESTIMATE_STATUS.invoiced)
      return Promise.reject(
        CustomAPIError.response(
          `Customer have already made a deposit for this estimate. Kindly refresh page.`,
          HttpStatus.NOT_FOUND.code,
        ),
      );

    const { error, value } = Joi.object<CreateEstimateType>($updateEstimateSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    if (value.vin || value.plateNumber) {
      const vehicle = await dataSources.vehicleDAOService.findByAny({
        where: {
          [Op.or]: [{ vin: value.vin }, { plateNumber: value.plateNumber }],
        },
      });

      if (!vehicle)
        return Promise.reject(
          CustomAPIError.response(`Vehicle with VIN or plate number does not exist.`, HttpStatus.NOT_FOUND.code),
        );

      for (const valueKey in value) {
        const key = valueKey as keyof CreateEstimateType;

        if (key === 'id') continue;

        if (value[key]) {
          await vehicle.update({
            [key]: value[key],
          });
        }
      }

      await vehicle.$add('estimates', [estimate]);
    }

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
      taxPart: value.taxPart,
    };

    await estimate.update(estimateValues);

    return { estimate };
  }
}
