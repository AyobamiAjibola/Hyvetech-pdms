import settings from "../config/settings";
import { v4 } from "uuid";
import { sign } from "jsonwebtoken";
import { appCommonTypes } from "../@types/app-common";
import camelcase from "camelcase";
import moment from "moment/moment";
import { Op } from "sequelize";
import { appModelTypes } from "../@types/app-model";
import fs from "fs/promises";
import { Moment } from "moment";
import Appointment from "../models/Appointment";
import dataStore from "../config/dataStore";
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;

const startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
const endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

interface IGetImagePath {
  basePath: string;
  filename: string;
  tempPath: string;
}

export default class Generic {
  public static async fileExist(path: string) {
    try {
      await fs.access(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static async getImagePath(params: IGetImagePath) {
    const exists = await this.fileExist(params.basePath);

    if (!exists) await fs.mkdir(params.basePath);

    const newFileName = `${v4()}.${
      params.filename.split(".")[params.filename.split(".").length - 1]
    }`;

    const newPath = `${params.basePath}/${newFileName}`;

    await fs.rename(params.tempPath, newPath);

    return newPath;
  }

  /**
   * @name generateJwt
   * @param payload
   * @desc
   * Generate jsonwebtoken.
   */
  public static generateJwt(payload: CustomJwtPayload) {
    const key = <string>settings.jwt.key;
    return sign(payload, key, { expiresIn: "24h" });
  }

  public static generateRandomString(limit: number) {
    const letters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < limit; i++) {
      const randomNum = Math.floor(Math.random() * letters.length);
      randomString += letters.substring(randomNum, randomNum + 1);
    }

    return randomString;
  }

  public static convertTextToCamelcase(text: string) {
    text = text.replace(/[^a-zA-Z0-9 ]/g, "");
    return camelcase(text);
  }

  public static formatNumberToIntl(number: number) {
    return new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 2,
    }).format(number);
  }

  public static generateSlug(text: string) {
    text = text.trim();

    if (text.search(/\s/g) !== -1) {
      return text.toUpperCase().replace(/\s/g, "_");
    }
    return text.toUpperCase();
  }

  public static calculateDiscount(principal: number, discount: number) {
    return principal - principal * (discount / 100);
  }

  public static getMonths() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  public static async getMonthlyData(repository: AbstractCrudRepository) {
    const year = moment().year();

    const result = [];

    const months = Generic.getMonths();
    let dataObject: Partial<{ name: string; y: any }> = {};

    for (let i = 0; i < months.length; i++) {
      const datetime = moment({ year: year, month: i, date: 1 });

      const firstDay = moment(datetime).startOf("month").toDate();
      const lastDay = moment(datetime).endOf("month").toDate();

      const customers = await repository.findAll({
        where: {
          createdAt: {
            [Op.between]: [firstDay, lastDay],
          },
        },
      });

      dataObject = { ...dataObject, y: customers.length, name: months[i] };

      result.push(dataObject);
    }

    return {
      name: repository.model,
      data: result,
    };
  }

  public static async getDailyData(repository: AbstractCrudRepository) {
    const result = [];

    const data = await repository.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    let dataObject: { [p: string]: any } = {};

    if (!data.length) {
      dataObject = {
        ...dataObject,
        name: repository.model,
        y: data.length,
        timestamp: Date.now(),
      };

      result.push(dataObject);
    } else {
      for (let i = 0; i < data.length; i++) {
        const timestamp = new Date(data[i].createdAt).getTime();

        dataObject = {
          ...dataObject,
          name: repository.model,
          y: data.length,
          timestamp,
        };

        result.push(dataObject);
      }
    }

    return {
      name: repository.model,
      data: result,
    };
  }

  public static async enableTimeSlot(
    appointmentDate: Moment,
    appointment: Appointment
  ) {
    const date = appointmentDate.format("YYYY-MM-DD");
    const time = appointment.timeSlot;

    const getSlots = await dataStore.get(date);

    if (getSlots) {
      const slotsJSON = JSON.parse(getSlots);

      if (slotsJSON !== null) {
        const tempSlots = [...slotsJSON];

        const slot = tempSlots.find((slot) => slot.time === time);

        const index = tempSlots.indexOf(slot);

        tempSlots[index].available = true;

        await dataStore.set(date, JSON.stringify(tempSlots));
      }
    }
  }
}
