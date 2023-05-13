import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import { createReminderTypeHandler, createServiceReminderHandler, deleteReminderHandler, getReminderTypesHandler, getRemindersHandler, updateReminderHandler, updateReminderTypeHandler, updateStatusHandler } from '../../routes/serviceReminderRoute';

const serviceReminderPath = '/reminder';
const serviceReminderEndpoints: RouteEndpoints = [
    {
        name: 'create reminder type',
        method: 'post',
        path: `${serviceReminderPath}/type`,
        handler: createReminderTypeHandler,
    },
    {
        name: 'create reminder',
        method: 'post',
        path: serviceReminderPath,
        handler: createServiceReminderHandler,
    },
    {
        name: 'updated reminder type',
        method: 'put',
        path: `${serviceReminderPath}/type/:reminderTypeId`,
        handler: updateReminderTypeHandler,
    },
    {
        name: 'reminders',
        method: 'get',
        path: `${serviceReminderPath}s`,
        handler: getRemindersHandler,
    },
    {
        name: 'reminder types',
        method: 'get',
        path: `${serviceReminderPath}/types`,
        handler: getReminderTypesHandler,
    },
    {
        name: 'update reminder',
        method: 'patch',
        path: `${serviceReminderPath}/:reminderId`,
        handler: updateReminderHandler,
    },
    {
        name: 'delete reminder',
        method: 'delete',
        path: `${serviceReminderPath}/:reminderId`,
        handler: deleteReminderHandler,
    },
    {
        name: 'update reminder status',
        method: 'put',
        path: `${serviceReminderPath}/:reminderId/toggle-status`,
        handler: updateStatusHandler,
    }
]

export default serviceReminderEndpoints;