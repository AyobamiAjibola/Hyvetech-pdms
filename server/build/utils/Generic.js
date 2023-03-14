"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const camelcase_1 = __importDefault(require("camelcase"));
const jsonwebtoken_1 = require("jsonwebtoken");
const settings_1 = __importDefault(require("../config/settings"));
const dataStore_1 = __importDefault(require("../config/dataStore"));
const startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
const endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
class Generic {
    static functionIntervalCaller(config) {
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
                if (config.stop)
                    clearInterval(interval);
                if (count >= cycle)
                    clearInterval(interval);
                config.onTick(config);
                if (config.log)
                    config.log({ count, options: config });
            }, start);
        };
        run();
    }
    static async fileExist(path) {
        try {
            await promises_1.default.access(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static async getImagePath(params) {
        const exists = await this.fileExist(params.basePath);
        if (!exists)
            await promises_1.default.mkdir(params.basePath);
        const newFileName = `${(0, uuid_1.v4)()}${node_path_1.default.extname(params.filename)}`;
        const newPath = `${params.basePath}/${newFileName}`;
        await promises_1.default.rename(params.tempPath, newPath);
        return newPath;
    }
    /**
     * @name generateJwt
     * @param payload
     * @desc
     * Generate jsonwebtoken.
     */
    static generateJwt(payload) {
        const key = settings_1.default.jwt.key;
        return (0, jsonwebtoken_1.sign)(payload, key);
    }
    static generateRandomString(limit) {
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
    static randomize(options) {
        const numbers = '01234567890123456789012345678901234567890123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        const specialChars = '@#!$%^&+=*()<>_-?|.';
        let text = numbers;
        let count = 10;
        let result = '';
        if (options?.count)
            count = options.count;
        if (options?.number)
            text = numbers;
        if (options?.string)
            text = letters;
        if (options?.mixed)
            text = numbers + letters + specialChars;
        if (options?.alphanumeric)
            text = letters + numbers;
        for (let i = 0; i < count; i++) {
            const randomNum = Math.floor(Math.random() * text.length);
            result += text.substring(randomNum, randomNum + 1);
        }
        return result;
    }
    static convertTextToCamelcase(text) {
        text = text.replace(/[^a-zA-Z0-9 ]/g, '');
        return (0, camelcase_1.default)(text);
    }
    static formatNumberToIntl(number) {
        return new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 2,
        }).format(number);
    }
    static generateSlug(text) {
        text = text.trim();
        if (text.search(/\s/g) !== -1) {
            return text.toUpperCase().replace(/\s/g, '_');
        }
        return text.toUpperCase();
    }
    static calculateDiscount(principal, discount) {
        return principal - principal * (discount / 100);
    }
    static getMonths() {
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
    static async getMonthlyData(repository) {
        const year = (0, moment_1.default)().year();
        const result = [];
        const months = Generic.getMonths();
        let dataObject = {};
        for (let i = 0; i < months.length; i++) {
            const datetime = (0, moment_1.default)({ year: year, month: i, date: 1 });
            const firstDay = (0, moment_1.default)(datetime).startOf('month').toDate();
            const lastDay = (0, moment_1.default)(datetime).endOf('month').toDate();
            const _repository = await repository.findAll({
                where: {
                    createdAt: {
                        [sequelize_1.Op.between]: [firstDay, lastDay],
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
    static async getDailyData(repository) {
        const result = [];
        const data = await repository.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
        });
        let dataObject = {};
        if (!data.length) {
            dataObject = {
                ...dataObject,
                name: repository.model,
                y: data.length,
                timestamp: Date.now(),
            };
            result.push(dataObject);
        }
        else {
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
    static async enableTimeSlot(appointmentDate, appointment) {
        const date = appointmentDate.format('YYYY-MM-DD');
        const time = appointment.timeSlot;
        const getSlots = await dataStore_1.default.get(date);
        if (getSlots) {
            const slotsJSON = JSON.parse(getSlots);
            if (slotsJSON !== null) {
                const tempSlots = [...slotsJSON];
                const slot = tempSlots.find(slot => slot.time === time);
                const index = tempSlots.indexOf(slot);
                tempSlots[index].available = true;
                await dataStore_1.default.set(date, JSON.stringify(tempSlots));
            }
        }
    }
    static whichPushToken(token) {
        const ios = 'ios';
        const android = 'android';
        const response = { token: '', type: '' };
        try {
            if (token.match(/ios/)?.input) {
                response.type = ios;
                response.token = token.replace(`[${ios}]-`, '');
            }
            if (token.match(/android/)?.input) {
                response.type = android;
                response.token = token.replace(`[${android}]-`, '');
            }
        }
        catch (e) {
            response.type = ios;
            response.token = token;
        }
        try {
            response.type = android;
            response.token = response.token.replace(`[${android}]-`, '');
            response.token = response.token.replace(`[${ios}]-`, '');
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
        return response;
    }
}
exports.default = Generic;
