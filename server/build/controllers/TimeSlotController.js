"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataStore_1 = __importDefault(require("../config/dataStore"));
const joi_1 = __importDefault(require("joi"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const TimeSlot_1 = __importDefault(require("../models/TimeSlot"));
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
class TimeSlotController {
    static LOGGER = AppLogger_1.default.init(TimeSlotController.name).logger;
    static async initTimeSlot(req) {
        const timeSlot = { date: '', slots: [] };
        const { error, value } = joi_1.default.object({
            date: joi_1.default.string(),
            slots: joi_1.default.array(),
            now: joi_1.default.boolean().allow(null),
        }).validate(req.body);
        if (error) {
            return Promise.reject({
                message: error.message,
                code: HttpStatus_1.default.BAD_REQUEST.code,
            });
        }
        const slots = await dataStore_1.default.get(value.date);
        if (slots) {
            timeSlot.date = value.date;
            const _slots = JSON.parse(slots);
            timeSlot.slots = _slots?.sort((a, b) => a.id - b.id);
            return Promise.resolve({
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result: timeSlot,
            });
        }
        await dataStore_1.default.set(value.date, JSON.stringify(value.slots));
        const result = await dataStore_1.default.get(value.date);
        if (result) {
            const _slots = JSON.parse(result);
            timeSlot.date = value.date;
            timeSlot.slots = _slots?.sort((a, b) => a.id - b.id);
            timeSlot.slots = JSON.parse(result);
            return Promise.resolve({
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result: timeSlot,
            });
        }
        else {
            this.LOGGER.warning(`Time slot ${value.date} does not exist.`);
            return Promise.resolve({
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
            });
        }
    }
    static async disableTimeslot(req) {
        const timeSlot = { date: '', slots: [] };
        const { error, value } = joi_1.default.object({
            date: joi_1.default.string(),
            time: joi_1.default.string(),
        }).validate(req.body);
        if (error) {
            return Promise.reject({
                message: HttpStatus_1.default.BAD_REQUEST.value,
                code: HttpStatus_1.default.BAD_REQUEST.code,
            });
        }
        const getSlots = await dataStore_1.default.get(value?.date);
        if (getSlots) {
            const slotsJSON = JSON.parse(getSlots);
            const tempSlots = [...slotsJSON];
            const slot = tempSlots.find((slot) => slot.time === value?.time);
            const index = tempSlots.indexOf(slot);
            tempSlots[index].available = false;
            await dataStore_1.default.set(value?.date, JSON.stringify(tempSlots));
            const _slots = JSON.parse(tempSlots);
            timeSlot.date = value?.date;
            timeSlot.slots = _slots?.sort((a, b) => a.id - b.id);
            return Promise.resolve({
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result: timeSlot,
            });
        }
        else {
            this.LOGGER.warning(`Time slot ${value.date} does not exist.`);
            return Promise.resolve({
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
            });
        }
    }
    static async getDefaultTimeslots() {
        const timeslot = await dao_1.default.scheduleDAOService.findByAny({
            where: { default: true },
            attributes: ['id', 'name', 'status', 'default'],
            include: [
                {
                    model: TimeSlot_1.default,
                    attributes: ['id', 'time', 'label', 'available'],
                    order: [['id', 'ASC']],
                },
            ],
        });
        return Promise.resolve({
            message: HttpStatus_1.default.OK.value,
            code: HttpStatus_1.default.OK.code,
            result: timeslot,
        });
    }
}
exports.default = TimeSlotController;
