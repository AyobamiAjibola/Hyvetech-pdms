import dataStore from "../config/dataStore";
import { Request } from "express";
import { appCommonTypes } from "../@types/app-common";
import Joi from "joi";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import TimeSlot from "../models/TimeSlot";
import AppLogger from "../utils/AppLogger";
import ISchedule = appCommonTypes.ISchedule;

export default class TimeSlotController {
  private static LOGGER = AppLogger.init(TimeSlotController.name).logger;

  public static async initTimeSlot(req: Request) {
    const timeSlot: ISchedule = { date: "", slots: [] };

    const { error, value } = Joi.object({
      date: Joi.string(),
      slots: Joi.array(),
      now: Joi.boolean().allow(null),
    }).validate(req.body);

    if (error) {
      return Promise.reject({
        message: error.message,
        code: HttpStatus.BAD_REQUEST.code,
      });
    }

    const slots = await dataStore.get(value.date);

    if (slots) {
      timeSlot.date = value.date;
      const _slots = JSON.parse(slots);
      timeSlot.slots = _slots?.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );

      return Promise.resolve({
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: timeSlot,
      });
    }

    await dataStore.set(value.date, JSON.stringify(value.slots));

    const result = await dataStore.get(value.date);

    if (result) {
      const _slots = JSON.parse(result);

      timeSlot.date = value.date;
      timeSlot.slots = _slots?.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );

      timeSlot.slots = JSON.parse(result);

      return Promise.resolve({
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: timeSlot,
      });
    } else {
      this.LOGGER.warning(`Time slot ${value.date} does not exist.`);

      return Promise.resolve({
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
      });
    }
  }

  public static async disableTimeslot(req: Request) {
    const timeSlot: ISchedule = { date: "", slots: [] };

    const { error, value } = Joi.object({
      date: Joi.string(),
      time: Joi.string(),
    }).validate(req.body);

    if (error) {
      return Promise.reject({
        message: HttpStatus.BAD_REQUEST.value,
        code: HttpStatus.BAD_REQUEST.code,
      });
    }

    const getSlots = await dataStore.get(value?.date);

    if (getSlots) {
      const slotsJSON = JSON.parse(getSlots);

      const tempSlots = [...slotsJSON];

      const slot = tempSlots.find((slot: any) => slot.time === value?.time);

      const index = tempSlots.indexOf(slot);

      tempSlots[index].available = false;

      await dataStore.set(value?.date, JSON.stringify(tempSlots));

      const _slots = JSON.parse(<any>tempSlots);

      timeSlot.date = value?.date;
      timeSlot.slots = _slots?.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );

      return Promise.resolve({
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: timeSlot,
      });
    } else {
      this.LOGGER.warning(`Time slot ${value.date} does not exist.`);

      return Promise.resolve({
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
      });
    }
  }

  public static async getDefaultTimeslots() {
    const timeslot = await dataSources.scheduleDAOService.findByAny({
      where: { default: true },
      attributes: ["id", "name", "status", "default"],
      include: [
        {
          model: TimeSlot,
          attributes: ["id", "time", "label", "available"],
          order: [["id", "ASC"]],
        },
      ],
    });

    return Promise.resolve({
      message: HttpStatus.OK.value,
      code: HttpStatus.OK.code,
      result: timeslot,
    });
  }
}
