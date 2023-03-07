import path from 'node:path';
import fs from 'fs/promises';

import { v4 } from 'uuid';
import { Op } from 'sequelize';
import moment, { Moment } from 'moment';
import camelcase from 'camelcase';
import { sign } from 'jsonwebtoken';

import settings from '../config/settings';
import { appCommonTypes } from '../@types/app-common';
import { appModelTypes } from '../@types/app-model';
import Appointment from '../models/Appointment';
import dataStore from '../config/dataStore';
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;

const startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
const endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

interface IGetImagePath {
  basePath: string;
  filename: string;
  tempPath: string;
}

interface IRandomize {
  number?: boolean;
  alphanumeric?: boolean;
  string?: boolean;
  mixed?: boolean;
  count?: number;
}

interface IFuncIntervalCallerConfig {
  //call your functions here
  onTick: (args: this) => void | Promise<void>;
  // Number of times the function 'onTick' should run
  attempts: number;
  //Call interval. Should be in milliseconds e.g 60 * 1000
  interval: number;
  // reset the interval, until a condition is met
  reset?: boolean;
  //stop the interval
  stop?: boolean;

  //log the interval count
  log?: (args: { count: number; options: IFuncIntervalCallerConfig }) => void;
}

export default class Generic {
  public static functionIntervalCaller(config: IFuncIntervalCallerConfig) {
    const start = config.interval;
    const stop = config.attempts * start;
    const cycle = stop / start;
    let count = 0;

    const run = () => {
      const interval = setInterval(() => {
        if (config.reset) {
          clearInterval(interval);
          run();
        }

        count++;

        if (config.stop) clearInterval(interval);

        if (count >= cycle) clearInterval(interval);

        config.onTick(config);

        if (config.log) config.log({ count, options: config });
      }, start);
    };

    run();
  }

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

    const newFileName = `${v4()}${path.extname(params.filename)}`;

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
    return sign(payload, key);
  }

  public static generateRandomString(limit: number) {
    const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz@#!$%^&+=';
    let randomString = '';
    for (let i = 0; i < limit; i++) {
      const randomNum = Math.floor(Math.random() * letters.length);
      randomString += letters.substring(randomNum, randomNum + 1);
    }

    return randomString;
  }

  /**
   * @name randomize
   * @description generate random chars (string,numbers,special characters, or mixed)
   * @description default count is 10 and result is numbers if no options are passed
   * @param options
   */
  public static randomize(options?: IRandomize) {
    const numbers = '01234567890123456789012345678901234567890123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const specialChars = '@#!$%^&+=*()<>_-?|.';

    let text = numbers;
    let count = 10;
    let result = '';

    if (options?.count) count = options.count;
    if (options?.number) text = numbers;
    if (options?.string) text = letters;
    if (options?.mixed) text = numbers + letters + specialChars;
    if (options?.alphanumeric) text = letters + numbers;

    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(Math.random() * text.length);
      result += text.substring(randomNum, randomNum + 1);
    }

    return result;
  }

  public static convertTextToCamelcase(text: string) {
    text = text.replace(/[^a-zA-Z0-9 ]/g, '');
    return camelcase(text);
  }

  public static formatNumberToIntl(number: number) {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
    }).format(number);
  }

  public static generateSlug(text: string) {
    text = text.trim();

    if (text.search(/\s/g) !== -1) {
      return text.toUpperCase().replace(/\s/g, '_');
    }
    return text.toUpperCase();
  }

  public static calculateDiscount(principal: number, discount: number) {
    return principal - principal * (discount / 100);
  }

  public static getMonths() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }

  public static async getMonthlyData(repository: AbstractCrudRepository) {
    const year = moment().year();

    const result = [];

    const months = Generic.getMonths();
    let dataObject: Partial<{ name: string; y: any }> = {};

    for (let i = 0; i < months.length; i++) {
      const datetime = moment({ year: year, month: i, date: 1 });

      const firstDay = moment(datetime).startOf('month').toDate();
      const lastDay = moment(datetime).endOf('month').toDate();

      const _repository = await repository.findAll({
        where: {
          createdAt: {
            [Op.between]: [firstDay, lastDay],
          },
        },
      });

      dataObject = { ...dataObject, y: _repository.length, name: months[i] };

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

  public static async enableTimeSlot(appointmentDate: Moment, appointment: Appointment) {
    const date = appointmentDate.format('YYYY-MM-DD');
    const time = appointment.timeSlot;

    const getSlots = await dataStore.get(date);

    if (getSlots) {
      const slotsJSON = JSON.parse(getSlots);

      if (slotsJSON !== null) {
        const tempSlots = [...slotsJSON];

        const slot = tempSlots.find(slot => slot.time === time);

        const index = tempSlots.indexOf(slot);

        tempSlots[index].available = true;

        await dataStore.set(date, JSON.stringify(tempSlots));
      }
    }
  }

  public static whichPushToken(token: string) {
    const ios = 'ios';
    const android = 'android';
    const response: { type: string; token: string } = { token: '', type: '' };

    try {
      if (token.match(/ios/)?.input) {
        response.type = ios;
        response.token = token.replace(`[${ios}]-`, '');
      }

      if (token.match(/android/)?.input) {
        response.type = android;
        response.token = token.replace(`[${android}]-`, '');
      }
    } catch (e) {
      response.type = ios;
      response.token = token;
    }

    try {
      response.type = android;
      response.token = response.token.replace(`[${android}]-`, '');
      response.token = response.token.replace(`[${ios}]-`, '');
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return response;
  }
}
