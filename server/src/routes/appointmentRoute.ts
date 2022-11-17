import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import AppointmentController from "../controllers/AppointmentController";

export const getAppointmentsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.allAppointments();
  res.status(response.code).json(response);
});

export const getAppointmentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.getAppointment(req);
  res.status(response.code).json(response);
});

export const createAppointmentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.createAppointment(req);
  res.status(response.code).json(response);
});

export const updateAppointmentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.updateAppointment(req);
  res.status(response.code).json(response);
});

export const rescheduleAppointmentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.rescheduleInspection(req);
  res.status(response.code).json(response);
});

export const cancelAppointmentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await AppointmentController.cancelInspection(req);
  res.status(response.code).json(response);
});
