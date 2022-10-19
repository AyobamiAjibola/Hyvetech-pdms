import { Request } from "express";
import Joi from "joi";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import { appCommonTypes } from "../@types/app-common";
import CheckList from "../models/CheckList";
import { InferAttributes } from "sequelize";
import {
  INITIAL_CHECK_LIST_VALUES,
  JOB_STATUS,
  UPLOAD_BASE_PATH,
} from "../config/constants";
import { File } from "formidable";
import Job from "../models/Job";
import Generic from "../utils/Generic";
import HttpResponse = appCommonTypes.HttpResponse;
import CheckListType = appCommonTypes.CheckListType;
import IImageButtonData = appCommonTypes.IImageButtonData;

export default class CheckListController {
  public static async create(req: Request) {
    try {
      const { error, value } = Joi.object({
        partner: Joi.string().required().label("Partner Id"),
        checkList: Joi.string().required().label("Check List Name"),
        description: Joi.string().required().label("Check List Description"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partnerId = value.partner as string;
      const name = value.checkList;
      const description = value.description;

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const exist = await dataSources.checkListDAOService.findByAny({
        where: { name },
      });

      if (exist)
        return Promise.reject(
          CustomAPIError.response(
            `Check list with name already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const data: any = { name, description };

      const checkList = await dataSources.checkListDAOService.create(data);

      await partner.$add("checkLists", [checkList]);

      const checkLists = await dataSources.checkListDAOService.findAll({
        include: [{ all: true }],
      });

      const results = checkLists.map((checkList) => checkList.toJSON());

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: `Created Check List Successfully`,
        results,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public static async createJobCheckList(req: Request) {
    const jobId = req.params.jobId as string;

    try {
      const { error, value } = Joi.object({
        checkList: Joi.string().required().label("Check List"),
        vehicleInfo: Joi.string().required().label("Vehicle Info"),
      }).validate(req.fields);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const job = await dataSources.jobDAOService.findById(+jobId);

      if (!job)
        return Promise.reject(
          CustomAPIError.response(
            `Job does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const vehicle = await job.$get("vehicle");

      if (!vehicle)
        return Promise.reject(
          CustomAPIError.response(
            `Vehicle does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const technician = await job.$get("technician");

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `Technician does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      console.log(value.vehicleInfo);

      const checkList = value.checkList as string;
      const checkListJSON = JSON.parse(checkList) as CheckListType;
      const sections = checkListJSON.sections;
      const images: IImageButtonData[] = [];
      const basePath = `${UPLOAD_BASE_PATH}/checklists`;

      for (const section of sections) {
        const questions = section.questions;

        for (const question of questions) {
          if (question.images) {
            for (const image of question.images) {
              images.push(image);
            }
          }
        }
      }

      for (const image of images) {
        const { originalFilename, filepath } = req.files[image.title] as File;

        image.url = await Generic.getImagePath({
          tempPath: filepath,
          filename: originalFilename as string,
          basePath,
        });
      }

      const newSections = sections.map((section) => {
        section.questions.forEach((question) => {
          question.images = images;
        });

        return section;
      });

      const checklistValues = JSON.stringify({
        ...checkListJSON,
        sections: newSections,
      });

      await vehicle.update({
        onInspection: false,
        isBooked: false,
      });

      await technician.update({
        hasJob: false,
      });

      await job.update({
        jobDate: new Date(),
        status: JOB_STATUS.complete,
        checkList: checklistValues,
      });

      const response: HttpResponse<Job> = {
        code: HttpStatus.OK.code,
        message: `Successfully created Job Check List`,
        result: job,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async update(req: Request) {
    const checkListId = req.params.checkListId as string;

    try {
      const { error, value } = Joi.object({
        sections: Joi.array().items(Joi.any()).required(),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const sections = value.sections;

      const checkList = await dataSources.checkListDAOService.findById(
        +checkListId,
        { include: [{ all: true }] }
      );

      if (!checkList)
        return Promise.reject(
          CustomAPIError.response(
            `Check List does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      await checkList.update({ sections });

      const response: HttpResponse<CheckList> = {
        code: HttpStatus.OK.code,
        message: "Added Check List Section Successfully",
        result: checkList,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async checkLists() {
    try {
      const checkLists = await dataSources.checkListDAOService.findAll({
        include: [{ all: true }],
      });

      const results = checkLists.map((checkList) => {
        const result = checkList.toJSON();

        if (result.sections)
          result.sections = result.sections.map((section) =>
            JSON.parse(section)
          );
        else
          result.sections = JSON.parse(
            JSON.stringify([INITIAL_CHECK_LIST_VALUES])
          );

        return result;
      });

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async checkList(req: Request) {
    const checkListId = req.params.checkListId as string;

    try {
      const checkList = await dataSources.checkListDAOService.findById(
        +checkListId,
        {
          include: [{ all: true }],
        }
      );

      if (!checkList)
        return Promise.reject(
          CustomAPIError.response(
            `Check List not found`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const result = checkList.toJSON();

      if (result.sections)
        result.sections = result.sections.map((section) => JSON.parse(section));
      else
        result.sections = JSON.parse(
          JSON.stringify([INITIAL_CHECK_LIST_VALUES])
        );

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
