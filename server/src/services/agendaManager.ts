import moment from "moment";

import { AppAgenda } from "agenda-schedule-wrapper";

import { BOOK_APPOINTMENT, CANCEL_APPOINTMENT, RESCHEDULE_APPOINTMENT } from "../config/constants";
import EventEmitter from "events";

export default function agendaManager(emitter: EventEmitter) {
  emitter.on(BOOK_APPOINTMENT, ({ appointment }) => {
    let startTime = appointment.timeSlot.split("-")[0].trim();
    startTime = moment(startTime, "HH: a");
    const date = moment(appointment.appointmentDate);

    const when = moment({
      year: date.year(),
      month: date.month(),
      date: date.date(),
      hours: startTime.hours(),
    })
      .utc(true)
      .toDate();

    (async () => {
      await AppAgenda.dispatch({
        name: BOOK_APPOINTMENT,
        onTick: async (job) => {
          console.log(job.attrs);
        },
      });

      await AppAgenda.agenda.schedule(when, BOOK_APPOINTMENT, {
        appointmentCode: appointment.code,
      });
    })();
  });

  emitter.on(RESCHEDULE_APPOINTMENT, ({ appointment }) => {
    const { code } = appointment;

    console.log("Rescheduled", code);
  });

  emitter.on(CANCEL_APPOINTMENT, ({ appointment }) => {
    const { code } = appointment;

    console.log("Cancelled", code);
  });
}
