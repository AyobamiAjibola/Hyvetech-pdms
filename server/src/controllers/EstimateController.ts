import { Request } from "express";
import Joi from "joi";
import Estimate, {
  $createEstimateSchema,
  CreateEstimateType,
} from "../models/Estimate";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import { Op } from "sequelize";
import { appCommonTypes } from "../@types/app-common";
import HttpResponse = appCommonTypes.HttpResponse;

export default class EstimateController {
  public async create(req: Request) {
    const response: HttpResponse<Estimate> = {
      code: HttpStatus.NOT_FOUND.code,
      message: HttpStatus.NOT_FOUND.value,
    };

    try {
      const { error, value } = Joi.object<CreateEstimateType>(
        $createEstimateSchema
      ).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      if (!value)
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.INTERNAL_SERVER_ERROR.value,
            HttpStatus.INTERNAL_SERVER_ERROR.code
          )
        );

      const driver = await dataSources.rideShareDriverDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email }, { phone: value.phone }],
        },
      });

      const customer = await dataSources.customerDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email }, { phone: value.phone }],
        },
      });

      if (driver) {
        //todo: handle create estimate
      }

      if (customer) {
        //todo: handle create estimate
      }

      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async doCreateEstimate() {
    //
  }
}
