import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import ServiceReminderController from '../controllers/ServiceReminderController';

const serviceReminderController = new ServiceReminderController();

export const createReminderTypeHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.createReminderTypeHandler(req)
    res.status(response.code).json(response);
});

export const createServiceReminderHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.createServiceReminderHandler(req)
    res.status(response.code).json(response);
});

export const updateReminderTypeHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.updateReminderTypeHandler(req);
    res.status(response.code).json(response);
});

export const getRemindersHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.reminders(req);
    res.status(response.code).json(response);
});

export const getReminderTypesHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.getAllReminderTypes(req);
    res.status(response.code).json(response);
});

export const updateReminderHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.updateReminder(req);
    res.status(response.code).json(response);
});

export const deleteReminderHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.deleteReminder(req);
    res.status(response.code).json(response);
});

export const updateStatusHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await serviceReminderController.updateReminderStatus(req);
    res.status(response.code).json(response);
});