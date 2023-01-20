"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const agenda_schedule_wrapper_1 = require("agenda-schedule-wrapper");
const constants_1 = require("../config/constants");
function agendaManager(emitter) {
    emitter.on(constants_1.BOOK_APPOINTMENT, ({ appointment }) => {
        let startTime = appointment.timeSlot.split('-')[0].trim();
        startTime = (0, moment_1.default)(startTime, 'HH: a');
        const date = (0, moment_1.default)(appointment.appointmentDate);
        const when = (0, moment_1.default)({
            year: date.year(),
            month: date.month(),
            date: date.date(),
            hours: startTime.hours(),
        })
            .utc(true)
            .toDate();
        (async () => {
            await agenda_schedule_wrapper_1.AppAgenda.dispatch({
                name: constants_1.BOOK_APPOINTMENT,
                onTick: async (job) => {
                    console.log(job.attrs);
                },
            });
            await agenda_schedule_wrapper_1.AppAgenda.agenda.schedule(when, constants_1.BOOK_APPOINTMENT, {
                appointmentCode: appointment.code,
            });
        })();
    });
    emitter.on(constants_1.RESCHEDULE_APPOINTMENT, ({ appointment }) => {
        const { code } = appointment;
        console.log('Rescheduled', code);
    });
    emitter.on(constants_1.CANCEL_APPOINTMENT, ({ appointment }) => {
        const { code } = appointment;
        console.log('Cancelled', code);
    });
}
exports.default = agendaManager;
