import {
  cancelAppointmentHandler,
  getAppointmentHandler,
  getAppointmentsHandler,
  rescheduleAppointmentHandler,
  updateAppointmentHandler,
} from "../../routes/appointmentRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const appointmentEndpoints: RouteEndpoints = [
  {
    name: "appointments",
    method: "get",
    path: "/appointments",
    handler: getAppointmentsHandler,
  },
  {
    name: "appointments",
    method: "get",
    path: "/appointments/:appointmentId",
    handler: getAppointmentHandler,
  },
  {
    name: "appointments",
    method: "patch",
    path: "/appointments/:appointmentId",
    handler: updateAppointmentHandler,
  },
  {
    name: "appointments",
    method: "post",
    path: "/appointments/cancel",
    handler: cancelAppointmentHandler,
  },
  {
    name: "appointments",
    method: "post",
    path: "/appointments/reschedule",
    handler: rescheduleAppointmentHandler,
  },
];

export default appointmentEndpoints;
