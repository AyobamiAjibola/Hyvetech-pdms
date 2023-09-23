import path from 'node:path';
import fs from 'fs/promises';

import { v4 } from 'uuid';
import { Op } from 'sequelize';
import moment, { Moment } from 'moment';
import camelcase from 'camelcase';
import { sign, verify } from 'jsonwebtoken';

import settings from '../config/settings';
import { appCommonTypes } from '../@types/app-common';
import { appModelTypes } from '../@types/app-model';
import Appointment from '../models/Appointment';
import dataStore from '../config/dataStore';
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;
import { NextFunction, Request } from 'express';
import UserToken from '../models/UserToken';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';

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

interface Expense {
  expenseCode: string;
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

  public static capitalizeWord (sentence: string): string {
    const words = sentence?.split(' ');
    const capitalizedWords = words?.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords?.join(' ');
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

  public static async generateJWT (payload: CustomJwtPayload) {
    try {
      // Create the access token
      const accessToken = sign(
        payload,
        <string>settings.jwtAccessToken.key,
        { expiresIn: <string>settings.jwtAccessToken.expiry}
      );

      // Create the refresh token
      const refreshToken = sign(
        payload,
        <string>settings.jwtRefreshToken.key,
        { expiresIn: <string>settings.jwtRefreshToken.expiry }
      );
  
      // Delete any existing user tokens
      await UserToken.destroy({ where: { userId: payload.userId } });
  
      // Calculate the refresh token expiration date (e.g., 7 days from now)
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setHours(refreshTokenExpiry.getHours() + 24);
  
      // Create a new user token
      await UserToken.create({
        userId: payload.userId,
        token: refreshToken,
        expired_at: refreshTokenExpiry,
      });
      
      return { accessToken, refreshToken };
    } catch (err: any) {
      return Promise.reject((CustomAPIError.response(err, HttpStatus.BAD_REQUEST.code)));
    }
  };

  public static async refreshToken (refreshToken: string, req: Request, next: NextFunction) {
    try {
      if (!refreshToken) {
        return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code))
      }
  
      // Check if the refresh token exists in the database
      const userToken = await UserToken.findOne({ where: { token: refreshToken } });
  
      if (!userToken) {
        // throw new AppError('Invalid refresh token', BAD_REQUEST);
        return Promise.reject(CustomAPIError.response('Invalid refresh token', HttpStatus.BAD_REQUEST.code))
      }
  
      // Verify the refresh token and get the payload
      const data: any = verify(refreshToken, settings.jwtRefreshToken.key as string);
  
      // Check if there is a valid user token in the database
      const dbToken = await UserToken.findOne({
        where: {
          userId: data.userId,
          expired_at: { [Op.gte]: new Date() },
        },
      });
  
      if (!dbToken) {
        // throw new AppError('Invalid refresh token', BAD_REQUEST);
        return Promise.reject(CustomAPIError.response('Invalid refresh token', HttpStatus.BAD_REQUEST.code))
      }
  
      // Attach the payload to the request object
      req.data = data;
  
      next();
    } catch (error: any) {
      next(Promise.reject(CustomAPIError.response(error, HttpStatus.BAD_REQUEST.code)));
    }
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

  // THIS HAS LESS CHANCE OF DUPLICATE VALUE
  // public static generateRandomStringCrypto(limit: number) {
  //   const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz@#!$%^&+=';
  //   const letterCount = letters.length;
  //   const randomBytes = crypto.randomBytes(limit);
  //   let randomString = '';
  //   for (let i = 0; i < limit; i++) {
  //     const randomNum = randomBytes[i] % letterCount;
  //     randomString += letters[randomNum];
  //   }
  //   return randomString;
  // }

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

  public static generateCode(data: any, prefix: string, id: number): string {

    let count = data.length + 1;
    let code: string;

    do {
      code = `${prefix}-${id}${count.toString().padStart(4, '0')}`;
      count++;
    } while (data.some((expense: any) => expense.code === code));

    return code;

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

  public static async getMonthlyDataTotal(repository: AbstractCrudRepository) {
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

      const invTotalValue = this.getRevenue(_repository);

      dataObject = { ...dataObject, y: invTotalValue, name: months[i] };

      result.push(dataObject);
    }

    return {
      name: repository.model,
      data: result,
    };
  }

  public static async getMonthlyDataTotalExpenses(repository: AbstractCrudRepository) {
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

      const expenseTotalValue = this.getExpenses(_repository);

      dataObject = { ...dataObject, y: expenseTotalValue, name: months[i] };

      result.push(dataObject);
    }

    return {
      name: repository.model,
      data: result,
    };
  }

  public static getRevenue(invoices: any) {
    let amount = 0;

    invoices.map((_invoice: any) => {
      amount = amount + _invoice.grandTotal;
    });

    return amount;
  }

  public static getExpenses(expenses: any) {
    let amount = 0;

    expenses.map((_expense: any) => {
      amount = amount + _expense.amount;
    });

    return amount;
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

  public static nextServiceDate(lastDate: string, serviceIntervalUnit: string, serviceInterval: string ){
      const serviceDate = new Date(lastDate);

      let result: any;
      if (serviceIntervalUnit === 'month') {
        serviceDate.setMonth(serviceDate.getMonth() + parseInt(serviceInterval));
      } else if (serviceIntervalUnit === 'day') {
        serviceDate.setDate(serviceDate.getDate() + parseInt(serviceInterval));
      } else if (serviceIntervalUnit === 'week') {
        serviceDate.setDate(serviceDate.getDate() + (parseInt(serviceInterval) * 7));
      } else if (serviceIntervalUnit === 'year') {
        serviceDate.setFullYear(serviceDate.getFullYear() + parseInt(serviceInterval));
      } else {
        return console.log('Wrong date')
      }

      // Adjust for leap year if necessary
      const originalYear = serviceDate.getFullYear();
      const isLeapYear = (year: any) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const isServiceDateLeapYear = isLeapYear(originalYear);

      if (isServiceDateLeapYear) {
        if (!isLeapYear(serviceDate.getFullYear())) {
          // Adjust for day when moving from a leap year to a non-leap year
          serviceDate.setDate(serviceDate.getDate() - 1);
        }
      } else {
        if (isLeapYear(serviceDate.getFullYear())) {
          // Adjust for day when moving from a non-leap year to a leap year
          serviceDate.setDate(serviceDate.getDate() + 1);
        }
      }
      // serviceDate.setDate(serviceDate.getDate() + 1);
      result = serviceDate.toISOString().slice(0, 10);
      return result;
  }


  public static reminderStatus(startDate: string, endDate: string, serviceIntervalUnit: string, serviceInterval: any ) {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const currYear = currentDate.getFullYear();
    const currMonth = currentDate.getMonth();
    const currDay = currentDate.getDate()

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate()

    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate()

    if(currYear < startYear && currMonth < startMonth && currDay < startDay) {
      return 'Date is not within range';
    }
    if(currYear > endYear && currMonth > endMonth && currDay > endDay) {
      return 'Date is not within range';
    }

    const futureDateLimit = new Date() === new Date(start) ? new Date() : new Date(start);
    const interval = parseInt(serviceInterval);

    if (serviceIntervalUnit === 'month') {
      futureDateLimit.setMonth(futureDateLimit.getMonth() + interval);
    } else if (serviceIntervalUnit === 'week') {
      futureDateLimit.setDate(futureDateLimit.getDate() + (7 * interval));
    } else if (serviceIntervalUnit === 'day') {
      futureDateLimit.setDate(futureDateLimit.getDate() + interval);
    }

    if (currentDate <= futureDateLimit) {
      const milliseconds = futureDateLimit.getTime() - currentDate.getTime();
      console.log(milliseconds, 'checks seconds')
      if (milliseconds > 2678400000) {
        const diffMonths = Math.floor(milliseconds / (30 * 24 * 60 * 60 * 1000));
        return `Due in [${diffMonths}] month(s)`;
      } else if (milliseconds > 604800000) {
        const diffWeeks = Math.floor(milliseconds / (7 * 24 * 60 * 60 * 1000));
        return `Due in [${diffWeeks}] week(s)`;
      } else {
        const diffDays = Math.round(milliseconds / (24 * 60 * 60 * 1000));

        if(diffDays >= 1){
          return `Due in [${diffDays}] day(s)`;
        } else if(diffDays < 1){
          return `Due today`
        }
      }
    } else {
      const currentDateYear = currentDate.getFullYear();
      const currentDateMonth = currentDate.getMonth();
      const currentDateDay = currentDate.getDate();

      const futureDateLimitYear = futureDateLimit.getFullYear();
      const futureDateLimitMonth = futureDateLimit.getMonth();
      const futureDateLimitDay = futureDateLimit.getDate();

      if (
        currentDateYear === futureDateLimitYear &&
        currentDateMonth === futureDateLimitMonth &&
        currentDateDay === futureDateLimitDay
      ) {
        return `Due today`;
      } else {
        const milliseconds = currentDate.getTime() - futureDateLimit.getTime();
        if (milliseconds > 2678400000) {
          const diffMonths = Math.floor(milliseconds / (30 * 24 * 60 * 60 * 1000));
          return `Overdue by [${diffMonths}] month(s)`;
        } else if (milliseconds > 604800000) {
          const diffWeeks = Math.floor(milliseconds / (7 * 24 * 60 * 60 * 1000));
          return `Overdue by [${diffWeeks}] week(s)`;
        } else {
          const diffDays = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
          return `Overdue by [${diffDays}] day(s)`;
        }
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
