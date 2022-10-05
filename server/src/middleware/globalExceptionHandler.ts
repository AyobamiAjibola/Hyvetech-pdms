import { NextFunction, Request, Response } from "express";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import { MESSAGES } from "../config/constants";
import AppLogger from "../utils/AppLogger";
import { appCommonTypes } from "../@types/app-common";
import HttpResponse = appCommonTypes.HttpResponse;

const logger = AppLogger.init(globalExceptionHandler.name).logger;

export default function globalExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);

  if (res.headersSent) return next(err);

  if (err instanceof CustomAPIError) {
    const response: HttpResponse<any> = {
      code: err.code,
      message: err.message,
    };

    return res.status(err.code).json(response);
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
    message: MESSAGES.http["500"],
    code: HttpStatus.INTERNAL_SERVER_ERROR.code,
  });
}
